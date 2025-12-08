import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabase-config.js';
import { getDefaultMembers } from './member-data.js';

// リカバリーURL（type=recovery）検知を初期化直後に判定できるよう保存
const initialHash = typeof window !== 'undefined' ? window.location.hash || '' : '';
const initialSearch = typeof window !== 'undefined' ? window.location.search || '' : '';
function getTypeParamFromString(s) {
  if (!s) return null;
  const sp = new URLSearchParams(s.replace(/^#/, '?'));
  return sp.get('type');
}
let recoveryRequested =
  getTypeParamFromString(initialHash) === 'recovery' ||
  getTypeParamFromString(initialSearch) === 'recovery';

const SUPABASE_CDN_SOURCES = [
  'https://unpkg.com/@supabase/supabase-js@2/dist/umd/supabase.js',
  'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js'
];
const SUPABASE_SCRIPT_ATTR = 'data-supabase-autoload';

// Supabase初期化（未読込でもUIは動作するようにガード）
let supabase = null;
const supabaseReadyPromise = initSupabaseClient();

function initSupabaseClient() {
  if (typeof window === 'undefined') {
    return Promise.resolve(null);
  }
  return ensureSupabaseLibrary()
    .then((lib) => {
      if (!lib?.createClient) {
        console.warn('supabase-js が正しく読み込まれませんでした。ログイン/登録機能は一時的に使用できません。');
        return null;
      }
      supabase = lib.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true
        }
      });
      return supabase;
    })
    .catch((err) => {
      console.warn('supabase-js の読み込みに失敗しました。ログイン/登録機能は一時的に使用できません。', err);
      return null;
    });
}

async function ensureSupabaseLibrary() {
  if (typeof window === 'undefined') {
    return null;
  }
  if (window.supabase?.createClient) {
    return window.supabase;
  }
  for (const src of SUPABASE_CDN_SOURCES) {
    try {
      await loadScriptOnce(src);
      if (window.supabase?.createClient) {
        return window.supabase;
      }
    } catch (err) {
      console.warn(`supabase-js の読み込みに失敗しました (${src})`, err);
    }
  }
  return window.supabase?.createClient ? window.supabase : null;
}

function loadScriptOnce(src) {
  return new Promise((resolve, reject) => {
    if (typeof document === 'undefined') {
      reject(new Error('document is not available'));
      return;
    }
    const selector = `script[${SUPABASE_SCRIPT_ATTR}="${src}"]`;
    const existing = document.querySelector(selector);
    if (existing) {
      if (window.supabase?.createClient) {
        resolve();
        return;
      }
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error(`supabase-js の読み込みに失敗しました (${src})`)), { once: true });
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.defer = true;
    script.crossOrigin = 'anonymous';
    script.setAttribute(SUPABASE_SCRIPT_ATTR, src);
    script.addEventListener('load', () => resolve(), { once: true });
    script.addEventListener('error', () => reject(new Error(`supabase-js の読み込みに失敗しました (${src})`)), { once: true });
    const parent = document.head || document.body || document.documentElement;
    if (!parent) {
      reject(new Error('script parent is not available'));
      return;
    }
    parent.appendChild(script);
  });
}

let approvalPollTimer = null;
let approvalRealtimeChannel = null;
const storage = (() => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage;
    }
  } catch (_) {
    // noop
  }
  return null;
})();
const STORAGE_KEY = 'team-manager.app-state';
const DEFAULT_APP_DATA = Object.freeze({
  announcements: [
    {
      id: 'ann-1',
      tag: '共有',
      title: '屋内消火演習は13:00開始予定',
      body: '午前の講義終了後、第1訓練棟へ移動してください。装備チェックは12:30までに完了させます。',
      layout: 'mixed',
      mediaUrl: 'https://images.unsplash.com/photo-1508873699372-7aeab60b44c7?auto=format&fit=crop&w=1200&q=80',
      mediaAlt: '消火訓練の様子'
    },
    {
      id: 'ann-2',
      tag: '注意',
      title: '雨天に伴う屋外訓練の縮小',
      body: '本日の屋外想定は安全管理のため時間を短縮します。詳細は業務連絡を確認してください。',
      layout: 'image',
      mediaUrl: 'https://images.unsplash.com/photo-1509223197845-458d87318791?auto=format&fit=crop&w=1200&q=80',
      mediaAlt: '雨天時の訓練場'
    },
    {
      id: 'ann-3',
      tag: '警戒',
      title: '熱中症対策の強化',
      body: '水分補給間隔を30分ごとに設定し、体調不良があれば速やかに助教へ報告してください。',
      layout: 'text'
    }
  ],
  notices: [
    {
      id: 'notice-1',
      title: 'ロープワーク評価の提出',
      detail: '各班リーダーは講評メモをTeamsにアップロードしてください。',
      target: '全班',
      deadline: '10/07 17:00'
    },
    {
      id: 'notice-2',
      title: '資機材点検の立ち会い',
      detail: '第2班は午後の予定前に装備庫の点検確認を行います。',
      target: '第2班',
      deadline: '10/08 12:30'
    }
  ],
  schedule: [
    { id: 'sch-1', date: '10/07(月)', time: '08:30-12:00', title: 'ロープレスキュー基礎', owner: '第1班 / 佐藤助教' },
    { id: 'sch-2', date: '10/08(火)', time: '13:00-17:00', title: '建物侵入検索', owner: '第2班 / 鈴木助教' },
    { id: 'sch-3', date: '10/09(水)', time: '09:00-11:30', title: '傷病者搬送シミュレーション', owner: '第3班 / 高橋助教' },
    { id: 'sch-4', date: '10/10(木)', time: '14:00-17:00', title: '総合訓練リハーサル', owner: '全班 / 指導部' }
  ],
  members: getDefaultMembers(),
  resources: [
    { id: 'res-1', title: '救助資機材チェックリスト', meta: 'PDF / 最終更新 2025-08-15', link: '#' },
    { id: 'res-2', title: '災害対応マニュアル抜粋', meta: 'SharePoint / 訓練用ダイジェスト', link: '#' },
    { id: 'res-3', title: 'ロープワーク動画教材', meta: '動画 / 15分', link: '#' }
  ],
  qaLog: [
    {
      id: 'qa-1',
      name: '第2班 鈴木',
      topic: 'equipment',
      question: '新しいカラビナの配布はいつになりますか？',
      createdAt: '2025-10-05T08:30:00+09:00'
    }
  ]
});
const TOPIC_LABELS = {
  schedule: '予定・集合',
  equipment: '資機材',
  procedure: '救助要領',
  safety: '安全管理',
  other: 'その他'
};
const SLIDE_LAYOUT_OPTIONS = ['text', 'mixed', 'image'];
const SLIDE_LAYOUT_LABELS = {
  text: 'テキスト',
  mixed: '写真 + テキスト',
  image: '写真のみ'
};
const ADMIN_ACCESS_CODE = 'RESCUE2025';
let appData = null;
let appBootstrapped = false;
let sliderSlides = [];
let sliderIndex = 0;
let sliderTimer = null;
let toastTimer = null;
let sliderStatusTimer = null;
let adminUnlocked = false;
const MEMBERS_TABLE = 'members';
const ANNOUNCEMENTS_TABLE = 'announcements';
const MEMBER_NOTES_TABLE = 'member_insights';
const MEMBER_PHOTO_BUCKET = 'member-photos';
const SLIDER_MEDIA_BUCKET = 'slider-media';
const SUPABASE_BUCKET_IDS = [MEMBER_PHOTO_BUCKET, SLIDER_MEDIA_BUCKET];
let membersSyncInFlight = null;
let announcementsSyncInFlight = null;
let memberNotesSyncInFlight = null;
let editingMemberId = null;
let currentSession = null;
let currentUserProfile = null;
const supabaseMonitor = {
  initialized: false,
  storageVisible: false,
  storageDirty: true,
  elements: {},
  state: {
    status: 'pending',
    message: 'Supabaseの初期化を待機しています...',
    memberCount: null,
    storageTotal: null,
    storageSummary: [],
    lastSyncedAt: null,
    lastError: null
  }
};
const memberNotesState = {
  entries: {},
  selectedMemberId: '',
  lastSyncedAt: null
};

function getSupabaseProjectDisplayUrl() {
  if (!SUPABASE_URL) return '未設定';
  if (typeof URL === 'function') {
    try {
      const parsed = new URL(SUPABASE_URL);
      return parsed.origin;
    } catch (_) {
      return SUPABASE_URL;
    }
  }
  return SUPABASE_URL;
}

function setupSupabaseMonitorUI() {
  if (supabaseMonitor.initialized) return;
  const statusEl = $('supabase-connection-status');
  if (!statusEl) return;
  supabaseMonitor.elements = {
    status: statusEl,
    memberCount: $('supabase-member-count'),
    storageCount: $('supabase-storage-count'),
    lastSync: $('supabase-last-sync'),
    refreshBtn: $('supabase-refresh-btn'),
    storageBtn: $('supabase-storage-refresh-btn'),
    projectUrl: $('supabase-project-url'),
    storageSection: $('supabase-storage-section'),
    storageList: $('supabase-storage-list'),
    storageEmpty: $('supabase-storage-empty')
  };
  if (supabaseMonitor.elements.projectUrl) {
    supabaseMonitor.elements.projectUrl.textContent = getSupabaseProjectDisplayUrl();
  }
  if (supabaseMonitor.elements.refreshBtn) {
    supabaseMonitor.elements.refreshBtn.addEventListener('click', () => {
      const includeStorage = supabaseMonitor.storageVisible;
      refreshSupabaseMonitor({ includeStorage });
    });
  }
  if (supabaseMonitor.elements.storageBtn) {
    supabaseMonitor.elements.storageBtn.addEventListener('click', async () => {
      supabaseMonitor.storageVisible = !supabaseMonitor.storageVisible;
      updateSupabaseMonitorUI();
      if (supabaseMonitor.storageVisible && supabaseMonitor.storageDirty) {
        await refreshSupabaseMonitor({ includeStorage: true, silent: true });
      }
    });
  }
  supabaseMonitor.initialized = true;
  updateSupabaseMonitorUI();
  if (!supabase) {
    updateSupabaseMonitorLocalFallback();
  }
}

function updateSupabaseMonitorUI() {
  if (!supabaseMonitor.initialized) return;
  const { elements, state } = supabaseMonitor;
  if (elements.status) {
    elements.status.textContent = state.message;
  }
  if (elements.memberCount) {
    elements.memberCount.textContent = Number.isFinite(state.memberCount)
      ? `${state.memberCount}件`
      : (state.status === 'local' && Array.isArray(appData?.members))
        ? `${appData.members.length}件`
        : '―';
  }
  if (elements.storageCount) {
    elements.storageCount.textContent = Number.isFinite(state.storageTotal)
      ? `${state.storageTotal}件`
      : '―';
  }
  if (elements.lastSync) {
    if (state.lastSyncedAt) {
      elements.lastSync.textContent = formatSupabaseMonitorDate(state.lastSyncedAt);
    } else if (state.status === 'local') {
      elements.lastSync.textContent = 'ローカル保存中';
    } else {
      elements.lastSync.textContent = '未同期';
    }
  }
  if (elements.storageBtn) {
    elements.storageBtn.textContent = supabaseMonitor.storageVisible
      ? 'Storageを隠す'
      : 'Storageを表示';
  }
  if (elements.storageSection) {
    elements.storageSection.style.display = supabaseMonitor.storageVisible ? 'block' : 'none';
  }
  renderSupabaseStorageList();
}

function renderSupabaseStorageList() {
  if (!supabaseMonitor.initialized) return;
  const { storageList, storageEmpty } = supabaseMonitor.elements;
  if (!storageList) return;
  storageList.innerHTML = '';
  const summary = supabaseMonitor.state.storageSummary;
  if (!Array.isArray(summary) || summary.length === 0) {
    if (storageEmpty) {
      storageEmpty.style.display = '';
    }
    return;
  }
  if (storageEmpty) {
    storageEmpty.style.display = 'none';
  }
  summary.forEach((bucketInfo) => {
    const item = document.createElement('li');
    item.className = 'supabase-storage-item';
    const head = document.createElement('div');
    head.className = 'supabase-storage-item-head';
    const labelEl = document.createElement('span');
    labelEl.textContent = bucketInfo.bucket;
    const countEl = document.createElement('span');
    countEl.className = 'supabase-storage-meta';
    countEl.textContent = Number.isFinite(bucketInfo.total)
      ? `${bucketInfo.total}件`
      : '―';
    head.appendChild(labelEl);
    head.appendChild(countEl);
    item.appendChild(head);
    if (bucketInfo.error) {
      const errorMsg = document.createElement('p');
      errorMsg.className = 'supabase-storage-error';
      errorMsg.textContent = bucketInfo.error;
      item.appendChild(errorMsg);
    } else if (bucketInfo.files?.length) {
      const filesList = document.createElement('ul');
      filesList.className = 'supabase-storage-files';
      bucketInfo.files.forEach((file) => {
        const row = document.createElement('li');
        row.className = 'supabase-storage-file';
        const nameEl = document.createElement('code');
        nameEl.textContent = file.name;
        const metaEl = document.createElement('span');
        metaEl.className = 'supabase-storage-meta';
        const parts = [];
        if (file.updatedAt) {
          parts.push(formatSupabaseMonitorDate(file.updatedAt));
        }
        if (Number.isFinite(file.size)) {
          parts.push(formatSupabaseFileSize(file.size));
        }
        metaEl.textContent = parts.join(' / ') || '―';
        row.appendChild(nameEl);
        row.appendChild(metaEl);
        filesList.appendChild(row);
      });
      item.appendChild(filesList);
    } else {
      const emptyRow = document.createElement('p');
      emptyRow.className = 'supabase-storage-meta';
      emptyRow.textContent = 'ファイルはまだありません。';
      item.appendChild(emptyRow);
    }
    storageList.appendChild(item);
  });
}

function formatSupabaseMonitorDate(input) {
  if (!input) return '';
  const date = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(date.getTime())) return '';
  try {
    if (typeof Intl !== 'undefined' && Intl.DateTimeFormat) {
      return new Intl.DateTimeFormat('ja-JP', { dateStyle: 'short', timeStyle: 'short' }).format(date);
    }
  } catch (_) {
    // noop
  }
  return date.toLocaleString('ja-JP');
}

function formatSupabaseFileSize(bytes) {
  if (!Number.isFinite(bytes)) return '';
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  }
  if (bytes >= 1024) {
    return `${Math.round(bytes / 1024)}KB`;
  }
  return `${bytes}B`;
}

async function refreshSupabaseMonitor(options = {}) {
  const { includeStorage = false, silent = false } = options;
  if (!supabaseMonitor.initialized) return;
  if (!supabase) {
    updateSupabaseMonitorLocalFallback();
    if (!silent) {
      showToast('Supabaseが未設定のためローカル保存モードで動作しています。', 'error');
    }
    return;
  }
  supabaseMonitor.state.status = 'loading';
  supabaseMonitor.state.message = 'Supabaseと同期中...';
  updateSupabaseMonitorUI();
  try {
    const { count } = await supabase
      .from(MEMBERS_TABLE)
      .select('id', { head: true, count: 'exact' });
    if (typeof count === 'number') {
      supabaseMonitor.state.memberCount = count;
    }
    if (includeStorage) {
      const summary = await Promise.all(SUPABASE_BUCKET_IDS.map((bucketId) => listBucketObjects(bucketId)));
      supabaseMonitor.state.storageSummary = summary;
      supabaseMonitor.state.storageTotal = summary.reduce((acc, bucket) => {
        return acc + (Number.isFinite(bucket.total) ? bucket.total : 0);
      }, 0);
      supabaseMonitor.storageDirty = false;
    }
    supabaseMonitor.state.status = 'connected';
    supabaseMonitor.state.message = 'Supabaseと接続済み';
    supabaseMonitor.state.lastError = null;
    supabaseMonitor.state.lastSyncedAt = new Date();
    updateSupabaseMonitorUI();
    if (!silent) {
      showToast('Supabaseの状態を更新しました。', 'success');
    }
  } catch (err) {
    supabaseMonitor.state.status = 'error';
    supabaseMonitor.state.message = 'Supabaseの同期に失敗しました。';
    supabaseMonitor.state.lastError = err?.message || String(err);
    if (includeStorage) {
      supabaseMonitor.state.storageSummary = [];
      supabaseMonitor.state.storageTotal = null;
    }
    updateSupabaseMonitorUI();
    if (!silent) {
      showToast('Supabaseの状態取得に失敗しました。', 'error');
    }
  }
}

async function listBucketObjects(bucketId) {
  const summary = { bucket: bucketId, files: [], total: 0, error: null };
  try {
    const { data, error } = await supabase.storage
      .from(bucketId)
      .list('', {
        limit: 50,
        sortBy: { column: 'updated_at', order: 'desc' }
      });
    if (error) {
      throw error;
    }
    const files = Array.isArray(data)
      ? data
        .filter((entry) => entry && typeof entry.name === 'string' && !entry.name.endsWith('/'))
        .map((entry) => {
          const rawSize = entry?.metadata?.size ?? entry?.metadata?.Size ?? entry?.metadata?.length ?? entry?.metadata?.ContentLength;
          const sizeNumber = typeof rawSize === 'number' ? rawSize : Number(rawSize);
          return {
            name: entry.name,
            updatedAt: entry.updated_at ? new Date(entry.updated_at) : (entry.created_at ? new Date(entry.created_at) : null),
            size: Number.isFinite(sizeNumber) ? sizeNumber : null
          };
        })
      : [];
    summary.total = files.length;
    summary.files = files.slice(0, 10);
  } catch (err) {
    summary.error = err?.message || '取得に失敗しました。';
  }
  return summary;
}

function markSupabaseStorageDirty() {
  supabaseMonitor.storageDirty = true;
  if (supabaseMonitor.initialized && supabaseMonitor.storageVisible && supabase) {
    refreshSupabaseMonitor({ includeStorage: true, silent: true });
  }
}

function updateSupabaseMonitorLocalFallback() {
  if (!supabaseMonitor.initialized) return;
  supabaseMonitor.state.status = 'local';
  supabaseMonitor.state.message = '現在はローカル保存モード（localStorage）で動作しています。';
  supabaseMonitor.state.memberCount = Array.isArray(appData?.members) ? appData.members.length : null;
  supabaseMonitor.state.storageSummary = [];
  supabaseMonitor.state.storageTotal = null;
  supabaseMonitor.state.lastSyncedAt = null;
  supabaseMonitor.state.lastError = null;
  updateSupabaseMonitorUI();
}

function $(id) {
  return document.getElementById(id);
}

function escapeHTML(value) {
  if (value === null || value === undefined) {
    return '';
  }
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatMultilineText(value) {
  if (!value) return '';
  return escapeHTML(value).replace(/\n/g, '<br>');
}

function isCurrentUserAdmin() {
  return Boolean(currentUserProfile?.isAdmin);
}

function clearMemberNotesForm() {
  const select = $('memberNotesSelect');
  if (select) {
    select.value = '';
  }
  const traitsField = $('memberTraitsField');
  const cautionsField = $('memberCautionsField');
  if (traitsField) traitsField.value = '';
  if (cautionsField) cautionsField.value = '';
}

function resetMemberNotesState() {
  memberNotesState.entries = {};
  memberNotesState.selectedMemberId = '';
  memberNotesState.lastSyncedAt = null;
  clearMemberNotesForm();
  updateMemberNotesStatus('');
  renderMemberNotesPreview('');
}

function isMemberNotesPanelVisible() {
  const panel = $('member-notes-panel');
  return panel ? panel.classList.contains('show') : false;
}

function stopApprovalPolling() {
  if (approvalPollTimer) {
    clearInterval(approvalPollTimer);
    approvalPollTimer = null;
  }
  if (approvalRealtimeChannel) {
    try {
      if (supabase && typeof supabase.removeChannel === 'function') {
        supabase.removeChannel(approvalRealtimeChannel).catch((err) => {
          console.warn('承認リアルタイム監視の解除に失敗しました:', err);
        });
      } else if (typeof approvalRealtimeChannel.unsubscribe === 'function') {
        approvalRealtimeChannel.unsubscribe();
      }
    } catch (err) {
      console.warn('承認リアルタイム監視の解除処理でエラーが発生しました:', err);
    } finally {
      approvalRealtimeChannel = null;
    }
  }
}

function cloneDefaultState() {
  return JSON.parse(JSON.stringify(DEFAULT_APP_DATA));
}

function loadAppData() {
  try {
    const raw = storage?.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const defaults = cloneDefaultState();
      return {
        ...defaults,
        ...parsed,
        announcements: Array.isArray(parsed?.announcements) ? parsed.announcements : defaults.announcements,
        notices: Array.isArray(parsed?.notices) ? parsed.notices : defaults.notices,
        schedule: Array.isArray(parsed?.schedule) ? parsed.schedule : defaults.schedule,
        members: Array.isArray(parsed?.members) ? parsed.members : defaults.members,
        resources: Array.isArray(parsed?.resources) ? parsed.resources : defaults.resources,
        qaLog: Array.isArray(parsed?.qaLog) ? parsed.qaLog : defaults.qaLog
      };
    }
  } catch (err) {
    console.warn('アプリデータの読み込みに失敗しました:', err);
  }
  return cloneDefaultState();
}

function saveAppData(state) {
  try {
    storage?.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn('アプリデータの保存に失敗しました:', err);
  }
}

function createId(prefix = 'id') {
  try {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return `${prefix}-${crypto.randomUUID()}`;
    }
  } catch (_) {
    // noop
  }
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function resolveSubmitButton(event, fallbackSelector) {
  if (event?.submitter instanceof HTMLButtonElement) {
    return event.submitter;
  }
  const active = document.activeElement;
  if (active instanceof HTMLButtonElement && event?.target && active.form === event.target) {
    return active;
  }
  if (fallbackSelector) {
    const fallback =
      typeof fallbackSelector === 'string'
        ? document.querySelector(fallbackSelector)
        : fallbackSelector;
    if (fallback instanceof HTMLButtonElement) {
      return fallback;
    }
  }
  if (event?.target instanceof HTMLFormElement) {
    const defaultBtn = event.target.querySelector('button[type="submit"]');
    if (defaultBtn instanceof HTMLButtonElement) {
      return defaultBtn;
    }
  }
  return null;
}

function ensureArrayState(key) {
  if (!appData) return;
  if (!Array.isArray(appData[key])) {
    appData[key] = [];
  }
}

function normalizeSlideLayout(layout, hasMedia) {
  const lower = (layout || '').toLowerCase();
  let resolved = SLIDE_LAYOUT_OPTIONS.includes(lower)
    ? lower
    : (hasMedia ? 'mixed' : 'text');
  if ((resolved === 'mixed' || resolved === 'image') && !hasMedia) {
    resolved = 'text';
  }
  return resolved;
}

function getSlideLayout(slide) {
  return normalizeSlideLayout(slide?.layout, Boolean(slide?.mediaUrl));
}

function normalizeMemberRecord(record) {
  if (!record || typeof record !== 'object') return null;
  const parsedAge = typeof record.age === 'number'
    ? record.age
    : Number(record.age);
  return {
    id: record.id || record.member_id || record.uuid || record.localId || '',
    name: record.name || '氏名未設定',
    role: record.role || '',
    team: record.team || '',
    contact: record.contact || '',
    age: Number.isFinite(parsedAge) ? parsedAge : null,
    affiliation: record.affiliation || record.team || '',
    motivation: record.motivation || '',
    photo: record.photo || '',
    photoAlt: record.photoAlt || record.photo_alt || `${record.name || 'メンバー'}のプロフィール写真`
  };
}

function findMemberById(memberId) {
  if (!memberId) return null;
  if (!Array.isArray(appData?.members)) return null;
  return appData.members.find((member) => member.id === memberId) || null;
}

function normalizeAnnouncementRecord(record) {
  if (!record || typeof record !== 'object') return null;
  const hasMedia = Boolean(record.media_url || record.mediaUrl);
  const layout = normalizeSlideLayout(record.layout, hasMedia);
  return {
    id: record.id || record.announcement_id || record.uuid || createId('ann'),
    tag: record.tag || '共有',
    title: record.title || '',
    body: record.body || '',
    layout,
    mediaUrl: record.media_url || record.mediaUrl || '',
    mediaAlt: record.media_alt || record.mediaAlt || (hasMedia ? (record.title || '関連画像') : ''),
    createdAt: record.created_at || record.createdAt || new Date().toISOString()
  };
}

async function refreshMembersFromSupabase(options = {}) {
  if (!supabase) return false;
  if (membersSyncInFlight) {
    return membersSyncInFlight;
  }
  membersSyncInFlight = (async () => {
    try {
      const { data, error } = await supabase
        .from(MEMBERS_TABLE)
        .select('id, name, role, team, contact, age, affiliation, motivation, photo, photo_alt, created_at')
        .order('created_at', { ascending: true });
      if (error) {
        throw error;
      }
      const normalized = Array.isArray(data)
        ? data.map((row) => normalizeMemberRecord(row)).filter(Boolean)
        : [];
      ensureArrayState('members');
      appData.members = normalized;
      saveAppData(appData);
      renderMemberTable();
      renderAdminMembers();
      if (supabaseMonitor.initialized) {
        supabaseMonitor.state.memberCount = normalized.length;
        supabaseMonitor.state.status = 'connected';
        supabaseMonitor.state.message = 'Supabaseと接続済み';
        supabaseMonitor.state.lastSyncedAt = new Date();
        updateSupabaseMonitorUI();
      }
      if (editingMemberId) {
        const editingMember = normalized.find((member) => member.id === editingMemberId);
        if (editingMember) {
          fillMemberFormFields(editingMember);
          applyMemberEditUIState(editingMember);
        } else {
          exitMemberEditMode({ silent: true });
        }
      }
      if (isMemberNotesPanelVisible()) {
        populateMemberNotesSelect(memberNotesState.selectedMemberId);
      }
      return true;
    } catch (err) {
      if (!options.silent) {
        showToast('メンバー情報の取得に失敗しました。', 'error');
      }
      console.warn('Failed to fetch members from Supabase:', err);
      if (supabaseMonitor.initialized) {
        supabaseMonitor.state.status = 'error';
        supabaseMonitor.state.message = 'メンバー同期に失敗しました。';
        supabaseMonitor.state.lastError = err?.message || String(err);
        updateSupabaseMonitorUI();
      }
      return false;
    } finally {
      membersSyncInFlight = null;
    }
  })();
  return membersSyncInFlight;
}

async function refreshMemberNotesFromSupabase(options = {}) {
  if (!supabase || !isCurrentUserAdmin()) return false;
  if (memberNotesSyncInFlight) {
    return memberNotesSyncInFlight;
  }
  memberNotesSyncInFlight = (async () => {
    try {
      const { data, error } = await supabase
        .from(MEMBER_NOTES_TABLE)
        .select('member_id, traits, cautions, updated_at, updated_by_email')
        .order('updated_at', { ascending: false });
      if (error) {
        throw error;
      }
      const nextEntries = {};
      (data || []).forEach((row) => {
        if (!row?.member_id) return;
        nextEntries[row.member_id] = {
          traits: row.traits || '',
          cautions: row.cautions || '',
          updatedAt: row.updated_at || null,
          updatedByEmail: row.updated_by_email || ''
        };
      });
      memberNotesState.entries = nextEntries;
      memberNotesState.lastSyncedAt = new Date();
      const selectedId = memberNotesState.selectedMemberId;
      if (selectedId && memberNotesState.entries[selectedId]) {
        fillMemberNotesFieldsFromState(selectedId);
      }
      if (isMemberNotesPanelVisible()) {
        populateMemberNotesSelect(selectedId);
      }
      return true;
    } catch (err) {
      if (!options.silent) {
        showToast('メンバー特性メモの取得に失敗しました。', 'error');
      }
      console.warn('Failed to fetch member notes from Supabase:', err);
      return false;
    } finally {
      memberNotesSyncInFlight = null;
    }
  })();
  return memberNotesSyncInFlight;
}

async function refreshAnnouncementsFromSupabase(options = {}) {
  if (!supabase) return false;
  if (announcementsSyncInFlight) {
    return announcementsSyncInFlight;
  }
  announcementsSyncInFlight = (async () => {
    try {
      const { data, error } = await supabase
        .from(ANNOUNCEMENTS_TABLE)
        .select('id, tag, title, body, layout, media_url, media_alt, created_at')
        .order('created_at', { ascending: false });
      if (error) {
        throw error;
      }
      const normalized = Array.isArray(data)
        ? data.map((row) => normalizeAnnouncementRecord(row)).filter(Boolean)
        : [];
      ensureArrayState('announcements');
      appData.announcements = normalized;
      saveAppData(appData);
      renderAnnouncements();
      renderSliderAdminList();
      startSliderAutoPlay();
      return true;
    } catch (err) {
      if (!options.silent) {
        showToast('スライダー情報の取得に失敗しました。', 'error');
      }
      console.warn('Failed to fetch announcements from Supabase:', err);
      return false;
    } finally {
      announcementsSyncInFlight = null;
    }
  })();
  return announcementsSyncInFlight;
}

async function insertMemberToSupabase(member) {
  if (!supabase) return null;
  const payload = {
    name: member.name,
    role: member.role || null,
    team: member.team || null,
    contact: member.contact || null,
    age: Number.isFinite(member.age) ? member.age : null,
    affiliation: member.affiliation || null,
    motivation: member.motivation || null,
    photo: member.photo || null,
    photo_alt: member.photoAlt || null
  };
  const { data, error } = await supabase
    .from(MEMBERS_TABLE)
    .insert(payload)
    .select('id, name, role, team, contact, age, affiliation, motivation, photo, photo_alt, created_at')
    .single();
  if (error) throw error;
  return normalizeMemberRecord(data);
}

async function insertAnnouncementToSupabase(slide) {
  if (!supabase) return null;
  const payload = {
    tag: slide.tag || '共有',
    title: slide.title || null,
    body: slide.body || null,
    layout: slide.layout || 'text',
    media_url: slide.mediaUrl || null,
    media_alt: slide.mediaAlt || null
  };
  const { data, error } = await supabase
    .from(ANNOUNCEMENTS_TABLE)
    .insert(payload)
    .select('id, tag, title, body, layout, media_url, media_alt, created_at')
    .single();
  if (error) throw error;
  return normalizeAnnouncementRecord(data);
}

async function deleteMemberFromSupabase(id) {
  if (!supabase || !id) return;
  const { error } = await supabase
    .from(MEMBERS_TABLE)
    .delete()
    .eq('id', id);
  if (error) {
    throw error;
  }
}

async function deleteAnnouncementFromSupabase(id) {
  if (!supabase || !id) return;
  const { error } = await supabase
    .from(ANNOUNCEMENTS_TABLE)
    .delete()
    .eq('id', id);
  if (error) {
    throw error;
  }
}

async function updateMemberInSupabase(id, member) {
  if (!supabase || !id) return null;
  const payload = {
    name: member.name,
    role: member.role || null,
    team: member.team || null,
    contact: member.contact || null,
    age: Number.isFinite(member.age) ? member.age : null,
    affiliation: member.affiliation || null,
    motivation: member.motivation || null,
    photo: member.photo || null,
    photo_alt: member.photoAlt || null
  };
  const { data, error } = await supabase
    .from(MEMBERS_TABLE)
    .update(payload)
    .eq('id', id)
    .select('id, name, role, team, contact, age, affiliation, motivation, photo, photo_alt, created_at')
    .single();
  if (error) throw error;
  return normalizeMemberRecord(data);
}

async function upsertMemberNotesToSupabase(memberId, values) {
  if (!supabase || !memberId) return null;
  const payload = {
    member_id: memberId,
    traits: values.traits || null,
    cautions: values.cautions || null,
    updated_by: currentSession?.user?.id || null,
    updated_by_email: currentSession?.user?.email || null
  };
  const { data, error } = await supabase
    .from(MEMBER_NOTES_TABLE)
    .upsert(payload, { onConflict: 'member_id' })
    .select('member_id')
    .single();
  if (error) {
    throw error;
  }
  return data;
}

function sanitizeFileName(name = '') {
  if (!name) return `member-photo-${Date.now()}`;
  return name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
}

async function uploadMemberPhoto(file, options = {}) {
  if (!supabase || !file) return '';
  try {
    const fileName = sanitizeFileName(file.name || 'photo.jpg');
    const ext = fileName.includes('.') ? fileName.split('.').pop() : 'jpg';
    const objectName = `members/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from(MEMBER_PHOTO_BUCKET)
      .upload(objectName, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type || 'image/jpeg'
      });
    if (uploadError) {
      throw uploadError;
    }
    const { data } = supabase.storage
      .from(MEMBER_PHOTO_BUCKET)
      .getPublicUrl(objectName, { download: false });
    const publicUrl = data?.publicUrl || '';
    markSupabaseStorageDirty();
    return publicUrl;
  } catch (err) {
    console.warn('Failed to upload member photo:', err);
    showToast('顔写真のアップロードに失敗しました。', 'error');
    throw err;
  }
}

async function uploadSliderMedia(file) {
  if (!supabase || !file) return '';
  try {
    const fileName = sanitizeFileName(file.name || 'slide.jpg');
    const ext = fileName.includes('.') ? fileName.split('.').pop() : 'jpg';
    const objectName = `slider/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from(SLIDER_MEDIA_BUCKET)
      .upload(objectName, file, {
        cacheControl: '1800',
        upsert: false,
        contentType: file.type || 'image/jpeg'
      });
    if (uploadError) {
      throw uploadError;
    }
    const { data } = supabase.storage
      .from(SLIDER_MEDIA_BUCKET)
      .getPublicUrl(objectName, { download: false });
    const publicUrl = data?.publicUrl || '';
    markSupabaseStorageDirty();
    return publicUrl;
  } catch (err) {
    console.warn('Failed to upload slider media:', err);
    showToast('スライド画像のアップロードに失敗しました。', 'error');
    throw err;
  }
}

function buildSlideMessage(slide) {
  const parts = [];
  parts.push(`<span class="eyebrow">${slide?.tag || '共有'}</span>`);
  if (slide?.title) {
    parts.push(`<h3>${slide.title}</h3>`);
  }
  if (slide?.body) {
    parts.push(`<p>${slide.body}</p>`);
  }
  return parts.join('');
}

function renderSlideMarkup(slide) {
  const layout = getSlideLayout(slide);
  const hasMedia = Boolean(slide?.mediaUrl);
  const messageContent = buildSlideMessage(slide);
  const messageBlock = messageContent ? `<div class="slide-message">${messageContent}</div>` : '';
  const mediaBlock = hasMedia
    ? `<div class="slide-media"><img src="${slide.mediaUrl}" alt="${slide.mediaAlt || slide.title || '関連画像'}" loading="lazy"></div>`
    : '';
  if (layout === 'image' && hasMedia) {
    return `
      <div class="slide" data-type="message" data-layout="image">
        <div class="slide-image-only">
          ${mediaBlock}
          ${messageBlock ? `<div class="slide-overlay">${messageBlock}</div>` : ''}
        </div>
      </div>`;
  }
  if (layout === 'mixed' && hasMedia) {
    return `
      <div class="slide" data-type="message" data-layout="mixed">
        <div class="slide-split">
          ${mediaBlock}
          ${messageBlock || '<div class="slide-message"><p>写真情報</p></div>'}
        </div>
      </div>`;
  }
  return `
    <div class="slide" data-type="message" data-layout="text">
      ${messageBlock || '<div class="slide-message"><p>内容未設定</p></div>'}
    </div>`;
}

function setMemberNotesFormDisabled(disabled) {
  ['memberNotesSelect', 'memberTraitsField', 'memberCautionsField', 'memberNotesSaveBtn'].forEach((id) => {
    const el = $(id);
    if (el) {
      el.disabled = disabled;
    }
  });
}

function toggleMemberNotesButton(visible) {
  const btn = $('memberNotesBtn');
  if (!btn) return;
  btn.style.display = visible ? '' : 'none';
  if (!visible) {
    closeMemberNotesPanel();
  }
}

function openMemberNotesPanel() {
  const panel = $('member-notes-panel');
  if (!panel) return;
  panel.classList.add('show');
  panel.removeAttribute('hidden');
  populateMemberNotesSelect(memberNotesState.selectedMemberId);
  $('memberNotesSelect')?.focus();
}

function closeMemberNotesPanel() {
  const panel = $('member-notes-panel');
  if (!panel) return;
  panel.classList.remove('show');
  panel.setAttribute('hidden', 'hidden');
}

function populateMemberNotesSelect(preferredId = '') {
  const select = $('memberNotesSelect');
  if (!select) return;
  const members = Array.isArray(appData?.members) ? appData.members : [];
  if (!members.length) {
    select.innerHTML = '<option value="">登録済みメンバーがありません</option>';
    setMemberNotesFormDisabled(true);
    clearMemberNotesForm();
    renderMemberNotesPreview('');
    updateMemberNotesStatus('');
    return;
  }
  setMemberNotesFormDisabled(false);
  const options = ['<option value="">メンバーを選択してください</option>'];
  members.forEach((member) => {
    const label = member.team ? `[${member.team}] ${member.name}` : member.name;
    options.push(`<option value="${member.id}">${escapeHTML(label)}</option>`);
  });
  select.innerHTML = options.join('');
  let resolvedId = preferredId || memberNotesState.selectedMemberId || members[0].id;
  if (!members.some((member) => member.id === resolvedId)) {
    resolvedId = '';
  }
  if (resolvedId) {
    select.value = resolvedId;
    memberNotesState.selectedMemberId = resolvedId;
    fillMemberNotesFieldsFromState(resolvedId);
  } else {
    select.value = '';
    memberNotesState.selectedMemberId = '';
    clearMemberNotesForm();
    renderMemberNotesPreview('');
    updateMemberNotesStatus('');
  }
}

function fillMemberNotesFieldsFromState(memberId) {
  const notes = memberNotesState.entries[memberId] || { traits: '', cautions: '' };
  const traitsField = $('memberTraitsField');
  const cautionsField = $('memberCautionsField');
  if (traitsField) {
    traitsField.value = notes.traits || '';
  }
  if (cautionsField) {
    cautionsField.value = notes.cautions || '';
  }
  updateMemberNotesStatus(memberId);
  renderMemberNotesPreview(memberId);
}

function handleMemberNotesSelectChange() {
  const select = $('memberNotesSelect');
  if (!select) return;
  const memberId = select.value;
  memberNotesState.selectedMemberId = memberId;
  if (memberId) {
    fillMemberNotesFieldsFromState(memberId);
  } else {
    clearMemberNotesForm();
    renderMemberNotesPreview('');
    updateMemberNotesStatus('');
  }
}

function updateMemberNotesStatus(memberId) {
  const statusEl = $('memberNotesStatus');
  if (!statusEl) return;
  if (!memberId) {
    statusEl.textContent = '対象メンバーを選択してください。';
    return;
  }
  const note = memberNotesState.entries[memberId];
  if (!note || (!note.traits && !note.cautions)) {
    statusEl.textContent = 'まだメモは登録されていません。';
    return;
  }
  const parts = [];
  if (note.updatedAt) {
    parts.push(`最終更新 ${formatTimestamp(note.updatedAt)}`);
  }
  if (note.updatedByEmail) {
    parts.push(`記入者 ${note.updatedByEmail}`);
  }
  statusEl.textContent = parts.join(' / ');
}

function renderMemberNotesPreview(memberId) {
  const preview = $('memberNotesPreview');
  if (!preview) return;
  if (!memberId) {
    preview.innerHTML = '<p class="muted">メンバーを選択すると記録内容が表示されます。</p>';
    return;
  }
  const member = findMemberById(memberId);
  const note = memberNotesState.entries[memberId];
  const displayName = member ? `${member.team ? `${member.team} / ` : ''}${member.name}` : '対象メンバー';
  const traits = note?.traits?.trim();
  const cautions = note?.cautions?.trim();
  const traitsMarkup = traits ? formatMultilineText(traits) : '<span class="muted">未記入</span>';
  const cautionsMarkup = cautions ? formatMultilineText(cautions) : '<span class="muted">未記入</span>';
  preview.innerHTML = `
    <article>
      <h4>${escapeHTML(displayName)}</h4>
      <div class="member-notes-preview-section">
        <strong>特性</strong>
        <p>${traitsMarkup}</p>
      </div>
      <div class="member-notes-preview-section">
        <strong>注意すべき点</strong>
        <p>${cautionsMarkup}</p>
      </div>
    </article>
  `;
}

function setMemberNotesSaving(isSaving) {
  const btn = $('memberNotesSaveBtn');
  if (!btn) return;
  btn.disabled = isSaving;
  btn.textContent = isSaving ? '保存中...' : '上書き保存';
}

async function handleMemberNotesSubmit(event) {
  event.preventDefault();
  if (!isCurrentUserAdmin()) {
    showToast('管理者のみ利用できます。', 'error');
    return;
  }
  if (!requireSupabaseForSync('メンバー特性メモ')) {
    return;
  }
  const select = $('memberNotesSelect');
  const memberId = select?.value;
  if (!memberId) {
    showToast('メンバーを選択してください。', 'error');
    return;
  }
  const traitsValue = $('memberTraitsField')?.value?.trim() || '';
  const cautionsValue = $('memberCautionsField')?.value?.trim() || '';
  setMemberNotesSaving(true);
  try {
    await upsertMemberNotesToSupabase(memberId, { traits: traitsValue, cautions: cautionsValue });
    showToast('特性メモを保存しました。', 'success');
    memberNotesState.selectedMemberId = memberId;
    await refreshMemberNotesFromSupabase({ silent: true });
    fillMemberNotesFieldsFromState(memberId);
  } catch (err) {
    console.warn('Failed to save member notes via Supabase:', err);
    showToast('特性メモの保存に失敗しました。Supabaseの設定や権限を確認してください。', 'error');
  } finally {
    setMemberNotesSaving(false);
  }
}

async function handleMemberNotesOpen() {
  if (!isCurrentUserAdmin()) {
    showToast('管理者のみ利用できます。', 'error');
    return;
  }
  if (!requireSupabaseForSync('メンバー特性メモ')) {
    return;
  }
  await refreshMemberNotesFromSupabase({ silent: true });
  openMemberNotesPanel();
}

function toggleAdminButton(visible) {
  const btn = $('adminAccessBtn');
  if (!btn) return;
  btn.style.display = visible ? '' : 'none';
}

function updateAdminPanelVisibility() {
  const panel = $('admin-panel');
  if (!panel) return;
  if (adminUnlocked) {
    panel.classList.add('visible');
    panel.removeAttribute('hidden');
  } else {
    panel.classList.remove('visible');
    panel.setAttribute('hidden', 'hidden');
  }
}

function setAdminAccess(enabled) {
  adminUnlocked = enabled;
  updateAdminPanelVisibility();
  if (!enabled) {
    closeAdminModal();
  }
}

function openAdminModal() {
  const modal = $('admin-modal');
  if (!modal) return;
  modal.classList.add('show');
  $('admin-code')?.focus();
}

function closeAdminModal() {
  const modal = $('admin-modal');
  if (!modal) return;
  modal.classList.remove('show');
  $('admin-access-form')?.reset();
}

function ensureAdminAccess() {
  if (adminUnlocked) return true;
  showToast('管理者画面に入室してください。', 'error');
  return false;
}

function requireSupabaseForSync(featureLabel = 'この操作') {
  if (supabase) {
    return true;
  }
  const label = featureLabel ? `${featureLabel}を` : 'この操作は';
  showToast(`Supabase未接続のため${label}実行できません。URL/キーと権限を確認してください。`, 'error');
  return false;
}

function bootstrapProtectedApp(options = {}) {
  const { forceReload = false } = options;
  if (!appData || forceReload) {
    appData = loadAppData();
  }
  renderProtectedApp();
  updateAdminPanelVisibility();
  if (!appBootstrapped) {
    attachProtectedEvents();
    appBootstrapped = true;
  }
  startSliderAutoPlay();
  if (!supabase && supabaseMonitor.initialized) {
    updateSupabaseMonitorLocalFallback();
  }
}

function renderProtectedApp() {
  if (!appData) {
    appData = loadAppData();
  }
  renderAnnouncements();
  renderNotices();
  renderAdminNotices();
  renderSchedule();
  renderMemberTable();
  renderAdminMembers();
  renderResources();
  renderAdminResources();
  renderQaLog();
  renderSliderAdminList();
}

function attachProtectedEvents() {
  const noticeForm = $('notice-form');
  if (noticeForm) {
    noticeForm.addEventListener('submit', handleNoticeSubmit);
  }
  const memberForm = $('member-form');
  if (memberForm) {
    memberForm.addEventListener('submit', handleMemberSubmit);
  }
  const resourceForm = $('resource-form');
  if (resourceForm) {
    resourceForm.addEventListener('submit', handleResourceSubmit);
  }
  const qaForm = $('qa-form');
  if (qaForm) {
    qaForm.addEventListener('submit', handleQaSubmit);
  }
  const sliderForm = $('slider-form');
  if (sliderForm) {
    sliderForm.addEventListener('submit', handleSliderSubmit);
  }
  const sliderSubmitBtn = $('slider-submit-btn');
  if (sliderForm && sliderSubmitBtn && typeof sliderForm.requestSubmit === 'function') {
    sliderSubmitBtn.addEventListener('click', (event) => {
      if (sliderSubmitBtn.disabled) return;
      event.preventDefault();
      sliderForm.requestSubmit(sliderSubmitBtn);
    });
  }
  const adminAccessBtn = $('adminAccessBtn');
  if (adminAccessBtn) {
    adminAccessBtn.addEventListener('click', () => {
      if (adminUnlocked) {
        setAdminAccess(true);
      } else {
        openAdminModal();
      }
    });
  }
  const adminAccessForm = $('admin-access-form');
  if (adminAccessForm) {
    adminAccessForm.addEventListener('submit', handleAdminAccessSubmit);
  }
  const adminModalClose = $('adminModalClose');
  if (adminModalClose) {
    adminModalClose.addEventListener('click', () => {
      closeAdminModal();
    });
  }
  const adminCloseBtn = $('adminCloseBtn');
  if (adminCloseBtn) {
    adminCloseBtn.addEventListener('click', () => {
      setAdminAccess(false);
      showToast('管理者画面を閉じました。', 'success');
    });
  }
  const sliderPrev = $('sliderPrev');
  const sliderNext = $('sliderNext');
  if (sliderPrev) {
    sliderPrev.addEventListener('click', () => shiftSlide(-1));
  }
  if (sliderNext) {
    sliderNext.addEventListener('click', () => shiftSlide(1));
  }
  const memberNotesBtn = $('memberNotesBtn');
  if (memberNotesBtn) {
    memberNotesBtn.addEventListener('click', () => {
      handleMemberNotesOpen();
    });
  }
  const memberNotesClose = $('memberNotesCloseBtn');
  if (memberNotesClose) {
    memberNotesClose.addEventListener('click', () => {
      closeMemberNotesPanel();
    });
  }
  const memberNotesCancel = $('memberNotesCancelBtn');
  if (memberNotesCancel) {
    memberNotesCancel.addEventListener('click', () => {
      closeMemberNotesPanel();
    });
  }
  const memberNotesForm = $('member-notes-form');
  if (memberNotesForm) {
    memberNotesForm.addEventListener('submit', handleMemberNotesSubmit);
  }
  const memberNotesSelect = $('memberNotesSelect');
  if (memberNotesSelect) {
    memberNotesSelect.addEventListener('change', handleMemberNotesSelectChange);
  }
  const adminNoticeList = $('admin-notice-list');
  if (adminNoticeList) {
    adminNoticeList.addEventListener('click', (event) => {
      const btn = findActionButton(event, 'remove-notice');
      if (btn?.dataset?.id) {
        handleNoticeDelete(btn.dataset.id);
      }
    });
  }
  const adminMemberList = $('admin-member-list');
  if (adminMemberList) {
    adminMemberList.addEventListener('click', (event) => {
      const btn = event.target.closest('button[data-action]');
      if (!btn?.dataset?.action) return;
      const { action, id } = btn.dataset;
      if (!id) return;
      if (action === 'remove-member') {
        handleMemberDelete(id);
      } else if (action === 'edit-member') {
        enterMemberEditMode(id);
      }
    });
  }
  const sliderAdminList = $('slider-admin-list');
  if (sliderAdminList) {
    sliderAdminList.addEventListener('click', (event) => {
      const btn = findActionButton(event, 'remove-slide');
      if (btn?.dataset?.id) {
        handleSliderDelete(btn.dataset.id);
      }
    });
  }
  const adminResourceList = $('admin-resource-list');
  if (adminResourceList) {
    adminResourceList.addEventListener('click', (event) => {
      const btn = findActionButton(event, 'remove-resource');
      if (btn?.dataset?.id) {
        handleResourceDelete(btn.dataset.id);
      }
    });
  }
  const memberCancelBtn = $('member-cancel-btn');
  if (memberCancelBtn) {
    memberCancelBtn.addEventListener('click', () => {
      exitMemberEditMode();
      showToast('編集をキャンセルしました。', 'success');
    });
  }
  setupSupabaseMonitorUI();
}

function findActionButton(event, actionName) {
  const target = event.target;
  if (!(target instanceof Element)) return null;
  return target.closest(`button[data-action="${actionName}"]`);
}

function renderAnnouncements() {
  const track = $('announcement-track');
  const dots = $('sliderDots');
  if (!track || !dots) return;
  sliderSlides = Array.isArray(appData?.announcements) ? appData.announcements : [];
  if (!sliderSlides.length) {
    track.innerHTML = `
      <div class="slide" data-type="message">
        <div class="slide-message">
          <span class="eyebrow">情報</span>
          <h3>現在表示できる更新情報はありません</h3>
          <p>承認済みになると最新のダッシュボードが表示されます。</p>
        </div>
      </div>`;
    dots.innerHTML = '';
    sliderIndex = 0;
    return;
  }
  track.innerHTML = sliderSlides.map((item) => renderSlideMarkup(item)).join('');
  dots.innerHTML = sliderSlides.map((_, idx) => `
    <button type="button" class="dot${idx === sliderIndex ? ' active' : ''}" data-index="${idx}" aria-label="通知 ${idx + 1}"></button>
  `).join('');
  dots.querySelectorAll('.dot').forEach((dot) => {
    dot.addEventListener('click', () => goToSlide(Number(dot.dataset.index)));
  });
  goToSlide(sliderIndex);
}

function goToSlide(targetIndex) {
  if (!sliderSlides.length) return;
  sliderIndex = ((targetIndex % sliderSlides.length) + sliderSlides.length) % sliderSlides.length;
  updateSliderPosition();
}

function shiftSlide(delta) {
  if (!sliderSlides.length) return;
  goToSlide(sliderIndex + delta);
}

function updateSliderPosition() {
  const track = $('announcement-track');
  const dots = $('sliderDots');
  if (!track) return;
  track.style.transform = `translateX(-${sliderIndex * 100}%)`;
  if (dots) {
    dots.querySelectorAll('.dot').forEach((dot, idx) => {
      dot.classList.toggle('active', idx === sliderIndex);
    });
  }
}

function startSliderAutoPlay() {
  stopSliderAutoPlay();
  if (!sliderSlides.length) return;
  sliderTimer = setInterval(() => shiftSlide(1), 6000);
}

function stopSliderAutoPlay() {
  if (sliderTimer) {
    clearInterval(sliderTimer);
    sliderTimer = null;
  }
}

function renderNotices() {
  const list = $('notice-list');
  if (!list) return;
  const notices = Array.isArray(appData?.notices) ? appData.notices : [];
  if (!notices.length) {
    list.innerHTML = '<li class="empty">現在登録されている業務連絡はありません。</li>';
    return;
  }
  list.innerHTML = notices.map((notice) => `
    <li>
      <div>
        <strong>${notice.title}</strong>
        <div class="meta">${notice.target || '全体'} / ${notice.deadline || '随時'}</div>
        <p class="notice-body">${notice.detail}</p>
      </div>
    </li>
  `).join('');
}

function renderAdminNotices() {
  const list = $('admin-notice-list');
  if (!list) return;
  const notices = Array.isArray(appData?.notices) ? appData.notices : [];
  if (!notices.length) {
    list.innerHTML = '<li class="empty">登録済みの業務連絡はありません。</li>';
    return;
  }
  list.innerHTML = notices.map((notice) => `
    <li>
      <div>
        <strong>${notice.title}</strong>
        <div class="meta">${notice.target || '全体'} / ${notice.deadline || '随時'}</div>
      </div>
      <button type="button" class="icon-button" data-action="remove-notice" data-id="${notice.id}" aria-label="この連絡を削除">×</button>
    </li>
  `).join('');
}

function renderSchedule() {
  const body = $('schedule-body');
  if (!body) return;
  const rows = Array.isArray(appData?.schedule) ? appData.schedule : [];
  if (!rows.length) {
    body.innerHTML = '<tr><td colspan="4">予定は登録されていません。</td></tr>';
    return;
  }
  body.innerHTML = rows.map((item) => `
    <tr>
      <td>${item.date}</td>
      <td>${item.time}</td>
      <td>${item.title}</td>
      <td>${item.owner}</td>
    </tr>
  `).join('');
}

function renderMemberTable() {
  const table = $('member-table');
  if (!table) return;
  const body = table.querySelector('tbody');
  if (!body) return;
  const members = Array.isArray(appData?.members) ? appData.members : [];
  if (!members.length) {
    body.innerHTML = '<tr><td colspan="5">登録済みのメンバーはいません。</td></tr>';
  } else {
    body.innerHTML = members.map((member) => `
      <tr>
        <td>${member.name}</td>
        <td>${member.role || '-'}</td>
        <td>${member.team || '-'}</td>
        <td>${member.contact || '未設定'}</td>
        <td>
          ${member.id
            ? `<a class="badge" href="./member-profile.html?id=${encodeURIComponent(member.id)}">詳細</a>`
            : '<span class="muted">-</span>'}
        </td>
      </tr>
    `).join('');
  }
  const memberCaption = $('member-count-caption');
  if (memberCaption) {
    memberCaption.textContent = `${members.length}名が登録済み`;
  }
}

function renderAdminMembers() {
  const list = $('admin-member-list');
  if (!list) return;
  const members = Array.isArray(appData?.members) ? appData.members : [];
  if (!members.length) {
    list.innerHTML = '<li class="empty">登録済みのメンバーはありません。</li>';
    return;
  }
  list.innerHTML = members.map((member) => {
    const hasId = Boolean(member.id);
    const detailLink = hasId
      ? `<a class="badge" href="./member-profile.html?id=${encodeURIComponent(member.id)}" target="_blank" rel="noopener noreferrer">開く</a>`
      : '<span class="badge muted">ID未割当</span>';
    const editButton = hasId
      ? `<button type="button" class="icon-button" data-action="edit-member" data-id="${member.id}" aria-label="${member.name}を編集">✎</button>`
      : '';
    const removeButton = hasId
      ? `<button type="button" class="icon-button" data-action="remove-member" data-id="${member.id}" aria-label="${member.name}を削除">×</button>`
      : '';
    return `
      <li>
        <div>
          <strong>${member.name}</strong>
          <div class="meta">${member.role || '-'} / ${member.team || '-'}</div>
        </div>
        <div style="display:flex; gap:6px; align-items:center;">
          ${detailLink}
          ${editButton}
          ${removeButton}
        </div>
      </li>
    `;
  }).join('');
}

function fillMemberFormFields(member = null) {
  const nameField = $('member-name');
  if (nameField) nameField.value = member?.name || '';
  const roleField = $('member-role');
  if (roleField) roleField.value = member?.role || '';
  const teamSelect = $('member-team');
  if (teamSelect) {
    if (member?.team) {
      teamSelect.value = member.team;
    } else {
      teamSelect.selectedIndex = 0;
    }
  }
  const affiliationField = $('member-affiliation');
  if (affiliationField) affiliationField.value = member?.affiliation || member?.team || '';
  const contactField = $('member-contact');
  if (contactField) contactField.value = member?.contact || '';
  const ageField = $('member-age');
  if (ageField) {
    ageField.value = Number.isFinite(member?.age) ? member.age : '';
  }
  const motivationField = $('member-motivation');
  if (motivationField) motivationField.value = member?.motivation || '';
  const photoInput = $('member-photo-file');
  if (photoInput) {
    photoInput.value = '';
  }
}

function resetMemberFormFields() {
  const form = $('member-form');
  if (form) form.reset();
  fillMemberFormFields(null);
}

function applyMemberEditUIState(member) {
  const submitBtn = $('member-submit-btn');
  if (submitBtn) submitBtn.textContent = 'メンバーを更新';
  const cancelBtn = $('member-cancel-btn');
  if (cancelBtn) cancelBtn.style.display = '';
  const status = $('member-form-status');
  if (status) {
    status.textContent = `編集モード: ${member.name}（顔写真は未選択なら現状を保持します）`;
    status.style.display = '';
  }
}

function exitMemberEditMode(options = {}) {
  editingMemberId = null;
  if (options.resetForm !== false) {
    resetMemberFormFields();
  }
  const submitBtn = $('member-submit-btn');
  if (submitBtn) submitBtn.textContent = 'メンバーを追加';
  const cancelBtn = $('member-cancel-btn');
  if (cancelBtn) cancelBtn.style.display = 'none';
  const status = $('member-form-status');
  if (status) {
    status.textContent = '';
    status.style.display = 'none';
  }
}

function enterMemberEditMode(id) {
  ensureArrayState('members');
  const members = Array.isArray(appData?.members) ? appData.members : [];
  const member = members.find((item) => item.id === id);
  if (!member) {
    showToast('指定したメンバーが見つかりません。', 'error');
    return;
  }
  editingMemberId = id;
  fillMemberFormFields(member);
  applyMemberEditUIState(member);
  $('member-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  showToast(`${member.name} の情報を編集しています。`, 'info');
}

function renderResources() {
  const list = $('resource-list');
  if (!list) return;
  const resources = Array.isArray(appData?.resources) ? appData.resources : [];
  if (!resources.length) {
    list.innerHTML = '<li class="empty">登録済みの資料はありません。</li>';
    return;
  }
  list.innerHTML = resources.map((item) => `
    <li>
      <div>
        <strong>${item.title}</strong>
        <div class="meta">${item.meta || '概要未設定'}</div>
      </div>
      ${item.link ? `<a href="${item.link}" class="badge" target="_blank" rel="noopener noreferrer">開く</a>` : ''}
    </li>
  `).join('');
}

function renderAdminResources() {
  const list = $('admin-resource-list');
  if (!list) return;
  const resources = Array.isArray(appData?.resources) ? appData.resources : [];
  if (!resources.length) {
    list.innerHTML = '<li class="empty">登録済みの資料はありません。</li>';
    return;
  }
  list.innerHTML = resources.map((item) => `
    <li>
      <div>
        <strong>${item.title}</strong>
        <div class="meta">${item.meta || '概要未設定'}</div>
      </div>
      <button type="button" class="icon-button" data-action="remove-resource" data-id="${item.id}" aria-label="この資料を削除">×</button>
    </li>
  `).join('');
}

function renderQaLog() {
  const list = $('qa-log');
  if (!list) return;
  const entries = Array.isArray(appData?.qaLog) ? appData.qaLog.slice(0, 5) : [];
  if (!entries.length) {
    list.innerHTML = '<li class="empty">まだ質問は登録されていません。</li>';
    return;
  }
  list.innerHTML = entries.map((entry) => `
    <li>
      <div>
        <strong>${entry.name || '匿名'}</strong>
        <div class="meta">${formatTopic(entry.topic)} / ${formatTimestamp(entry.createdAt)}</div>
        <p class="qa-body">${entry.question}</p>
      </div>
    </li>
  `).join('');
}

function renderSliderAdminList() {
  const list = $('slider-admin-list');
  if (!list) return;
  const slides = Array.isArray(appData?.announcements) ? appData.announcements : [];
  if (!slides.length) {
    list.innerHTML = '<li class="empty">表示中のスライドはありません。</li>';
    return;
  }
  list.innerHTML = slides.map((slide) => {
    const layout = getSlideLayout(slide);
    const displayTitle = slide.title || '(タイトル未設定)';
    return `
    <li>
      <div>
        <strong>${displayTitle}</strong>
        <div class="meta">${slide.tag || '共有'} / ${SLIDE_LAYOUT_LABELS[layout] || SLIDE_LAYOUT_LABELS.text}</div>
      </div>
      <button type="button" class="icon-button" data-action="remove-slide" data-id="${slide.id}" aria-label="このスライドを削除">×</button>
    </li>
  `;
  }).join('');
}

function handleNoticeSubmit(event) {
  event.preventDefault();
  if (!ensureAdminAccess()) return;
  if (!appData) return;
  ensureArrayState('notices');
  const title = $('notice-title')?.value?.trim();
  const detail = $('notice-detail')?.value?.trim();
  if (!title || !detail) {
    showToast('件名と詳細を入力してください。', 'error');
    return;
  }
  const target = $('notice-target')?.value?.trim();
  const deadline = $('notice-deadline')?.value?.trim();
  const newNotice = {
    id: createId('notice'),
    title,
    detail,
    target: target || '全体',
    deadline: deadline || '随時',
    createdAt: new Date().toISOString()
  };
  appData.notices = [newNotice, ...appData.notices];
  saveAppData(appData);
  $('notice-form')?.reset();
  renderNotices();
  renderAdminNotices();
  showToast('業務連絡を追加しました。', 'success');
}

function handleNoticeDelete(id) {
  if (!appData || !id) return;
  if (!ensureAdminAccess()) return;
  ensureArrayState('notices');
  const before = appData.notices.length;
  appData.notices = appData.notices.filter((notice) => notice.id !== id);
  if (appData.notices.length === before) return;
  saveAppData(appData);
  renderNotices();
  renderAdminNotices();
  showToast('業務連絡を削除しました。', 'success');
}

async function handleMemberSubmit(event) {
  event.preventDefault();
  if (!ensureAdminAccess()) return;
  if (!appData) return;
  if (!requireSupabaseForSync('メンバー管理')) return;
  ensureArrayState('members');
  const name = $('member-name')?.value?.trim();
  const role = $('member-role')?.value?.trim();
  const team = $('member-team')?.value || '';
  if (!name || !role || !team) {
    showToast('氏名・役割・班を入力してください。', 'error');
    return;
  }
  const contact = $('member-contact')?.value?.trim();
  const ageValue = $('member-age')?.value?.trim();
  const affiliationInput = $('member-affiliation')?.value?.trim();
  const motivation = $('member-motivation')?.value?.trim();
  const photoInput = $('member-photo-file');
  const photoFile = photoInput?.files?.[0] || null;
  const isEditing = Boolean(editingMemberId);
  const editingId = editingMemberId;
  const existingMember = isEditing
    ? (Array.isArray(appData?.members) ? appData.members.find((member) => member.id === editingId) : null)
    : null;
  if (isEditing && !existingMember) {
    showToast('編集中のメンバーを確認できません。もう一度選択してください。', 'error');
    exitMemberEditMode();
    return;
  }
  if (!affiliationInput) {
    showToast('所属を入力してください。', 'error');
    return;
  }
  if (!contact) {
    showToast('連絡先を入力してください。', 'error');
    return;
  }
  const ageNumber = ageValue ? Number(ageValue) : null;
  const normalizedAge = Number.isFinite(ageNumber) ? ageNumber : null;
  const defaultPhotoAlt = `${name}のプロフィール写真`;
  const memberPayload = {
    name,
    role,
    team,
    contact: contact || '',
    age: normalizedAge,
    affiliation: affiliationInput || team,
    motivation: motivation || '',
    photo: existingMember?.photo || '',
    photoAlt: existingMember?.photoAlt || defaultPhotoAlt
  };
  const submitBtn = resolveSubmitButton(event, '#member-submit-btn');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = isEditing ? '更新中...' : '追加中...';
  }
  try {
    if (photoFile) {
      memberPayload.photo = await uploadMemberPhoto(photoFile, { memberName: name });
      memberPayload.photoAlt = defaultPhotoAlt;
    }
    if (isEditing) {
      await updateMemberInSupabase(editingId, memberPayload);
    } else {
      await insertMemberToSupabase(memberPayload);
    }
    await refreshMembersFromSupabase({ silent: true });
    if (isEditing) {
      exitMemberEditMode({ silent: true });
    } else {
      resetMemberFormFields();
    }
    showToast(isEditing ? `${memberPayload.name} を更新しました。` : `${memberPayload.name} を追加しました。`, 'success');
  } catch (err) {
    console.warn('Failed to sync member with Supabase:', err);
    const actionLabel = isEditing ? '更新' : '追加';
    const detail = err?.message ? ` (${err.message})` : '';
    showToast(`メンバーの${actionLabel}に失敗しました。Supabaseの設定や権限を確認してください。${detail}`, 'error');
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = isEditing ? 'メンバーを更新' : 'メンバーを追加';
    }
  }
}

async function handleMemberDelete(id) {
  if (!id || !ensureAdminAccess()) return;
  if (!requireSupabaseForSync('メンバー管理')) return;
  ensureArrayState('members');
  try {
    await deleteMemberFromSupabase(id);
    if (editingMemberId === id) {
      exitMemberEditMode({ silent: true });
    }
    await refreshMembersFromSupabase({ silent: true });
    showToast('メンバーを削除しました。', 'success');
  } catch (err) {
    console.warn('Failed to delete member via Supabase:', err);
    showToast('メンバーの削除に失敗しました。Supabaseの設定や権限を確認してください。', 'error');
  }
}

function handleResourceSubmit(event) {
  event.preventDefault();
  if (!ensureAdminAccess()) return;
  if (!appData) return;
  ensureArrayState('resources');
  const title = $('resource-title')?.value?.trim();
  if (!title) {
    showToast('資料名を入力してください。', 'error');
    return;
  }
  const meta = $('resource-meta')?.value?.trim();
  const link = $('resource-link')?.value?.trim();
  const newResource = {
    id: createId('res'),
    title,
    meta: meta || '概要未設定',
    link: link || ''
  };
  appData.resources = [...appData.resources, newResource];
  saveAppData(appData);
  $('resource-form')?.reset();
  renderResources();
  renderAdminResources();
  showToast('参考資料を追加しました。', 'success');
}

function handleResourceDelete(id) {
  if (!appData || !id) return;
  if (!ensureAdminAccess()) return;
  ensureArrayState('resources');
  const before = appData.resources.length;
  appData.resources = appData.resources.filter((resource) => resource.id !== id);
  if (before === appData.resources.length) return;
  saveAppData(appData);
  renderResources();
  renderAdminResources();
  showToast('参考資料を削除しました。', 'success');
}

async function handleSliderSubmit(event) {
  event.preventDefault();
  if (!ensureAdminAccess()) {
    updateSliderFormStatus('管理者コードを入力してから操作してください。', 'error');
    return;
  }
  if (!appData) {
    updateSliderFormStatus('アプリデータの読み込みに失敗しました。', 'error');
    return;
  }
  if (!requireSupabaseForSync('スライダー管理')) {
    updateSliderFormStatus('Supabase未接続のため保存できません。', 'error');
    return;
  }
  ensureArrayState('announcements');
  const title = $('slider-title')?.value?.trim();
  const body = $('slider-body')?.value?.trim();
  const tag = $('slider-tag')?.value || '共有';
  const layoutInput = $('slider-layout')?.value || 'text';
  const mediaAltInput = $('slider-alt')?.value?.trim();
  const mediaUrlRaw = $('slider-media')?.value?.trim();
  const mediaFileInput = $('slider-media-file');
  const mediaFile = mediaFileInput?.files?.[0] || null;
  const submitBtn = resolveSubmitButton(event, '#slider-submit-btn');
  updateSliderFormStatus('スライドを送信中...', 'info');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = '追加中...';
  }
  try {
    let mediaUrl = '';
    if (mediaFile) {
      mediaUrl = await uploadSliderMedia(mediaFile);
    } else if (mediaUrlRaw) {
      mediaUrl = mediaUrlRaw;
    }
    const hasMedia = Boolean(mediaUrl);
    if ((layoutInput === 'mixed' || layoutInput === 'image') && !hasMedia) {
      updateSliderFormStatus('選択したレイアウトには画像が必要です。', 'error');
      showToast('選択したレイアウトには画像が必要です。', 'error');
      return;
    }
    if (layoutInput === 'text' && !title && !body) {
      updateSliderFormStatus('タイトルまたは本文を入力してください。', 'error');
      showToast('テキストのみのレイアウトではタイトルまたは本文を入力してください。', 'error');
      return;
    }
    if (!title && !body && !hasMedia) {
      updateSliderFormStatus('タイトル・本文・画像のいずれかは入力してください。', 'error');
      showToast('タイトル・本文・画像のいずれかは入力してください。', 'error');
      return;
    }
    const layout = normalizeSlideLayout(layoutInput, hasMedia);
    const resolvedMediaAlt = hasMedia ? (mediaAltInput || title || '関連画像') : '';
    const slidePayload = {
      tag,
      title,
      body,
      layout,
      mediaUrl,
      mediaAlt: resolvedMediaAlt
    };
    await insertAnnouncementToSupabase(slidePayload);
    await refreshAnnouncementsFromSupabase({ silent: true });
    $('slider-form')?.reset();
    if (mediaFileInput) {
      mediaFileInput.value = '';
    }
    const layoutField = $('slider-layout');
    if (layoutField) layoutField.value = 'text';
    updateSliderFormStatus('スライドを追加しました。', 'success', { autoHide: 4000 });
    showToast('スライダーに新しい情報を追加しました。', 'success');
  } catch (err) {
    console.warn('Failed to add slider entry via Supabase:', err);
    const detail = err?.message ? ` (${err.message})` : '';
    updateSliderFormStatus('スライダーの追加に失敗しました。Supabaseの設定や権限を確認してください。', 'error');
    showToast(`スライダーの追加に失敗しました。Supabaseの設定や権限を確認してください。${detail}`, 'error');
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'スライドを追加';
    }
  }
}

async function handleSliderDelete(id) {
  if (!appData || !id) return;
  if (!ensureAdminAccess()) return;
  if (!requireSupabaseForSync('スライダー管理')) return;
  ensureArrayState('announcements');
  try {
    await deleteAnnouncementFromSupabase(id);
    await refreshAnnouncementsFromSupabase({ silent: true });
    showToast('スライダーから削除しました。', 'success');
  } catch (err) {
    console.warn('Failed to delete slider entry via Supabase:', err);
    showToast('スライダーの削除に失敗しました。Supabaseの設定や権限を確認してください。', 'error');
  }
}

function handleQaSubmit(event) {
  event.preventDefault();
  if (!ensureAdminAccess()) return;
  if (!appData) return;
  ensureArrayState('qaLog');
  const question = $('qa-question')?.value?.trim();
  if (!question) {
    showToast('質問内容を入力してください。', 'error');
    return;
  }
  const name = $('qa-name')?.value?.trim();
  const topic = $('qa-topic')?.value || 'other';
  const newEntry = {
    id: createId('qa'),
    name: name || '匿名',
    topic,
    question,
    createdAt: new Date().toISOString()
  };
  appData.qaLog = [newEntry, ...appData.qaLog];
  saveAppData(appData);
  $('qa-form')?.reset();
  renderQaLog();
  showToast('質問を登録しました。', 'success');
}

function handleAdminAccessSubmit(event) {
  event.preventDefault();
  const code = $('admin-code')?.value?.trim();
  if (!code) {
    showToast('アクセスコードを入力してください。', 'error');
    return;
  }
  if (code !== ADMIN_ACCESS_CODE) {
    showToast('アクセスコードが違います。', 'error');
    return;
  }
  setAdminAccess(true);
  closeAdminModal();
  renderProtectedApp();
  showToast('管理者画面に入室しました。', 'success');
}

function formatTopic(topic) {
  return TOPIC_LABELS[topic] || TOPIC_LABELS.other;
}

function formatTimestamp(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  return `${month}/${day} ${hour}:${minute}`;
}

function showToast(message, type = 'info') {
  const toast = $('app-toast');
  if (!toast) return;
  toast.textContent = message;
  toast.className = `toast show${type === 'success' ? ' success' : type === 'error' ? ' error' : ''}`;
  if (toastTimer) {
    clearTimeout(toastTimer);
  }
  toastTimer = setTimeout(() => {
    toast.className = 'toast';
    toast.textContent = '';
  }, 3200);
}

function updateSliderFormStatus(message, type = 'info', options = {}) {
  const statusEl = $('slider-form-status');
  if (!statusEl) return;
  if (sliderStatusTimer) {
    clearTimeout(sliderStatusTimer);
    sliderStatusTimer = null;
  }
  if (!message) {
    statusEl.textContent = '';
    statusEl.style.display = 'none';
    statusEl.className = 'form-status muted';
    return;
  }
  const variantClass = type === 'error'
    ? 'form-status error'
    : type === 'success'
      ? 'form-status success'
      : 'form-status muted';
  statusEl.className = variantClass;
  statusEl.textContent = message;
  statusEl.style.display = '';
  if (options.autoHide) {
    sliderStatusTimer = setTimeout(() => {
      updateSliderFormStatus('');
    }, options.autoHide);
  }
}

function translatePasswordUpdateError(message) {
  const raw = message || '';
  const lower = raw.toLowerCase();
  if (lower.includes('different from the old password')) {
    return '新しいパスワードは現在のパスワードと異なる必要があります。別のパスワードを設定してください。';
  }
  if (lower.includes('at least') && lower.includes('characters')) {
    const m = raw.match(/at least\s+(\d+)\s+characters/i);
    const n = m ? m[1] : '6';
    return `パスワードは${n}文字以上にしてください。`;
  }
  if (lower.includes('same as email')) {
    return 'メールアドレスと同じ文字列はパスワードに使用できません。';
  }
  if (lower.includes('session') && lower.includes('not') && lower.includes('found')) {
    return 'セッションを確認できませんでした。リンクの有効期限が切れた可能性があります。再度メールのリンクを開いてお試しください。';
  }
  return `パスワード更新に失敗しました: ${raw}`;
}

function extractTokensFromHash() {
  const h = typeof window !== 'undefined' ? window.location.hash || '' : '';
  if (!h) return null;
  const sp = new URLSearchParams(h.replace(/^#/, '?'));
  const access_token = sp.get('access_token');
  const refresh_token = sp.get('refresh_token');
  if (access_token && refresh_token) {
    return { access_token, refresh_token };
  }
  return null;
}

function showReset() {
  const authCard = $('auth-card');
  const signupCard = $('signup-card');
  const resetCard = $('reset-card');
  const authView = $('auth-view');
  const appHome = $('app-home');
  const overlay = $('auth-overlay');
  const logoutBtn = $('logoutBtn');
  toggleAdminButton(false);
  toggleMemberNotesButton(false);
  setAdminAccess(false);
  closeMemberNotesPanel();
  resetMemberNotesState();
  stopSliderAutoPlay();
  if (authView) authView.style.display = '';
  if (authCard) authCard.style.display = 'none';
  if (signupCard) signupCard.style.display = 'none';
  if (appHome) appHome.style.display = 'none';
  if (overlay) overlay.style.display = 'none';
  if (logoutBtn) logoutBtn.style.display = 'none';
  if (resetCard) resetCard.style.display = '';
  const msg = $('reset-message');
  if (msg) msg.textContent = '';
}

function showLogin() {
  stopApprovalPolling();
  stopSliderAutoPlay();
  const authCard = $('auth-card');
  const signupCard = $('signup-card');
  const resetCard = $('reset-card');
  const authView = $('auth-view');
  const appHome = $('app-home');
  const overlay = $('auth-overlay');
  const logoutBtn = $('logoutBtn');
  toggleAdminButton(false);
  toggleMemberNotesButton(false);
  setAdminAccess(false);
  closeMemberNotesPanel();
  resetMemberNotesState();
  if (authView) authView.style.display = '';
  if (authCard) authCard.style.display = '';
  if (signupCard) signupCard.style.display = 'none';
  if (resetCard) resetCard.style.display = 'none';
  if (appHome) appHome.style.display = 'none';
  if (overlay) overlay.style.display = 'none';
  if (logoutBtn) logoutBtn.style.display = 'none';
  const msg = $('auth-message');
  if (msg) { msg.textContent = ''; }
}

function showSignup() {
  const authCard = $('auth-card');
  const signupCard = $('signup-card');
  const resetCard = $('reset-card');
  const authView = $('auth-view');
  const appHome = $('app-home');
  const overlay = $('auth-overlay');
  const logoutBtn = $('logoutBtn');
  toggleAdminButton(false);
  toggleMemberNotesButton(false);
  setAdminAccess(false);
  closeMemberNotesPanel();
  resetMemberNotesState();
  stopSliderAutoPlay();
  if (authView) authView.style.display = '';
  if (authCard) authCard.style.display = 'none';
  if (signupCard) signupCard.style.display = '';
  if (resetCard) resetCard.style.display = 'none';
  if (appHome) appHome.style.display = 'none';
  if (overlay) overlay.style.display = 'none';
  if (logoutBtn) logoutBtn.style.display = 'none';
  const msg = $('signup-message');
  if (msg) { msg.textContent = ''; }
}

function showPending(message) {
  const overlay = $('auth-overlay');
  toggleAdminButton(false);
  toggleMemberNotesButton(false);
  setAdminAccess(false);
  closeMemberNotesPanel();
  resetMemberNotesState();
  if (overlay) {
    overlay.style.display = 'flex';
  }
  const msg = $('auth-message');
  if (msg) {
    msg.textContent = message || '承認待ちです。承認され次第、自動で利用可能になります。';
  }
}

function showMain() {
  stopApprovalPolling();
  stopSliderAutoPlay();
  const authCard = $('auth-card');
  const authView = $('auth-view');
  const appHome = $('app-home');
  const overlay = $('auth-overlay');
  const logoutBtn = $('logoutBtn');
  if (authView) authView.style.display = 'none';
  if (authCard) authCard.style.display = 'none';
  if (overlay) overlay.style.display = 'none';
  if (appHome) appHome.style.display = '';
  if (logoutBtn) logoutBtn.style.display = '';
  toggleAdminButton(true);
  const adminUser = isCurrentUserAdmin();
  toggleMemberNotesButton(adminUser);
  if (adminUser) {
    refreshMemberNotesFromSupabase({ silent: true });
  } else {
    resetMemberNotesState();
  }
  updateAdminPanelVisibility();
  bootstrapProtectedApp();
  if (supabase) {
    refreshMembersFromSupabase({ silent: true });
    refreshAnnouncementsFromSupabase({ silent: true });
  }
  if (supabaseMonitor.initialized) {
    refreshSupabaseMonitor({ includeStorage: supabaseMonitor.storageVisible, silent: true });
  }
}

function startApprovalPolling(userId) {
  if (!supabase || !userId) return;
  stopApprovalPolling();

  try {
    approvalRealtimeChannel = supabase
      .channel(`profiles-approval-${userId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'profiles',
        filter: `id=eq.${userId}`
      }, (payload) => {
        if (payload?.new?.approved) {
          stopApprovalPolling();
          showMain();
        }
      });
    approvalRealtimeChannel.subscribe((status) => {
      if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
        console.warn('承認リアルタイム監視で問題が発生しました。ポーリングにフォールバックします。');
      }
    });
  } catch (err) {
    console.warn('承認リアルタイム監視の初期化に失敗しました:', err);
  }

  approvalPollTimer = setInterval(async () => {
    try {
      const { data: p, error } = await supabase
        .from('profiles')
        .select('approved')
        .eq('id', userId)
        .maybeSingle();
      if (error) {
        console.warn('承認状態取得に失敗しました:', error.message || error);
        return;
      }
      if (p && p.approved) {
        stopApprovalPolling();
        showMain();
      }
    } catch (pollErr) {
      console.warn('承認状態ポーリング中にエラーが発生しました:', pollErr);
    }
  }, 3000);
}

async function updateAuthUI(session) {
  currentSession = session || null;
  if (!supabase) {
    currentUserProfile = null;
    showLogin();
    return;
  }
  if (!session) {
    currentUserProfile = null;
    showLogin();
    return;
  }
  try {
    const sessionEmail = session?.user?.email || '';
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('approved, is_admin')
      .eq('id', session.user.id)
      .maybeSingle();
    if (error) {
      currentUserProfile = null;
      showPending('承認状態の確認に失敗しました。しばらくしてから再度お試しください。');
      return;
    }
    const approved = Boolean(profile?.approved);
    const isAdminProfile = Boolean(profile?.is_admin);
    currentUserProfile = {
      id: session.user.id,
      email: sessionEmail,
      approved,
      isAdmin: isAdminProfile
    };
    if (!profile || !approved) {
      if (isAdminProfile) {
        showMain();
        return;
      }
      showPending('承認待ちです。承認され次第、自動で利用可能になります。');
      startApprovalPolling(session.user.id);
      return;
    }
    showMain();
  } catch (e) {
    currentUserProfile = null;
    showPending('エラーが発生しました。再度お試しください。');
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  // ログインフォーム
  const loginForm = $('login-form');
  const loginBtn = $('loginBtn');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = $('email')?.value?.trim();
      const password = $('password')?.value;
      const msg = $('auth-message');
      try {
        if (!supabase) {
          if (msg) { msg.textContent = '現在ログイン機能を利用できません。しばらくしてから再度お試しください。'; }
          return;
        }
        if (!email || !password) {
          if (msg) { msg.textContent = 'メールアドレスとパスワードを入力してください。'; }
          return;
        }
        if (loginBtn) {
          loginBtn.disabled = true;
          loginBtn.textContent = 'ログイン中...';
        }
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          if (msg) {
            const lower = (error.message || '').toLowerCase();
            if (lower.includes('invalid login credentials')) {
              msg.textContent = 'メールアドレスまたはパスワードが正しくありません。初めての方は「新規登録へ」を押してください。パスワードを忘れた場合は「パスワード再設定」をご利用ください。';
            } else if (lower.includes('email not confirmed')) {
              msg.textContent = 'メール認証が未完了です。受信メールの認証リンクを開いてから再度お試しください。';
            } else {
              msg.textContent = `ログインに失敗しました: ${error.message}`;
            }
          }
          return;
        }
        if (msg) { msg.textContent = 'ログインしました。承認状態を確認しています...'; }
        // Vercel など一部ホスト環境で onAuthStateChange が遅延することがあり、
        // その場合に備えてここで即座にUI更新を試みる
        try {
          const session = data?.session
            || (await supabase.auth.getSession())?.data?.session
            || null;
          if (session) {
            await updateAuthUI(session);
          }
        } catch (_) {
          // noop: onAuthStateChange 側の処理に任せる
        }
        // onAuthStateChange でもUI更新が走るため二重適用されても問題なし
      } catch (err) {
        if (msg) { msg.textContent = 'ログイン処理でエラーが発生しました。'; }
      } finally {
        if (loginBtn) {
          loginBtn.disabled = false;
          loginBtn.textContent = 'ログイン';
        }
      }
    });
  }

  // 新規登録フォーム・切替
  const showSignupBtn = $('show-signup');
  const backLoginBtn = $('back-login');
  if (showSignupBtn) {
    showSignupBtn.addEventListener('click', () => showSignup());
  }
  if (backLoginBtn) {
    backLoginBtn.addEventListener('click', () => showLogin());
  }
  const signupForm = $('signup-form');
  const signupBtn = $('signupBtn');
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = $('signup-email')?.value?.trim();
      const password = $('signup-password')?.value;
      const msg = $('signup-message');
      try {
        if (!email || !password) {
          if (msg) msg.textContent = 'メールアドレスとパスワードを入力してください。';
          return;
        }
        // supabase が未初期化の場合は処理を中断（CDNの読込失敗やオフライン時の保護）
        if (!supabase) {
          if (msg) msg.textContent = '現在新規登録機能を利用できません。しばらくしてから再度お試しください。';
          return;
        }
        if (signupBtn) {
          signupBtn.disabled = true;
          signupBtn.textContent = '登録中...';
        }
        // メール認証後の戻り先を team-manager/index.html に固定
        const redirectTo = `${window.location.origin}${window.location.pathname}`;
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: redirectTo }
        });
        if (error) {
          if (msg) msg.textContent = `登録に失敗しました: ${error.message}`;
          return;
        }
        if (data?.user?.id) {
          // トリガー待機
          await new Promise(r => setTimeout(r, 1500));
          // profiles 存在確認
          const { data: profileData } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', data.user.id)
            .maybeSingle();
          if (!profileData) {
            const { error: insErr } = await supabase
              .from('profiles')
              .insert({ id: data.user.id, email, approved: false });
            if (insErr && insErr.code !== '23505' && !(insErr.message || '').includes('duplicate')) {
              console.warn('profiles 挿入エラー:', insErr);
            }
          }
        }
        if (msg) {
          msg.textContent = '登録が完了しました。必要に応じてメール認証後、ログインしてください。';
        }
        showLogin();
        $('email')?.focus();
      } catch (_) {
        if (msg) msg.textContent = '登録処理でエラーが発生しました。';
      } finally {
        if (signupBtn) {
          signupBtn.disabled = false;
          signupBtn.textContent = '新規登録';
        }
      }
    });
  }

  // ログアウト
  const logoutBtn = $('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      try {
        if (supabase) {
          await supabase.auth.signOut();
        }
        showLogin();
      } catch (_) {
        // noop
      }
    });
  }

  // パスワード再設定（メール送信）
  const resetBtn = $('reset-password');
  if (resetBtn) {
    resetBtn.addEventListener('click', async () => {
      const email = $('email')?.value?.trim();
      const msg = $('auth-message');
      try {
        if (!supabase) {
          if (msg) msg.textContent = '現在パスワード再設定を利用できません。しばらくしてから再度お試しください。';
          return;
        }
        if (!email) {
          if (msg) msg.textContent = '再設定するメールアドレスを上の入力欄に入力してください。';
          $('email')?.focus();
          return;
        }
        const redirectTo = `${window.location.origin}${window.location.pathname}`;
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
        if (error) {
          if (msg) msg.textContent = `再設定メールの送信に失敗しました: ${error.message}`;
          return;
        }
        if (msg) msg.textContent = 'パスワード再設定メールを送信しました。メールをご確認ください。';
      } catch (_) {
        const msg2 = $('auth-message');
        if (msg2) msg2.textContent = '再設定メール送信でエラーが発生しました。';
      }
    });
  }

  // 再設定フォーム送信処理
  const resetForm = $('reset-form');
  const resetSubmit = $('resetSubmit');
  const resetCancel = $('reset-cancel');
  if (resetForm) {
    resetForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const newPassword = $('new-password')?.value || '';
      const confirm = $('confirm-password')?.value || '';
      const msg = $('reset-message');
      try {
        if (!supabase) {
          if (msg) msg.textContent = '現在パスワード更新を利用できません。しばらくしてから再度お試しください。';
          return;
        }
        // オフライン即判定
        if (typeof navigator !== 'undefined' && navigator && navigator.onLine === false) {
          if (msg) msg.textContent = '現在オフラインです。ネットワーク接続を確認してから再度お試しください。';
          return;
        }
        // 現在のセッションが無いと updateUser は完了しないため事前確認
        let { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          // URLハッシュからトークンを復旧（ブラウザや拡張の影響でdetectSessionInUrlが失敗する場合の保険）
          const tokens = extractTokensFromHash();
          if (tokens) {
            try {
              const { data: setRes, error: setErr } = await supabase.auth.setSession(tokens);
              if (setErr) {
                if (msg) msg.textContent = 'セッションの復旧に失敗しました。再度メールのリンクを開いてお試しください。';
                return;
              }
              session = setRes?.session || null;
            } catch (_) {
              // noop
            }
          }
        }
        if (!session) {
          if (msg) msg.textContent = 'リカバリーセッションを確認できません。もう一度メールのリンクを開くか、このページを再読み込みしてからお試しください。';
          return;
        }
        if (newPassword.length < 8) {
          if (msg) msg.textContent = 'パスワードは8文字以上を推奨します。';
          return;
        }
        if (newPassword !== confirm) {
          if (msg) msg.textContent = '確認用パスワードが一致しません。';
          return;
        }
        if (resetSubmit) {
          resetSubmit.disabled = true;
          resetSubmit.textContent = '更新中...';
        }
        // 30秒のタイムアウト保護
        const withTimeout = (p, ms = 30000) => Promise.race([
          p,
          new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms))
        ]);
        const { error: updErr } = await withTimeout(supabase.auth.updateUser({ password: newPassword }));
        if (updErr) {
          if (msg) msg.textContent = translatePasswordUpdateError(updErr.message);
          return;
        }
        if (msg) msg.textContent = 'パスワードを更新しました。再度ログインしてください。';
        await supabase.auth.signOut();
        recoveryRequested = false;
        showLogin();
        $('email')?.focus();
      } catch (err) {
        const msg2 = $('reset-message');
        if (msg2) msg2.textContent = err?.message === 'timeout'
          ? '更新がタイムアウトしました。ネットワーク状況を確認の上、もう一度お試しください。'
          : 'パスワード更新でエラーが発生しました。';
      } finally {
        if (resetSubmit) {
          resetSubmit.disabled = false;
          resetSubmit.textContent = 'パスワードを設定';
        }
      }
    });
  }
  if (resetCancel) {
    resetCancel.addEventListener('click', async () => {
      try {
        if (supabase) await supabase.auth.signOut();
      } finally {
        recoveryRequested = false;
        showLogin();
      }
    });
  }

  // Supabaseの初期化完了を待ってからセッション確認
  await supabaseReadyPromise;
  if (supabase) {
    const { data: { session } } = await supabase.auth.getSession();
    if (recoveryRequested && session) {
      showReset();
    } else {
      await updateAuthUI(session);
    }
  } else {
    showLogin();
  }

  // 認証状態の監視
  if (supabase) {
    supabase.auth.onAuthStateChange(async (eventName, newSession) => {
      // リンクから戻った時の確実な分岐
      if (eventName === 'PASSWORD_RECOVERY' || (eventName === 'SIGNED_IN' && recoveryRequested)) {
        showReset();
        return;
      }
      await updateAuthUI(newSession);
    });
  }
});


