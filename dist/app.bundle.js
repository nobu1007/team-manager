(() => {
  // supabase-config.js
  var SUPABASE_URL = "https://hnyypwbkpqqudilypjvg.supabase.co";
  var SUPABASE_ANON_KEY = "sb_publishable_CmxTssKUX0noaayRQSTGRg_TzetlAQR";

  // member-data.js
  var DEFAULT_MEMBER_PROFILES = [
    {
      id: "mem-1",
      name: "\u4F50\u85E4\u5927\u548C",
      role: "\u73ED\u9577",
      team: "\u7B2C1\u73ED",
      contact: "Teams / \u5185\u7DDA1234",
      age: 34,
      affiliation: "\u76F8\u6A21\u539F\u5E02\u6D88\u9632\u5C40 \u7B2C1\u73ED",
      motivation: "\u4EF2\u9593\u5168\u54E1\u3092\u5B89\u5168\u306B\u5BB6\u3078\u5E30\u3059\u3053\u3068\u304C\u4FE1\u6761\u3067\u3059\u3002\u51B7\u9759\u306A\u5224\u65AD\u3068\u5FB9\u5E95\u3057\u305F\u6E96\u5099\u3067\u73ED\u3092\u5F15\u3063\u5F35\u308A\u307E\u3059\u3002",
      photo: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80",
      photoAlt: "\u73FE\u5834\u3067\u88C5\u5099\u3092\u6574\u3048\u308B\u6D88\u9632\u968A\u54E1"
    },
    {
      id: "mem-2",
      name: "\u9234\u6728\u967D\u83DC",
      role: "\u30E1\u30C7\u30A3\u30C3\u30AF",
      team: "\u7B2C2\u73ED",
      contact: "\u643A\u5E2F 090-xxxx-001",
      age: 29,
      affiliation: "\u76F8\u6A21\u539F\u5E02\u6D88\u9632\u5C40 \u533B\u7642\u652F\u63F4\u73ED",
      motivation: "\u6700\u5F8C\u306E1\u79D2\u307E\u3067\u8AE6\u3081\u306A\u3044\u6551\u547D\u51E6\u7F6E\u3092\u5FC3\u639B\u3051\u3066\u3044\u307E\u3059\u3002\u53D7\u8B1B\u751F\u306E\u4F53\u8ABF\u7BA1\u7406\u3082\u4EFB\u305B\u3066\u304F\u3060\u3055\u3044\u3002",
      photo: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80",
      photoAlt: "\u6551\u6025\u533B\u7642\u306E\u6E96\u5099\u3092\u3059\u308B\u968A\u54E1"
    },
    {
      id: "mem-3",
      name: "\u9AD8\u6A4B\u84EE",
      role: "\u30ED\u30FC\u30D7\u62C5\u5F53",
      team: "\u7B2C3\u73ED",
      contact: "Teams",
      age: 31,
      affiliation: "\u76F8\u6A21\u539F\u5E02\u6D88\u9632\u5C40 \u7279\u5225\u6551\u52A9\u968A",
      motivation: "\u3069\u3093\u306A\u9AD8\u6240\u3067\u3082\u6700\u901F\u30FB\u6700\u5B89\u5168\u3067\u30A2\u30AF\u30BB\u30B9\u3067\u304D\u308B\u3088\u3046\u30ED\u30FC\u30D7\u30EC\u30B9\u30AD\u30E5\u30FC\u306E\u6280\u8853\u3092\u78E8\u304D\u7D9A\u3051\u3066\u3044\u307E\u3059\u3002",
      photo: "https://images.unsplash.com/photo-1524504388940-1e723d76f91c?auto=format&fit=crop&w=600&q=80",
      photoAlt: "\u30ED\u30FC\u30D7\u5668\u5177\u3092\u78BA\u8A8D\u3059\u308B\u968A\u54E1"
    },
    {
      id: "mem-4",
      name: "\u4E2D\u6751\u7FFC",
      role: "\u8ECA\u4E21\u6307\u63EE",
      team: "\u652F\u63F4\u968A",
      contact: "\u5185\u7DDA5678",
      age: 33,
      affiliation: "\u76F8\u6A21\u539F\u5E02\u6D88\u9632\u5C40 \u6A5F\u52D5\u652F\u63F4\u968A",
      motivation: "\u8ECA\u4E21\u904B\u7528\u3068\u901A\u4FE1\u306E\u4E21\u9762\u304B\u3089\u53D7\u8B1B\u751F\u3092\u652F\u3048\u3001\u3069\u3093\u306A\u72B6\u6CC1\u3067\u3082\u8A13\u7DF4\u3092\u6B62\u3081\u306A\u3044\u74B0\u5883\u3092\u6574\u3048\u307E\u3059\u3002",
      photo: "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=600&q=80",
      photoAlt: "\u901A\u4FE1\u6A5F\u5668\u3092\u64CD\u4F5C\u3059\u308B\u968A\u54E1"
    }
  ];
  function getDefaultMembers() {
    return DEFAULT_MEMBER_PROFILES.map((member) => ({ ...member }));
  }

  // app.js
  var initialHash = typeof window !== "undefined" ? window.location.hash || "" : "";
  var initialSearch = typeof window !== "undefined" ? window.location.search || "" : "";
  function getTypeParamFromString(s) {
    if (!s) return null;
    const sp = new URLSearchParams(s.replace(/^#/, "?"));
    return sp.get("type");
  }
  var recoveryRequested = getTypeParamFromString(initialHash) === "recovery" || getTypeParamFromString(initialSearch) === "recovery";
  var SUPABASE_CDN_SOURCES = [
    "https://unpkg.com/@supabase/supabase-js@2/dist/umd/supabase.js",
    "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js"
  ];
  var SUPABASE_SCRIPT_ATTR = "data-supabase-autoload";
  var supabase = null;
  var supabaseReadyPromise = initSupabaseClient();
  function initSupabaseClient() {
    if (typeof window === "undefined") {
      return Promise.resolve(null);
    }
    return ensureSupabaseLibrary().then((lib) => {
      if (!(lib == null ? void 0 : lib.createClient)) {
        console.warn("supabase-js \u304C\u6B63\u3057\u304F\u8AAD\u307F\u8FBC\u307E\u308C\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u30ED\u30B0\u30A4\u30F3/\u767B\u9332\u6A5F\u80FD\u306F\u4E00\u6642\u7684\u306B\u4F7F\u7528\u3067\u304D\u307E\u305B\u3093\u3002");
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
    }).catch((err) => {
      console.warn("supabase-js \u306E\u8AAD\u307F\u8FBC\u307F\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002\u30ED\u30B0\u30A4\u30F3/\u767B\u9332\u6A5F\u80FD\u306F\u4E00\u6642\u7684\u306B\u4F7F\u7528\u3067\u304D\u307E\u305B\u3093\u3002", err);
      return null;
    });
  }
  async function ensureSupabaseLibrary() {
    var _a, _b, _c;
    if (typeof window === "undefined") {
      return null;
    }
    if ((_a = window.supabase) == null ? void 0 : _a.createClient) {
      return window.supabase;
    }
    for (const src of SUPABASE_CDN_SOURCES) {
      try {
        await loadScriptOnce(src);
        if ((_b = window.supabase) == null ? void 0 : _b.createClient) {
          return window.supabase;
        }
      } catch (err) {
        console.warn(`supabase-js \u306E\u8AAD\u307F\u8FBC\u307F\u306B\u5931\u6557\u3057\u307E\u3057\u305F (${src})`, err);
      }
    }
    return ((_c = window.supabase) == null ? void 0 : _c.createClient) ? window.supabase : null;
  }
  function loadScriptOnce(src) {
    return new Promise((resolve, reject) => {
      var _a;
      if (typeof document === "undefined") {
        reject(new Error("document is not available"));
        return;
      }
      const selector = `script[${SUPABASE_SCRIPT_ATTR}="${src}"]`;
      const existing = document.querySelector(selector);
      if (existing) {
        if ((_a = window.supabase) == null ? void 0 : _a.createClient) {
          resolve();
          return;
        }
        existing.addEventListener("load", () => resolve(), { once: true });
        existing.addEventListener("error", () => reject(new Error(`supabase-js \u306E\u8AAD\u307F\u8FBC\u307F\u306B\u5931\u6557\u3057\u307E\u3057\u305F (${src})`)), { once: true });
        return;
      }
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.defer = true;
      script.crossOrigin = "anonymous";
      script.setAttribute(SUPABASE_SCRIPT_ATTR, src);
      script.addEventListener("load", () => resolve(), { once: true });
      script.addEventListener("error", () => reject(new Error(`supabase-js \u306E\u8AAD\u307F\u8FBC\u307F\u306B\u5931\u6557\u3057\u307E\u3057\u305F (${src})`)), { once: true });
      const parent = document.head || document.body || document.documentElement;
      if (!parent) {
        reject(new Error("script parent is not available"));
        return;
      }
      parent.appendChild(script);
    });
  }
  var approvalPollTimer = null;
  var approvalRealtimeChannel = null;
  var storage = (() => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        return window.localStorage;
      }
    } catch (_) {
    }
    return null;
  })();
  var STORAGE_KEY = "team-manager.app-state";
  var DEFAULT_APP_DATA = Object.freeze({
    announcements: [
      {
        id: "ann-1",
        tag: "\u5171\u6709",
        title: "\u5C4B\u5185\u6D88\u706B\u6F14\u7FD2\u306F13:00\u958B\u59CB\u4E88\u5B9A",
        body: "\u5348\u524D\u306E\u8B1B\u7FA9\u7D42\u4E86\u5F8C\u3001\u7B2C1\u8A13\u7DF4\u68DF\u3078\u79FB\u52D5\u3057\u3066\u304F\u3060\u3055\u3044\u3002\u88C5\u5099\u30C1\u30A7\u30C3\u30AF\u306F12:30\u307E\u3067\u306B\u5B8C\u4E86\u3055\u305B\u307E\u3059\u3002",
        layout: "mixed",
        mediaUrl: "https://images.unsplash.com/photo-1508873699372-7aeab60b44c7?auto=format&fit=crop&w=1200&q=80",
        mediaAlt: "\u6D88\u706B\u8A13\u7DF4\u306E\u69D8\u5B50"
      },
      {
        id: "ann-2",
        tag: "\u6CE8\u610F",
        title: "\u96E8\u5929\u306B\u4F34\u3046\u5C4B\u5916\u8A13\u7DF4\u306E\u7E2E\u5C0F",
        body: "\u672C\u65E5\u306E\u5C4B\u5916\u60F3\u5B9A\u306F\u5B89\u5168\u7BA1\u7406\u306E\u305F\u3081\u6642\u9593\u3092\u77ED\u7E2E\u3057\u307E\u3059\u3002\u8A73\u7D30\u306F\u696D\u52D9\u9023\u7D61\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
        layout: "image",
        mediaUrl: "https://images.unsplash.com/photo-1509223197845-458d87318791?auto=format&fit=crop&w=1200&q=80",
        mediaAlt: "\u96E8\u5929\u6642\u306E\u8A13\u7DF4\u5834"
      },
      {
        id: "ann-3",
        tag: "\u8B66\u6212",
        title: "\u71B1\u4E2D\u75C7\u5BFE\u7B56\u306E\u5F37\u5316",
        body: "\u6C34\u5206\u88DC\u7D66\u9593\u9694\u309230\u5206\u3054\u3068\u306B\u8A2D\u5B9A\u3057\u3001\u4F53\u8ABF\u4E0D\u826F\u304C\u3042\u308C\u3070\u901F\u3084\u304B\u306B\u52A9\u6559\u3078\u5831\u544A\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
        layout: "text"
      }
    ],
    notices: [
      {
        id: "notice-1",
        title: "\u30ED\u30FC\u30D7\u30EF\u30FC\u30AF\u8A55\u4FA1\u306E\u63D0\u51FA",
        detail: "\u5404\u73ED\u30EA\u30FC\u30C0\u30FC\u306F\u8B1B\u8A55\u30E1\u30E2\u3092Teams\u306B\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
        target: "\u5168\u73ED",
        deadline: "10/07 17:00"
      },
      {
        id: "notice-2",
        title: "\u8CC7\u6A5F\u6750\u70B9\u691C\u306E\u7ACB\u3061\u4F1A\u3044",
        detail: "\u7B2C2\u73ED\u306F\u5348\u5F8C\u306E\u4E88\u5B9A\u524D\u306B\u88C5\u5099\u5EAB\u306E\u70B9\u691C\u78BA\u8A8D\u3092\u884C\u3044\u307E\u3059\u3002",
        target: "\u7B2C2\u73ED",
        deadline: "10/08 12:30"
      }
    ],
    schedule: [
      { id: "sch-1", date: "10/07(\u6708)", time: "08:30-12:00", title: "\u30ED\u30FC\u30D7\u30EC\u30B9\u30AD\u30E5\u30FC\u57FA\u790E", owner: "\u7B2C1\u73ED / \u4F50\u85E4\u52A9\u6559" },
      { id: "sch-2", date: "10/08(\u706B)", time: "13:00-17:00", title: "\u5EFA\u7269\u4FB5\u5165\u691C\u7D22", owner: "\u7B2C2\u73ED / \u9234\u6728\u52A9\u6559" },
      { id: "sch-3", date: "10/09(\u6C34)", time: "09:00-11:30", title: "\u50B7\u75C5\u8005\u642C\u9001\u30B7\u30DF\u30E5\u30EC\u30FC\u30B7\u30E7\u30F3", owner: "\u7B2C3\u73ED / \u9AD8\u6A4B\u52A9\u6559" },
      { id: "sch-4", date: "10/10(\u6728)", time: "14:00-17:00", title: "\u7DCF\u5408\u8A13\u7DF4\u30EA\u30CF\u30FC\u30B5\u30EB", owner: "\u5168\u73ED / \u6307\u5C0E\u90E8" }
    ],
    members: getDefaultMembers(),
    resources: [
      { id: "res-1", title: "\u6551\u52A9\u8CC7\u6A5F\u6750\u30C1\u30A7\u30C3\u30AF\u30EA\u30B9\u30C8", meta: "PDF / \u6700\u7D42\u66F4\u65B0 2025-08-15", link: "#" },
      { id: "res-2", title: "\u707D\u5BB3\u5BFE\u5FDC\u30DE\u30CB\u30E5\u30A2\u30EB\u629C\u7C8B", meta: "SharePoint / \u8A13\u7DF4\u7528\u30C0\u30A4\u30B8\u30A7\u30B9\u30C8", link: "#" },
      { id: "res-3", title: "\u30ED\u30FC\u30D7\u30EF\u30FC\u30AF\u52D5\u753B\u6559\u6750", meta: "\u52D5\u753B / 15\u5206", link: "#" }
    ],
    qaLog: [
      {
        id: "qa-1",
        name: "\u7B2C2\u73ED \u9234\u6728",
        topic: "equipment",
        question: "\u65B0\u3057\u3044\u30AB\u30E9\u30D3\u30CA\u306E\u914D\u5E03\u306F\u3044\u3064\u306B\u306A\u308A\u307E\u3059\u304B\uFF1F",
        createdAt: "2025-10-05T08:30:00+09:00"
      }
    ]
  });
  var TOPIC_LABELS = {
    schedule: "\u4E88\u5B9A\u30FB\u96C6\u5408",
    equipment: "\u8CC7\u6A5F\u6750",
    procedure: "\u6551\u52A9\u8981\u9818",
    safety: "\u5B89\u5168\u7BA1\u7406",
    other: "\u305D\u306E\u4ED6"
  };
  var SLIDE_LAYOUT_OPTIONS = ["text", "mixed", "image"];
  var SLIDE_LAYOUT_LABELS = {
    text: "\u30C6\u30AD\u30B9\u30C8",
    mixed: "\u5199\u771F + \u30C6\u30AD\u30B9\u30C8",
    image: "\u5199\u771F\u306E\u307F"
  };
  var ADMIN_ACCESS_CODE = "RESCUE2025";
  var appData = null;
  var appBootstrapped = false;
  var sliderSlides = [];
  var sliderIndex = 0;
  var sliderTimer = null;
  var toastTimer = null;
  var sliderStatusTimer = null;
  var adminUnlocked = false;
  var MEMBERS_TABLE = "members";
  var ANNOUNCEMENTS_TABLE = "announcements";
  var MEMBER_NOTES_TABLE = "member_insights";
  var MEMBER_PHOTO_BUCKET = "member-photos";
  var SLIDER_MEDIA_BUCKET = "slider-media";
  var SUPABASE_BUCKET_IDS = [MEMBER_PHOTO_BUCKET, SLIDER_MEDIA_BUCKET];
  var membersSyncInFlight = null;
  var announcementsSyncInFlight = null;
  var memberNotesSyncInFlight = null;
  var editingMemberId = null;
  var currentSession = null;
  var currentUserProfile = null;
  var supabaseMonitor = {
    initialized: false,
    storageVisible: false,
    storageDirty: true,
    elements: {},
    state: {
      status: "pending",
      message: "Supabase\u306E\u521D\u671F\u5316\u3092\u5F85\u6A5F\u3057\u3066\u3044\u307E\u3059...",
      memberCount: null,
      storageTotal: null,
      storageSummary: [],
      lastSyncedAt: null,
      lastError: null
    }
  };
  var memberNotesState = {
    entries: {},
    selectedMemberId: "",
    lastSyncedAt: null
  };
  function getSupabaseProjectDisplayUrl() {
    if (!SUPABASE_URL) return "\u672A\u8A2D\u5B9A";
    if (typeof URL === "function") {
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
    const statusEl = $("supabase-connection-status");
    if (!statusEl) return;
    supabaseMonitor.elements = {
      status: statusEl,
      memberCount: $("supabase-member-count"),
      storageCount: $("supabase-storage-count"),
      lastSync: $("supabase-last-sync"),
      refreshBtn: $("supabase-refresh-btn"),
      storageBtn: $("supabase-storage-refresh-btn"),
      projectUrl: $("supabase-project-url"),
      storageSection: $("supabase-storage-section"),
      storageList: $("supabase-storage-list"),
      storageEmpty: $("supabase-storage-empty")
    };
    if (supabaseMonitor.elements.projectUrl) {
      supabaseMonitor.elements.projectUrl.textContent = getSupabaseProjectDisplayUrl();
    }
    if (supabaseMonitor.elements.refreshBtn) {
      supabaseMonitor.elements.refreshBtn.addEventListener("click", () => {
        const includeStorage = supabaseMonitor.storageVisible;
        refreshSupabaseMonitor({ includeStorage });
      });
    }
    if (supabaseMonitor.elements.storageBtn) {
      supabaseMonitor.elements.storageBtn.addEventListener("click", async () => {
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
      elements.memberCount.textContent = Number.isFinite(state.memberCount) ? `${state.memberCount}\u4EF6` : state.status === "local" && Array.isArray(appData == null ? void 0 : appData.members) ? `${appData.members.length}\u4EF6` : "\u2015";
    }
    if (elements.storageCount) {
      elements.storageCount.textContent = Number.isFinite(state.storageTotal) ? `${state.storageTotal}\u4EF6` : "\u2015";
    }
    if (elements.lastSync) {
      if (state.lastSyncedAt) {
        elements.lastSync.textContent = formatSupabaseMonitorDate(state.lastSyncedAt);
      } else if (state.status === "local") {
        elements.lastSync.textContent = "\u30ED\u30FC\u30AB\u30EB\u4FDD\u5B58\u4E2D";
      } else {
        elements.lastSync.textContent = "\u672A\u540C\u671F";
      }
    }
    if (elements.storageBtn) {
      elements.storageBtn.textContent = supabaseMonitor.storageVisible ? "Storage\u3092\u96A0\u3059" : "Storage\u3092\u8868\u793A";
    }
    if (elements.storageSection) {
      elements.storageSection.style.display = supabaseMonitor.storageVisible ? "block" : "none";
    }
    renderSupabaseStorageList();
  }
  function renderSupabaseStorageList() {
    if (!supabaseMonitor.initialized) return;
    const { storageList, storageEmpty } = supabaseMonitor.elements;
    if (!storageList) return;
    storageList.innerHTML = "";
    const summary = supabaseMonitor.state.storageSummary;
    if (!Array.isArray(summary) || summary.length === 0) {
      if (storageEmpty) {
        storageEmpty.style.display = "";
      }
      return;
    }
    if (storageEmpty) {
      storageEmpty.style.display = "none";
    }
    summary.forEach((bucketInfo) => {
      var _a;
      const item = document.createElement("li");
      item.className = "supabase-storage-item";
      const head = document.createElement("div");
      head.className = "supabase-storage-item-head";
      const labelEl = document.createElement("span");
      labelEl.textContent = bucketInfo.bucket;
      const countEl = document.createElement("span");
      countEl.className = "supabase-storage-meta";
      countEl.textContent = Number.isFinite(bucketInfo.total) ? `${bucketInfo.total}\u4EF6` : "\u2015";
      head.appendChild(labelEl);
      head.appendChild(countEl);
      item.appendChild(head);
      if (bucketInfo.error) {
        const errorMsg = document.createElement("p");
        errorMsg.className = "supabase-storage-error";
        errorMsg.textContent = bucketInfo.error;
        item.appendChild(errorMsg);
      } else if ((_a = bucketInfo.files) == null ? void 0 : _a.length) {
        const filesList = document.createElement("ul");
        filesList.className = "supabase-storage-files";
        bucketInfo.files.forEach((file) => {
          const row = document.createElement("li");
          row.className = "supabase-storage-file";
          const nameEl = document.createElement("code");
          nameEl.textContent = file.name;
          const metaEl = document.createElement("span");
          metaEl.className = "supabase-storage-meta";
          const parts = [];
          if (file.updatedAt) {
            parts.push(formatSupabaseMonitorDate(file.updatedAt));
          }
          if (Number.isFinite(file.size)) {
            parts.push(formatSupabaseFileSize(file.size));
          }
          metaEl.textContent = parts.join(" / ") || "\u2015";
          row.appendChild(nameEl);
          row.appendChild(metaEl);
          filesList.appendChild(row);
        });
        item.appendChild(filesList);
      } else {
        const emptyRow = document.createElement("p");
        emptyRow.className = "supabase-storage-meta";
        emptyRow.textContent = "\u30D5\u30A1\u30A4\u30EB\u306F\u307E\u3060\u3042\u308A\u307E\u305B\u3093\u3002";
        item.appendChild(emptyRow);
      }
      storageList.appendChild(item);
    });
  }
  function formatSupabaseMonitorDate(input) {
    if (!input) return "";
    const date = input instanceof Date ? input : new Date(input);
    if (Number.isNaN(date.getTime())) return "";
    try {
      if (typeof Intl !== "undefined" && Intl.DateTimeFormat) {
        return new Intl.DateTimeFormat("ja-JP", { dateStyle: "short", timeStyle: "short" }).format(date);
      }
    } catch (_) {
    }
    return date.toLocaleString("ja-JP");
  }
  function formatSupabaseFileSize(bytes) {
    if (!Number.isFinite(bytes)) return "";
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
        showToast("Supabase\u304C\u672A\u8A2D\u5B9A\u306E\u305F\u3081\u30ED\u30FC\u30AB\u30EB\u4FDD\u5B58\u30E2\u30FC\u30C9\u3067\u52D5\u4F5C\u3057\u3066\u3044\u307E\u3059\u3002", "error");
      }
      return;
    }
    supabaseMonitor.state.status = "loading";
    supabaseMonitor.state.message = "Supabase\u3068\u540C\u671F\u4E2D...";
    updateSupabaseMonitorUI();
    try {
      const { count } = await supabase.from(MEMBERS_TABLE).select("id", { head: true, count: "exact" });
      if (typeof count === "number") {
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
      supabaseMonitor.state.status = "connected";
      supabaseMonitor.state.message = "Supabase\u3068\u63A5\u7D9A\u6E08\u307F";
      supabaseMonitor.state.lastError = null;
      supabaseMonitor.state.lastSyncedAt = /* @__PURE__ */ new Date();
      updateSupabaseMonitorUI();
      if (!silent) {
        showToast("Supabase\u306E\u72B6\u614B\u3092\u66F4\u65B0\u3057\u307E\u3057\u305F\u3002", "success");
      }
    } catch (err) {
      supabaseMonitor.state.status = "error";
      supabaseMonitor.state.message = "Supabase\u306E\u540C\u671F\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002";
      supabaseMonitor.state.lastError = (err == null ? void 0 : err.message) || String(err);
      if (includeStorage) {
        supabaseMonitor.state.storageSummary = [];
        supabaseMonitor.state.storageTotal = null;
      }
      updateSupabaseMonitorUI();
      if (!silent) {
        showToast("Supabase\u306E\u72B6\u614B\u53D6\u5F97\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002", "error");
      }
    }
  }
  async function listBucketObjects(bucketId) {
    const summary = { bucket: bucketId, files: [], total: 0, error: null };
    try {
      const { data, error } = await supabase.storage.from(bucketId).list("", {
        limit: 50,
        sortBy: { column: "updated_at", order: "desc" }
      });
      if (error) {
        throw error;
      }
      const files = Array.isArray(data) ? data.filter((entry) => entry && typeof entry.name === "string" && !entry.name.endsWith("/")).map((entry) => {
        var _a, _b, _c, _d, _e, _f, _g;
        const rawSize = (_g = (_e = (_c = (_a = entry == null ? void 0 : entry.metadata) == null ? void 0 : _a.size) != null ? _c : (_b = entry == null ? void 0 : entry.metadata) == null ? void 0 : _b.Size) != null ? _e : (_d = entry == null ? void 0 : entry.metadata) == null ? void 0 : _d.length) != null ? _g : (_f = entry == null ? void 0 : entry.metadata) == null ? void 0 : _f.ContentLength;
        const sizeNumber = typeof rawSize === "number" ? rawSize : Number(rawSize);
        return {
          name: entry.name,
          updatedAt: entry.updated_at ? new Date(entry.updated_at) : entry.created_at ? new Date(entry.created_at) : null,
          size: Number.isFinite(sizeNumber) ? sizeNumber : null
        };
      }) : [];
      summary.total = files.length;
      summary.files = files.slice(0, 10);
    } catch (err) {
      summary.error = (err == null ? void 0 : err.message) || "\u53D6\u5F97\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002";
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
    supabaseMonitor.state.status = "local";
    supabaseMonitor.state.message = "\u73FE\u5728\u306F\u30ED\u30FC\u30AB\u30EB\u4FDD\u5B58\u30E2\u30FC\u30C9\uFF08localStorage\uFF09\u3067\u52D5\u4F5C\u3057\u3066\u3044\u307E\u3059\u3002";
    supabaseMonitor.state.memberCount = Array.isArray(appData == null ? void 0 : appData.members) ? appData.members.length : null;
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
    if (value === null || value === void 0) {
      return "";
    }
    return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function formatMultilineText(value) {
    if (!value)
      return "";
    return escapeHTML(value).replace(/\n/g, "<br>");
  }
  function isCurrentUserAdmin() {
    var _a;
    return Boolean((_a = currentUserProfile == null ? void 0 : currentUserProfile.isAdmin) != null ? _a : false);
  }
  function clearMemberNotesForm() {
    var _a, _b;
    const select = $("memberNotesSelect");
    if (select) {
      select.value = "";
    }
    (_a = $("memberTraitsField")) == null ? void 0 : _a.value = "";
    (_b = $("memberCautionsField")) == null ? void 0 : _b.value = "";
  }
  function isMemberNotesPanelVisible() {
    const panel = $("member-notes-panel");
    return panel ? panel.classList.contains("show") : false;
  }
  function resetMemberNotesState() {
    memberNotesState.entries = {};
    memberNotesState.selectedMemberId = "";
    memberNotesState.lastSyncedAt = null;
    clearMemberNotesForm();
    renderMemberNotesPreview("");
    updateMemberNotesStatus("");
  }
  function stopApprovalPolling() {
    if (approvalPollTimer) {
      clearInterval(approvalPollTimer);
      approvalPollTimer = null;
    }
    if (approvalRealtimeChannel) {
      try {
        if (supabase && typeof supabase.removeChannel === "function") {
          supabase.removeChannel(approvalRealtimeChannel).catch((err) => {
            console.warn("\u627F\u8A8D\u30EA\u30A2\u30EB\u30BF\u30A4\u30E0\u76E3\u8996\u306E\u89E3\u9664\u306B\u5931\u6557\u3057\u307E\u3057\u305F:", err);
          });
        } else if (typeof approvalRealtimeChannel.unsubscribe === "function") {
          approvalRealtimeChannel.unsubscribe();
        }
      } catch (err) {
        console.warn("\u627F\u8A8D\u30EA\u30A2\u30EB\u30BF\u30A4\u30E0\u76E3\u8996\u306E\u89E3\u9664\u51E6\u7406\u3067\u30A8\u30E9\u30FC\u304C\u767A\u751F\u3057\u307E\u3057\u305F:", err);
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
      const raw = storage == null ? void 0 : storage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const defaults = cloneDefaultState();
        return {
          ...defaults,
          ...parsed,
          announcements: Array.isArray(parsed == null ? void 0 : parsed.announcements) ? parsed.announcements : defaults.announcements,
          notices: Array.isArray(parsed == null ? void 0 : parsed.notices) ? parsed.notices : defaults.notices,
          schedule: Array.isArray(parsed == null ? void 0 : parsed.schedule) ? parsed.schedule : defaults.schedule,
          members: Array.isArray(parsed == null ? void 0 : parsed.members) ? parsed.members : defaults.members,
          resources: Array.isArray(parsed == null ? void 0 : parsed.resources) ? parsed.resources : defaults.resources,
          qaLog: Array.isArray(parsed == null ? void 0 : parsed.qaLog) ? parsed.qaLog : defaults.qaLog
        };
      }
    } catch (err) {
      console.warn("\u30A2\u30D7\u30EA\u30C7\u30FC\u30BF\u306E\u8AAD\u307F\u8FBC\u307F\u306B\u5931\u6557\u3057\u307E\u3057\u305F:", err);
    }
    return cloneDefaultState();
  }
  function saveAppData(state) {
    try {
      storage == null ? void 0 : storage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.warn("\u30A2\u30D7\u30EA\u30C7\u30FC\u30BF\u306E\u4FDD\u5B58\u306B\u5931\u6557\u3057\u307E\u3057\u305F:", err);
    }
  }
  function createId(prefix = "id") {
    try {
      if (typeof crypto !== "undefined" && crypto.randomUUID) {
        return `${prefix}-${crypto.randomUUID()}`;
      }
    } catch (_) {
    }
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  }
  function resolveSubmitButton(event, fallbackSelector) {
    if ((event == null ? void 0 : event.submitter) instanceof HTMLButtonElement) {
      return event.submitter;
    }
    const active = document.activeElement;
    if (active instanceof HTMLButtonElement && (event == null ? void 0 : event.target) && active.form === event.target) {
      return active;
    }
    if (fallbackSelector) {
      const fallback = typeof fallbackSelector === "string" ? document.querySelector(fallbackSelector) : fallbackSelector;
      if (fallback instanceof HTMLButtonElement) {
        return fallback;
      }
    }
    if ((event == null ? void 0 : event.target) instanceof HTMLFormElement) {
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
    const lower = (layout || "").toLowerCase();
    let resolved = SLIDE_LAYOUT_OPTIONS.includes(lower) ? lower : hasMedia ? "mixed" : "text";
    if ((resolved === "mixed" || resolved === "image") && !hasMedia) {
      resolved = "text";
    }
    return resolved;
  }
  function getSlideLayout(slide) {
    return normalizeSlideLayout(slide == null ? void 0 : slide.layout, Boolean(slide == null ? void 0 : slide.mediaUrl));
  }
  function normalizeMemberRecord(record) {
    if (!record || typeof record !== "object") return null;
    const parsedAge = typeof record.age === "number" ? record.age : Number(record.age);
    return {
      id: record.id || record.member_id || record.uuid || record.localId || "",
      name: record.name || "\u6C0F\u540D\u672A\u8A2D\u5B9A",
      role: record.role || "",
      team: record.team || "",
      contact: record.contact || "",
      age: Number.isFinite(parsedAge) ? parsedAge : null,
      affiliation: record.affiliation || record.team || "",
      motivation: record.motivation || "",
      photo: record.photo || "",
      photoAlt: record.photoAlt || record.photo_alt || `${record.name || "\u30E1\u30F3\u30D0\u30FC"}\u306E\u30D7\u30ED\u30D5\u30A3\u30FC\u30EB\u5199\u771F`
    };
  }
  function normalizeAnnouncementRecord(record) {
    if (!record || typeof record !== "object") return null;
    const hasMedia = Boolean(record.media_url || record.mediaUrl);
    const layout = normalizeSlideLayout(record.layout, hasMedia);
    return {
      id: record.id || record.announcement_id || record.uuid || createId("ann"),
      tag: record.tag || "\u5171\u6709",
      title: record.title || "",
      body: record.body || "",
      layout,
      mediaUrl: record.media_url || record.mediaUrl || "",
      mediaAlt: record.media_alt || record.mediaAlt || (hasMedia ? record.title || "\u95A2\u9023\u753B\u50CF" : ""),
      createdAt: record.created_at || record.createdAt || (/* @__PURE__ */ new Date()).toISOString()
    };
  }
  async function refreshMembersFromSupabase(options = {}) {
    if (!supabase) return false;
    if (membersSyncInFlight) {
      return membersSyncInFlight;
    }
    membersSyncInFlight = (async () => {
      try {
        const { data, error } = await supabase.from(MEMBERS_TABLE).select("id, name, role, team, contact, age, affiliation, motivation, photo, photo_alt, created_at").order("created_at", { ascending: true });
        if (error) {
          throw error;
        }
        const normalized = Array.isArray(data) ? data.map((row) => normalizeMemberRecord(row)).filter(Boolean) : [];
        ensureArrayState("members");
        appData.members = normalized;
        saveAppData(appData);
        renderMemberTable();
        renderAdminMembers();
        if (supabaseMonitor.initialized) {
          supabaseMonitor.state.memberCount = normalized.length;
          supabaseMonitor.state.status = "connected";
          supabaseMonitor.state.message = "Supabase\u3068\u63A5\u7D9A\u6E08\u307F";
          supabaseMonitor.state.lastSyncedAt = /* @__PURE__ */ new Date();
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
          showToast("\u30E1\u30F3\u30D0\u30FC\u60C5\u5831\u306E\u53D6\u5F97\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002", "error");
        }
        console.warn("Failed to fetch members from Supabase:", err);
        if (supabaseMonitor.initialized) {
          supabaseMonitor.state.status = "error";
          supabaseMonitor.state.message = "\u30E1\u30F3\u30D0\u30FC\u540C\u671F\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002";
          supabaseMonitor.state.lastError = (err == null ? void 0 : err.message) || String(err);
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
    if (!supabase || !isCurrentUserAdmin())
      return false;
    if (memberNotesSyncInFlight) {
      return memberNotesSyncInFlight;
    }
    memberNotesSyncInFlight = (async () => {
      try {
        const { data, error } = await supabase.from(MEMBER_NOTES_TABLE).select("member_id, traits, cautions, updated_at, updated_by_email").order("updated_at", { ascending: false });
        if (error) {
          throw error;
        }
        const nextEntries = {};
        (data || []).forEach((row) => {
          if (!(row != null && row.member_id))
            return;
          nextEntries[row.member_id] = {
            traits: row.traits || "",
            cautions: row.cautions || "",
            updatedAt: row.updated_at || null,
            updatedByEmail: row.updated_by_email || ""
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
        if (!(options != null && options.silent)) {
          showToast("\u30E1\u30F3\u30D0\u30FC\u7279\u6027\u30E1\u30E2\u306E\u53D6\u5F97\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002", "error");
        }
        console.warn("Failed to fetch member notes from Supabase:", err);
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
        const { data, error } = await supabase.from(ANNOUNCEMENTS_TABLE).select("id, tag, title, body, layout, media_url, media_alt, created_at").order("created_at", { ascending: false });
        if (error) {
          throw error;
        }
        const normalized = Array.isArray(data) ? data.map((row) => normalizeAnnouncementRecord(row)).filter(Boolean) : [];
        ensureArrayState("announcements");
        appData.announcements = normalized;
        saveAppData(appData);
        renderAnnouncements();
        renderSliderAdminList();
        startSliderAutoPlay();
        return true;
      } catch (err) {
        if (!options.silent) {
          showToast("\u30B9\u30E9\u30A4\u30C0\u30FC\u60C5\u5831\u306E\u53D6\u5F97\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002", "error");
        }
        console.warn("Failed to fetch announcements from Supabase:", err);
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
    const { data, error } = await supabase.from(MEMBERS_TABLE).insert(payload).select("id, name, role, team, contact, age, affiliation, motivation, photo, photo_alt, created_at").single();
    if (error) throw error;
    return normalizeMemberRecord(data);
  }
  async function insertAnnouncementToSupabase(slide) {
    if (!supabase) return null;
    const payload = {
      tag: slide.tag || "\u5171\u6709",
      title: slide.title || null,
      body: slide.body || null,
      layout: slide.layout || "text",
      media_url: slide.mediaUrl || null,
      media_alt: slide.mediaAlt || null
    };
    const { data, error } = await supabase.from(ANNOUNCEMENTS_TABLE).insert(payload).select("id, tag, title, body, layout, media_url, media_alt, created_at").single();
    if (error) throw error;
    return normalizeAnnouncementRecord(data);
  }
  async function deleteMemberFromSupabase(id) {
    if (!supabase || !id) return;
    const { error } = await supabase.from(MEMBERS_TABLE).delete().eq("id", id);
    if (error) {
      throw error;
    }
  }
  async function deleteAnnouncementFromSupabase(id) {
    if (!supabase || !id) return;
    const { error } = await supabase.from(ANNOUNCEMENTS_TABLE).delete().eq("id", id);
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
    const { data, error } = await supabase.from(MEMBERS_TABLE).update(payload).eq("id", id).select("id, name, role, team, contact, age, affiliation, motivation, photo, photo_alt, created_at").single();
    if (error) throw error;
    return normalizeMemberRecord(data);
  }
  async function upsertMemberNotesToSupabase(memberId, values) {
    var _a, _b;
    if (!supabase || !memberId)
      return null;
    const payload = {
      member_id: memberId,
      traits: values.traits || null,
      cautions: values.cautions || null,
      updated_by: ((_a = currentSession == null ? void 0 : currentSession.user) == null ? void 0 : _a.id) || null,
      updated_by_email: ((_b = currentSession == null ? void 0 : currentSession.user) == null ? void 0 : _b.email) || null
    };
    const { data, error } = await supabase.from(MEMBER_NOTES_TABLE).upsert(payload, { onConflict: "member_id" }).select("member_id").single();
    if (error) {
      throw error;
    }
    return data;
  }
  function sanitizeFileName(name = "") {
    if (!name) return `member-photo-${Date.now()}`;
    return name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  }
  async function uploadMemberPhoto(file, options = {}) {
    if (!supabase || !file) return "";
    try {
      const fileName = sanitizeFileName(file.name || "photo.jpg");
      const ext = fileName.includes(".") ? fileName.split(".").pop() : "jpg";
      const objectName = `members/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage.from(MEMBER_PHOTO_BUCKET).upload(objectName, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type || "image/jpeg"
      });
      if (uploadError) {
        throw uploadError;
      }
      const { data } = supabase.storage.from(MEMBER_PHOTO_BUCKET).getPublicUrl(objectName, { download: false });
      const publicUrl = (data == null ? void 0 : data.publicUrl) || "";
      markSupabaseStorageDirty();
      return publicUrl;
    } catch (err) {
      console.warn("Failed to upload member photo:", err);
      showToast("\u9854\u5199\u771F\u306E\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002", "error");
      throw err;
    }
  }
  async function uploadSliderMedia(file) {
    if (!supabase || !file) return "";
    try {
      const fileName = sanitizeFileName(file.name || "slide.jpg");
      const ext = fileName.includes(".") ? fileName.split(".").pop() : "jpg";
      const objectName = `slider/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: uploadError } = await supabase.storage.from(SLIDER_MEDIA_BUCKET).upload(objectName, file, {
        cacheControl: "1800",
        upsert: false,
        contentType: file.type || "image/jpeg"
      });
      if (uploadError) {
        throw uploadError;
      }
      const { data } = supabase.storage.from(SLIDER_MEDIA_BUCKET).getPublicUrl(objectName, { download: false });
      const publicUrl = (data == null ? void 0 : data.publicUrl) || "";
      markSupabaseStorageDirty();
      return publicUrl;
    } catch (err) {
      console.warn("Failed to upload slider media:", err);
      showToast("\u30B9\u30E9\u30A4\u30C9\u753B\u50CF\u306E\u30A2\u30C3\u30D7\u30ED\u30FC\u30C9\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002", "error");
      throw err;
    }
  }
  function buildSlideMessage(slide) {
    const parts = [];
    parts.push(`<span class="eyebrow">${(slide == null ? void 0 : slide.tag) || "\u5171\u6709"}</span>`);
    if (slide == null ? void 0 : slide.title) {
      parts.push(`<h3>${slide.title}</h3>`);
    }
    if (slide == null ? void 0 : slide.body) {
      parts.push(`<p>${slide.body}</p>`);
    }
    return parts.join("");
  }
  function renderSlideMarkup(slide) {
    const layout = getSlideLayout(slide);
    const hasMedia = Boolean(slide == null ? void 0 : slide.mediaUrl);
    const messageContent = buildSlideMessage(slide);
    const messageBlock = messageContent ? `<div class="slide-message">${messageContent}</div>` : "";
    const mediaBlock = hasMedia ? `<div class="slide-media"><img src="${slide.mediaUrl}" alt="${slide.mediaAlt || slide.title || "\u95A2\u9023\u753B\u50CF"}" loading="lazy"></div>` : "";
    if (layout === "image" && hasMedia) {
      return `
      <div class="slide" data-type="message" data-layout="image">
        <div class="slide-image-only">
          ${mediaBlock}
          ${messageBlock ? `<div class="slide-overlay">${messageBlock}</div>` : ""}
        </div>
      </div>`;
    }
    if (layout === "mixed" && hasMedia) {
      return `
      <div class="slide" data-type="message" data-layout="mixed">
        <div class="slide-split">
          ${mediaBlock}
          ${messageBlock || '<div class="slide-message"><p>\u5199\u771F\u60C5\u5831</p></div>'}
        </div>
      </div>`;
    }
    return `
    <div class="slide" data-type="message" data-layout="text">
      ${messageBlock || '<div class="slide-message"><p>\u5185\u5BB9\u672A\u8A2D\u5B9A</p></div>'}
    </div>`;
  }
  function setMemberNotesFormDisabled(disabled) {
    ["memberNotesSelect", "memberTraitsField", "memberCautionsField", "memberNotesSaveBtn"].forEach((id) => {
      const el = $(id);
      if (el) {
        el.disabled = disabled;
      }
    });
  }
  function toggleMemberNotesButton(visible) {
    const btn = $("memberNotesBtn");
    if (!btn)
      return;
    btn.style.display = visible ? "" : "none";
    if (!visible) {
      closeMemberNotesPanel();
    }
  }
  function openMemberNotesPanel() {
    const panel = $("member-notes-panel");
    if (!panel)
      return;
    panel.classList.add("show");
    panel.removeAttribute("hidden");
    populateMemberNotesSelect(memberNotesState.selectedMemberId);
    const select = $("memberNotesSelect");
    if (select) {
      select.focus();
    }
  }
  function closeMemberNotesPanel() {
    const panel = $("member-notes-panel");
    if (!panel)
      return;
    panel.classList.remove("show");
    panel.setAttribute("hidden", "hidden");
  }
  function populateMemberNotesSelect(preferredId = "") {
    const select = $("memberNotesSelect");
    if (!select)
      return;
    const members = Array.isArray(appData == null ? void 0 : appData.members) ? appData.members : [];
    if (!members.length) {
      select.innerHTML = '<option value="">\u767B\u9332\u6E08\u307F\u30E1\u30F3\u30D0\u30FC\u304C\u3042\u308A\u307E\u305B\u3093</option>';
      setMemberNotesFormDisabled(true);
      clearMemberNotesForm();
      renderMemberNotesPreview("");
      updateMemberNotesStatus("");
      return;
    }
    setMemberNotesFormDisabled(false);
    const options = ['<option value="">\u30E1\u30F3\u30D0\u30FC\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044</option>'];
    members.forEach((member) => {
      const label = member.team ? `[${member.team}] ${member.name}` : member.name;
      options.push(`<option value="${member.id}">${escapeHTML(label)}</option>`);
    });
    select.innerHTML = options.join("");
    let resolvedId = preferredId || memberNotesState.selectedMemberId || members[0].id;
    if (!members.some((member) => member.id === resolvedId)) {
      resolvedId = "";
    }
    if (resolvedId) {
      select.value = resolvedId;
      memberNotesState.selectedMemberId = resolvedId;
      fillMemberNotesFieldsFromState(resolvedId);
    } else {
      select.value = "";
      memberNotesState.selectedMemberId = "";
      clearMemberNotesForm();
      renderMemberNotesPreview("");
      updateMemberNotesStatus("");
    }
  }
  function fillMemberNotesFieldsFromState(memberId) {
    const notes = memberNotesState.entries[memberId] || { traits: "", cautions: "" };
    const traitsField = $("memberTraitsField");
    const cautionsField = $("memberCautionsField");
    if (traitsField) {
      traitsField.value = notes.traits || "";
    }
    if (cautionsField) {
      cautionsField.value = notes.cautions || "";
    }
    updateMemberNotesStatus(memberId);
    renderMemberNotesPreview(memberId);
  }
  function handleMemberNotesSelectChange() {
    const select = $("memberNotesSelect");
    if (!select)
      return;
    const memberId = select.value;
    memberNotesState.selectedMemberId = memberId;
    if (memberId) {
      fillMemberNotesFieldsFromState(memberId);
    } else {
      clearMemberNotesForm();
      renderMemberNotesPreview("");
      updateMemberNotesStatus("");
    }
  }
  function updateMemberNotesStatus(memberId) {
    const statusEl = $("memberNotesStatus");
    if (!statusEl)
      return;
    if (!memberId) {
      statusEl.textContent = "\u5BFE\u8C61\u30E1\u30F3\u30D0\u30FC\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044\u3002";
      return;
    }
    const note = memberNotesState.entries[memberId];
    if (!note || !note.traits && !note.cautions) {
      statusEl.textContent = "\u307E\u3060\u30E1\u30E2\u306F\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093\u3002";
      return;
    }
    const parts = [];
    if (note.updatedAt) {
      parts.push(`\u6700\u7D42\u66F4\u65B0 ${formatTimestamp(note.updatedAt)}`);
    }
    if (note.updatedByEmail) {
      parts.push(`\u8A18\u5165\u8005 ${note.updatedByEmail}`);
    }
    statusEl.textContent = parts.join(" / ") || "";
  }
  function renderMemberNotesPreview(memberId) {
    const preview = $("memberNotesPreview");
    if (!preview)
      return;
    if (!memberId) {
      preview.innerHTML = "<p class=\"muted\">\u30E1\u30F3\u30D0\u30FC\u3092\u9078\u629E\u3059\u308B\u3068\u8A18\u9332\u5185\u5BB9\u304C\u8868\u793A\u3055\u308C\u307E\u3059\u3002</p>";
      return;
    }
    const member = findMemberById(memberId);
    const note = memberNotesState.entries[memberId];
    const displayName = member ? `${member.team ? `${member.team} / ` : ""}${member.name}` : "\u5BFE\u8C61\u30E1\u30F3\u30D0\u30FC";
    const traits = note == null ? void 0 : note.traits;
    const cautions = note == null ? void 0 : note.cautions;
    const traitsMarkup = (traits == null ? void 0 : traits.trim()) ? formatMultilineText(traits) : '<span class="muted">\u672A\u8A18\u5165</span>';
    const cautionsMarkup = (cautions == null ? void 0 : cautions.trim()) ? formatMultilineText(cautions) : '<span class="muted">\u672A\u8A18\u5165</span>';
    preview.innerHTML = `
    <article>
      <h4>${escapeHTML(displayName)}</h4>
      <div class="member-notes-preview-section">
        <strong>\u7279\u6027</strong>
        <p>${traitsMarkup}</p>
      </div>
      <div class="member-notes-preview-section">
        <strong>\u6CE8\u610F\u3059\u3079\u304D\u70B9</strong>
        <p>${cautionsMarkup}</p>
      </div>
    </article>
  `;
  }
  function setMemberNotesSaving(isSaving) {
    const btn = $("memberNotesSaveBtn");
    if (!btn)
      return;
    btn.disabled = isSaving;
    btn.textContent = isSaving ? "\u4FDD\u5B58\u4E2D..." : "\u4E0A\u66F8\u304D\u4FDD\u5B58";
  }
  async function handleMemberNotesSubmit(event) {
    event.preventDefault();
    if (!isCurrentUserAdmin()) {
      showToast("\u7BA1\u7406\u8005\u306E\u307F\u5229\u7528\u3067\u304D\u307E\u3059\u3002", "error");
      return;
    }
    if (!requireSupabaseForSync("\u30E1\u30F3\u30D0\u30FC\u7279\u6027\u30E1\u30E2")) {
      return;
    }
    const select = $("memberNotesSelect");
    const memberId = select == null ? void 0 : select.value;
    if (!memberId) {
      showToast("\u30E1\u30F3\u30D0\u30FC\u3092\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044\u3002", "error");
      return;
    }
    const traitsInput = $("memberTraitsField");
    const cautionsInput = $("memberCautionsField");
    const traitsValue = (traitsInput == null ? void 0 : traitsInput.value.trim()) || "";
    const cautionsValue = (cautionsInput == null ? void 0 : cautionsInput.value.trim()) || "";
    setMemberNotesSaving(true);
    try {
      await upsertMemberNotesToSupabase(memberId, { traits: traitsValue, cautions: cautionsValue });
      showToast("\u7279\u6027\u30E1\u30E2\u3092\u4FDD\u5B58\u3057\u307E\u3057\u305F\u3002", "success");
      memberNotesState.selectedMemberId = memberId;
      await refreshMemberNotesFromSupabase({ silent: true });
      fillMemberNotesFieldsFromState(memberId);
    } catch (err) {
      console.warn("Failed to save member notes via Supabase:", err);
      showToast("\u7279\u6027\u30E1\u30E2\u306E\u4FDD\u5B58\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002Supabase\u306E\u8A2D\u5B9A\u3084\u6A29\u9650\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002", "error");
    } finally {
      setMemberNotesSaving(false);
    }
  }
  async function handleMemberNotesOpen() {
    if (!isCurrentUserAdmin()) {
      showToast("\u7BA1\u7406\u8005\u306E\u307F\u5229\u7528\u3067\u304D\u307E\u3059\u3002", "error");
      return;
    }
    if (!requireSupabaseForSync("\u30E1\u30F3\u30D0\u30FC\u7279\u6027\u30E1\u30E2")) {
      return;
    }
    await refreshMemberNotesFromSupabase({ silent: true });
    openMemberNotesPanel();
  }
  function toggleAdminButton(visible) {
    const btn = $("adminAccessBtn");
    if (!btn)
      return;
    btn.style.display = visible ? "" : "none";
  }
  function updateAdminPanelVisibility() {
    const panel = $("admin-panel");
    if (!panel) return;
    if (adminUnlocked) {
      panel.classList.add("visible");
      panel.removeAttribute("hidden");
    } else {
      panel.classList.remove("visible");
      panel.setAttribute("hidden", "hidden");
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
    var _a;
    const modal = $("admin-modal");
    if (!modal) return;
    modal.classList.add("show");
    (_a = $("admin-code")) == null ? void 0 : _a.focus();
  }
  function closeAdminModal() {
    var _a;
    const modal = $("admin-modal");
    if (!modal) return;
    modal.classList.remove("show");
    (_a = $("admin-access-form")) == null ? void 0 : _a.reset();
  }
  function ensureAdminAccess() {
    if (adminUnlocked) return true;
    showToast("\u7BA1\u7406\u8005\u753B\u9762\u306B\u5165\u5BA4\u3057\u3066\u304F\u3060\u3055\u3044\u3002", "error");
    return false;
  }
  function requireSupabaseForSync(featureLabel = "\u3053\u306E\u64CD\u4F5C") {
    if (supabase) {
      return true;
    }
    const label = featureLabel ? `${featureLabel}\u3092` : "\u3053\u306E\u64CD\u4F5C\u306F";
    showToast(`Supabase\u672A\u63A5\u7D9A\u306E\u305F\u3081${label}\u5B9F\u884C\u3067\u304D\u307E\u305B\u3093\u3002URL/\u30AD\u30FC\u3068\u6A29\u9650\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002`, "error");
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
    const noticeForm = $("notice-form");
    if (noticeForm) {
      noticeForm.addEventListener("submit", handleNoticeSubmit);
    }
    const memberForm = $("member-form");
    if (memberForm) {
      memberForm.addEventListener("submit", handleMemberSubmit);
    }
    const resourceForm = $("resource-form");
    if (resourceForm) {
      resourceForm.addEventListener("submit", handleResourceSubmit);
    }
    const qaForm = $("qa-form");
    if (qaForm) {
      qaForm.addEventListener("submit", handleQaSubmit);
    }
    const sliderForm = $("slider-form");
    if (sliderForm) {
      sliderForm.addEventListener("submit", handleSliderSubmit);
    }
    const sliderSubmitBtn = $("slider-submit-btn");
    if (sliderForm && sliderSubmitBtn && typeof sliderForm.requestSubmit === "function") {
      sliderSubmitBtn.addEventListener("click", (event) => {
        if (sliderSubmitBtn.disabled) return;
        event.preventDefault();
        sliderForm.requestSubmit(sliderSubmitBtn);
      });
    }
    const adminAccessBtn = $("adminAccessBtn");
    if (adminAccessBtn) {
      adminAccessBtn.addEventListener("click", () => {
        if (adminUnlocked) {
          setAdminAccess(true);
        } else {
          openAdminModal();
        }
      });
    }
    const adminAccessForm = $("admin-access-form");
    if (adminAccessForm) {
      adminAccessForm.addEventListener("submit", handleAdminAccessSubmit);
    }
    const adminModalClose = $("adminModalClose");
    if (adminModalClose) {
      adminModalClose.addEventListener("click", () => {
        closeAdminModal();
      });
    }
    const adminCloseBtn = $("adminCloseBtn");
    if (adminCloseBtn) {
      adminCloseBtn.addEventListener("click", () => {
        setAdminAccess(false);
        showToast("\u7BA1\u7406\u8005\u753B\u9762\u3092\u9589\u3058\u307E\u3057\u305F\u3002", "success");
      });
    }
    const sliderPrev = $("sliderPrev");
    const sliderNext = $("sliderNext");
    if (sliderPrev) {
      sliderPrev.addEventListener("click", () => shiftSlide(-1));
    }
    if (sliderNext) {
      sliderNext.addEventListener("click", () => shiftSlide(1));
    }
    const memberNotesBtn = $("memberNotesBtn");
    if (memberNotesBtn) {
      memberNotesBtn.addEventListener("click", () => {
        handleMemberNotesOpen();
      });
    }
    const memberNotesClose = $("memberNotesCloseBtn");
    if (memberNotesClose) {
      memberNotesClose.addEventListener("click", () => {
        closeMemberNotesPanel();
      });
    }
    const memberNotesCancel = $("memberNotesCancelBtn");
    if (memberNotesCancel) {
      memberNotesCancel.addEventListener("click", () => {
        closeMemberNotesPanel();
      });
    }
    const memberNotesForm = $("member-notes-form");
    if (memberNotesForm) {
      memberNotesForm.addEventListener("submit", handleMemberNotesSubmit);
    }
    const memberNotesSelect = $("memberNotesSelect");
    if (memberNotesSelect) {
      memberNotesSelect.addEventListener("change", handleMemberNotesSelectChange);
    }
    const adminNoticeList = $("admin-notice-list");
    if (adminNoticeList) {
      adminNoticeList.addEventListener("click", (event) => {
        var _a;
        const btn = findActionButton(event, "remove-notice");
        if ((_a = btn == null ? void 0 : btn.dataset) == null ? void 0 : _a.id) {
          handleNoticeDelete(btn.dataset.id);
        }
      });
    }
    const adminMemberList = $("admin-member-list");
    if (adminMemberList) {
      adminMemberList.addEventListener("click", (event) => {
        var _a;
        const btn = event.target.closest("button[data-action]");
        if (!((_a = btn == null ? void 0 : btn.dataset) == null ? void 0 : _a.action)) return;
        const { action, id } = btn.dataset;
        if (!id) return;
        if (action === "remove-member") {
          handleMemberDelete(id);
        } else if (action === "edit-member") {
          enterMemberEditMode(id);
        }
      });
    }
    const sliderAdminList = $("slider-admin-list");
    if (sliderAdminList) {
      sliderAdminList.addEventListener("click", (event) => {
        var _a;
        const btn = findActionButton(event, "remove-slide");
        if ((_a = btn == null ? void 0 : btn.dataset) == null ? void 0 : _a.id) {
          handleSliderDelete(btn.dataset.id);
        }
      });
    }
    const adminResourceList = $("admin-resource-list");
    if (adminResourceList) {
      adminResourceList.addEventListener("click", (event) => {
        var _a;
        const btn = findActionButton(event, "remove-resource");
        if ((_a = btn == null ? void 0 : btn.dataset) == null ? void 0 : _a.id) {
          handleResourceDelete(btn.dataset.id);
        }
      });
    }
    const memberCancelBtn = $("member-cancel-btn");
    if (memberCancelBtn) {
      memberCancelBtn.addEventListener("click", () => {
        exitMemberEditMode();
        showToast("\u7DE8\u96C6\u3092\u30AD\u30E3\u30F3\u30BB\u30EB\u3057\u307E\u3057\u305F\u3002", "success");
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
    const track = $("announcement-track");
    const dots = $("sliderDots");
    if (!track || !dots) return;
    sliderSlides = Array.isArray(appData == null ? void 0 : appData.announcements) ? appData.announcements : [];
    if (!sliderSlides.length) {
      track.innerHTML = `
      <div class="slide" data-type="message">
        <div class="slide-message">
          <span class="eyebrow">\u60C5\u5831</span>
          <h3>\u73FE\u5728\u8868\u793A\u3067\u304D\u308B\u66F4\u65B0\u60C5\u5831\u306F\u3042\u308A\u307E\u305B\u3093</h3>
          <p>\u627F\u8A8D\u6E08\u307F\u306B\u306A\u308B\u3068\u6700\u65B0\u306E\u30C0\u30C3\u30B7\u30E5\u30DC\u30FC\u30C9\u304C\u8868\u793A\u3055\u308C\u307E\u3059\u3002</p>
        </div>
      </div>`;
      dots.innerHTML = "";
      sliderIndex = 0;
      return;
    }
    track.innerHTML = sliderSlides.map((item) => renderSlideMarkup(item)).join("");
    dots.innerHTML = sliderSlides.map((_, idx) => `
    <button type="button" class="dot${idx === sliderIndex ? " active" : ""}" data-index="${idx}" aria-label="\u901A\u77E5 ${idx + 1}"></button>
  `).join("");
    dots.querySelectorAll(".dot").forEach((dot) => {
      dot.addEventListener("click", () => goToSlide(Number(dot.dataset.index)));
    });
    goToSlide(sliderIndex);
  }
  function goToSlide(targetIndex) {
    if (!sliderSlides.length) return;
    sliderIndex = (targetIndex % sliderSlides.length + sliderSlides.length) % sliderSlides.length;
    updateSliderPosition();
  }
  function shiftSlide(delta) {
    if (!sliderSlides.length) return;
    goToSlide(sliderIndex + delta);
  }
  function updateSliderPosition() {
    const track = $("announcement-track");
    const dots = $("sliderDots");
    if (!track) return;
    track.style.transform = `translateX(-${sliderIndex * 100}%)`;
    if (dots) {
      dots.querySelectorAll(".dot").forEach((dot, idx) => {
        dot.classList.toggle("active", idx === sliderIndex);
      });
    }
  }
  function startSliderAutoPlay() {
    stopSliderAutoPlay();
    if (!sliderSlides.length) return;
    sliderTimer = setInterval(() => shiftSlide(1), 6e3);
  }
  function stopSliderAutoPlay() {
    if (sliderTimer) {
      clearInterval(sliderTimer);
      sliderTimer = null;
    }
  }
  function renderNotices() {
    const list = $("notice-list");
    if (!list) return;
    const notices = Array.isArray(appData == null ? void 0 : appData.notices) ? appData.notices : [];
    if (!notices.length) {
      list.innerHTML = '<li class="empty">\u73FE\u5728\u767B\u9332\u3055\u308C\u3066\u3044\u308B\u696D\u52D9\u9023\u7D61\u306F\u3042\u308A\u307E\u305B\u3093\u3002</li>';
      return;
    }
    list.innerHTML = notices.map((notice) => `
    <li>
      <div>
        <strong>${notice.title}</strong>
        <div class="meta">${notice.target || "\u5168\u4F53"} / ${notice.deadline || "\u968F\u6642"}</div>
        <p class="notice-body">${notice.detail}</p>
      </div>
    </li>
  `).join("");
  }
  function renderAdminNotices() {
    const list = $("admin-notice-list");
    if (!list) return;
    const notices = Array.isArray(appData == null ? void 0 : appData.notices) ? appData.notices : [];
    if (!notices.length) {
      list.innerHTML = '<li class="empty">\u767B\u9332\u6E08\u307F\u306E\u696D\u52D9\u9023\u7D61\u306F\u3042\u308A\u307E\u305B\u3093\u3002</li>';
      return;
    }
    list.innerHTML = notices.map((notice) => `
    <li>
      <div>
        <strong>${notice.title}</strong>
        <div class="meta">${notice.target || "\u5168\u4F53"} / ${notice.deadline || "\u968F\u6642"}</div>
      </div>
      <button type="button" class="icon-button" data-action="remove-notice" data-id="${notice.id}" aria-label="\u3053\u306E\u9023\u7D61\u3092\u524A\u9664">\xD7</button>
    </li>
  `).join("");
  }
  function renderSchedule() {
    const body = $("schedule-body");
    if (!body) return;
    const rows = Array.isArray(appData == null ? void 0 : appData.schedule) ? appData.schedule : [];
    if (!rows.length) {
      body.innerHTML = '<tr><td colspan="4">\u4E88\u5B9A\u306F\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093\u3002</td></tr>';
      return;
    }
    body.innerHTML = rows.map((item) => `
    <tr>
      <td>${item.date}</td>
      <td>${item.time}</td>
      <td>${item.title}</td>
      <td>${item.owner}</td>
    </tr>
  `).join("");
  }
  function renderMemberTable() {
    const table = $("member-table");
    if (!table) return;
    const body = table.querySelector("tbody");
    if (!body) return;
    const members = Array.isArray(appData == null ? void 0 : appData.members) ? appData.members : [];
    if (!members.length) {
      body.innerHTML = '<tr><td colspan="5">\u767B\u9332\u6E08\u307F\u306E\u30E1\u30F3\u30D0\u30FC\u306F\u3044\u307E\u305B\u3093\u3002</td></tr>';
    } else {
      body.innerHTML = members.map((member) => `
      <tr>
        <td>${member.name}</td>
        <td>${member.role || "-"}</td>
        <td>${member.team || "-"}</td>
        <td>${member.contact || "\u672A\u8A2D\u5B9A"}</td>
        <td>
          ${member.id ? `<a class="badge" href="./member-profile.html?id=${encodeURIComponent(member.id)}">\u8A73\u7D30</a>` : '<span class="muted">-</span>'}
        </td>
      </tr>
    `).join("");
    }
    const memberCaption = $("member-count-caption");
    if (memberCaption) {
      memberCaption.textContent = `${members.length}\u540D\u304C\u767B\u9332\u6E08\u307F`;
    }
  }
  function renderAdminMembers() {
    const list = $("admin-member-list");
    if (!list) return;
    const members = Array.isArray(appData == null ? void 0 : appData.members) ? appData.members : [];
    if (!members.length) {
      list.innerHTML = '<li class="empty">\u767B\u9332\u6E08\u307F\u306E\u30E1\u30F3\u30D0\u30FC\u306F\u3042\u308A\u307E\u305B\u3093\u3002</li>';
      return;
    }
    list.innerHTML = members.map((member) => {
      const hasId = Boolean(member.id);
      const detailLink = hasId ? `<a class="badge" href="./member-profile.html?id=${encodeURIComponent(member.id)}" target="_blank" rel="noopener noreferrer">\u958B\u304F</a>` : '<span class="badge muted">ID\u672A\u5272\u5F53</span>';
      const editButton = hasId ? `<button type="button" class="icon-button" data-action="edit-member" data-id="${member.id}" aria-label="${member.name}\u3092\u7DE8\u96C6">\u270E</button>` : "";
      const removeButton = hasId ? `<button type="button" class="icon-button" data-action="remove-member" data-id="${member.id}" aria-label="${member.name}\u3092\u524A\u9664">\xD7</button>` : "";
      return `
      <li>
        <div>
          <strong>${member.name}</strong>
          <div class="meta">${member.role || "-"} / ${member.team || "-"}</div>
        </div>
        <div style="display:flex; gap:6px; align-items:center;">
          ${detailLink}
          ${editButton}
          ${removeButton}
        </div>
      </li>
    `;
    }).join("");
  }
  function fillMemberFormFields(member = null) {
    const nameField = $("member-name");
    if (nameField) nameField.value = (member == null ? void 0 : member.name) || "";
    const roleField = $("member-role");
    if (roleField) roleField.value = (member == null ? void 0 : member.role) || "";
    const teamSelect = $("member-team");
    if (teamSelect) {
      if (member == null ? void 0 : member.team) {
        teamSelect.value = member.team;
      } else {
        teamSelect.selectedIndex = 0;
      }
    }
    const affiliationField = $("member-affiliation");
    if (affiliationField) affiliationField.value = (member == null ? void 0 : member.affiliation) || (member == null ? void 0 : member.team) || "";
    const contactField = $("member-contact");
    if (contactField) contactField.value = (member == null ? void 0 : member.contact) || "";
    const ageField = $("member-age");
    if (ageField) {
      ageField.value = Number.isFinite(member == null ? void 0 : member.age) ? member.age : "";
    }
    const motivationField = $("member-motivation");
    if (motivationField) motivationField.value = (member == null ? void 0 : member.motivation) || "";
    const photoInput = $("member-photo-file");
    if (photoInput) {
      photoInput.value = "";
    }
  }
  function resetMemberFormFields() {
    const form = $("member-form");
    if (form) form.reset();
    fillMemberFormFields(null);
  }
  function applyMemberEditUIState(member) {
    const submitBtn = $("member-submit-btn");
    if (submitBtn) submitBtn.textContent = "\u30E1\u30F3\u30D0\u30FC\u3092\u66F4\u65B0";
    const cancelBtn = $("member-cancel-btn");
    if (cancelBtn) cancelBtn.style.display = "";
    const status = $("member-form-status");
    if (status) {
      status.textContent = `\u7DE8\u96C6\u30E2\u30FC\u30C9: ${member.name}\uFF08\u9854\u5199\u771F\u306F\u672A\u9078\u629E\u306A\u3089\u73FE\u72B6\u3092\u4FDD\u6301\u3057\u307E\u3059\uFF09`;
      status.style.display = "";
    }
  }
  function exitMemberEditMode(options = {}) {
    editingMemberId = null;
    if (options.resetForm !== false) {
      resetMemberFormFields();
    }
    const submitBtn = $("member-submit-btn");
    if (submitBtn) submitBtn.textContent = "\u30E1\u30F3\u30D0\u30FC\u3092\u8FFD\u52A0";
    const cancelBtn = $("member-cancel-btn");
    if (cancelBtn) cancelBtn.style.display = "none";
    const status = $("member-form-status");
    if (status) {
      status.textContent = "";
      status.style.display = "none";
    }
  }
  function enterMemberEditMode(id) {
    var _a;
    ensureArrayState("members");
    const members = Array.isArray(appData == null ? void 0 : appData.members) ? appData.members : [];
    const member = members.find((item) => item.id === id);
    if (!member) {
      showToast("\u6307\u5B9A\u3057\u305F\u30E1\u30F3\u30D0\u30FC\u304C\u898B\u3064\u304B\u308A\u307E\u305B\u3093\u3002", "error");
      return;
    }
    editingMemberId = id;
    fillMemberFormFields(member);
    applyMemberEditUIState(member);
    (_a = $("member-form")) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth", block: "start" });
    showToast(`${member.name} \u306E\u60C5\u5831\u3092\u7DE8\u96C6\u3057\u3066\u3044\u307E\u3059\u3002`, "info");
  }
  function renderResources() {
    const list = $("resource-list");
    if (!list) return;
    const resources = Array.isArray(appData == null ? void 0 : appData.resources) ? appData.resources : [];
    if (!resources.length) {
      list.innerHTML = '<li class="empty">\u767B\u9332\u6E08\u307F\u306E\u8CC7\u6599\u306F\u3042\u308A\u307E\u305B\u3093\u3002</li>';
      return;
    }
    list.innerHTML = resources.map((item) => `
    <li>
      <div>
        <strong>${item.title}</strong>
        <div class="meta">${item.meta || "\u6982\u8981\u672A\u8A2D\u5B9A"}</div>
      </div>
      ${item.link ? `<a href="${item.link}" class="badge" target="_blank" rel="noopener noreferrer">\u958B\u304F</a>` : ""}
    </li>
  `).join("");
  }
  function renderAdminResources() {
    const list = $("admin-resource-list");
    if (!list) return;
    const resources = Array.isArray(appData == null ? void 0 : appData.resources) ? appData.resources : [];
    if (!resources.length) {
      list.innerHTML = '<li class="empty">\u767B\u9332\u6E08\u307F\u306E\u8CC7\u6599\u306F\u3042\u308A\u307E\u305B\u3093\u3002</li>';
      return;
    }
    list.innerHTML = resources.map((item) => `
    <li>
      <div>
        <strong>${item.title}</strong>
        <div class="meta">${item.meta || "\u6982\u8981\u672A\u8A2D\u5B9A"}</div>
      </div>
      <button type="button" class="icon-button" data-action="remove-resource" data-id="${item.id}" aria-label="\u3053\u306E\u8CC7\u6599\u3092\u524A\u9664">\xD7</button>
    </li>
  `).join("");
  }
  function renderQaLog() {
    const list = $("qa-log");
    if (!list) return;
    const entries = Array.isArray(appData == null ? void 0 : appData.qaLog) ? appData.qaLog.slice(0, 5) : [];
    if (!entries.length) {
      list.innerHTML = '<li class="empty">\u307E\u3060\u8CEA\u554F\u306F\u767B\u9332\u3055\u308C\u3066\u3044\u307E\u305B\u3093\u3002</li>';
      return;
    }
    list.innerHTML = entries.map((entry) => `
    <li>
      <div>
        <strong>${entry.name || "\u533F\u540D"}</strong>
        <div class="meta">${formatTopic(entry.topic)} / ${formatTimestamp(entry.createdAt)}</div>
        <p class="qa-body">${entry.question}</p>
      </div>
    </li>
  `).join("");
  }
  function renderSliderAdminList() {
    const list = $("slider-admin-list");
    if (!list) return;
    const slides = Array.isArray(appData == null ? void 0 : appData.announcements) ? appData.announcements : [];
    if (!slides.length) {
      list.innerHTML = '<li class="empty">\u8868\u793A\u4E2D\u306E\u30B9\u30E9\u30A4\u30C9\u306F\u3042\u308A\u307E\u305B\u3093\u3002</li>';
      return;
    }
    list.innerHTML = slides.map((slide) => {
      const layout = getSlideLayout(slide);
      const displayTitle = slide.title || "(\u30BF\u30A4\u30C8\u30EB\u672A\u8A2D\u5B9A)";
      return `
    <li>
      <div>
        <strong>${displayTitle}</strong>
        <div class="meta">${slide.tag || "\u5171\u6709"} / ${SLIDE_LAYOUT_LABELS[layout] || SLIDE_LAYOUT_LABELS.text}</div>
      </div>
      <button type="button" class="icon-button" data-action="remove-slide" data-id="${slide.id}" aria-label="\u3053\u306E\u30B9\u30E9\u30A4\u30C9\u3092\u524A\u9664">\xD7</button>
    </li>
  `;
    }).join("");
  }
  function handleNoticeSubmit(event) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i;
    event.preventDefault();
    if (!ensureAdminAccess()) return;
    if (!appData) return;
    ensureArrayState("notices");
    const title = (_b = (_a = $("notice-title")) == null ? void 0 : _a.value) == null ? void 0 : _b.trim();
    const detail = (_d = (_c = $("notice-detail")) == null ? void 0 : _c.value) == null ? void 0 : _d.trim();
    if (!title || !detail) {
      showToast("\u4EF6\u540D\u3068\u8A73\u7D30\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002", "error");
      return;
    }
    const target = (_f = (_e = $("notice-target")) == null ? void 0 : _e.value) == null ? void 0 : _f.trim();
    const deadline = (_h = (_g = $("notice-deadline")) == null ? void 0 : _g.value) == null ? void 0 : _h.trim();
    const newNotice = {
      id: createId("notice"),
      title,
      detail,
      target: target || "\u5168\u4F53",
      deadline: deadline || "\u968F\u6642",
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    appData.notices = [newNotice, ...appData.notices];
    saveAppData(appData);
    (_i = $("notice-form")) == null ? void 0 : _i.reset();
    renderNotices();
    renderAdminNotices();
    showToast("\u696D\u52D9\u9023\u7D61\u3092\u8FFD\u52A0\u3057\u307E\u3057\u305F\u3002", "success");
  }
  function handleNoticeDelete(id) {
    if (!appData || !id) return;
    if (!ensureAdminAccess()) return;
    ensureArrayState("notices");
    const before = appData.notices.length;
    appData.notices = appData.notices.filter((notice) => notice.id !== id);
    if (appData.notices.length === before) return;
    saveAppData(appData);
    renderNotices();
    renderAdminNotices();
    showToast("\u696D\u52D9\u9023\u7D61\u3092\u524A\u9664\u3057\u307E\u3057\u305F\u3002", "success");
  }
  async function handleMemberSubmit(event) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n;
    event.preventDefault();
    if (!ensureAdminAccess()) return;
    if (!appData) return;
    if (!requireSupabaseForSync("\u30E1\u30F3\u30D0\u30FC\u7BA1\u7406")) return;
    ensureArrayState("members");
    const name = (_b = (_a = $("member-name")) == null ? void 0 : _a.value) == null ? void 0 : _b.trim();
    const role = (_d = (_c = $("member-role")) == null ? void 0 : _c.value) == null ? void 0 : _d.trim();
    const team = ((_e = $("member-team")) == null ? void 0 : _e.value) || "";
    if (!name || !role || !team) {
      showToast("\u6C0F\u540D\u30FB\u5F79\u5272\u30FB\u73ED\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002", "error");
      return;
    }
    const contact = (_g = (_f = $("member-contact")) == null ? void 0 : _f.value) == null ? void 0 : _g.trim();
    const ageValue = (_i = (_h = $("member-age")) == null ? void 0 : _h.value) == null ? void 0 : _i.trim();
    const affiliationInput = (_k = (_j = $("member-affiliation")) == null ? void 0 : _j.value) == null ? void 0 : _k.trim();
    const motivation = (_m = (_l = $("member-motivation")) == null ? void 0 : _l.value) == null ? void 0 : _m.trim();
    const photoInput = $("member-photo-file");
    const photoFile = ((_n = photoInput == null ? void 0 : photoInput.files) == null ? void 0 : _n[0]) || null;
    const isEditing = Boolean(editingMemberId);
    const editingId = editingMemberId;
    const existingMember = isEditing ? Array.isArray(appData == null ? void 0 : appData.members) ? appData.members.find((member) => member.id === editingId) : null : null;
    if (isEditing && !existingMember) {
      showToast("\u7DE8\u96C6\u4E2D\u306E\u30E1\u30F3\u30D0\u30FC\u3092\u78BA\u8A8D\u3067\u304D\u307E\u305B\u3093\u3002\u3082\u3046\u4E00\u5EA6\u9078\u629E\u3057\u3066\u304F\u3060\u3055\u3044\u3002", "error");
      exitMemberEditMode();
      return;
    }
    if (!affiliationInput) {
      showToast("\u6240\u5C5E\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002", "error");
      return;
    }
    if (!contact) {
      showToast("\u9023\u7D61\u5148\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002", "error");
      return;
    }
    const ageNumber = ageValue ? Number(ageValue) : null;
    const normalizedAge = Number.isFinite(ageNumber) ? ageNumber : null;
    const defaultPhotoAlt = `${name}\u306E\u30D7\u30ED\u30D5\u30A3\u30FC\u30EB\u5199\u771F`;
    const memberPayload = {
      name,
      role,
      team,
      contact: contact || "",
      age: normalizedAge,
      affiliation: affiliationInput || team,
      motivation: motivation || "",
      photo: (existingMember == null ? void 0 : existingMember.photo) || "",
      photoAlt: (existingMember == null ? void 0 : existingMember.photoAlt) || defaultPhotoAlt
    };
    const submitBtn = resolveSubmitButton(event, "#member-submit-btn");
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = isEditing ? "\u66F4\u65B0\u4E2D..." : "\u8FFD\u52A0\u4E2D...";
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
      showToast(isEditing ? `${memberPayload.name} \u3092\u66F4\u65B0\u3057\u307E\u3057\u305F\u3002` : `${memberPayload.name} \u3092\u8FFD\u52A0\u3057\u307E\u3057\u305F\u3002`, "success");
    } catch (err) {
      console.warn("Failed to sync member with Supabase:", err);
      const actionLabel = isEditing ? "\u66F4\u65B0" : "\u8FFD\u52A0";
      const detail = (err == null ? void 0 : err.message) ? ` (${err.message})` : "";
      showToast(`\u30E1\u30F3\u30D0\u30FC\u306E${actionLabel}\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002Supabase\u306E\u8A2D\u5B9A\u3084\u6A29\u9650\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002${detail}`, "error");
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = isEditing ? "\u30E1\u30F3\u30D0\u30FC\u3092\u66F4\u65B0" : "\u30E1\u30F3\u30D0\u30FC\u3092\u8FFD\u52A0";
      }
    }
  }
  async function handleMemberDelete(id) {
    if (!id || !ensureAdminAccess()) return;
    if (!requireSupabaseForSync("\u30E1\u30F3\u30D0\u30FC\u7BA1\u7406")) return;
    ensureArrayState("members");
    try {
      await deleteMemberFromSupabase(id);
      if (editingMemberId === id) {
        exitMemberEditMode({ silent: true });
      }
      await refreshMembersFromSupabase({ silent: true });
      showToast("\u30E1\u30F3\u30D0\u30FC\u3092\u524A\u9664\u3057\u307E\u3057\u305F\u3002", "success");
    } catch (err) {
      console.warn("Failed to delete member via Supabase:", err);
      showToast("\u30E1\u30F3\u30D0\u30FC\u306E\u524A\u9664\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002Supabase\u306E\u8A2D\u5B9A\u3084\u6A29\u9650\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002", "error");
    }
  }
  function handleResourceSubmit(event) {
    var _a, _b, _c, _d, _e, _f, _g;
    event.preventDefault();
    if (!ensureAdminAccess()) return;
    if (!appData) return;
    ensureArrayState("resources");
    const title = (_b = (_a = $("resource-title")) == null ? void 0 : _a.value) == null ? void 0 : _b.trim();
    if (!title) {
      showToast("\u8CC7\u6599\u540D\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002", "error");
      return;
    }
    const meta = (_d = (_c = $("resource-meta")) == null ? void 0 : _c.value) == null ? void 0 : _d.trim();
    const link = (_f = (_e = $("resource-link")) == null ? void 0 : _e.value) == null ? void 0 : _f.trim();
    const newResource = {
      id: createId("res"),
      title,
      meta: meta || "\u6982\u8981\u672A\u8A2D\u5B9A",
      link: link || ""
    };
    appData.resources = [...appData.resources, newResource];
    saveAppData(appData);
    (_g = $("resource-form")) == null ? void 0 : _g.reset();
    renderResources();
    renderAdminResources();
    showToast("\u53C2\u8003\u8CC7\u6599\u3092\u8FFD\u52A0\u3057\u307E\u3057\u305F\u3002", "success");
  }
  function handleResourceDelete(id) {
    if (!appData || !id) return;
    if (!ensureAdminAccess()) return;
    ensureArrayState("resources");
    const before = appData.resources.length;
    appData.resources = appData.resources.filter((resource) => resource.id !== id);
    if (before === appData.resources.length) return;
    saveAppData(appData);
    renderResources();
    renderAdminResources();
    showToast("\u53C2\u8003\u8CC7\u6599\u3092\u524A\u9664\u3057\u307E\u3057\u305F\u3002", "success");
  }
  async function handleSliderSubmit(event) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
    event.preventDefault();
    if (!ensureAdminAccess()) return;
    if (!appData) return;
    if (!requireSupabaseForSync("\u30B9\u30E9\u30A4\u30C0\u30FC\u7BA1\u7406")) return;
    ensureArrayState("announcements");
    const title = (_b = (_a = $("slider-title")) == null ? void 0 : _a.value) == null ? void 0 : _b.trim();
    const body = (_d = (_c = $("slider-body")) == null ? void 0 : _c.value) == null ? void 0 : _d.trim();
    const tag = ((_e = $("slider-tag")) == null ? void 0 : _e.value) || "\u5171\u6709";
    const layoutInput = ((_f = $("slider-layout")) == null ? void 0 : _f.value) || "text";
    const mediaAltInput = (_h = (_g = $("slider-alt")) == null ? void 0 : _g.value) == null ? void 0 : _h.trim();
    const mediaUrlRaw = (_j = (_i = $("slider-media")) == null ? void 0 : _i.value) == null ? void 0 : _j.trim();
    const mediaFileInput = $("slider-media-file");
    const mediaFile = ((_k = mediaFileInput == null ? void 0 : mediaFileInput.files) == null ? void 0 : _k[0]) || null;
    const submitBtn = resolveSubmitButton(event, "#slider-submit-btn");
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "\u8FFD\u52A0\u4E2D...";
    }
    try {
      let mediaUrl = "";
      if (mediaFile) {
        mediaUrl = await uploadSliderMedia(mediaFile);
      } else if (mediaUrlRaw) {
        mediaUrl = mediaUrlRaw;
      }
      const hasMedia = Boolean(mediaUrl);
      if ((layoutInput === "mixed" || layoutInput === "image") && !hasMedia) {
        showToast("\u9078\u629E\u3057\u305F\u30EC\u30A4\u30A2\u30A6\u30C8\u306B\u306F\u753B\u50CF\u304C\u5FC5\u8981\u3067\u3059\u3002", "error");
        return;
      }
      if (layoutInput === "text" && !title && !body) {
        showToast("\u30C6\u30AD\u30B9\u30C8\u306E\u307F\u306E\u30EC\u30A4\u30A2\u30A6\u30C8\u3067\u306F\u30BF\u30A4\u30C8\u30EB\u307E\u305F\u306F\u672C\u6587\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002", "error");
        return;
      }
      if (!title && !body && !hasMedia) {
        showToast("\u30BF\u30A4\u30C8\u30EB\u30FB\u672C\u6587\u30FB\u753B\u50CF\u306E\u3044\u305A\u308C\u304B\u306F\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002", "error");
        return;
      }
      const layout = normalizeSlideLayout(layoutInput, hasMedia);
      const resolvedMediaAlt = hasMedia ? mediaAltInput || title || "\u95A2\u9023\u753B\u50CF" : "";
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
      (_l = $("slider-form")) == null ? void 0 : _l.reset();
      if (mediaFileInput) {
        mediaFileInput.value = "";
      }
      const layoutField = $("slider-layout");
      if (layoutField) layoutField.value = "text";
      showToast("\u30B9\u30E9\u30A4\u30C0\u30FC\u306B\u65B0\u3057\u3044\u60C5\u5831\u3092\u8FFD\u52A0\u3057\u307E\u3057\u305F\u3002", "success");
    } catch (err) {
      console.warn("Failed to add slider entry via Supabase:", err);
      const detail = (err == null ? void 0 : err.message) ? ` (${err.message})` : "";
      showToast(`\u30B9\u30E9\u30A4\u30C0\u30FC\u306E\u8FFD\u52A0\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002Supabase\u306E\u8A2D\u5B9A\u3084\u6A29\u9650\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002${detail}`, "error");
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "\u30B9\u30E9\u30A4\u30C9\u3092\u8FFD\u52A0";
      }
    }
  }
  async function handleSliderDelete(id) {
    if (!appData || !id) return;
    if (!ensureAdminAccess()) return;
    if (!requireSupabaseForSync("\u30B9\u30E9\u30A4\u30C0\u30FC\u7BA1\u7406")) return;
    ensureArrayState("announcements");
    try {
      await deleteAnnouncementFromSupabase(id);
      await refreshAnnouncementsFromSupabase({ silent: true });
      showToast("\u30B9\u30E9\u30A4\u30C0\u30FC\u304B\u3089\u524A\u9664\u3057\u307E\u3057\u305F\u3002", "success");
    } catch (err) {
      console.warn("Failed to delete slider entry via Supabase:", err);
      showToast("\u30B9\u30E9\u30A4\u30C0\u30FC\u306E\u524A\u9664\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002Supabase\u306E\u8A2D\u5B9A\u3084\u6A29\u9650\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002", "error");
    }
  }
  function handleQaSubmit(event) {
    var _a, _b, _c, _d, _e, _f;
    event.preventDefault();
    if (!ensureAdminAccess()) return;
    if (!appData) return;
    ensureArrayState("qaLog");
    const question = (_b = (_a = $("qa-question")) == null ? void 0 : _a.value) == null ? void 0 : _b.trim();
    if (!question) {
      showToast("\u8CEA\u554F\u5185\u5BB9\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002", "error");
      return;
    }
    const name = (_d = (_c = $("qa-name")) == null ? void 0 : _c.value) == null ? void 0 : _d.trim();
    const topic = ((_e = $("qa-topic")) == null ? void 0 : _e.value) || "other";
    const newEntry = {
      id: createId("qa"),
      name: name || "\u533F\u540D",
      topic,
      question,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    appData.qaLog = [newEntry, ...appData.qaLog];
    saveAppData(appData);
    (_f = $("qa-form")) == null ? void 0 : _f.reset();
    renderQaLog();
    showToast("\u8CEA\u554F\u3092\u767B\u9332\u3057\u307E\u3057\u305F\u3002", "success");
  }
  function handleAdminAccessSubmit(event) {
    var _a, _b;
    event.preventDefault();
    const code = (_b = (_a = $("admin-code")) == null ? void 0 : _a.value) == null ? void 0 : _b.trim();
    if (!code) {
      showToast("\u30A2\u30AF\u30BB\u30B9\u30B3\u30FC\u30C9\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002", "error");
      return;
    }
    if (code !== ADMIN_ACCESS_CODE) {
      showToast("\u30A2\u30AF\u30BB\u30B9\u30B3\u30FC\u30C9\u304C\u9055\u3044\u307E\u3059\u3002", "error");
      return;
    }
    setAdminAccess(true);
    closeAdminModal();
    renderProtectedApp();
    showToast("\u7BA1\u7406\u8005\u753B\u9762\u306B\u5165\u5BA4\u3057\u307E\u3057\u305F\u3002", "success");
  }
  function formatTopic(topic) {
    return TOPIC_LABELS[topic] || TOPIC_LABELS.other;
  }
  function formatTimestamp(value) {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");
    return `${month}/${day} ${hour}:${minute}`;
  }
  function showToast(message, type = "info") {
    const toast = $("app-toast");
    if (!toast) return;
    toast.textContent = message;
    toast.className = `toast show${type === "success" ? " success" : type === "error" ? " error" : ""}`;
    if (toastTimer) {
      clearTimeout(toastTimer);
    }
    toastTimer = setTimeout(() => {
      toast.className = "toast";
      toast.textContent = "";
    }, 3200);
  }
  function updateSliderFormStatus(message, type = "info", options = {}) {
    const statusEl = $("slider-form-status");
    if (!statusEl) return;
    if (sliderStatusTimer) {
      clearTimeout(sliderStatusTimer);
      sliderStatusTimer = null;
    }
    if (!message) {
      statusEl.textContent = "";
      statusEl.style.display = "none";
      statusEl.className = "form-status muted";
      return;
    }
    const variantClass = type === "error" ? "form-status error" : type === "success" ? "form-status success" : "form-status muted";
    statusEl.className = variantClass;
    statusEl.textContent = message;
    statusEl.style.display = "";
    if (options.autoHide) {
      sliderStatusTimer = setTimeout(() => {
        updateSliderFormStatus("");
      }, options.autoHide);
    }
  }
  function translatePasswordUpdateError(message) {
    const raw = message || "";
    const lower = raw.toLowerCase();
    if (lower.includes("different from the old password")) {
      return "\u65B0\u3057\u3044\u30D1\u30B9\u30EF\u30FC\u30C9\u306F\u73FE\u5728\u306E\u30D1\u30B9\u30EF\u30FC\u30C9\u3068\u7570\u306A\u308B\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059\u3002\u5225\u306E\u30D1\u30B9\u30EF\u30FC\u30C9\u3092\u8A2D\u5B9A\u3057\u3066\u304F\u3060\u3055\u3044\u3002";
    }
    if (lower.includes("at least") && lower.includes("characters")) {
      const m = raw.match(/at least\s+(\d+)\s+characters/i);
      const n = m ? m[1] : "6";
      return `\u30D1\u30B9\u30EF\u30FC\u30C9\u306F${n}\u6587\u5B57\u4EE5\u4E0A\u306B\u3057\u3066\u304F\u3060\u3055\u3044\u3002`;
    }
    if (lower.includes("same as email")) {
      return "\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9\u3068\u540C\u3058\u6587\u5B57\u5217\u306F\u30D1\u30B9\u30EF\u30FC\u30C9\u306B\u4F7F\u7528\u3067\u304D\u307E\u305B\u3093\u3002";
    }
    if (lower.includes("session") && lower.includes("not") && lower.includes("found")) {
      return "\u30BB\u30C3\u30B7\u30E7\u30F3\u3092\u78BA\u8A8D\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u30EA\u30F3\u30AF\u306E\u6709\u52B9\u671F\u9650\u304C\u5207\u308C\u305F\u53EF\u80FD\u6027\u304C\u3042\u308A\u307E\u3059\u3002\u518D\u5EA6\u30E1\u30FC\u30EB\u306E\u30EA\u30F3\u30AF\u3092\u958B\u3044\u3066\u304A\u8A66\u3057\u304F\u3060\u3055\u3044\u3002";
    }
    return `\u30D1\u30B9\u30EF\u30FC\u30C9\u66F4\u65B0\u306B\u5931\u6557\u3057\u307E\u3057\u305F: ${raw}`;
  }
  function extractTokensFromHash() {
    const h = typeof window !== "undefined" ? window.location.hash || "" : "";
    if (!h) return null;
    const sp = new URLSearchParams(h.replace(/^#/, "?"));
    const access_token = sp.get("access_token");
    const refresh_token = sp.get("refresh_token");
    if (access_token && refresh_token) {
      return { access_token, refresh_token };
    }
    return null;
  }
  function showReset() {
    const authCard = $("auth-card");
    const signupCard = $("signup-card");
    const resetCard = $("reset-card");
    const authView = $("auth-view");
    const appHome = $("app-home");
    const overlay = $("auth-overlay");
    const logoutBtn = $("logoutBtn");
    toggleAdminButton(false);
    toggleMemberNotesButton(false);
    setAdminAccess(false);
    closeMemberNotesPanel();
    resetMemberNotesState();
    stopSliderAutoPlay();
    if (authView) authView.style.display = "";
    if (authCard) authCard.style.display = "none";
    if (signupCard) signupCard.style.display = "none";
    if (appHome) appHome.style.display = "none";
    if (overlay) overlay.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "none";
    if (resetCard) resetCard.style.display = "";
    const msg = $("reset-message");
    if (msg) msg.textContent = "";
  }
  function showLogin() {
    stopApprovalPolling();
    stopSliderAutoPlay();
    const authCard = $("auth-card");
    const signupCard = $("signup-card");
    const resetCard = $("reset-card");
    const authView = $("auth-view");
    const appHome = $("app-home");
    const overlay = $("auth-overlay");
    const logoutBtn = $("logoutBtn");
    toggleAdminButton(false);
    toggleMemberNotesButton(false);
    setAdminAccess(false);
    closeMemberNotesPanel();
    resetMemberNotesState();
    if (authView) authView.style.display = "";
    if (authCard) authCard.style.display = "";
    if (signupCard) signupCard.style.display = "none";
    if (resetCard) resetCard.style.display = "none";
    if (appHome) appHome.style.display = "none";
    if (overlay) overlay.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "none";
    const msg = $("auth-message");
    if (msg) {
      msg.textContent = "";
    }
  }
  function showSignup() {
    const authCard = $("auth-card");
    const signupCard = $("signup-card");
    const resetCard = $("reset-card");
    const authView = $("auth-view");
    const appHome = $("app-home");
    const overlay = $("auth-overlay");
    const logoutBtn = $("logoutBtn");
    toggleAdminButton(false);
    toggleMemberNotesButton(false);
    setAdminAccess(false);
    closeMemberNotesPanel();
    resetMemberNotesState();
    stopSliderAutoPlay();
    if (authView) authView.style.display = "";
    if (authCard) authCard.style.display = "none";
    if (signupCard) signupCard.style.display = "";
    if (resetCard) resetCard.style.display = "none";
    if (appHome) appHome.style.display = "none";
    if (overlay) overlay.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "none";
    const msg = $("signup-message");
    if (msg) {
      msg.textContent = "";
    }
  }
  function showPending(message) {
    const overlay = $("auth-overlay");
    toggleAdminButton(false);
    toggleMemberNotesButton(false);
    setAdminAccess(false);
    closeMemberNotesPanel();
    resetMemberNotesState();
    if (overlay) {
      overlay.style.display = "flex";
    }
    const msg = $("auth-message");
    if (msg) {
      msg.textContent = message || "\u627F\u8A8D\u5F85\u3061\u3067\u3059\u3002\u627F\u8A8D\u3055\u308C\u6B21\u7B2C\u3001\u81EA\u52D5\u3067\u5229\u7528\u53EF\u80FD\u306B\u306A\u308A\u307E\u3059\u3002";
    }
  }
  function showMain() {
    stopApprovalPolling();
    stopSliderAutoPlay();
    const authCard = $("auth-card");
    const authView = $("auth-view");
    const appHome = $("app-home");
    const overlay = $("auth-overlay");
    const logoutBtn = $("logoutBtn");
    if (authView) authView.style.display = "none";
    if (authCard) authCard.style.display = "none";
    if (overlay) overlay.style.display = "none";
    if (appHome) appHome.style.display = "";
    if (logoutBtn) logoutBtn.style.display = "";
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
      approvalRealtimeChannel = supabase.channel(`profiles-approval-${userId}`).on("postgres_changes", {
        event: "UPDATE",
        schema: "public",
        table: "profiles",
        filter: `id=eq.${userId}`
      }, (payload) => {
        var _a;
        if ((_a = payload == null ? void 0 : payload.new) == null ? void 0 : _a.approved) {
          stopApprovalPolling();
          showMain();
        }
      });
      approvalRealtimeChannel.subscribe((status) => {
        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          console.warn("\u627F\u8A8D\u30EA\u30A2\u30EB\u30BF\u30A4\u30E0\u76E3\u8996\u3067\u554F\u984C\u304C\u767A\u751F\u3057\u307E\u3057\u305F\u3002\u30DD\u30FC\u30EA\u30F3\u30B0\u306B\u30D5\u30A9\u30FC\u30EB\u30D0\u30C3\u30AF\u3057\u307E\u3059\u3002");
        }
      });
    } catch (err) {
      console.warn("\u627F\u8A8D\u30EA\u30A2\u30EB\u30BF\u30A4\u30E0\u76E3\u8996\u306E\u521D\u671F\u5316\u306B\u5931\u6557\u3057\u307E\u3057\u305F:", err);
    }
    approvalPollTimer = setInterval(async () => {
      try {
        const { data: p, error } = await supabase.from("profiles").select("approved").eq("id", userId).maybeSingle();
        if (error) {
          console.warn("\u627F\u8A8D\u72B6\u614B\u53D6\u5F97\u306B\u5931\u6557\u3057\u307E\u3057\u305F:", error.message || error);
          return;
        }
        if (p && p.approved) {
          stopApprovalPolling();
          showMain();
        }
      } catch (pollErr) {
        console.warn("\u627F\u8A8D\u72B6\u614B\u30DD\u30FC\u30EA\u30F3\u30B0\u4E2D\u306B\u30A8\u30E9\u30FC\u304C\u767A\u751F\u3057\u307E\u3057\u305F:", pollErr);
      }
    }, 3e3);
  }
  async function updateAuthUI(session) {
    var _a;
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
      const sessionEmail = ((_a = session == null ? void 0 : session.user) == null ? void 0 : _a.email) || "";
      const { data: profile, error } = await supabase.from("profiles").select("approved, is_admin").eq("id", session.user.id).maybeSingle();
      if (error) {
        currentUserProfile = null;
        showPending("\u627F\u8A8D\u72B6\u614B\u306E\u78BA\u8A8D\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002\u3057\u3070\u3089\u304F\u3057\u3066\u304B\u3089\u518D\u5EA6\u304A\u8A66\u3057\u304F\u3060\u3055\u3044\u3002");
        return;
      }
      const approved = Boolean(profile == null ? void 0 : profile.approved);
      const isAdminProfile = Boolean(profile == null ? void 0 : profile.is_admin);
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
        showPending("\u627F\u8A8D\u5F85\u3061\u3067\u3059\u3002\u627F\u8A8D\u3055\u308C\u6B21\u7B2C\u3001\u81EA\u52D5\u3067\u5229\u7528\u53EF\u80FD\u306B\u306A\u308A\u307E\u3059\u3002");
        startApprovalPolling(session.user.id);
        return;
      }
      showMain();
    } catch (e) {
      currentUserProfile = null;
      showPending("\u30A8\u30E9\u30FC\u304C\u767A\u751F\u3057\u307E\u3057\u305F\u3002\u518D\u5EA6\u304A\u8A66\u3057\u304F\u3060\u3055\u3044\u3002");
    }
  }
  document.addEventListener("DOMContentLoaded", async () => {
    const loginForm = $("login-form");
    const loginBtn = $("loginBtn");
    if (loginForm) {
      loginForm.addEventListener("submit", async (e) => {
        var _a, _b, _c;
        e.preventDefault();
        const email = (_b = (_a = $("email")) == null ? void 0 : _a.value) == null ? void 0 : _b.trim();
        const password = (_c = $("password")) == null ? void 0 : _c.value;
        const msg = $("auth-message");
        try {
          if (!supabase) {
            if (msg) {
              msg.textContent = "\u73FE\u5728\u30ED\u30B0\u30A4\u30F3\u6A5F\u80FD\u3092\u5229\u7528\u3067\u304D\u307E\u305B\u3093\u3002\u3057\u3070\u3089\u304F\u3057\u3066\u304B\u3089\u518D\u5EA6\u304A\u8A66\u3057\u304F\u3060\u3055\u3044\u3002";
            }
            return;
          }
          if (!email || !password) {
            if (msg) {
              msg.textContent = "\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9\u3068\u30D1\u30B9\u30EF\u30FC\u30C9\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002";
            }
            return;
          }
          if (loginBtn) {
            loginBtn.disabled = true;
            loginBtn.textContent = "\u30ED\u30B0\u30A4\u30F3\u4E2D...";
          }
          const { data, error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) {
            if (msg) {
              const lower = (error.message || "").toLowerCase();
              if (lower.includes("invalid login credentials")) {
                msg.textContent = "\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9\u307E\u305F\u306F\u30D1\u30B9\u30EF\u30FC\u30C9\u304C\u6B63\u3057\u304F\u3042\u308A\u307E\u305B\u3093\u3002\u521D\u3081\u3066\u306E\u65B9\u306F\u300C\u65B0\u898F\u767B\u9332\u3078\u300D\u3092\u62BC\u3057\u3066\u304F\u3060\u3055\u3044\u3002\u30D1\u30B9\u30EF\u30FC\u30C9\u3092\u5FD8\u308C\u305F\u5834\u5408\u306F\u300C\u30D1\u30B9\u30EF\u30FC\u30C9\u518D\u8A2D\u5B9A\u300D\u3092\u3054\u5229\u7528\u304F\u3060\u3055\u3044\u3002";
              } else if (lower.includes("email not confirmed")) {
                msg.textContent = "\u30E1\u30FC\u30EB\u8A8D\u8A3C\u304C\u672A\u5B8C\u4E86\u3067\u3059\u3002\u53D7\u4FE1\u30E1\u30FC\u30EB\u306E\u8A8D\u8A3C\u30EA\u30F3\u30AF\u3092\u958B\u3044\u3066\u304B\u3089\u518D\u5EA6\u304A\u8A66\u3057\u304F\u3060\u3055\u3044\u3002";
              } else {
                msg.textContent = `\u30ED\u30B0\u30A4\u30F3\u306B\u5931\u6557\u3057\u307E\u3057\u305F: ${error.message}`;
              }
            }
            return;
          }
          if (msg) {
            msg.textContent = "\u30ED\u30B0\u30A4\u30F3\u3057\u307E\u3057\u305F\u3002\u627F\u8A8D\u72B6\u614B\u3092\u78BA\u8A8D\u3057\u3066\u3044\u307E\u3059...";
          }
          try {
            const session = ((data == null ? void 0 : data.session) || (await supabase.auth.getSession()).data.session) ?? null;
            if (session) {
              await updateAuthUI(session);
            }
          } catch (__) {
          }
        } catch (err) {
          if (msg) {
            msg.textContent = "\u30ED\u30B0\u30A4\u30F3\u51E6\u7406\u3067\u30A8\u30E9\u30FC\u304C\u767A\u751F\u3057\u307E\u3057\u305F\u3002";
          }
        } finally {
          if (loginBtn) {
            loginBtn.disabled = false;
            loginBtn.textContent = "\u30ED\u30B0\u30A4\u30F3";
          }
        }
      });
    }
    const showSignupBtn = $("show-signup");
    const backLoginBtn = $("back-login");
    if (showSignupBtn) {
      showSignupBtn.addEventListener("click", () => showSignup());
    }
    if (backLoginBtn) {
      backLoginBtn.addEventListener("click", () => showLogin());
    }
    const signupForm = $("signup-form");
    const signupBtn = $("signupBtn");
    if (signupForm) {
      signupForm.addEventListener("submit", async (e) => {
        var _a, _b, _c, _d, _e;
        e.preventDefault();
        const email = (_b = (_a = $("signup-email")) == null ? void 0 : _a.value) == null ? void 0 : _b.trim();
        const password = (_c = $("signup-password")) == null ? void 0 : _c.value;
        const msg = $("signup-message");
        try {
          if (!email || !password) {
            if (msg) msg.textContent = "\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9\u3068\u30D1\u30B9\u30EF\u30FC\u30C9\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002";
            return;
          }
          if (!supabase) {
            if (msg) msg.textContent = "\u73FE\u5728\u65B0\u898F\u767B\u9332\u6A5F\u80FD\u3092\u5229\u7528\u3067\u304D\u307E\u305B\u3093\u3002\u3057\u3070\u3089\u304F\u3057\u3066\u304B\u3089\u518D\u5EA6\u304A\u8A66\u3057\u304F\u3060\u3055\u3044\u3002";
            return;
          }
          if (signupBtn) {
            signupBtn.disabled = true;
            signupBtn.textContent = "\u767B\u9332\u4E2D...";
          }
          const redirectTo = `${window.location.origin}${window.location.pathname}`;
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: redirectTo }
          });
          if (error) {
            if (msg) msg.textContent = `\u767B\u9332\u306B\u5931\u6557\u3057\u307E\u3057\u305F: ${error.message}`;
            return;
          }
          if ((_d = data == null ? void 0 : data.user) == null ? void 0 : _d.id) {
            await new Promise((r) => setTimeout(r, 1500));
            const { data: profileData } = await supabase.from("profiles").select("id").eq("id", data.user.id).maybeSingle();
            if (!profileData) {
              const { error: insErr } = await supabase.from("profiles").insert({ id: data.user.id, email, approved: false });
              if (insErr && insErr.code !== "23505" && !(insErr.message || "").includes("duplicate")) {
                console.warn("profiles \u633F\u5165\u30A8\u30E9\u30FC:", insErr);
              }
            }
          }
          if (msg) {
            msg.textContent = "\u767B\u9332\u304C\u5B8C\u4E86\u3057\u307E\u3057\u305F\u3002\u5FC5\u8981\u306B\u5FDC\u3058\u3066\u30E1\u30FC\u30EB\u8A8D\u8A3C\u5F8C\u3001\u30ED\u30B0\u30A4\u30F3\u3057\u3066\u304F\u3060\u3055\u3044\u3002";
          }
          showLogin();
          (_e = $("email")) == null ? void 0 : _e.focus();
        } catch (_) {
          if (msg) msg.textContent = "\u767B\u9332\u51E6\u7406\u3067\u30A8\u30E9\u30FC\u304C\u767A\u751F\u3057\u307E\u3057\u305F\u3002";
        } finally {
          if (signupBtn) {
            signupBtn.disabled = false;
            signupBtn.textContent = "\u65B0\u898F\u767B\u9332";
          }
        }
      });
    }
    const logoutBtn = $("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", async () => {
        try {
          if (supabase) {
            await supabase.auth.signOut();
          }
          showLogin();
        } catch (_) {
        }
      });
    }
    const resetBtn = $("reset-password");
    if (resetBtn) {
      resetBtn.addEventListener("click", async () => {
        var _a, _b, _c;
        const email = (_b = (_a = $("email")) == null ? void 0 : _a.value) == null ? void 0 : _b.trim();
        const msg = $("auth-message");
        try {
          if (!supabase) {
            if (msg) msg.textContent = "\u73FE\u5728\u30D1\u30B9\u30EF\u30FC\u30C9\u518D\u8A2D\u5B9A\u3092\u5229\u7528\u3067\u304D\u307E\u305B\u3093\u3002\u3057\u3070\u3089\u304F\u3057\u3066\u304B\u3089\u518D\u5EA6\u304A\u8A66\u3057\u304F\u3060\u3055\u3044\u3002";
            return;
          }
          if (!email) {
            if (msg) msg.textContent = "\u518D\u8A2D\u5B9A\u3059\u308B\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9\u3092\u4E0A\u306E\u5165\u529B\u6B04\u306B\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002";
            (_c = $("email")) == null ? void 0 : _c.focus();
            return;
          }
          const redirectTo = `${window.location.origin}${window.location.pathname}`;
          const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
          if (error) {
            if (msg) msg.textContent = `\u518D\u8A2D\u5B9A\u30E1\u30FC\u30EB\u306E\u9001\u4FE1\u306B\u5931\u6557\u3057\u307E\u3057\u305F: ${error.message}`;
            return;
          }
          if (msg) msg.textContent = "\u30D1\u30B9\u30EF\u30FC\u30C9\u518D\u8A2D\u5B9A\u30E1\u30FC\u30EB\u3092\u9001\u4FE1\u3057\u307E\u3057\u305F\u3002\u30E1\u30FC\u30EB\u3092\u3054\u78BA\u8A8D\u304F\u3060\u3055\u3044\u3002";
        } catch (_) {
          const msg2 = $("auth-message");
          if (msg2) msg2.textContent = "\u518D\u8A2D\u5B9A\u30E1\u30FC\u30EB\u9001\u4FE1\u3067\u30A8\u30E9\u30FC\u304C\u767A\u751F\u3057\u307E\u3057\u305F\u3002";
        }
      });
    }
    const resetForm = $("reset-form");
    const resetSubmit = $("resetSubmit");
    const resetCancel = $("reset-cancel");
    if (resetForm) {
      resetForm.addEventListener("submit", async (e) => {
        var _a, _b, _c;
        e.preventDefault();
        const newPassword = ((_a = $("new-password")) == null ? void 0 : _a.value) || "";
        const confirm = ((_b = $("confirm-password")) == null ? void 0 : _b.value) || "";
        const msg = $("reset-message");
        try {
          if (!supabase) {
            if (msg) msg.textContent = "\u73FE\u5728\u30D1\u30B9\u30EF\u30FC\u30C9\u66F4\u65B0\u3092\u5229\u7528\u3067\u304D\u307E\u305B\u3093\u3002\u3057\u3070\u3089\u304F\u3057\u3066\u304B\u3089\u518D\u5EA6\u304A\u8A66\u3057\u304F\u3060\u3055\u3044\u3002";
            return;
          }
          if (typeof navigator !== "undefined" && navigator && navigator.onLine === false) {
            if (msg) msg.textContent = "\u73FE\u5728\u30AA\u30D5\u30E9\u30A4\u30F3\u3067\u3059\u3002\u30CD\u30C3\u30C8\u30EF\u30FC\u30AF\u63A5\u7D9A\u3092\u78BA\u8A8D\u3057\u3066\u304B\u3089\u518D\u5EA6\u304A\u8A66\u3057\u304F\u3060\u3055\u3044\u3002";
            return;
          }
          let { data: { session } } = await supabase.auth.getSession();
          if (!session) {
            const tokens = extractTokensFromHash();
            if (tokens) {
              try {
                const { data: setRes, error: setErr } = await supabase.auth.setSession(tokens);
                if (setErr) {
                  if (msg) msg.textContent = "\u30BB\u30C3\u30B7\u30E7\u30F3\u306E\u5FA9\u65E7\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002\u518D\u5EA6\u30E1\u30FC\u30EB\u306E\u30EA\u30F3\u30AF\u3092\u958B\u3044\u3066\u304A\u8A66\u3057\u304F\u3060\u3055\u3044\u3002";
                  return;
                }
                session = (setRes == null ? void 0 : setRes.session) || null;
              } catch (_) {
              }
            }
          }
          if (!session) {
            if (msg) msg.textContent = "\u30EA\u30AB\u30D0\u30EA\u30FC\u30BB\u30C3\u30B7\u30E7\u30F3\u3092\u78BA\u8A8D\u3067\u304D\u307E\u305B\u3093\u3002\u3082\u3046\u4E00\u5EA6\u30E1\u30FC\u30EB\u306E\u30EA\u30F3\u30AF\u3092\u958B\u304F\u304B\u3001\u3053\u306E\u30DA\u30FC\u30B8\u3092\u518D\u8AAD\u307F\u8FBC\u307F\u3057\u3066\u304B\u3089\u304A\u8A66\u3057\u304F\u3060\u3055\u3044\u3002";
            return;
          }
          if (newPassword.length < 8) {
            if (msg) msg.textContent = "\u30D1\u30B9\u30EF\u30FC\u30C9\u306F8\u6587\u5B57\u4EE5\u4E0A\u3092\u63A8\u5968\u3057\u307E\u3059\u3002";
            return;
          }
          if (newPassword !== confirm) {
            if (msg) msg.textContent = "\u78BA\u8A8D\u7528\u30D1\u30B9\u30EF\u30FC\u30C9\u304C\u4E00\u81F4\u3057\u307E\u305B\u3093\u3002";
            return;
          }
          if (resetSubmit) {
            resetSubmit.disabled = true;
            resetSubmit.textContent = "\u66F4\u65B0\u4E2D...";
          }
          const withTimeout = (p, ms = 3e4) => Promise.race([
            p,
            new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), ms))
          ]);
          const { error: updErr } = await withTimeout(supabase.auth.updateUser({ password: newPassword }));
          if (updErr) {
            if (msg) msg.textContent = translatePasswordUpdateError(updErr.message);
            return;
          }
          if (msg) msg.textContent = "\u30D1\u30B9\u30EF\u30FC\u30C9\u3092\u66F4\u65B0\u3057\u307E\u3057\u305F\u3002\u518D\u5EA6\u30ED\u30B0\u30A4\u30F3\u3057\u3066\u304F\u3060\u3055\u3044\u3002";
          await supabase.auth.signOut();
          recoveryRequested = false;
          showLogin();
          (_c = $("email")) == null ? void 0 : _c.focus();
        } catch (err) {
          const msg2 = $("reset-message");
          if (msg2) msg2.textContent = (err == null ? void 0 : err.message) === "timeout" ? "\u66F4\u65B0\u304C\u30BF\u30A4\u30E0\u30A2\u30A6\u30C8\u3057\u307E\u3057\u305F\u3002\u30CD\u30C3\u30C8\u30EF\u30FC\u30AF\u72B6\u6CC1\u3092\u78BA\u8A8D\u306E\u4E0A\u3001\u3082\u3046\u4E00\u5EA6\u304A\u8A66\u3057\u304F\u3060\u3055\u3044\u3002" : "\u30D1\u30B9\u30EF\u30FC\u30C9\u66F4\u65B0\u3067\u30A8\u30E9\u30FC\u304C\u767A\u751F\u3057\u307E\u3057\u305F\u3002";
        } finally {
          if (resetSubmit) {
            resetSubmit.disabled = false;
            resetSubmit.textContent = "\u30D1\u30B9\u30EF\u30FC\u30C9\u3092\u8A2D\u5B9A";
          }
        }
      });
    }
    if (resetCancel) {
      resetCancel.addEventListener("click", async () => {
        try {
          if (supabase) await supabase.auth.signOut();
        } finally {
          recoveryRequested = false;
          showLogin();
        }
      });
    }
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
    if (supabase) {
      supabase.auth.onAuthStateChange(async (eventName, newSession) => {
        if (eventName === "PASSWORD_RECOVERY" || eventName === "SIGNED_IN" && recoveryRequested) {
          showReset();
          return;
        }
        await updateAuthUI(newSession);
      });
    }
  });
})();
