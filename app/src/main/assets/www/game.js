/* =====================================================================
 * CỬU THIÊN TRUYỆN KỲ — Cultivation RPG Engine (HTML5 Canvas + Android WebView)
 * Nâng cấp toàn diện: Ngũ Hành Linh Mạch, Tâm Ma, Trận Pháp, Cửu Trọng Thiên Lôi,
 * Cộng Hưởng 3 Thiên Phú Luân Hồi, Đấu Giá AI, Linh Thú Tiến Hóa, Đại Hội Tông Môn,
 * Tương tác NPC Nhân Quả & Bộ lọc Đổi Màu NPC theo 4 Tông Phái.
 * ===================================================================== */

const STORAGE_KEY = "cuu_thien_truyen_ky_save_v1";
const META_KEY = "cuu_thien_truyen_ky_meta_v1";

const REALMS = [
  { name: "Luyện Khí", baseExp: 100, lifespanBonus: 0, hpScale: 1, atkScale: 1 },
  { name: "Trúc Cơ", baseExp: 320, lifespanBonus: 80, hpScale: 2.2, atkScale: 2.0 },
  { name: "Kim Đan", baseExp: 900, lifespanBonus: 180, hpScale: 4.8, atkScale: 4.2 },
  { name: "Nguyên Anh", baseExp: 2400, lifespanBonus: 350, hpScale: 10.5, atkScale: 9.0 },
  { name: "Hóa Thần", baseExp: 6500, lifespanBonus: 600, hpScale: 22, atkScale: 18 },
  { name: "Luyện Hư", baseExp: 16000, lifespanBonus: 1000, hpScale: 45, atkScale: 36 },
  { name: "Hợp Thể", baseExp: 40000, lifespanBonus: 1600, hpScale: 95, atkScale: 75 },
  { name: "Đại Thừa", baseExp: 95000, lifespanBonus: 2500, hpScale: 190, atkScale: 150 },
  { name: "Độ Kiếp", baseExp: 220000, lifespanBonus: 5000, hpScale: 400, atkScale: 320 }
];

const PALETTES = {
  NgocThanh: {
    label: "Ngọc Thanh Môn",
    robe: "#1e6f68",
    trim: "#38d9a9",
    inner: "#eef7f5",
    hair: "#141d22",
    aura: "rgba(56, 217, 169, 0.35)",
    badge: "#38d9a9"
  },
  HuyetMa: {
    label: "Huyết Ma Tông",
    robe: "#6e1423",
    trim: "#e05263",
    inner: "#24161a",
    hair: "#120c0e",
    aura: "rgba(224, 82, 99, 0.35)",
    badge: "#e05263"
  },
  KimTien: {
    label: "Kim Tiên Các",
    robe: "#8a621c",
    trim: "#f3d27a",
    inner: "#fff8e1",
    hair: "#2b2113",
    aura: "rgba(243, 210, 122, 0.35)",
    badge: "#e9c46a"
  },
  UMinh: {
    label: "U Minh Điện",
    robe: "#3d2463",
    trim: "#b58cff",
    inner: "#1b1629",
    hair: "#e2dcf2",
    aura: "rgba(181, 140, 255, 0.35)",
    badge: "#b58cff"
  }
};

const INNATE_TRAITS = [
  { id: "kiem_tam", name: "Kiếm Tâm Thông Minh", tag: "Kiếm Đạo", cost: 0, unlockedDefault: true, desc: "+18% Công kích, +10% Tốc độ tu luyện", atkPct: 0.18, cultPct: 0.10 },
  { id: "kiem_y", name: "Thiên Sinh Kiếm Ý", tag: "Kiếm Đạo", cost: 350, unlockedDefault: false, desc: "+10% Bạo kích, +12% Công kích", crit: 0.10, atkPct: 0.12 },
  { id: "cuu_kiem", name: "Cửu Thiên Kiếm Thể", tag: "Kiếm Đạo", cost: 700, unlockedDefault: false, desc: "+25% Công kích, +8% Hút máu", atkPct: 0.25, drain: 0.08 },

  { id: "dan_dong", name: "Dược Linh Chi Thể", tag: "Đan Đạo", cost: 0, unlockedDefault: true, desc: "+25% Hiệu quả Đan dược, -15% Tâm ma tăng", pillPct: 0.25 },
  { id: "truong_sinh", name: "Trường Sinh Huyết", tag: "Đan Đạo", cost: 300, unlockedDefault: false, desc: "+50 năm Thọ nguyên khởi đầu, +15% Sinh lực", lifespan: 50, hpPct: 0.15 },

  { id: "khi_van", name: "Thiên Mệnh Chi Tử", tag: "Khí Vận", cost: 0, unlockedDefault: true, desc: "+20 Khí vận, +20% Linh thạch nhận được", luck: 20, stonePct: 0.20 },
  { id: "tai_than", name: "Tụ Bảo Đạo Thể", tag: "Khí Vận", cost: 400, unlockedDefault: false, desc: "Khởi đầu +600 Linh thạch, giảm 15% giá Bảo Các", startStones: 600 },

  { id: "kim_cuong", name: "Kim Cương Bất Hoại", tag: "Thể Tu", cost: 0, unlockedDefault: true, desc: "+25% Sinh lực, +15% Phòng thủ", hpPct: 0.25, defPct: 0.15 },
  { id: "loi_the", name: "Lôi Đình Đạo Thể", tag: "Thể Tu", cost: 500, unlockedDefault: false, desc: "Giảm 15% sát thương Cửu Trọng Thiên Lôi", tribReduce: 0.15 },

  { id: "dieu_thu", name: "Diệu Thủ Không Không", tag: "Ám Sát", cost: 0, unlockedDefault: true, desc: "+18% Tỷ lệ Thâu Đạo, +8% Né tránh", stealBonus: 0.18, dodge: 0.08 },
  { id: "u_anh", name: "U Ảnh Thân Pháp", tag: "Ám Sát", cost: 450, unlockedDefault: false, desc: "+12% Né tránh, +12% Bạo kích", dodge: 0.12, crit: 0.12 },
  { id: "linh_su", name: "Ngự Thú Thần Thông", tag: "Khí Vận", cost: 550, unlockedDefault: false, desc: "+30% Sức mạnh Linh Thú & +15% Tu luyện", cultPct: 0.15, petPct: 0.30 }
];

const SHOP_CATALOG = [
  { id: "pill_hp", name: "Hồi Nguyên Đan", type: "consumable", price: 80, desc: "Hồi phục 45% Sinh lực (dùng được khi Độ Kiếp)", effect: "heal" },
  { id: "pill_calm", name: "Tịnh Tâm Đan", type: "consumable", price: 110, desc: "Thanh trừ 25% Tâm Ma tức thì", effect: "calm" },
  { id: "pill_exp", name: "Tụ Linh Đan", type: "consumable", price: 150, desc: "Tăng ngay +180 Tu Vi", effect: "exp" },
  { id: "pill_pet", name: "Linh Thú Quả", type: "consumable", price: 120, desc: "Dùng nuôi dưỡng & tăng cấp Linh Thú", effect: "petfood" },
  { id: "chest_thienco", name: "Rương Thiên Cơ", type: "chest", price: 320, desc: "Mở nhận ngẫu nhiên 5 bảo vật (Pháp Bảo, Đan Dược, Linh Thạch)" },
  { id: "wp_ngoc_sao", name: "Bích Ngọc Linh Địch", type: "equip", slot: "weapon", price: 380, atk: 42, crit: 0.06, desc: "+42 Công kích, +6% Bạo kích" },
  { id: "wp_huyen_kiem", name: "Cửu Thiên Huyền Kiếm", type: "equip", slot: "weapon", price: 850, atk: 110, crit: 0.10, drain: 0.05, desc: "+110 Công kích, +10% Bạo kích, +5% Hút máu" },
  { id: "ar_van_y", name: "Thanh Vân Đạo Bào", type: "equip", slot: "armor", price: 420, hp: 320, def: 28, desc: "+320 Sinh lực, +28 Phòng thủ" },
  { id: "tr_ho_than", name: "Thái Cực Hộ Tâm Kính", type: "equip", slot: "artifact", price: 650, def: 40, tribReduce: 0.12, desc: "+40 Phòng thủ, giảm 12% sát thương Thiên Lôi" },
  { id: "bk_cuu_thien", name: "Cửu Thiên Tâm Kinh", type: "equip", slot: "manual", price: 900, cultPct: 0.35, hp: 200, desc: "+35% Tốc độ tu luyện, +200 Sinh lực" }
];

const AUCTION_POOL = [
  { id: "auc_1", name: "Thánh Kiếm Thái Hư", type: "equip", slot: "weapon", atk: 195, crit: 0.14, drain: 0.08, reserve: 700, market: 1350, desc: "Thần binh thượng cổ: +195 Công, +14% Bạo kích, +8% Hút máu" },
  { id: "auc_2", name: "Huyền Băng Tiên Giáp", type: "equip", slot: "armor", hp: 950, def: 90, tribReduce: 0.10, reserve: 650, market: 1200, desc: "+950 Sinh lực, +90 Phòng thủ, -10% Sát thương Thiên Lôi" },
  { id: "auc_3", name: "Cửu Chuyển Hoàn Hồn Đan", type: "consumable", effect: "lifespan", reserve: 500, market: 1000, desc: "Tăng ngay +60 năm Thọ Nguyên & thanh trừ 40% Tâm Ma" },
  { id: "auc_4", name: "Hỗn Độn Đạo Điển", type: "equip", slot: "manual", cultPct: 0.65, atk: 65, desc: "+65% Tốc độ tu luyện, +65 Công kích", reserve: 850, market: 1650 },
  { id: "auc_5", name: "Lôi Đình Trấn Hồn Chung", type: "equip", slot: "artifact", def: 110, tribReduce: 0.22, desc: "+110 Phòng thủ, giảm 22% sát thương Thiên Lôi", reserve: 780, market: 1500 }
];

const PET_TEMPLATES = [
  { id: "thanh_loan", name: "Thanh Loan", element: "Mộc", icon: "🦚", cost: 400, bonusDesc: "Tăng tốc độ Tu Luyện", cultPerLv: 0.06, atkPerLv: 8 },
  { id: "huyen_quy", name: "Huyền Vũ Linh Quy", element: "Thổ", icon: "🐢", cost: 450, bonusDesc: "Giảm sát thương Thiên Lôi & tăng Phòng thủ", tribPerLv: 0.025, defPerLv: 10 },
  { id: "hoa_ky_lan", name: "Hỏa Kỳ Lân", element: "Hỏa", icon: "🦁", cost: 600, bonusDesc: "Tăng mạnh Công kích & Bạo kích", atkPerLv: 18, critPerLv: 0.015 },
  { id: "u_minh_ho", name: "Cửu Vĩ U Minh Hồ", element: "Thủy", icon: "🦊", cost: 550, bonusDesc: "Tăng Khí Vận & Tỷ lệ Thâu Đạo", stealPerLv: 0.03, luckPerLv: 5 }
];

const INITIAL_NPCS = [
  {
    id: "npc_1", name: "Tô Thanh Liên", title: "Ngọc Thanh Thánh Nữ", palette: "NgocThanh",
    realmIdx: 2, level: 4, x: 0.24, y: 0.30, favor: 25, hostile: false,
    skill: { id: "sk_ngoc_dich", name: "Bích Hải Triều Sinh Khúc", cultPct: 0.22, desc: "+22% Tu luyện, giảm nhẹ Tâm Ma" },
    loot: { id: "loot_sao", name: "Ngọc Thanh Linh Bội", type: "equip", slot: "artifact", def: 32, tribReduce: 0.08, desc: "+32 Phòng thủ, -8% Sát thương Thiên Lôi" }
  },
  {
    id: "npc_2", name: "Huyết Sát Ma Quân", title: "Huyết Ma Trưởng Lão", palette: "HuyetMa",
    realmIdx: 3, level: 2, x: 0.78, y: 0.28, favor: 0, hostile: false,
    skill: { id: "sk_huyet_kiem", name: "Huyết Hải Ma Công", atkPct: 0.25, drain: 0.07, desc: "+25% Công kích, +7% Hút máu" },
    loot: { id: "loot_huyet", name: "Huyết Hồn Ma Đao", type: "equip", slot: "weapon", atk: 92, drain: 0.07, desc: "+92 Công kích, +7% Hút máu" }
  },
  {
    id: "npc_3", name: "Kim Vạn Tài", title: "Kim Tiên Các Chủ", palette: "KimTien",
    realmIdx: 2, level: 6, x: 0.76, y: 0.68, favor: 15, hostile: false,
    skill: { id: "sk_kim_quang", name: "Kim Quang Tụ Linh Quyết", cultPct: 0.18, stonePct: 0.25, desc: "+18% Tu luyện, +25% Linh thạch" },
    loot: { id: "loot_kim", name: "Kim Tiền Tụ Bảo Bồn", type: "equip", slot: "artifact", def: 26, luck: 25, desc: "+26 Phòng thủ, +25 Khí vận" }
  },
  {
    id: "npc_4", name: "Mặc U Dạ", title: "U Minh Điện Sứ", palette: "UMinh",
    realmIdx: 3, level: 5, x: 0.22, y: 0.70, favor: 10, hostile: false,
    skill: { id: "sk_u_minh", name: "U Minh Quỷ Ảnh Bộ", dodge: 0.12, crit: 0.08, desc: "+12% Né tránh, +8% Bạo kích" },
    loot: { id: "loot_uminh", name: "U Minh Huyền Bào", type: "equip", slot: "armor", hp: 520, def: 48, desc: "+520 Sinh lực, +48 Phòng thủ" }
  },
  {
    id: "npc_5", name: "Lục Trường Phong", title: "Kiếm Tông Truyền Nhân", palette: "NgocThanh",
    realmIdx: 1, level: 5, x: 0.50, y: 0.22, favor: 30, hostile: false,
    skill: { id: "sk_thanh_phong", name: "Thanh Phong Kiếm Pháp", atkPct: 0.15, crit: 0.06, desc: "+15% Công kích, +6% Bạo kích" },
    loot: { id: "loot_kiem", name: "Thanh Phong Linh Kiếm", type: "equip", slot: "weapon", atk: 54, crit: 0.05, desc: "+54 Công kích, +5% Bạo kích" }
  },
  {
    id: "npc_6", name: "Bạch Lăng Sương", title: "Dược Vương Cốc Chủ", palette: "KimTien",
    realmIdx: 2, level: 2, x: 0.52, y: 0.76, favor: 20, hostile: false,
    skill: { id: "sk_dan_tam", name: "Thiên Hương Dược Điển", hpPct: 0.22, desc: "+22% Sinh lực tối đa" },
    loot: { id: "loot_dan", name: "Tụ Linh Bảo Lô", type: "equip", slot: "artifact", def: 35, tribReduce: 0.10, desc: "+35 Phòng thủ, -10% Thiên Lôi" }
  }
];

const GIFTCODES = {
  "CUUTHIENTRUYENKY": { stones: 888, merit: 300, item: "chest_thienco", msg: "Nhận 888 Linh Thạch, 300 Công Đức & 1 Rương Thiên Cơ!" },
  "TIENHIEP999": { stones: 999, merit: 200, item: "pill_exp", msg: "Nhận 999 Linh Thạch, 200 Công Đức & 1 Tụ Linh Đan!" },
  "LINHTHACH888": { stones: 1200, merit: 0, item: "pill_hp", msg: "Nhận 1200 Linh Thạch & 1 Hồi Nguyên Đan!" }
};

const Game = {
  meta: {
    merit: 1000,
    unlockedTraits: INNATE_TRAITS.filter(t => t.unlockedDefault).map(t => t.id),
    legacyItem: null,
    livesCount: 0,
    redeemedCodes: []
  },
  state: null,
  setupSelectedTraits: ["kiem_tam", "dan_dong", "khi_van"],
  canvas: null,
  ctx: null,
  worldW: 800,
  worldH: 600,
  playerPos: { x: 400, y: 300 },
  joyVec: { x: 0, y: 0 },
  keys: {},
  orbs: [],
  weatherParticles: [],
  popups: [],
  lightningFX: { active: false, flash: 0, shake: 0, bolts: [] },
  tribulation: { active: false, bolt: 0, shieldActive: false, timer: null },
  auctionState: null,
  lastFrame: 0,
  meditateTick: 0,
  autoSaveTick: 0,
  currentModal: null,
  avatarImg: new Image(),

  init() {
    this.avatarImg.src = "assets/avatar.png";
    this.loadMeta();
    this.updateTitleScreen();
    this.initCanvas();
    this.initJoystick();
    this.initKeyboard();
    requestAnimationFrame((t) => this.loop(t));
  },

  loadMeta() {
    try {
      const raw = localStorage.getItem(META_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        this.meta = Object.assign(this.meta, parsed);
      }
    } catch (e) {}
  },

  saveMeta() {
    try { localStorage.setItem(META_KEY, JSON.stringify(this.meta)); } catch (e) {}
  },

  saveGame() {
    if (!this.state) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      this.saveMeta();
    } catch (e) {}
  },

  loadSavedGame() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  },

  updateTitleScreen() {
    document.getElementById("title-merit").textContent = this.meta.merit;
    const saved = this.loadSavedGame();
    const box = document.getElementById("continue-box");
    if (saved && saved.alive) {
      box.classList.remove("hidden");
      const r = REALMS[saved.realmIdx] || REALMS[0];
      document.getElementById("continue-summary").textContent =
        `${saved.name} • ${r.name} Tầng ${saved.subLevel} • ${Math.floor(saved.age)}/${saved.maxLifespan} tuổi`;
    } else {
      box.classList.add("hidden");
    }
  },

  showScreen(id) {
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    document.getElementById(id).classList.add("active");
    if (id === "game-screen") {
      this.resizeCanvas();
      this.updateHUD();
    } else if (id === "title-screen") {
      this.updateTitleScreen();
    }
  },

  continueSavedGame() {
    const saved = this.loadSavedGame();
    if (!saved || !saved.alive) return;
    this.state = saved;
    this.showScreen("game-screen");
    this.log(`Chào mừng đạo hữu ${this.state.name} trở lại Cửu Thiên Thánh Địa!`);
  },

  openNewLifeSetup() {
    this.renderSetupTraits();
    this.showScreen("setup-screen");
  },

  renderSetupTraits() {
    const grid = document.getElementById("setup-traits-grid");
    grid.innerHTML = "";
    INNATE_TRAITS.forEach(tr => {
      const unlocked = this.meta.unlockedTraits.includes(tr.id);
      const selected = this.setupSelectedTraits.includes(tr.id);
      const div = document.createElement("div");
      div.className = `trait-card ${selected ? "selected" : ""} ${!unlocked ? "locked" : ""}`;
      div.innerHTML = `
        <div class="trait-title">
          <span>${tr.name}</span>
          <span class="badge-jade">${tr.tag}</span>
        </div>
        <div class="trait-desc">${unlocked ? tr.desc : `🔒 Mở khóa tại Cửa Hàng Luân Hồi (${tr.cost} Công Đức)`}</div>
      `;
      if (unlocked) {
        div.onclick = () => {
          const idx = this.setupSelectedTraits.indexOf(tr.id);
          if (idx >= 0) this.setupSelectedTraits.splice(idx, 1);
          else if (this.setupSelectedTraits.length < 3) this.setupSelectedTraits.push(tr.id);
          this.renderSetupTraits();
        };
      }
      grid.appendChild(div);
    });
    document.getElementById("selected-trait-count").textContent = this.setupSelectedTraits.length;
    const syn = this.computeTraitSynergy(this.setupSelectedTraits);
    document.getElementById("setup-synergy-preview").textContent = `Cộng hưởng: ${syn.label}`;
  },

  computeTraitSynergy(traitIds) {
    const counts = {};
    traitIds.forEach(id => {
      const t = INNATE_TRAITS.find(x => x.id === id);
      if (t) counts[t.tag] = (counts[t.tag] || 0) + 1;
    });
    let bestTag = null, bestCount = 0;
    Object.entries(counts).forEach(([k, v]) => {
      if (v > bestCount) { bestTag = k; bestCount = v; }
    });
    if (bestCount >= 3) return { bonus: 0.50, label: `Đại Cộng Hưởng ${bestTag} (+50% Tu Vi)` };
    if (bestCount === 2) return { bonus: 0.20, label: `Cộng Hưởng ${bestTag} (+20% Tu Vi)` };
    return { bonus: 0, label: "Chưa kích hoạt (chọn 2-3 cùng hệ)" };
  },

  startNewLife() {
    const name = document.getElementById("input-player-name").value.trim() || "Lâm Thanh Huyên";
    const element = document.getElementById("select-element").value;
    const palette = document.getElementById("select-palette").value;

    const traitObjs = this.setupSelectedTraits.map(id => INNATE_TRAITS.find(t => t.id === id)).filter(Boolean);
    let startStones = 500;
    let extraLifespan = element === "Mộc" ? 25 : 0;
    traitObjs.forEach(t => {
      if (t.startStones) startStones += t.startStones;
      if (t.lifespan) extraLifespan += t.lifespan;
    });

    const startInv = [
      { id: "pill_hp", qty: 3 },
      { id: "pill_calm", qty: 2 },
      { id: "chest_thienco", qty: 1 }
    ];

    const equipment = { weapon: null, armor: null, artifact: null, manual: null };
    if (this.meta.legacyItem) {
      equipment[this.meta.legacyItem.slot] = JSON.parse(JSON.stringify(this.meta.legacyItem));
    }

    this.state = {
      name,
      element,
      palette,
      alive: true,
      meditating: false,
      realmIdx: 0,
      subLevel: 1,
      exp: 0,
      reqExp: 100,
      age: 16,
      maxLifespan: 120 + extraLifespan,
      hp: 500,
      maxHp: 500,
      stones: startStones,
      heartDemon: 5,
      reputation: 50,
      arrayLevel: 1, // Trận Pháp Hộ Thân
      traits: [...this.setupSelectedTraits],
      skills: [],
      inventory: startInv,
      equipment,
      pets: [],
      activePetId: null,
      npcs: JSON.parse(JSON.stringify(INITIAL_NPCS)),
      tournamentHistory: [],
      wins: 0,
      settings: { weather: true, dmgPopup: true, weatherType: "rain" }
    };

    this.recalcDerivedStats(true);
    this.meta.livesCount += 1;
    this.saveGame();
    this.showScreen("game-screen");
    this.log(`Kiếp thứ ${this.meta.livesCount}: Đạo hữu ${name} mang ${element} Linh Mạch bắt đầu tiên lộ!` + (this.meta.legacyItem ? ` Mang theo Di Sản: ${this.meta.legacyItem.name}.` : ""));
  },

  getDerivedStats() {
    const s = this.state;
    const r = REALMS[s.realmIdx] || REALMS[0];
    const lvFactor = 1 + (s.subLevel - 1) * 0.14;

    let maxHp = 480 * r.hpScale * lvFactor;
    let atk = 45 * r.atkScale * lvFactor;
    let def = 20 * r.atkScale * lvFactor;
    let crit = 0.08 + (s.element === "Hỏa" ? 0.12 : 0);
    let dodge = 0.05;
    let drain = 0;
    let luck = 15;
    let cultMult = 1 + (s.element === "Thủy" ? 0.15 : 0);
    let stealBonus = 0;
    let tribReduce = Math.min(0.60, 0.08 + s.arrayLevel * 0.06 + (s.element === "Thổ" ? 0.10 : 0));

    if (s.element === "Kim") atk *= 1.15;
    if (s.element === "Thổ") def *= 1.20;

    // Traits + Synergy
    const syn = this.computeTraitSynergy(s.traits);
    cultMult += syn.bonus;
    let petPct = 1;
    s.traits.forEach(id => {
      const t = INNATE_TRAITS.find(x => x.id === id);
      if (!t) return;
      if (t.hpPct) maxHp *= (1 + t.hpPct);
      if (t.atkPct) atk *= (1 + t.atkPct);
      if (t.defPct) def *= (1 + t.defPct);
      if (t.crit) crit += t.crit;
      if (t.dodge) dodge += t.dodge;
      if (t.drain) drain += t.drain;
      if (t.luck) luck += t.luck;
      if (t.cultPct) cultMult += t.cultPct;
      if (t.stealBonus) stealBonus += t.stealBonus;
      if (t.tribReduce) tribReduce += t.tribReduce;
      if (t.petPct) petPct += t.petPct;
    });

    // Learned Skills
    s.skills.forEach(sk => {
      if (sk.atkPct) atk *= (1 + sk.atkPct);
      if (sk.hpPct) maxHp *= (1 + sk.hpPct);
      if (sk.crit) crit += sk.crit;
      if (sk.dodge) dodge += sk.dodge;
      if (sk.drain) drain += sk.drain;
      if (sk.cultPct) cultMult += sk.cultPct;
    });

    // Equipment
    Object.values(s.equipment).forEach(eq => {
      if (!eq) return;
      if (eq.hp) maxHp += eq.hp;
      if (eq.atk) atk += eq.atk;
      if (eq.def) def += eq.def;
      if (eq.crit) crit += eq.crit;
      if (eq.drain) drain += eq.drain;
      if (eq.luck) luck += eq.luck;
      if (eq.cultPct) cultMult += eq.cultPct;
      if (eq.tribReduce) tribReduce += eq.tribReduce;
    });

    // Active Pet
    const pet = s.pets.find(p => p.id === s.activePetId);
    if (pet) {
      const tpl = PET_TEMPLATES.find(t => t.id === pet.id);
      const evoMult = (1 + pet.evo * 0.45) * petPct;
      if (tpl) {
        if (tpl.atkPerLv) atk += tpl.atkPerLv * pet.level * evoMult;
        if (tpl.defPerLv) def += tpl.defPerLv * pet.level * evoMult;
        if (tpl.cultPerLv) cultMult += tpl.cultPerLv * pet.level * evoMult;
        if (tpl.tribPerLv) tribReduce += tpl.tribPerLv * pet.level * evoMult;
        if (tpl.critPerLv) crit += tpl.critPerLv * pet.level * evoMult;
        if (tpl.stealPerLv) stealBonus += tpl.stealPerLv * pet.level * evoMult;
        if (tpl.luckPerLv) luck += tpl.luckPerLv * pet.level * evoMult;
      }
    }

    return {
      maxHp: Math.round(maxHp),
      atk: Math.round(atk),
      def: Math.round(def),
      crit: Math.min(0.75, crit),
      dodge: Math.min(0.55, dodge),
      drain: Math.min(0.35, drain),
      luck: Math.round(luck),
      cultMult,
      stealBonus,
      tribReduce: Math.min(0.75, tribReduce),
      synergyLabel: syn.label
    };
  },

  recalcDerivedStats(fullHeal = false) {
    const d = this.getDerivedStats();
    this.state.maxHp = d.maxHp;
    if (fullHeal || this.state.hp > d.maxHp) this.state.hp = d.maxHp;
  },

  // ==================== CULTIVATION & BREAKTHROUGH ====================
  toggleMeditate() {
    if (!this.state || !this.state.alive || this.tribulation.active) return;
    this.state.meditating = !this.state.meditating;
    const btn = document.getElementById("btn-meditate");
    const lbl = document.getElementById("meditate-label");
    btn.classList.toggle("active", this.state.meditating);
    lbl.textContent = this.state.meditating ? "Đang Tu..." : "Tu Luyện";
    this.log(this.state.meditating ? "Bắt đầu tọa thiền dẫn khí nhập thể, linh khí tứ phương tụ hội..." : "Thu công kết thúc tọa thiền.");
  },

  calmHeartDemon() {
    if (!this.state || !this.state.alive || this.tribulation.active) return;
    if (this.state.heartDemon <= 0) {
      this.log("Đạo tâm đạo hữu đã trong sáng như gương, không còn Tâm Ma.");
      return;
    }
    const cost = 40;
    if (this.state.stones < cost) {
      this.log("Cần 40 Linh Thạch đốt Trầm Hương Thanh Tâm để hóa giải Tâm Ma.");
      return;
    }
    this.state.stones -= cost;
    const reduce = 18;
    this.state.heartDemon = Math.max(0, this.state.heartDemon - reduce);
    this.spawnPopup(this.playerPos.x, this.playerPos.y - 30, `-${reduce}% Tâm Ma`, "#38d9a9");
    this.log("Đốt hương tĩnh tâm, Tâm Ma tiêu tan 18%!");
    this.updateHUD();
  },

  tickCultivation() {
    if (!this.state || !this.state.alive || !this.state.meditating || this.tribulation.active) return;
    const d = this.getDerivedStats();
    const baseGain = 14 * (1 + this.state.realmIdx * 0.8);
    const demonPenalty = 1 - this.state.heartDemon * 0.004;
    const gain = Math.max(4, Math.round(baseGain * d.cultMult * demonPenalty));

    this.state.exp = Math.min(this.state.reqExp, this.state.exp + gain);
    this.state.age += 0.15;
    this.state.hp = Math.min(this.state.maxHp, this.state.hp + Math.round(this.state.maxHp * 0.04));

    // Spawn spirit orb moving to player
    const angle = Math.random() * Math.PI * 2;
    const dist = 90 + Math.random() * 80;
    this.orbs.push({
      x: this.playerPos.x + Math.cos(angle) * dist,
      y: this.playerPos.y + Math.sin(angle) * dist,
      life: 1
    });

    if (this.state.settings.dmgPopup) {
      this.spawnPopup(this.playerPos.x + (Math.random() * 24 - 12), this.playerPos.y - 34, `+${gain} Tu Vi`, "#38d9a9");
    }

    if (this.state.age >= this.state.maxLifespan) {
      this.triggerDeath("Thọ nguyên đã tận, đạo hữu tọa hóa trong lúc bế quan tu luyện.");
      return;
    }

    if (this.state.exp >= this.state.reqExp) {
      this.state.meditating = false;
      document.getElementById("btn-meditate").classList.remove("active");
      document.getElementById("meditate-label").textContent = "Tu Luyện";
      this.log("⚡ Tu vi viên mãn! Hãy nhấn nút [Độ Kiếp] để nghênh chiến Cửu Trọng Thiên Lôi!");
    }
    this.updateHUD();
  },

  startBreakthrough() {
    if (!this.state || this.tribulation.active || this.state.exp < this.state.reqExp) return;
    this.state.meditating = false;
    document.getElementById("btn-meditate").classList.remove("active");
    document.getElementById("meditate-label").textContent = "Tu Luyện";

    this.tribulation = { active: true, bolt: 0, shieldActive: false, timer: null };
    document.getElementById("tribulation-banner").classList.remove("hidden");
    this.updateTribulationBanner();
    this.log("⚡ Mây đen kéo đến! Cửu Trọng Thiên Lôi bắt đầu giáng xuống!");
    this.nextLightningBolt();
  },

  updateTribulationBanner() {
    document.getElementById("trib-bolt").textContent = this.tribulation.bolt;
    const pillItem = this.state.inventory.find(i => i.id === "pill_hp");
    document.getElementById("trib-pill-count").textContent = pillItem ? pillItem.qty : 0;
  },

  useTribulationPill() {
    const idx = this.state.inventory.findIndex(i => i.id === "pill_hp" && i.qty > 0);
    if (idx < 0) { this.log("Đã hết Hồi Nguyên Đan!"); return; }
    this.state.inventory[idx].qty--;
    if (this.state.inventory[idx].qty <= 0) this.state.inventory.splice(idx, 1);
    const hasDan = this.state.traits.includes("dan_dong") ? 1.25 : 1;
    const heal = Math.round(this.state.maxHp * 0.45 * hasDan);
    this.state.hp = Math.min(this.state.maxHp, this.state.hp + heal);
    this.spawnPopup(this.playerPos.x, this.playerPos.y - 36, `+${heal} HP`, "#51cf66");
    this.updateTribulationBanner();
    this.updateHUD();
  },

  activateTribulationShield() {
    if (this.tribulation.shieldActive) return;
    if (this.state.stones < 60) {
      this.log("Cần 60 Linh Thạch để kích hoạt Hộ Thuẫn Trận Pháp!");
      return;
    }
    this.state.stones -= 60;
    this.tribulation.shieldActive = true;
    this.spawnPopup(this.playerPos.x, this.playerPos.y - 36, "Hộ Thuẫn Kích Hoạt!", "#e9c46a");
    this.log("Hộ Thuẫn Trận Pháp giảm 50% sát thương đạo Thiên Lôi kế tiếp!");
    this.updateHUD();
  },

  nextLightningBolt() {
    if (!this.tribulation.active || !this.state.alive) return;
    this.tribulation.bolt++;
    this.updateTribulationBanner();

    const d = this.getDerivedStats();
    const bolt = this.tribulation.bolt;
    const baseDmg = (this.state.maxHp * 0.13) * (1 + bolt * 0.11);
    const demonFactor = 1 + (this.state.heartDemon / 100) * 0.55;
    let dmg = Math.round(baseDmg * demonFactor * (1 - d.tribReduce));
    if (this.tribulation.shieldActive) {
      dmg = Math.round(dmg * 0.5);
      this.tribulation.shieldActive = false;
    }

    this.state.hp -= dmg;
    this.triggerLightningVisual();
    this.spawnPopup(this.playerPos.x, this.playerPos.y - 40, `⚡ -${dmg}`, "#ff6b6b");
    this.log(`Thiên Lôi đạo ${bolt}/9 giáng xuống! Chịu ${dmg} sát thương.`);
    this.updateHUD();

    if (this.state.hp <= 0) {
      this.finishTribulation(false);
      return;
    }

    if (bolt >= 9) {
      this.tribulation.timer = setTimeout(() => this.finishTribulation(true), 700);
    } else {
      this.tribulation.timer = setTimeout(() => this.nextLightningBolt(), 850);
    }
  },

  finishTribulation(success) {
    this.tribulation.active = false;
    clearTimeout(this.tribulation.timer);
    document.getElementById("tribulation-banner").classList.add("hidden");

    if (success) {
      this.state.subLevel++;
      if (this.state.subLevel > 9 && this.state.realmIdx < REALMS.length - 1) {
        this.state.subLevel = 1;
        this.state.realmIdx++;
        const newR = REALMS[this.state.realmIdx];
        this.state.maxLifespan += newR.lifespanBonus;
        this.meta.merit += 120 * this.state.realmIdx;
        this.log(`🌟 ĐỘ KIẾP ĐẠI THÀNH! Bước vào cảnh giới ${newR.name}! Thọ nguyên +${newR.lifespanBonus} năm!`);
      } else {
        this.log(`✨ Đột phá thành công lên ${REALMS[this.state.realmIdx].name} Tầng ${this.state.subLevel}!`);
      }
      this.state.exp = 0;
      const r = REALMS[this.state.realmIdx];
      this.state.reqExp = Math.round(r.baseExp * Math.pow(1.38, this.state.subLevel - 1));
      this.state.heartDemon = Math.max(0, this.state.heartDemon - 12);
      this.state.stones += 120 * (this.state.realmIdx + 1);
      this.recalcDerivedStats(true);
      this.spawnPopup(this.playerPos.x, this.playerPos.y - 45, "ĐỘT PHÁ THÀNH CÔNG!", "#f3d27a");
    } else {
      const recYears = Math.max(2, Math.round(6 - this.state.arrayLevel * 0.5));
      const expLoss = Math.round(this.state.exp * 0.35);
      this.state.age += recYears;
      this.state.exp = Math.max(0, this.state.exp - expLoss);
      this.state.hp = Math.round(this.state.maxHp * 0.3);
      this.state.heartDemon = Math.min(100, this.state.heartDemon + 14);
      this.log(`💥 Độ kiếp thất bại! Đạo cơ tổn hại, mất ${recYears} năm bế quan dưỡng thương & ${expLoss} Tu Vi.`);
      if (this.state.age >= this.state.maxLifespan) {
        this.triggerDeath("Trọng thương do Thiên Lôi không thể hồi phục, thọ nguyên cạn kiệt!");
      }
    }
    this.saveGame();
    this.updateHUD();
  },

  triggerLightningVisual() {
    this.lightningFX.active = true;
    this.lightningFX.flash = 0.85;
    this.lightningFX.shake = 12;
    const pts = [];
    let cx = this.playerPos.x + (Math.random() * 40 - 20);
    let cy = 0;
    pts.push({ x: cx, y: cy });
    for (let i = 1; i <= 7; i++) {
      cx += (this.playerPos.x - cx) * 0.35 + (Math.random() * 54 - 27);
      cy = (this.playerPos.y / 7) * i;
      pts.push({ x: cx, y: cy });
    }
    this.lightningFX.bolts = [pts];
  },

  // ==================== DEATH & REINCARNATION ====================
  triggerDeath(reason) {
    this.state.alive = false;
    this.state.meditating = false;
    const meritEarned = 150 + this.state.realmIdx * 220 + this.state.subLevel * 25 + this.state.wins * 40 + Math.floor(this.state.stones / 25);
    this.meta.merit += meritEarned;

    // Pick strongest equipped item as Legacy Heirloom for next life
    const eqList = Object.values(this.state.equipment).filter(Boolean);
    if (eqList.length > 0) {
      eqList.sort((a, b) => ((b.atk || 0) + (b.def || 0) + (b.hp || 0) / 5) - ((a.atk || 0) + (a.def || 0) + (a.hp || 0) / 5));
      this.meta.legacyItem = eqList[0];
    }

    this.saveGame();
    document.getElementById("death-reason").textContent = reason;
    document.getElementById("death-summary").innerHTML = `
      <div>• Cảnh giới tối cao: <strong>${REALMS[this.state.realmIdx].name} Tầng ${this.state.subLevel}</strong></div>
      <div>• Hưởng thọ: <strong>${Math.floor(this.state.age)} năm</strong></div>
      <div>• Công Đức thu hoạch: <strong style="color:#e9c46a">+${meritEarned} Công Đức</strong> (Tổng: ${this.meta.merit})</div>
      <div>• Di Sản Kiếp Trước giữ lại: <strong style="color:#38d9a9">${this.meta.legacyItem ? this.meta.legacyItem.name : "Chưa có"}</strong></div>
    `;
    document.getElementById("death-overlay").classList.remove("hidden");
  },

  enterReincarnation() {
    document.getElementById("death-overlay").classList.add("hidden");
    this.openNewLifeSetup();
  },

  // ==================== NPC INTERACTION (GIVE / STEAL / LEARN / COMBAT) ====================
  openNpcDetail(npcId) {
    const npc = this.state.npcs.find(n => n.id === npcId);
    if (!npc) return;
    const pal = PALETTES[npc.palette];
    const r = REALMS[npc.realmIdx];
    const learned = this.state.skills.some(s => s.id === npc.skill.id);

    this.showModal(`${npc.name} — ${npc.title}`, `
      <div class="panel-card">
        <div class="row-between">
          <div>
            <span class="npc-swatch" style="background:${pal.trim}"></span>
            <strong>${pal.label}</strong> • <span class="badge-gold">${r.name} Tầng ${npc.level}</span>
          </div>
          <span class="${npc.hostile ? "badge-crimson" : "badge-jade"}">${npc.hostile ? "Địch Ý (Truy Nã)" : `Hảo Cảm: ${npc.favor}/100`}</span>
        </div>
        <p style="font-size:12px;color:#93b5b3;margin-top:8px;">Bí kíp truyền thừa: <strong>${npc.skill.name}</strong> (${npc.skill.desc})</p>
        <p style="font-size:12px;color:#93b5b3;margin-top:4px;">Bảo vật mang theo: <strong>${npc.loot ? npc.loot.name : "Đã bị lấy mất"}</strong></p>
      </div>

      <div class="btn-group">
        <button class="btn btn-jade" onclick="Game.npcGiveGift('${npc.id}')">🎁 Tặng Linh Thạch (+15 Hảo Cảm • Tốn 100 💎)</button>
        <button class="btn btn-gold" ${learned ? "disabled" : ""} onclick="Game.npcLearnSkill('${npc.id}')">📜 ${learned ? "Đã Lĩnh Ngộ Bí Kíp" : "Thỉnh Giáo Bí Kíp (Cần ≥ 60 Hảo Cảm)"}</button>
        <button class="btn btn-outline" onclick="Game.npcSteal('${npc.id}')">🥷 Thâu Đạo / Trộm Bảo Vật (Có rủi ro Nhân Quả)</button>
        <button class="btn btn-crimson" onclick="Game.npcCombat('${npc.id}')">⚔️ Tỷ Thí Thực Chiến</button>
      </div>
    `);
  },

  npcGiveGift(npcId) {
    const npc = this.state.npcs.find(n => n.id === npcId);
    if (!npc) return;
    if (this.state.stones < 100) { this.log("Không đủ 100 Linh Thạch để tặng quà!"); return; }
    this.state.stones -= 100;
    npc.favor = Math.min(100, npc.favor + 15);
    npc.hostile = false;
    this.log(`Tặng quà cho ${npc.name}, hảo cảm tăng lên ${npc.favor}!`);
    this.updateHUD();
    this.openNpcDetail(npcId);
  },

  npcLearnSkill(npcId) {
    const npc = this.state.npcs.find(n => n.id === npcId);
    if (!npc) return;
    if (npc.favor < 60) { this.log(`${npc.name} chưa đủ tin tưởng (cần ≥ 60 Hảo Cảm)!`); return; }
    if (this.state.skills.some(s => s.id === npc.skill.id)) return;
    this.state.skills.push(JSON.parse(JSON.stringify(npc.skill)));
    this.recalcDerivedStats();
    this.log(`📜 Đã lĩnh ngộ tuyệt kỹ [${npc.skill.name}] từ ${npc.name}!`);
    this.saveGame();
    this.openNpcDetail(npcId);
  },

  npcSteal(npcId) {
    const npc = this.state.npcs.find(n => n.id === npcId);
    if (!npc) return;
    const d = this.getDerivedStats();
    const realmDiff = (this.state.realmIdx - npc.realmIdx) * 0.15;
    const chance = Math.max(0.15, Math.min(0.88, 0.42 + realmDiff + d.stealBonus + d.luck * 0.004));

    if (Math.random() < chance) {
      if (npc.loot) {
        this.addItemToInventory(npc.loot);
        this.log(`🥷 Thâu Đạo thành công! Đoạt được [${npc.loot.name}] từ ${npc.name}!`);
        npc.loot = null;
      } else {
        const stolen = 150 + npc.realmIdx * 90;
        this.state.stones += stolen;
        this.log(`🥷 Thâu Đạo thành công! Lấy được ${stolen} Linh Thạch từ ${npc.name}.`);
      }
      this.state.heartDemon = Math.min(100, this.state.heartDemon + 4);
    } else {
      npc.favor = Math.max(0, npc.favor - 30);
      npc.hostile = true;
      this.state.reputation = Math.max(0, this.state.reputation - 15);
      this.state.heartDemon = Math.min(100, this.state.heartDemon + 10);
      const dmg = Math.round(this.state.maxHp * 0.18);
      this.state.hp = Math.max(1, this.state.hp - dmg);
      this.spawnPopup(this.playerPos.x, this.playerPos.y - 35, `Bị phát hiện! -${dmg}`, "#e05263");
      this.log(`⚠️ Thâu Đạo thất bại! ${npc.name} nổi giận phản kích (-${dmg} HP, +10% Tâm Ma)!`);
    }
    this.updateHUD();
    this.saveGame();
    this.openNpcDetail(npcId);
  },

  npcCombat(npcId) {
    const npc = this.state.npcs.find(n => n.id === npcId);
    if (!npc) return;
    const res = this.runBattleSimulation(npc.name, npc.realmIdx, npc.level);
    if (res.win) {
      const reward = 180 + npc.realmIdx * 160;
      const expGain = 85 + npc.realmIdx * 120;
      this.state.stones += reward;
      this.state.exp = Math.min(this.state.reqExp, this.state.exp + expGain);
      this.state.wins++;
      this.log(`⚔️ Chiến thắng ${npc.name}! Thu hoạch ${reward} Linh Thạch & ${expGain} Tu Vi!`);
    } else {
      this.state.hp = Math.max(1, Math.round(this.state.maxHp * 0.25));
      this.log(`💥 Thất bại trước ${npc.name}, cần tu luyện và trang bị thêm!`);
    }
    this.updateHUD();
    this.saveGame();
    this.showModal(`Chiến Báo: Đấu với ${npc.name}`, `
      <div class="panel-card" style="line-height:1.55;font-size:12px;">
        ${res.logs.map(l => `<div>${l}</div>`).join("")}
      </div>
      <button class="btn btn-jade" onclick="Game.openNpcDetail('${npc.id}')">Quay Lại</button>
    `);
  },

  runBattleSimulation(enemyName, enemyRealmIdx, enemyLv) {
    const d = this.getDerivedStats();
    const r = REALMS[enemyRealmIdx] || REALMS[0];
    let pHp = this.state.hp;
    let eHp = Math.round(460 * r.hpScale * (1 + enemyLv * 0.12));
    const eAtk = Math.round(44 * r.atkScale * (1 + enemyLv * 0.12));
    const eDef = Math.round(18 * r.atkScale);
    const logs = [];

    for (let turn = 1; turn <= 12 && pHp > 0 && eHp > 0; turn++) {
      // Player attack
      let pDmg = Math.max(10, Math.round((d.atk - eDef * 0.45) * (0.9 + Math.random() * 0.2)));
      let tag = "";
      if (Math.random() < d.crit) { pDmg = Math.round(pDmg * 1.75); tag = " [BẠO KÍCH]"; }
      eHp -= pDmg;
      if (d.drain > 0) {
        const heal = Math.round(pDmg * d.drain);
        pHp = Math.min(this.state.maxHp, pHp + heal);
      }
      logs.push(`Hiệp ${turn}: Bạn gây <strong style="color:#38d9a9">${pDmg}</strong> sát thương${tag} (Địch còn ${Math.max(0, eHp)} HP).`);
      if (eHp <= 0) break;

      // Enemy attack
      if (Math.random() < d.dodge) {
        logs.push(`Hiệp ${turn}: Bạn thi triển thân pháp <strong style="color:#e9c46a">NÉ TRÁNH</strong> đòn của ${enemyName}!`);
      } else {
        const eDmg = Math.max(8, Math.round((eAtk - d.def * 0.45) * (0.9 + Math.random() * 0.2)));
        pHp -= eDmg;
        logs.push(`Hiệp ${turn}: ${enemyName} đánh trúng <strong style="color:#e05263">-${eDmg} HP</strong>.`);
      }
    }

    const win = eHp <= 0 || pHp >= eHp;
    this.state.hp = Math.max(1, pHp);
    if (this.state.settings.dmgPopup) {
      this.spawnPopup(this.playerPos.x, this.playerPos.y - 40, win ? "CHIẾN THẮNG!" : "THẤT BẠI", win ? "#e9c46a" : "#e05263");
    }
    return { win, logs };
  },

  // ==================== MODALS ====================
  showModal(title, html) {
    document.getElementById("modal-title").textContent = title;
    document.getElementById("modal-body").innerHTML = html;
    document.getElementById("modal-overlay").classList.remove("hidden");
  },

  closeModal() {
    this.currentModal = null;
    document.getElementById("modal-overlay").classList.add("hidden");
  },

  closeModalOnBackdrop(e) {
    if (e.target.id === "modal-overlay") this.closeModal();
  },

  openModal(tab) {
    this.currentModal = tab;
    if (tab === "character") this.renderCharacterModal();
    else if (tab === "inventory") this.renderInventoryModal();
    else if (tab === "npcs") this.renderNpcListModal();
    else if (tab === "auction") this.renderAuctionModal();
    else if (tab === "pets") this.renderPetsModal();
    else if (tab === "tournament") this.renderTournamentModal();
    else if (tab === "shop") this.renderShopModal();
    else if (tab === "settings") this.renderSettingsModal();
  },

  renderCharacterModal() {
    const s = this.state;
    const d = this.getDerivedStats();
    const arrayCost = 220 * s.arrayLevel;
    const traitsHtml = s.traits.map(id => {
      const t = INNATE_TRAITS.find(x => x.id === id);
      return t ? `<span class="badge-gold">${t.name} (${t.tag})</span>` : "";
    }).join(" ");

    const eqSlots = [
      ["weapon", "Vũ Khí"], ["armor", "Y Phục"], ["artifact", "Pháp Bảo"], ["manual", "Tâm Pháp"]
    ].map(([k, lbl]) => `
      <div class="panel-card row-between">
        <div><strong>${lbl}:</strong> ${s.equipment[k] ? `<span style="color:#38d9a9">${s.equipment[k].name}</span>` : "<span style='color:#6b8685'>Trống</span>"}</div>
        ${s.equipment[k] ? `<button class="btn btn-sm btn-ghost" onclick="Game.unequipItem('${k}')">Tháo</button>` : ""}
      </div>
    `).join("");

    const palBtns = Object.entries(PALETTES).map(([k, p]) => `
      <button class="btn btn-sm ${s.palette === k ? "btn-gold" : "btn-outline"}" onclick="Game.changePlayerPalette('${k}')">${p.label}</button>
    `).join(" ");

    this.showModal("Thông Tin Tu Sĩ & Dịch Dung", `
      <div class="panel-card">
        <div class="row-between" style="margin-bottom:8px;">
          <strong>${s.name}</strong>
          <span class="badge-jade">${s.element} Linh Mạch</span>
        </div>
        <div class="stat-grid-2">
          <div>⚔️ Công Kích: <strong>${d.atk}</strong></div>
          <div>🛡️ Phòng Thủ: <strong>${d.def}</strong></div>
          <div>💥 Bạo Kích: <strong>${Math.round(d.crit * 100)}%</strong></div>
          <div>💨 Né Tránh: <strong>${Math.round(d.dodge * 100)}%</strong></div>
          <div>🩸 Hút Máu: <strong>${Math.round(d.drain * 100)}%</strong></div>
          <div>🍀 Khí Vận: <strong>${d.luck}</strong></div>
          <div>⚡ Giảm Thiên Lôi: <strong>${Math.round(d.tribReduce * 100)}%</strong></div>
          <div>📈 Hệ số Tu Vi: <strong>x${d.cultMult.toFixed(2)}</strong></div>
        </div>
      </div>

      <div class="panel-card">
        <div style="margin-bottom:6px;"><strong>Thiên Phú & Cộng Hưởng:</strong> <span class="badge-jade">${d.synergyLabel}</span></div>
        <div style="display:flex;flex-wrap:wrap;gap:6px;">${traitsHtml}</div>
      </div>

      <div class="panel-card row-between">
        <div>
          <strong>Trận Pháp Hộ Thân (Cấp ${s.arrayLevel})</strong>
          <div style="font-size:11px;color:#93b5b3;">Giảm sát thương Thiên Lôi +6% mỗi cấp</div>
        </div>
        <button class="btn btn-sm btn-jade" onclick="Game.upgradeArray()">Nâng Cấp (${arrayCost} 💎)</button>
      </div>

      <div class="panel-card">
        <div style="margin-bottom:6px;"><strong>Dịch Dung — Đổi Màu Y Phục:</strong></div>
        <div style="display:flex;flex-wrap:wrap;gap:6px;">${palBtns}</div>
      </div>

      ${eqSlots}

      <button class="btn btn-crimson" onclick="Game.confirmVoluntaryReborn()">Chuyển Thế Luân Hồi (Tự Giải Binh Giải)</button>
    `);
  },

  changePlayerPalette(key) {
    this.state.palette = key;
    this.log(`Đã đổi y phục sang tông màu ${PALETTES[key].label}!`);
    this.saveGame();
    this.renderCharacterModal();
  },

  upgradeArray() {
    const cost = 220 * this.state.arrayLevel;
    if (this.state.stones < cost) { this.log(`Cần ${cost} Linh Thạch để nâng cấp Trận Pháp!`); return; }
    this.state.stones -= cost;
    this.state.arrayLevel++;
    this.log(`✨ Trận Pháp Hộ Thân đạt cấp ${this.state.arrayLevel}!`);
    this.updateHUD();
    this.renderCharacterModal();
  },

  confirmVoluntaryReborn() {
    this.closeModal();
    this.triggerDeath("Đạo hữu chủ động binh giải chuyển thế, mang theo Công Đức bước sang kiếp mới!");
  },

  // ==================== INVENTORY & CHEST ====================
  addItemToInventory(itemObj) {
    if (itemObj.type === "consumable" || itemObj.type === "chest") {
      const existing = this.state.inventory.find(i => i.id === itemObj.id);
      if (existing) existing.qty++;
      else this.state.inventory.push({ id: itemObj.id, qty: 1 });
    } else {
      this.state.inventory.push(Object.assign({ uid: "eq_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6), qty: 1 }, itemObj));
    }
  },

  renderInventoryModal() {
    const items = this.state.inventory;
    if (!items.length) {
      this.showModal("Túi Càn Khôn", `<div class="panel-card">Túi đồ hiện đang trống. Hãy ghé Bảo Các hoặc mở Đấu Giá Hội!</div>`);
      return;
    }

    const html = items.map((entry, idx) => {
      const tpl = SHOP_CATALOG.find(c => c.id === entry.id) || entry;
      const isEquip = tpl.type === "equip";
      const isChest = tpl.type === "chest";
      const actionLbl = isEquip ? "Trang Bị" : (isChest ? "Mở Rương (5 vật phẩm)" : "Sử Dụng");
      return `
        <div class="panel-card row-between">
          <div style="flex:1;min-width:160px;">
            <strong>${tpl.name}</strong> ${entry.qty > 1 ? `<span class="badge-gold">x${entry.qty}</span>` : ""}
            <div style="font-size:11px;color:#93b5b3;">${tpl.desc || ""}</div>
          </div>
          <button class="btn btn-sm ${isEquip ? "btn-gold" : "btn-jade"}" onclick="Game.useInventoryItem(${idx})">${actionLbl}</button>
        </div>
      `;
    }).join("");

    this.showModal("Túi Càn Khôn", html);
  },

  useInventoryItem(idx) {
    const entry = this.state.inventory[idx];
    if (!entry) return;
    const tpl = SHOP_CATALOG.find(c => c.id === entry.id) || entry;

    if (tpl.type === "equip") {
      const prev = this.state.equipment[tpl.slot];
      this.state.equipment[tpl.slot] = JSON.parse(JSON.stringify(tpl));
      this.state.inventory.splice(idx, 1);
      if (prev) this.state.inventory.push(prev);
      this.recalcDerivedStats();
      this.log(`Đã trang bị [${tpl.name}]!`);
    } else if (tpl.type === "chest") {
      entry.qty--;
      if (entry.qty <= 0) this.state.inventory.splice(idx, 1);
      this.openTreasureChest();
      return;
    } else {
      entry.qty--;
      if (entry.qty <= 0) this.state.inventory.splice(idx, 1);
      if (tpl.effect === "heal") {
        const bonus = this.state.traits.includes("dan_dong") ? 1.25 : 1;
        const h = Math.round(this.state.maxHp * 0.45 * bonus);
        this.state.hp = Math.min(this.state.maxHp, this.state.hp + h);
        this.log(`Uống ${tpl.name}, hồi phục ${h} Sinh lực!`);
      } else if (tpl.effect === "calm") {
        this.state.heartDemon = Math.max(0, this.state.heartDemon - 25);
        this.log(`Uống ${tpl.name}, giảm 25% Tâm Ma!`);
      } else if (tpl.effect === "exp") {
        this.state.exp = Math.min(this.state.reqExp, this.state.exp + 180);
        this.log(`Luyện hóa ${tpl.name}, tăng +180 Tu Vi!`);
      } else if (tpl.effect === "lifespan") {
        this.state.maxLifespan += 60;
        this.state.heartDemon = Math.max(0, this.state.heartDemon - 40);
        this.log(`🌟 Phục dụng Cửu Chuyển Hoàn Hồn Đan! +60 năm Thọ Nguyên!`);
      } else if (tpl.effect === "petfood") {
        if (this.state.activePetId) {
          const p = this.state.pets.find(x => x.id === this.state.activePetId);
          if (p) { p.level++; this.recalcDerivedStats(); this.log(`🐉 Cho ${p.name} ăn Linh Thú Quả, tăng lên Cấp ${p.level}!`); }
        } else {
          this.log("Chưa có Linh Thú xuất chiến, hoàn trả Linh Thú Quả.");
          this.addItemToInventory(tpl);
        }
      }
    }
    this.updateHUD();
    this.saveGame();
    this.renderInventoryModal();
  },

  openTreasureChest() {
    const rewards = [];
    for (let i = 0; i < 5; i++) {
      const roll = Math.random();
      if (roll < 0.35) {
        const st = 100 + Math.floor(Math.random() * 180);
        this.state.stones += st;
        rewards.push(`💎 ${st} Linh Thạch`);
      } else if (roll < 0.78) {
        const cons = SHOP_CATALOG.filter(c => c.type === "consumable");
        const pick = cons[Math.floor(Math.random() * cons.length)];
        this.addItemToInventory(pick);
        rewards.push(`🧪 ${pick.name}`);
      } else {
        const eqs = SHOP_CATALOG.filter(c => c.type === "equip");
        const pick = eqs[Math.floor(Math.random() * eqs.length)];
        this.addItemToInventory(pick);
        rewards.push(`✨ ${pick.name} (Hiếm)`);
      }
    }
    this.updateHUD();
    this.saveGame();
    this.showModal("Mở Rương Thiên Cơ (5 Vật Phẩm)", `
      <div class="panel-card" style="line-height:1.8;">
        ${rewards.map(r => `<div>• <strong>${r}</strong></div>`).join("")}
      </div>
      <button class="btn btn-jade" onclick="Game.renderInventoryModal()">Quay Về Túi Đồ</button>
    `);
  },

  unequipItem(slot) {
    const eq = this.state.equipment[slot];
    if (!eq) return;
    this.state.equipment[slot] = null;
    this.state.inventory.push(eq);
    this.recalcDerivedStats();
    this.saveGame();
    this.renderCharacterModal();
  },

  // ==================== NPC LIST ====================
  renderNpcListModal() {
    const html = this.state.npcs.map(npc => {
      const pal = PALETTES[npc.palette];
      const r = REALMS[npc.realmIdx];
      return `
        <div class="panel-card row-between">
          <div>
            <div><span class="npc-swatch" style="background:${pal.trim}"></span><strong>${npc.name}</strong> <span class="badge-gold">${r.name}</span></div>
            <div style="font-size:11px;color:#93b5b3;">${npc.title} • ${pal.label} • Hảo cảm: ${npc.favor}</div>
          </div>
          <button class="btn btn-sm btn-jade" onclick="Game.openNpcDetail('${npc.id}')">Tương Tác</button>
        </div>
      `;
    }).join("");
    this.showModal("Danh Sách Cao Thủ & NPC (Đổi Màu Tông Phái)", html);
  },

  // ==================== AUCTION HOUSE (AI BIDDERS) ====================
  renderAuctionModal() {
    if (!this.auctionState) {
      const item = AUCTION_POOL[Math.floor(Math.random() * AUCTION_POOL.length)];
      this.auctionState = {
        item,
        bid: item.reserve,
        highest: "Giá Khởi Điểm",
        round: 1,
        maxRounds: 4,
        ended: false
      };
    }
    const a = this.auctionState;
    const inc1 = Math.max(50, Math.round(a.bid * 0.1));
    const inc2 = Math.max(120, Math.round(a.bid * 0.25));

    this.showModal("⚖️ Đấu Giá Hội Cửu Thiên", `
      <div class="panel-card">
        <div class="row-between">
          <strong style="color:#e9c46a;font-size:15px;">${a.item.name}</strong>
          <span class="badge-jade">Hiệp ${a.round}/${a.maxRounds}</span>
        </div>
        <p style="font-size:12px;color:#93b5b3;margin:6px 0;">${a.item.desc}</p>
        <div class="stat-grid-2" style="margin-top:8px;">
          <div>Giá hiện tại: <strong style="color:#e9c46a">${a.bid} 💎</strong></div>
          <div>Người dẫn đầu: <strong>${a.highest}</strong></div>
        </div>
      </div>

      ${!a.ended ? `
        <div class="btn-group">
          <button class="btn btn-jade" onclick="Game.placeAuctionBid(${inc1})">Trả Giá Nhanh (+${inc1} 💎 → ${a.bid + inc1} 💎)</button>
          <button class="btn btn-gold" onclick="Game.placeAuctionBid(${inc2})">Áp Đảo (+${inc2} 💎 → ${a.bid + inc2} 💎)</button>
          <button class="btn btn-outline" onclick="Game.skipAuctionItem()">Bỏ Qua Vật Phẩm Này</button>
        </div>
      ` : `
        <button class="btn btn-gold" onclick="Game.nextAuctionItem()">Mở Phiên Đấu Giá Mới</button>
      `}
    `);
  },

  placeAuctionBid(inc) {
    const a = this.auctionState;
    if (!a || a.ended) return;
    const nextBid = a.bid + inc;
    if (this.state.stones < nextBid) { this.log("Không đủ Linh Thạch để trả giá!"); return; }

    a.bid = nextBid;
    a.highest = this.state.name;
    a.round++;

    // AI NPC Counter-Bid
    const aiNames = ["Kim Vạn Tài", "Huyết Sát Ma Quân", "Tô Thanh Liên", "Mặc U Dạ"];
    const aiName = aiNames[Math.floor(Math.random() * aiNames.length)];
    const aiMax = Math.round(a.item.market * (0.85 + Math.random() * 0.45));

    if (a.round <= a.maxRounds && a.bid < aiMax && Math.random() > 0.35) {
      const aiRaise = Math.max(40, Math.round(a.bid * 0.12));
      a.bid += aiRaise;
      a.highest = aiName;
      this.log(`⚖️ ${aiName} vừa nâng giá lên ${a.bid} Linh Thạch!`);
    } else if (a.round > a.maxRounds || a.bid >= aiMax) {
      a.ended = true;
      this.state.stones -= a.bid;
      this.addItemToInventory(a.item);
      this.log(`🎉 Chúc mừng! Bạn đấu giá thành công [${a.item.name}] với giá ${a.bid} Linh Thạch!`);
      this.updateHUD();
      this.saveGame();
    }
    this.renderAuctionModal();
  },

  skipAuctionItem() {
    this.auctionState = null;
    this.log("Đã bỏ qua vật phẩm, chuyển sang bảo vật tiếp theo.");
    this.renderAuctionModal();
  },

  nextAuctionItem() {
    this.auctionState = null;
    this.renderAuctionModal();
  },

  // ==================== PETS & BLOODLINE EVOLUTION ====================
  renderPetsModal() {
    const s = this.state;
    const ownedHtml = s.pets.length ? s.pets.map(p => {
      const tpl = PET_TEMPLATES.find(t => t.id === p.id);
      const isAct = s.activePetId === p.id;
      const evoCost = 350 * (p.evo + 1);
      return `
        <div class="panel-card">
          <div class="row-between">
            <strong>${tpl.icon} ${p.name} (Lv.${p.level} • Huyết Mạch Bậc ${p.evo})</strong>
            <span class="${isAct ? "badge-gold" : "badge-jade"}">${isAct ? "Đang Xuất Chiến" : "Nghỉ Ngơi"}</span>
          </div>
          <div style="font-size:11px;color:#93b5b3;margin:4px 0 8px;">${tpl.bonusDesc}</div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;">
            ${!isAct ? `<button class="btn btn-sm btn-jade" onclick="Game.setActivePet('${p.id}')">Xuất Chiến</button>` : ""}
            <button class="btn btn-sm btn-outline" onclick="Game.feedPet('${p.id}')">Luyện Cấp (100 💎)</button>
            <button class="btn btn-sm btn-gold" onclick="Game.evolvePet('${p.id}')">Tiến Hóa Huyết Mạch (${evoCost} 💎)</button>
          </div>
        </div>
      `;
    }).join("") : `<div class="panel-card">Chưa thu phục Linh Thú nào. Hãy chọn Linh Thú bên dưới!</div>`;

    const shopHtml = PET_TEMPLATES.filter(t => !s.pets.some(p => p.id === t.id)).map(t => `
      <div class="panel-card row-between">
        <div>
          <strong>${t.icon} ${t.name}</strong> <span class="badge-jade">${t.element}</span>
          <div style="font-size:11px;color:#93b5b3;">${t.bonusDesc}</div>
        </div>
        <button class="btn btn-sm btn-gold" onclick="Game.adoptPet('${t.id}')">Thu Phục (${t.cost} 💎)</button>
      </div>
    `).join("");

    this.showModal("🐉 Linh Thú & Tiến Hóa Huyết Mạch", `${ownedHtml}<h4 style="color:#e9c46a;margin-top:4px;">Linh Thú Có Thể Thu Phục</h4>${shopHtml}`);
  },

  adoptPet(petId) {
    const tpl = PET_TEMPLATES.find(t => t.id === petId);
    if (!tpl || this.state.stones < tpl.cost) { this.log("Không đủ Linh Thạch thu phục Linh Thú!"); return; }
    this.state.stones -= tpl.cost;
    this.state.pets.push({ id: tpl.id, name: tpl.name, level: 1, evo: 0 });
    if (!this.state.activePetId) this.state.activePetId = tpl.id;
    this.recalcDerivedStats();
    this.log(`🐉 Đã thu phục Linh Thú [${tpl.name}]!`);
    this.updateHUD();
    this.saveGame();
    this.renderPetsModal();
  },

  setActivePet(petId) {
    this.state.activePetId = petId;
    this.recalcDerivedStats();
    this.renderPetsModal();
  },

  feedPet(petId) {
    const p = this.state.pets.find(x => x.id === petId);
    if (!p || this.state.stones < 100) { this.log("Cần 100 Linh Thạch để nuôi dưỡng Linh Thú!"); return; }
    this.state.stones -= 100;
    p.level++;
    this.recalcDerivedStats();
    this.updateHUD();
    this.renderPetsModal();
  },

  evolvePet(petId) {
    const p = this.state.pets.find(x => x.id === petId);
    if (!p) return;
    const cost = 350 * (p.evo + 1);
    if (this.state.stones < cost) { this.log(`Cần ${cost} Linh Thạch để Tiến Hóa Huyết Mạch!`); return; }
    this.state.stones -= cost;
    p.evo++;
    this.recalcDerivedStats();
    this.log(`🔥 ${p.name} giác tỉnh Huyết Mạch Bậc ${p.evo}! Sức mạnh tăng vượt bậc!`);
    this.updateHUD();
    this.saveGame();
    this.renderPetsModal();
  },

  // ==================== TOURNAMENT (3 ROUNDS + BETTING) ====================
  renderTournamentModal() {
    const hist = this.state.tournamentHistory.slice(-5).reverse().map(h => `<div>• ${h}</div>`).join("") || "<div>Chưa có chiến báo nào.</div>";
    this.showModal("⚔️ Đại Hội Tông Môn (3 Vòng + Đặt Cược)", `
      <div class="panel-card">
        <p style="font-size:12px;color:#93b5b3;line-height:1.5;">
          Thi đấu liên tiếp <strong>3 vòng (Tứ Kết → Bán Kết → Chung Kết)</strong>. Thắng cả 3 vòng nhận thưởng gấp đôi tiền cược + Công Đức Luân Hồi!
        </p>
        <div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap;">
          <button class="btn btn-jade" onclick="Game.startTournament(150)">Cược 150 💎 (Thưởng 450 💎)</button>
          <button class="btn btn-gold" onclick="Game.startTournament(400)">Cược 400 💎 (Thưởng 1200 💎)</button>
        </div>
      </div>
      <div class="panel-card">
        <strong style="color:#e9c46a;">Chiến Báo Quán Quân Gần Đây:</strong>
        <div style="font-size:12px;color:#d9f7f0;margin-top:6px;line-height:1.6;">${hist}</div>
      </div>
    `);
  },

  startTournament(bet) {
    if (this.state.stones < bet) { this.log(`Cần ${bet} Linh Thạch để tham gia Đại Hội!`); return; }
    this.state.stones -= bet;
    const rounds = [
      { title: "Vòng 1 (Tứ Kết)", foe: "Đệ Tử Ngoại Môn", rIdx: Math.max(0, this.state.realmIdx - 1), lv: 3 },
      { title: "Vòng 2 (Bán Kết)", foe: "Chân Truyền Đệ Tử", rIdx: this.state.realmIdx, lv: Math.max(1, this.state.subLevel - 1) },
      { title: "Vòng 3 (Chung Kết)", foe: "Thiên Kiêu Tông Môn", rIdx: this.state.realmIdx, lv: Math.min(9, this.state.subLevel + 1) }
    ];
    let report = [];
    let wonAll = true;
    for (const rd of rounds) {
      const res = this.runBattleSimulation(rd.foe, rd.rIdx, rd.lv);
      report.push(`<div><strong>${rd.title} vs ${rd.foe}:</strong> ${res.win ? "<span style='color:#38d9a9'>TOÀN THẮNG</span>" : "<span style='color:#e05263'>THẤT BẠI</span>"}</div>`);
      if (!res.win) { wonAll = false; break; }
    }

    if (wonAll) {
      const prize = bet * 3;
      this.state.stones += prize;
      this.meta.merit += 80;
      this.state.wins += 3;
      const entry = `Năm ${Math.floor(this.state.age)} tuổi: ${this.state.name} đoạt QUÁN QUÂN (+${prize} 💎, +80 Công Đức)`;
      this.state.tournamentHistory.push(entry);
      this.log(`🏆 ${entry}`);
    } else {
      const entry = `Năm ${Math.floor(this.state.age)} tuổi: ${this.state.name} dừng bước tại Đại Hội Tông Môn`;
      this.state.tournamentHistory.push(entry);
      this.log(`⚔️ ${entry}`);
    }
    this.updateHUD();
    this.saveGame();
    this.showModal("Chiến Báo Đại Hội Tông Môn", `
      <div class="panel-card" style="line-height:1.7;">${report.join("")}</div>
      <button class="btn btn-gold" onclick="Game.renderTournamentModal()">Quay Lại Đại Hội</button>
    `);
  },

  // ==================== SHOP & REBORN SHOP ====================
  renderShopModal() {
    const discount = this.state.traits.includes("tai_than") ? 0.85 : 1;
    const html = SHOP_CATALOG.map(item => {
      const p = Math.round(item.price * discount);
      return `
        <div class="panel-card row-between">
          <div style="flex:1;">
            <strong>${item.name}</strong>
            <div style="font-size:11px;color:#93b5b3;">${item.desc}</div>
          </div>
          <button class="btn btn-sm btn-gold" onclick="Game.buyShopItem('${item.id}', ${p})">${p} 💎</button>
        </div>
      `;
    }).join("");
    this.showModal(`🏪 Cửu Thiên Bảo Các (Hiện có: ${this.state.stones} 💎)`, html);
  },

  buyShopItem(id, price) {
    const item = SHOP_CATALOG.find(x => x.id === id);
    if (!item || this.state.stones < price) { this.log("Không đủ Linh Thạch!"); return; }
    this.state.stones -= price;
    this.addItemToInventory(item);
    this.log(`Đã mua [${item.name}]!`);
    this.updateHUD();
    this.saveGame();
    this.renderShopModal();
  },

  openRebornShopModal(fromTitle) {
    const html = INNATE_TRAITS.filter(t => t.cost > 0).map(t => {
      const owned = this.meta.unlockedTraits.includes(t.id);
      return `
        <div class="panel-card row-between">
          <div style="flex:1;">
            <strong>${t.name}</strong> <span class="badge-jade">${t.tag}</span>
            <div style="font-size:11px;color:#93b5b3;">${t.desc}</div>
          </div>
          <button class="btn btn-sm ${owned ? "btn-ghost" : "btn-gold"}" ${owned ? "disabled" : ""} onclick="Game.buyRebornTrait('${t.id}', ${fromTitle})">
            ${owned ? "Đã Mở Khóa" : `${t.cost} ☯`}
          </button>
        </div>
      `;
    }).join("");
    this.showModal(`☯ Cửa Hàng Luân Hồi (Công Đức: ${this.meta.merit})`, html);
  },

  buyRebornTrait(id, fromTitle) {
    const t = INNATE_TRAITS.find(x => x.id === id);
    if (!t || this.meta.unlockedTraits.includes(id) || this.meta.merit < t.cost) return;
    this.meta.merit -= t.cost;
    this.meta.unlockedTraits.push(id);
    this.saveMeta();
    this.updateTitleScreen();
    if (!fromTitle) this.renderSetupTraits();
    this.openRebornShopModal(fromTitle);
  },

  // ==================== SETTINGS & GIFTCODE ====================
  renderSettingsModal() {
    const st = this.state.settings;
    this.showModal("⚙️ Cài Đặt & Quà Tặng", `
      <div class="panel-card">
        <div class="row-between" style="margin-bottom:8px;">
          <span>Hiệu ứng Thời tiết (Mưa Linh Khí / Tuyết):</span>
          <button class="btn btn-sm btn-jade" onclick="Game.toggleSetting('weather')">${st.weather ? "Đang Bật" : "Đang Tắt"}</button>
        </div>
        <div class="row-between" style="margin-bottom:8px;">
          <span>Hiển thị Chữ Bay / Sát Thương:</span>
          <button class="btn btn-sm btn-jade" onclick="Game.toggleSetting('dmgPopup')">${st.dmgPopup ? "Đang Bật" : "Đang Tắt"}</button>
        </div>
        <div class="row-between">
          <span>Kiểu Thời Tiết:</span>
          <button class="btn btn-sm btn-outline" onclick="Game.cycleWeather()">${st.weatherType === "rain" ? "Mưa Linh Khí" : "Tuyết Đạo Vực"}</button>
        </div>
      </div>

      <div class="panel-card">
        <label style="font-size:12px;color:#93b5b3;">Nhập Giftcode (Gợi ý: CUUTHIENTRUYENKY, TIENHIEP999, LINHTHACH888):</label>
        <div style="display:flex;gap:6px;margin-top:6px;">
          <input id="giftcode-input" type="text" placeholder="Nhập mã quà..." style="flex:1;background:#0a1419;border:1px solid rgba(56,217,169,0.35);border-radius:8px;color:#fff;padding:8px;" />
          <button class="btn btn-sm btn-gold" onclick="Game.redeemGiftcode()">Nhận</button>
        </div>
      </div>

      <div class="btn-group">
        <button class="btn btn-jade" onclick="Game.saveGame(); Game.log('💾 Đã lưu tiến độ vào thiết bị!');">Lưu Tiến Độ Ngay</button>
        <button class="btn btn-outline" onclick="Game.closeModal(); Game.showScreen('title-screen');">Về Màn Hình Chính</button>
      </div>
    `);
  },

  toggleSetting(key) {
    this.state.settings[key] = !this.state.settings[key];
    this.saveGame();
    this.renderSettingsModal();
  },

  cycleWeather() {
    this.state.settings.weatherType = this.state.settings.weatherType === "rain" ? "snow" : "rain";
    this.saveGame();
    this.renderSettingsModal();
  },

  redeemGiftcode() {
    const code = (document.getElementById("giftcode-input").value || "").trim().toUpperCase();
    const reward = GIFTCODES[code];
    if (!reward) { this.log("❌ Mã Giftcode không hợp lệ!"); return; }
    if (this.meta.redeemedCodes.includes(code)) { this.log("⚠️ Bạn đã nhận Giftcode này rồi!"); return; }
    this.meta.redeemedCodes.push(code);
    this.state.stones += reward.stones;
    this.meta.merit += reward.merit;
    if (reward.item) {
      const tpl = SHOP_CATALOG.find(x => x.id === reward.item);
      if (tpl) this.addItemToInventory(tpl);
    }
    this.saveGame();
    this.updateHUD();
    this.log(`🎁 Giftcode thành công: ${reward.msg}`);
  },

  // ==================== HUD & LOG ====================
  log(msg) {
    const el = document.getElementById("floating-log");
    if (el) el.textContent = msg;
  },

  updateHUD() {
    if (!this.state) return;
    const s = this.state;
    const r = REALMS[s.realmIdx] || REALMS[0];
    document.getElementById("hud-name").textContent = s.name;
    document.getElementById("hud-realm").textContent = `${r.name} Tầng ${s.subLevel}`;
    document.getElementById("hud-hp-text").textContent = `${Math.max(0, Math.round(s.hp))}/${s.maxHp}`;
    document.getElementById("hud-hp-fill").style.width = `${Math.max(0, Math.min(100, (s.hp / s.maxHp) * 100))}%`;
    document.getElementById("hud-exp-text").textContent = `${Math.round(s.exp)}/${s.reqExp}`;
    document.getElementById("hud-exp-fill").style.width = `${Math.max(0, Math.min(100, (s.exp / s.reqExp) * 100))}%`;
    document.getElementById("hud-stones").textContent = s.stones;
    document.getElementById("hud-age").textContent = `${Math.floor(s.age)}/${s.maxLifespan}`;
    document.getElementById("hud-demon").textContent = `${Math.round(s.heartDemon)}%`;
    document.getElementById("hud-merit").textContent = this.meta.merit;

    const btnBreak = document.getElementById("btn-breakthrough");
    if (s.exp >= s.reqExp && !this.tribulation.active) btnBreak.classList.remove("hidden");
    else btnBreak.classList.add("hidden");
  },

  // ==================== CANVAS 2D RENDERER & CONTROLS ====================
  initCanvas() {
    this.canvas = document.getElementById("world-canvas");
    this.ctx = this.canvas.getContext("2d");
    window.addEventListener("resize", () => this.resizeCanvas());
    this.resizeCanvas();

    // Tap on canvas to interact with NPC or walk
    this.canvas.addEventListener("pointerdown", (e) => {
      if (!this.state || !this.state.alive) return;
      const rect = this.canvas.getBoundingClientRect();
      const tx = e.clientX - rect.left;
      const ty = e.clientY - rect.top;

      for (const npc of this.state.npcs) {
        const nx = npc.x * this.worldW;
        const ny = npc.y * this.worldH;
        if (Math.hypot(tx - nx, ty - ny) < 34) {
          this.openNpcDetail(npc.id);
          return;
        }
      }
      // Move smoothly toward tapped spot if close
      const dx = tx - this.playerPos.x;
      const dy = ty - this.playerPos.y;
      const len = Math.hypot(dx, dy);
      if (len > 10) {
        this.playerPos.x = Math.max(28, Math.min(this.worldW - 28, this.playerPos.x + (dx / len) * Math.min(len, 55)));
        this.playerPos.y = Math.max(55, Math.min(this.worldH - 35, this.playerPos.y + (dy / len) * Math.min(len, 55)));
      }
    });

    // Init ambient weather particles
    for (let i = 0; i < 42; i++) {
      this.weatherParticles.push({
        x: Math.random() * 800,
        y: Math.random() * 600,
        speed: 1.2 + Math.random() * 2.2,
        size: 1.5 + Math.random() * 2.2
      });
    }
  },

  resizeCanvas() {
    const stage = this.canvas.parentElement;
    if (!stage) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.worldW = stage.clientWidth || 360;
    this.worldH = stage.clientHeight || 480;
    this.canvas.width = Math.floor(this.worldW * dpr);
    this.canvas.height = Math.floor(this.worldH * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (this.playerPos.x > this.worldW || this.playerPos.y > this.worldH) {
      this.playerPos.x = this.worldW * 0.5;
      this.playerPos.y = this.worldH * 0.52;
    }
  },

  initJoystick() {
    const zone = document.getElementById("joystick-zone");
    const knob = document.getElementById("joystick-knob");
    let activeId = null;

    const updateJoy = (clientX, clientY) => {
      const rect = zone.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      let dx = clientX - cx;
      let dy = clientY - cy;
      const maxR = 36;
      const dist = Math.hypot(dx, dy);
      if (dist > maxR) { dx = (dx / dist) * maxR; dy = (dy / dist) * maxR; }
      knob.style.transform = `translate(${dx}px, ${dy}px)`;
      this.joyVec.x = dx / maxR;
      this.joyVec.y = dy / maxR;
    };

    zone.addEventListener("pointerdown", (e) => {
      activeId = e.pointerId;
      zone.setPointerCapture(activeId);
      updateJoy(e.clientX, e.clientY);
    });
    zone.addEventListener("pointermove", (e) => {
      if (e.pointerId === activeId) updateJoy(e.clientX, e.clientY);
    });
    const reset = () => {
      activeId = null;
      knob.style.transform = "translate(0px, 0px)";
      this.joyVec.x = 0;
      this.joyVec.y = 0;
    };
    zone.addEventListener("pointerup", reset);
    zone.addEventListener("pointercancel", reset);
  },

  initKeyboard() {
    window.addEventListener("keydown", e => { this.keys[e.key.toLowerCase()] = true; });
    window.addEventListener("keyup", e => { this.keys[e.key.toLowerCase()] = false; });
  },

  spawnPopup(x, y, text, color) {
    this.popups.push({ x, y, text, color, life: 1.0 });
  },

  drawCharacterSprite(ctx, x, y, paletteKey, label, subLabel, isPlayer, isHostile, time) {
    const pal = PALETTES[paletteKey] || PALETTES.NgocThanh;
    const bob = Math.sin(time * 0.004 + x) * 2.2;

    ctx.save();
    ctx.translate(x, y + bob);

    // Aura circle under feet
    ctx.beginPath();
    ctx.ellipse(0, 18, 22, 9, 0, 0, Math.PI * 2);
    ctx.fillStyle = pal.aura;
    ctx.fill();
    ctx.strokeStyle = isHostile ? "#e05263" : pal.trim;
    ctx.lineWidth = isPlayer ? 2 : 1.2;
    ctx.stroke();

    // Flowing Xianxia Robe (Recolored per Sect Palette)
    ctx.beginPath();
    ctx.moveTo(-13, 16);
    ctx.lineTo(-9, -6);
    ctx.lineTo(9, -6);
    ctx.lineTo(13, 16);
    ctx.closePath();
    ctx.fillStyle = pal.robe;
    ctx.fill();

    // Inner robe V-collar
    ctx.beginPath();
    ctx.moveTo(-4, -6);
    ctx.lineTo(0, 8);
    ctx.lineTo(4, -6);
    ctx.closePath();
    ctx.fillStyle = pal.inner;
    ctx.fill();

    // Waist Sash
    ctx.fillStyle = pal.trim;
    ctx.fillRect(-10, 2, 20, 4);

    // Head
    ctx.beginPath();
    ctx.arc(0, -14, 9.5, 0, Math.PI * 2);
    ctx.fillStyle = "#ffe8dc";
    ctx.fill();

    // Hair & Hairpin
    ctx.beginPath();
    ctx.arc(0, -16, 10, Math.PI, Math.PI * 2);
    ctx.fillStyle = pal.hair;
    ctx.fill();
    ctx.fillStyle = pal.trim;
    ctx.fillRect(-8, -24, 16, 2.5);

    // Floating Jade Flute / Spirit Sword
    ctx.save();
    ctx.translate(15, -4 + Math.sin(time * 0.006) * 3);
    ctx.rotate(-0.45);
    ctx.fillStyle = pal.trim;
    ctx.fillRect(-1.5, -14, 3, 24);
    ctx.restore();

    // Nameplate
    ctx.font = "bold 11px sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = isHostile ? "#ff7b8a" : (isPlayer ? "#f3d27a" : "#edf6f5");
    ctx.fillText(label, 0, -32);
    if (subLabel) {
      ctx.font = "10px sans-serif";
      ctx.fillStyle = pal.badge;
      ctx.fillText(subLabel, 0, -21);
    }

    ctx.restore();
  },

  loop(ts) {
    const dt = Math.min(0.05, (ts - this.lastFrame) / 1000 || 0.016);
    this.lastFrame = ts;

    if (this.state && document.getElementById("game-screen").classList.contains("active")) {
      // Movement (Joystick + Keyboard)
      let vx = this.joyVec.x;
      let vy = this.joyVec.y;
      if (this.keys["w"] || this.keys["arrowup"]) vy -= 1;
      if (this.keys["s"] || this.keys["arrowdown"]) vy += 1;
      if (this.keys["a"] || this.keys["arrowleft"]) vx -= 1;
      if (this.keys["d"] || this.keys["arrowright"]) vx += 1;

      if (Math.abs(vx) > 0.05 || Math.abs(vy) > 0.05) {
        const speed = 155;
        this.playerPos.x = Math.max(24, Math.min(this.worldW - 24, this.playerPos.x + vx * speed * dt));
        this.playerPos.y = Math.max(58, Math.min(this.worldH - 30, this.playerPos.y + vy * speed * dt));
      }

      // Cultivation tick
      this.meditateTick += dt;
      if (this.meditateTick >= 0.9) {
        this.meditateTick = 0;
        this.tickCultivation();
      }

      // Auto-save every 10s
      this.autoSaveTick += dt;
      if (this.autoSaveTick >= 10) {
        this.autoSaveTick = 0;
        this.saveGame();
      }

      this.renderWorld(ts, dt);
    }

    requestAnimationFrame((t) => this.loop(t));
  },

  renderWorld(ts, dt) {
    const ctx = this.ctx;
    const W = this.worldW;
    const H = this.worldH;

    ctx.save();
    if (this.lightningFX.shake > 0) {
      ctx.translate((Math.random() - 0.5) * this.lightningFX.shake, (Math.random() - 0.5) * this.lightningFX.shake);
      this.lightningFX.shake = Math.max(0, this.lightningFX.shake - dt * 32);
    }

    // Background Gradient — Cửu Thiên Thánh Địa
    const grad = ctx.createRadialGradient(W * 0.5, H * 0.45, 20, W * 0.5, H * 0.5, Math.max(W, H) * 0.8);
    grad.addColorStop(0, "#15323b");
    grad.addColorStop(0.55, "#0d1f26");
    grad.addColorStop(1, "#071014");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Sacred Spirit Formation Circle (Trận Pháp Trung Tâm)
    ctx.save();
    ctx.translate(W * 0.5, H * 0.5);
    ctx.rotate(ts * 0.00025);
    ctx.strokeStyle = "rgba(56, 217, 169, 0.16)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, Math.min(W, H) * 0.28, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, Math.min(W, H) * 0.20, 0, Math.PI * 2);
    ctx.stroke();
    for (let i = 0; i < 8; i++) {
      const a = (Math.PI * 2 / 8) * i;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * Math.min(W, H) * 0.20, Math.sin(a) * Math.min(W, H) * 0.20);
      ctx.lineTo(Math.cos(a) * Math.min(W, H) * 0.28, Math.sin(a) * Math.min(W, H) * 0.28);
      ctx.stroke();
    }
    ctx.restore();

    // Draw Recolored NPCs
    this.state.npcs.forEach(npc => {
      const nx = npc.x * W;
      const ny = npc.y * H;
      const r = REALMS[npc.realmIdx];
      this.drawCharacterSprite(ctx, nx, ny, npc.palette, npc.name, `${r.name} • ${PALETTES[npc.palette].label}`, false, npc.hostile, ts);
    });

    // Draw Player
    this.drawCharacterSprite(ctx, this.playerPos.x, this.playerPos.y, this.state.palette, this.state.name, `${this.state.element} Linh Mạch`, true, false, ts);

    // Draw Active Pet beside Player
    if (this.state.activePetId) {
      const pet = this.state.pets.find(p => p.id === this.state.activePetId);
      const tpl = PET_TEMPLATES.find(t => t.id === this.state.activePetId);
      if (pet && tpl) {
        const px = this.playerPos.x - 32;
        const py = this.playerPos.y + 8 + Math.sin(ts * 0.007) * 4;
        ctx.font = "22px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(tpl.icon, px, py);
      }
    }

    // Spirit Orbs when Meditating
    for (let i = this.orbs.length - 1; i >= 0; i--) {
      const o = this.orbs[i];
      o.x += (this.playerPos.x - o.x) * 0.09;
      o.y += (this.playerPos.y - o.y) * 0.09;
      o.life -= dt * 1.1;
      ctx.beginPath();
      ctx.arc(o.x, o.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(56, 217, 169, ${Math.max(0, o.life)})`;
      ctx.fill();
      if (o.life <= 0) this.orbs.splice(i, 1);
    }

    // Weather particles
    if (this.state.settings.weather) {
      const isRain = this.state.settings.weatherType === "rain";
      ctx.strokeStyle = "rgba(130, 235, 210, 0.25)";
      ctx.fillStyle = "rgba(235, 250, 255, 0.45)";
      this.weatherParticles.forEach(p => {
        p.y += p.speed * (isRain ? 2.4 : 0.7);
        p.x += isRain ? -0.6 : Math.sin(ts * 0.002 + p.y * 0.02) * 0.6;
        if (p.y > H) { p.y = -5; p.x = Math.random() * W; }
        if (p.x < 0) p.x = W;
        if (isRain) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - 2, p.y + 9);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    }

    // Lightning FX
    if (this.lightningFX.flash > 0) {
      ctx.fillStyle = `rgba(255, 245, 200, ${this.lightningFX.flash * 0.35})`;
      ctx.fillRect(0, 0, W, H);
      this.lightningFX.bolts.forEach(pts => {
        ctx.beginPath();
        pts.forEach((pt, idx) => idx === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y));
        ctx.strokeStyle = `rgba(255, 238, 150, ${this.lightningFX.flash})`;
        ctx.lineWidth = 4;
        ctx.stroke();
      });
      this.lightningFX.flash = Math.max(0, this.lightningFX.flash - dt * 2.5);
    }

    // Floating Popups
    for (let i = this.popups.length - 1; i >= 0; i--) {
      const pop = this.popups[i];
      pop.y -= dt * 36;
      pop.life -= dt * 0.9;
      ctx.font = "bold 13px sans-serif";
      ctx.textAlign = "center";
      ctx.fillStyle = pop.color;
      ctx.globalAlpha = Math.max(0, pop.life);
      ctx.fillText(pop.text, pop.x, pop.y);
      ctx.globalAlpha = 1;
      if (pop.life <= 0) this.popups.splice(i, 1);
    }

    ctx.restore();
  }
};

window.addEventListener("DOMContentLoaded", () => Game.init());
