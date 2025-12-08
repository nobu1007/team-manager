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

  // member-profile.js
  var STORAGE_KEY = "team-manager.app-state";
  var FALLBACK_PHOTO = "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80";
  var MEMBERS_TABLE = "members";
  var supabaseClient = null;
  var _a;
  if (((_a = window.supabase) == null ? void 0 : _a.createClient) && SUPABASE_URL && SUPABASE_ANON_KEY) {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    });
  }
  function normalizeMember(raw) {
    if (!raw || typeof raw !== "object") return null;
    const parsedAge = Number(raw.age);
    return {
      id: raw.id || "",
      name: raw.name || "\u6C0F\u540D\u672A\u8A2D\u5B9A",
      role: raw.role || "",
      team: raw.team || "",
      contact: raw.contact || "",
      age: Number.isFinite(parsedAge) ? parsedAge : null,
      affiliation: raw.affiliation || raw.team || "",
      motivation: raw.motivation || "",
      photo: raw.photo || "",
      photoAlt: raw.photoAlt || raw.photo_alt || `${raw.name || "\u30E1\u30F3\u30D0\u30FC"}\u306E\u5199\u771F`
    };
  }
  function getNormalizedMembers(rawList) {
    if (!Array.isArray(rawList)) return [];
    return rawList.map(normalizeMember).filter(Boolean);
  }
  function loadMembersFromCache() {
    var _a2;
    try {
      const stored = (_a2 = window.localStorage) == null ? void 0 : _a2.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const members = getNormalizedMembers(parsed == null ? void 0 : parsed.members);
        if (members.length) {
          return members;
        }
      }
    } catch (err) {
      console.warn("\u30ED\u30FC\u30AB\u30EB\u30AD\u30E3\u30C3\u30B7\u30E5\u304B\u3089\u306E\u30E1\u30F3\u30D0\u30FC\u53D6\u5F97\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002", err);
    }
    return [];
  }
  function cacheMembersLocally(members) {
    var _a2, _b;
    if (!Array.isArray(members)) return;
    try {
      const stored = (_a2 = window.localStorage) == null ? void 0 : _a2.getItem(STORAGE_KEY);
      const parsed = stored ? JSON.parse(stored) : {};
      parsed.members = members;
      (_b = window.localStorage) == null ? void 0 : _b.setItem(STORAGE_KEY, JSON.stringify(parsed));
    } catch (err) {
      console.warn("\u30E1\u30F3\u30D0\u30FC\u30C7\u30FC\u30BF\u306E\u30ED\u30FC\u30AB\u30EB\u30AD\u30E3\u30C3\u30B7\u30E5\u4FDD\u5B58\u306B\u5931\u6557\u3057\u307E\u3057\u305F\u3002", err);
    }
  }
  async function loadMembers() {
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient.from(MEMBERS_TABLE).select("id, name, role, team, contact, age, affiliation, motivation, photo, photo_alt, created_at").order("created_at", { ascending: true });
        if (error) {
          throw error;
        }
        const normalized = getNormalizedMembers(data);
        if (normalized.length) {
          cacheMembersLocally(normalized);
          return normalized;
        }
      } catch (err) {
        console.warn("Supabase\u304B\u3089\u30E1\u30F3\u30D0\u30FC\u3092\u53D6\u5F97\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002", err);
      }
    }
    const cached = loadMembersFromCache();
    if (cached.length) {
      return cached;
    }
    return getNormalizedMembers(getDefaultMembers());
  }
  function resolvePhoto(member) {
    return (member == null ? void 0 : member.photo) || FALLBACK_PHOTO;
  }
  function formatAge(age) {
    if (Number.isFinite(age)) {
      return `${age}\u6B73`;
    }
    return "\u5E74\u9F62\u672A\u767B\u9332";
  }
  function renderDetail(member) {
    const detailEl = document.getElementById("profile-detail");
    const headingEl = document.getElementById("profile-heading");
    if (!detailEl || !member) {
      if (detailEl) {
        detailEl.hidden = true;
        detailEl.innerHTML = "";
      }
      return;
    }
    if (headingEl) {
      headingEl.textContent = `${member.name}\u306E\u30D7\u30ED\u30D5\u30A3\u30FC\u30EB`;
    }
    detailEl.innerHTML = `
    <img src="${resolvePhoto(member)}" alt="${member.photoAlt || `${member.name}\u306E\u5199\u771F`}" loading="lazy">
    <div>
      <h3 style="margin:0 0 8px">${member.name}</h3>
      <p class="muted" style="margin:0 0 12px;">${member.role || "\u5F79\u5272\u672A\u767B\u9332"} / ${member.team || "\u73ED\u672A\u767B\u9332"}</p>
      <p style="margin:0 0 12px;">${member.motivation || "\u610F\u6C17\u8FBC\u307F\u306F\u73FE\u5728\u6E96\u5099\u4E2D\u3067\u3059\u3002"}</p>
    </div>
    <div class="hero-meta">
      <div class="hero-pill">
        <strong>Age</strong>
        <span>${formatAge(member.age)}</span>
      </div>
      <div class="hero-pill">
        <strong>Affiliation</strong>
        <span>${member.affiliation || member.team || "\u6240\u5C5E\u672A\u767B\u9332"}</span>
      </div>
      <div class="hero-pill">
        <strong>Contact</strong>
        <span>${member.contact || "\u975E\u516C\u958B"}</span>
      </div>
    </div>
  `;
    detailEl.hidden = false;
  }
  function renderList(members, activeId = "") {
    const listEl = document.getElementById("profile-list");
    if (!listEl) return;
    if (!members.length) {
      listEl.innerHTML = '<p class="muted">\u73FE\u5728\u8868\u793A\u3067\u304D\u308B\u30E1\u30F3\u30D0\u30FC\u304C\u3044\u307E\u305B\u3093\u3002</p>';
      return;
    }
    listEl.innerHTML = members.map((member) => {
      const link = member.id ? `./member-profile.html?id=${encodeURIComponent(member.id)}` : "#";
      const isActive = member.id === activeId;
      const tagStart = member.id ? `<a class="profile-card${isActive ? " active" : ""}" href="${link}"${isActive ? ' aria-current="page"' : ""}>` : `<div class="profile-card${isActive ? " active" : ""}">`;
      const tagEnd = member.id ? "</a>" : "</div>";
      return `
      ${tagStart}
        <img src="${resolvePhoto(member)}" alt="${member.photoAlt || `${member.name}\u306E\u5199\u771F`}" loading="lazy">
        <div class="profile-meta">
          <span class="name">${member.name}</span>
          <span class="role">${member.role || "\u5F79\u5272\u672A\u767B\u9332"}</span>
          <span class="affiliation">${member.affiliation || member.team || "\u6240\u5C5E\u672A\u767B\u9332"}</span>
        </div>
        <p class="motto">${member.motivation || "\u610F\u6C17\u8FBC\u307F\u306F\u73FE\u5728\u6E96\u5099\u4E2D\u3067\u3059\u3002"}</p>
      ${tagEnd}
    `;
    }).join("");
  }
  function showLoadingMessage() {
    const listEl = document.getElementById("profile-list");
    if (listEl) {
      listEl.innerHTML = '<p class="muted">\u30E1\u30F3\u30D0\u30FC\u60C5\u5831\u3092\u8AAD\u307F\u8FBC\u307F\u4E2D\u3067\u3059...</p>';
    }
  }
  document.addEventListener("DOMContentLoaded", async () => {
    showLoadingMessage();
    const members = await loadMembers();
    const params = new URLSearchParams(window.location.search);
    const memberId = params.get("id");
    const target = memberId ? members.find((member) => member.id === memberId) : null;
    if (target) {
      renderDetail(target);
      renderList(members, target.id);
    } else {
      renderDetail(null);
      renderList(members);
    }
  });
})();
