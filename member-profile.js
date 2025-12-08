import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabase-config.js';
import { getDefaultMembers } from './member-data.js';

const STORAGE_KEY = 'team-manager.app-state';
const FALLBACK_PHOTO = 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80';
const MEMBERS_TABLE = 'members';
let supabaseClient = null;

if (window.supabase?.createClient && SUPABASE_URL && SUPABASE_ANON_KEY) {
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  });
}

function normalizeMember(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const parsedAge = Number(raw.age);
  return {
    id: raw.id || '',
    name: raw.name || '氏名未設定',
    role: raw.role || '',
    team: raw.team || '',
    contact: raw.contact || '',
    age: Number.isFinite(parsedAge) ? parsedAge : null,
    affiliation: raw.affiliation || raw.team || '',
    motivation: raw.motivation || '',
    photo: raw.photo || '',
    photoAlt: raw.photoAlt || raw.photo_alt || `${raw.name || 'メンバー'}の写真`
  };
}

function getNormalizedMembers(rawList) {
  if (!Array.isArray(rawList)) return [];
  return rawList.map(normalizeMember).filter(Boolean);
}

function loadMembersFromCache() {
  try {
    const stored = window.localStorage?.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      const members = getNormalizedMembers(parsed?.members);
      if (members.length) {
        return members;
      }
    }
  } catch (err) {
    console.warn('ローカルキャッシュからのメンバー取得に失敗しました。', err);
  }
  return [];
}

function cacheMembersLocally(members) {
  if (!Array.isArray(members)) return;
  try {
    const stored = window.localStorage?.getItem(STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : {};
    parsed.members = members;
    window.localStorage?.setItem(STORAGE_KEY, JSON.stringify(parsed));
  } catch (err) {
    console.warn('メンバーデータのローカルキャッシュ保存に失敗しました。', err);
  }
}

async function loadMembers() {
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from(MEMBERS_TABLE)
        .select('id, name, role, team, contact, age, affiliation, motivation, photo, photo_alt, created_at')
        .order('created_at', { ascending: true });
      if (error) {
        throw error;
      }
      const normalized = getNormalizedMembers(data);
      if (normalized.length) {
        cacheMembersLocally(normalized);
        return normalized;
      }
    } catch (err) {
      console.warn('Supabaseからメンバーを取得できませんでした。', err);
    }
  }
  const cached = loadMembersFromCache();
  if (cached.length) {
    return cached;
  }
  return getNormalizedMembers(getDefaultMembers());
}

function resolvePhoto(member) {
  return member?.photo || FALLBACK_PHOTO;
}

function formatAge(age) {
  if (Number.isFinite(age)) {
    return `${age}歳`;
  }
  return '年齢未登録';
}

function renderDetail(member) {
  const detailEl = document.getElementById('profile-detail');
  const headingEl = document.getElementById('profile-heading');
  if (!detailEl || !member) {
    if (detailEl) {
      detailEl.hidden = true;
      detailEl.innerHTML = '';
    }
    return;
  }
  if (headingEl) {
    headingEl.textContent = `${member.name}のプロフィール`;
  }
  detailEl.innerHTML = `
    <img src="${resolvePhoto(member)}" alt="${member.photoAlt || `${member.name}の写真`}" loading="lazy">
    <div>
      <h3 style="margin:0 0 8px">${member.name}</h3>
      <p class="muted" style="margin:0 0 12px;">${member.role || '役割未登録'} / ${member.team || '班未登録'}</p>
      <p style="margin:0 0 12px;">${member.motivation || '意気込みは現在準備中です。'}</p>
    </div>
    <div class="hero-meta">
      <div class="hero-pill">
        <strong>Age</strong>
        <span>${formatAge(member.age)}</span>
      </div>
      <div class="hero-pill">
        <strong>Affiliation</strong>
        <span>${member.affiliation || member.team || '所属未登録'}</span>
      </div>
      <div class="hero-pill">
        <strong>Contact</strong>
        <span>${member.contact || '非公開'}</span>
      </div>
    </div>
  `;
  detailEl.hidden = false;
}

function renderList(members, activeId = '') {
  const listEl = document.getElementById('profile-list');
  if (!listEl) return;
  if (!members.length) {
    listEl.innerHTML = '<p class="muted">現在表示できるメンバーがいません。</p>';
    return;
  }
  listEl.innerHTML = members.map((member) => {
    const link = member.id ? `./member-profile.html?id=${encodeURIComponent(member.id)}` : '#';
    const isActive = member.id === activeId;
    const tagStart = member.id ? `<a class="profile-card${isActive ? ' active' : ''}" href="${link}"${isActive ? ' aria-current="page"' : ''}>`
      : `<div class="profile-card${isActive ? ' active' : ''}">`;
    const tagEnd = member.id ? '</a>' : '</div>';
    return `
      ${tagStart}
        <img src="${resolvePhoto(member)}" alt="${member.photoAlt || `${member.name}の写真`}" loading="lazy">
        <div class="profile-meta">
          <span class="name">${member.name}</span>
          <span class="role">${member.role || '役割未登録'}</span>
          <span class="affiliation">${member.affiliation || member.team || '所属未登録'}</span>
        </div>
        <p class="motto">${member.motivation || '意気込みは現在準備中です。'}</p>
      ${tagEnd}
    `;
  }).join('');
}

function showLoadingMessage() {
  const listEl = document.getElementById('profile-list');
  if (listEl) {
    listEl.innerHTML = '<p class="muted">メンバー情報を読み込み中です...</p>';
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  showLoadingMessage();
  const members = await loadMembers();
  const params = new URLSearchParams(window.location.search);
  const memberId = params.get('id');
  const target = memberId ? members.find((member) => member.id === memberId) : null;
  if (target) {
    renderDetail(target);
    renderList(members, target.id);
  } else {
    renderDetail(null);
    renderList(members);
  }
});


