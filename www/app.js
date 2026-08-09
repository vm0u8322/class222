const STORAGE_KEY = "classok-maic-state-v3";
const LANG_KEY = "classok-lang";

function getApiUrl(url) {
  const serverUrl = localStorage.getItem("classok-server-url");
  if (!serverUrl) return url;
  const base = serverUrl.replace(/\/$/, "");
  return base + url;
}

const typeStyles = {
  class: { color: "#1463ff", label: { zh: "課程", en: "Class", ko: "수업" } },
  life: { color: "#17bdb8", label: { zh: "生活", en: "Life", ko: "생활" } },
  exam: { color: "#ff8a3d", label: { zh: "考試", en: "Exam", ko: "시험" } },
};
const weekDays = [1, 2, 3, 4, 5, 6, 0];

const i18n = {
  zh: {
    positioning: "AI Student Companion",
    heroTitle: "把課表、講義與提醒變成你的個人 AI 學習夥伴",
    openSchedule: "看時間表",
    askAI: "問 AI",
    courses: "課程",
    files: "資料",
    upcoming: "提醒",
    quickActions: "快速加入",
    importText: "文字匯入",
    uploadAll: "丟檔案",
    library: "檔案庫",
    todayFocus: "今日焦點",
    smartSchedule: "Smart Timeline",
    scheduleTitle: "智慧時間表",
    import: "匯入",
    scan: "拍照辨識",
    voice: "語音",
    clear: "清空",
    emptyScheduleTitle: "時間表目前是空白",
    emptyScheduleText: "貼上課程、生活活動、考試 deadline。AI 會自動辨識類型並排進同一張時間表。",
    scheduleInfo: "你可以匯入課程、生活休閒、社團活動、聚餐、考試日期或 deadline。AI 會自動辨識類型並列入同一張時間表。",
    back: "返回",
    memoryTitle: "學習記憶",
    uploadTitle: "上傳課程資料",
    uploadText: "PDF、照片、錄音、筆記都可以",
    chatTitle: "AI 學習助手",
    navHome: "首頁",
    navSchedule: "時間",
    navLibrary: "檔案",
    importSheetTitle: "匯入時間表文字",
    importHint: "可貼課程、考試、deadline、聚餐、社團等文字。AI 會辨識成課程 / 生活 / 考試三種事件。",
    sample: "範例",
    noSchedule: "先匯入時間表，ClassOK 會自動整理課程、生活活動與需要注意的 deadline。",
    noToday: "今天沒有事件。很適合安排複習或整理講義。",
    apiOnline: "Online",
    apiOffline: "Demo",
    libraryTitle: "智慧檔案庫",
    dropTitle: "一次丟進全部課程資料",
    dropText: "點這裡選擇檔案，或直接拖曳進來。ClassOK 會自動分類並跳過重複檔案。",
    unassigned: "未分類",
    duplicateSkipped: "已跳過重複檔案",
  },
  en: {
    positioning: "AI Student Companion",
    heroTitle: "Turn schedules, handouts, and reminders into a personal AI learning companion",
    openSchedule: "Timeline",
    askAI: "Ask AI",
    courses: "Classes",
    files: "Files",
    upcoming: "Alerts",
    quickActions: "Quick Add",
    importText: "Text Import",
    uploadAll: "Upload",
    library: "Library",
    todayFocus: "Today",
    smartSchedule: "Smart Timeline",
    scheduleTitle: "Smart Timeline",
    import: "Import",
    scan: "Scan",
    voice: "Voice",
    clear: "Clear",
    emptyScheduleTitle: "Your timeline is empty",
    emptyScheduleText: "Paste classes, life events, exams, and deadlines. AI places them into one timeline.",
    scheduleInfo: "You can import classes, life events, club activities, dinners, exam dates, and deadlines. AI detects the type and adds everything into one timeline.",
    back: "Back",
    memoryTitle: "AI Memory",
    uploadTitle: "Upload course files",
    uploadText: "PDFs, photos, recordings, and notes",
    chatTitle: "AI Learning Assistant",
    navHome: "Home",
    navSchedule: "Time",
    navLibrary: "Files",
    importSheetTitle: "Import Timeline",
    importHint: "Paste classes, exams, deadlines, dinners, club events, and more. AI detects Class / Life / Exam.",
    sample: "Sample",
    noSchedule: "Import your timeline so ClassOK can organize classes, life events, and deadlines.",
    noToday: "No events today. A good day to review or organize materials.",
    apiOnline: "Online",
    apiOffline: "Demo",
    libraryTitle: "Smart File Library",
    dropTitle: "Drop all course files here",
    dropText: "Tap here to choose files, or drag files in. ClassOK classifies automatically and skips duplicates.",
    unassigned: "Unassigned",
    duplicateSkipped: "Duplicate skipped",
  },
  ko: {
    positioning: "AI Student Companion",
    heroTitle: "시간표, 자료, 알림을 개인 AI 학습 동반자로 바꿔요",
    openSchedule: "시간표",
    askAI: "AI 질문",
    courses: "수업",
    files: "자료",
    upcoming: "알림",
    quickActions: "빠른 추가",
    importText: "텍스트",
    uploadAll: "업로드",
    library: "파일함",
    todayFocus: "오늘",
    smartSchedule: "Smart Timeline",
    scheduleTitle: "스마트 시간표",
    import: "가져오기",
    scan: "스캔",
    voice: "음성",
    clear: "비우기",
    emptyScheduleTitle: "시간표가 비어 있어요",
    emptyScheduleText: "수업, 생활 일정, 시험, 마감일을 붙여넣으면 AI가 한 시간표에 정리합니다.",
    scheduleInfo: "수업, 생활 일정, 동아리, 약속, 시험 날짜, 마감일을 가져올 수 있습니다. AI가 유형을 감지해 한 시간표에 넣습니다.",
    back: "뒤로",
    memoryTitle: "AI 기억",
    uploadTitle: "수업 자료 업로드",
    uploadText: "PDF, 사진, 녹음, 노트",
    chatTitle: "AI 학습 도우미",
    navHome: "홈",
    navSchedule: "시간",
    navLibrary: "파일",
    importSheetTitle: "시간표 가져오기",
    importHint: "수업, 시험, 마감일, 약속, 동아리 일정을 붙여넣으면 AI가 분류합니다.",
    sample: "예시",
    noSchedule: "시간표를 가져오면 ClassOK가 수업, 생활 일정, 마감일을 정리합니다.",
    noToday: "오늘 일정이 없습니다. 복습하거나 자료를 정리하기 좋아요.",
    apiOnline: "Online",
    apiOffline: "Demo",
    libraryTitle: "스마트 파일함",
    dropTitle: "수업 자료를 한 번에 넣기",
    dropText: "여기를 눌러 파일을 선택하거나 드래그하세요. ClassOK가 자동 분류하고 중복은 건너뜁니다.",
    unassigned: "미분류",
    duplicateSkipped: "중복 파일 건너뜀",
  },
};

["ja", "es", "fr", "de"].forEach((lang) => {
  i18n[lang] = i18n.en;
});

Object.assign(i18n.zh, {
  scheduleInfoTitle: "時間表說明",
  infoClose: "我知道了",
  scheduleInfo: "可以匯入課程、生活休閒、朋友聚餐、考試日期與 deadline，AI 會自動辨識類型並列入時間表。課程和考試重疊時也會一起顯示。",
});
Object.assign(i18n.en, {
  scheduleInfoTitle: "About Smart Timeline",
  infoClose: "Got it",
});
Object.assign(i18n.ko, {
  scheduleInfoTitle: "스마트 시간표 안내",
  infoClose: "확인",
});

typeStyles.class.label.zh = "課程";
typeStyles.life.label.zh = "生活";
typeStyles.exam.label.zh = "考試";
typeStyles.class.label.ko = "수업";
typeStyles.life.label.ko = "생활";
typeStyles.exam.label.ko = "시험";

Object.assign(i18n.zh, {
  positioning: "嗨，Shelly",
  heroTitle: "今天準備開始學習了嗎？",
  heroSubtitle: "ClassOK 已為你整理今日課程與學習資料",
  courses: "今日課程",
  files: "學習資料",
  upcoming: "待複習考試",
  noSchedule: "ClassOK 已為你整理今日課程與學習資料。匯入課表後，課程卡片會自動集中講義、筆記、照片與錄音。",
});

const state = {
  lang: localStorage.getItem(LANG_KEY) || "zh",
  activeView: "home",
  courses: [],
  files: [],
  selectedCourseId: "",
  apiReady: false,
  authUser: null,
  authProviders: {},
  messages: [],
  calendarMonth: "",
  selectedCalendarDate: "",
  academicSystem: "semester",
};

let mediaRecorder = null;
let recordingTarget = "";
let recordedChunks = [];

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));
const text = (key) => i18n[state.lang]?.[key] || i18n.en?.[key] || i18n.zh[key] || key;

function save() {
  state.updatedAt = Date.now();
  const cleanFiles = (state.files || []).map(({ sourceFile, objectUrl, ...file }) => file);
  const payload = {
    ...state,
    messages: (state.messages || []).slice(-20),
    files: cleanFiles,
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (err) {
    console.warn("localStorage quota exceeded, slimming file previews to save state:", err);
    try {
      const slimFiles = cleanFiles.map((f, idx) => 
        idx >= cleanFiles.length - 3 ? f : { ...f, previewData: "" }
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        ...payload,
        messages: (state.messages || []).slice(-10),
        files: slimFiles,
      }));
    } catch (e) {
      console.error("Critical localStorage quota error:", e);
    }
  }

  try {
    localStorage.setItem(LANG_KEY, state.lang);
  } catch {}

  syncToServer();
}

async function syncToServer() {
  try {
    const payload = {
      courses: state.courses,
      files: state.files.map(({ sourceFile, objectUrl, ...file }) => file),
      messages: state.messages.slice(-50),
      selectedCourseId: state.selectedCourseId,
      academicSystem: state.academicSystem,
      updatedAt: state.updatedAt || Date.now(),
    };
    await fetch(getApiUrl("/api/sync"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.warn("Sync to SQLite failed:", err);
  }
}

async function syncFromServer() {
  try {
    const response = await fetch(getApiUrl("/api/sync"));
    if (response.ok) {
      const data = await response.json();
      if (data && (data.courses || data.files || data.messages)) {
        const serverUpdatedAt = Number(data.updatedAt || 0);
        const localUpdatedAt = Number(state.updatedAt || 0);
        const serverHasContent = (data.courses?.length || 0) + (data.files?.length || 0) + (data.messages?.length || 0) > 0;
        if (!serverHasContent || serverUpdatedAt < localUpdatedAt) return;
        state.courses = hydrateCourseMinutes(data.courses) || state.courses;
        state.files = data.files || state.files;
        state.messages = data.messages || state.messages;
        state.selectedCourseId = data.selectedCourseId || state.selectedCourseId;
        state.academicSystem = data.academicSystem || state.academicSystem;
        state.updatedAt = serverUpdatedAt || localUpdatedAt;
        renderAll();
      }
    }
  } catch (err) {
    console.warn("Sync from SQLite failed:", err);
  }
}

function restore() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (!saved) return;
    state.lang = saved.lang || state.lang;
    state.activeView = saved.activeView || "home";
    state.courses = Array.isArray(saved.courses) ? saved.courses : [];
    state.files = Array.isArray(saved.files) ? saved.files : [];
    state.selectedCourseId = saved.selectedCourseId || "";
    state.messages = Array.isArray(saved.messages) ? saved.messages : [];
    state.calendarMonth = saved.calendarMonth || "";
    state.selectedCalendarDate = saved.selectedCalendarDate || "";
    state.academicSystem = saved.academicSystem || "semester";
    state.updatedAt = Number(saved.updatedAt || 0);
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function applyI18n() {
  document.documentElement.lang = state.lang === "zh" ? "zh-Hant" : state.lang;
  $$("[data-i18n]").forEach((el) => {
    el.textContent = text(el.dataset.i18n);
  });
}

function switchView(view) {
  state.activeView = view;
  $(".phone-shell")?.classList.toggle("schedule-mode", view === "schedule");
  $$(".view").forEach((panel) => panel.classList.toggle("active", panel.id === `view-${view}`));
  $$(".nav-item").forEach((button) => button.classList.toggle("active", button.dataset.viewTarget === view));
  if (view === "course") renderCourse();
  save();
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.remove("hidden");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.add("hidden"), 2400);
}

function dayLabel(day) {
  const labels = {
    zh: ["週日", "週一", "週二", "週三", "週四", "週五", "週六"],
    en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    ko: ["일", "월", "화", "수", "목", "금", "토"],
  };
  return labels[state.lang]?.[day] || labels.zh[day] || "";
}

function getEventsThisWeek() {
  const today = new Date();
  const day = today.getDay();
  const diffToMonday = today.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(today.getFullYear(), today.getMonth(), diffToMonday);
  monday.setHours(0, 0, 0, 0);
  
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  
  return state.courses.filter(event => {
    if (!event.date) return false;
    const date = new Date(event.date + "T00:00:00");
    return date >= monday && date <= sunday;
  }).sort((a, b) => new Date(a.date) - new Date(b.date) || a.startMin - b.startMin);
}

function renderSchedule() {
  const empty = $("#scheduleEmpty");
  const timeline = $("#timeline");
  if (!state.courses.length) {
    empty.classList.remove("hidden");
    timeline.classList.remove("active");
    timeline.innerHTML = "";
    return;
  }
  empty.classList.add("hidden");
  timeline.classList.add("active");

  const timed = state.courses.filter((event) => {
    if (!Number.isInteger(event.day)) return false;
    if (event.type === "exam") {
      const titleKey = compactText(event.relatedCourse || event.title || "");
      const hasMatchingClass = state.courses.some(c =>
        c.type === "class" && c.day === event.day &&
        (compactText(c.title || "").includes(titleKey) || titleKey.includes(compactText(c.title || "")))
      );
      if (hasMatchingClass) return false;
    }
    return true;
  });

  if (!timed.length) {
    timeline.innerHTML = `<div style="text-align:center;padding:20px;color:var(--text-secondary,#666);font-size:14px;">本週尚無固定課程課表。</div>`;
    return;
  }

  const mergedTimed = mergeContiguousCourses(timed);
  const startMin = roundDown(Math.min(...mergedTimed.map(e => e.startMin)), 30);
  const endMin   = roundUp(Math.max(...mergedTimed.map(e => e.endMin)), 30);
  const total    = Math.max(60, endMin - startMin);
  const ticks    = makeCompactTicks(startMin, endMin);
  const visualHeight = Math.max(100, Math.round((total / 60) * 72));

  timeline.innerHTML = `
    <div class="compact-schedule" style="height:${visualHeight}px">
      <div class="compact-head"><span></span>${weekDays.map(day => `<strong>${dayLabel(day)}</strong>`).join("")}</div>
      <div class="compact-body">
        <div class="time-axis">${ticks.map(min => `<span style="top:${((min - startMin) / total) * 100}%">${fromMinutes(min)}</span>`).join("")}</div>
        ${weekDays.map(day => `<div class="day-lane" data-day="${day}"></div>`).join("")}
      </div>
    </div>`;

  for (const day of weekDays) {
    const lane = timeline.querySelector(`.day-lane[data-day="${day}"]`);
    if (!lane) continue;
    layoutOverlaps(mergeContiguousCourses(timed).filter(e => e.day === day), day).forEach(({ event, laneIndex, laneCount, groupId }) => {
      const top    = ((event.startMin - startMin) / total) * 100;
      const height = ((event.endMin - event.startMin) / total) * 100;
      const width  = 100 / laneCount;
      const block  = document.createElement("button");
      block.className = `course-block compact ${event.type || "class"} ${cardKind(event)}-card`;
      
      block.setAttribute("data-group", groupId);
      block.setAttribute("data-lane-index", laneIndex);
      block.setAttribute("data-lane-count", laneCount);

      if (laneCount > 1) {
        block.classList.add("overlap");
        const defaultRank = laneCount - 1 - laneIndex;
        block.setAttribute("data-stack-rank", String(defaultRank));
        if (defaultRank === 0) {
          block.classList.add("focused-overlap");
        } else {
          block.classList.add("stacked-overlap");
        }
      }
      if (event.endMin - event.startMin <= 60) block.classList.add("short");
      block.style.top    = `${top}%`;
      block.style.height = `${Math.max(9, height)}%`;
      
      if (laneCount > 1) {
        block.style.left   = "4px";
        block.style.right  = "4px";
      } else {
        block.style.left  = `calc(${laneIndex * width}% + 4px)`;
        block.style.right = `calc(${100 - (laneIndex + 1) * width}% + 4px)`;
      }

      let quizBadge = "";
      if (event.type === "class") {
        const titleKey = compactText(event.title || "");
        const hasQuiz  = state.courses.some(e =>
          e.type === "exam" && (
            compactText(e.relatedCourse || "").includes(titleKey) ||
            (titleKey && compactText(e.title || "").includes(titleKey))
          )
        );
        if (hasQuiz) {
          block.classList.add("has-quiz");
          quizBadge = `<b class="quiz-badge">⚡</b>`;
        }
      }
      block.style.background = cardKindColor(event);
      block.title   = `${event.title}・${cardKindLabel(event)}・${event.start}-${event.end}${event.room ? `・${event.room}` : ""}`;
      block.innerHTML = `<strong>${escapeHtml(event.title)}</strong><span>${event.start}-${event.end}${event.room ? `<br>${escapeHtml(event.room)}` : ""}</span><em>${cardKindLabel(event)}</em>${quizBadge}`;
      
      block.addEventListener("click", (e) => {
        const currentRank = block.getAttribute("data-stack-rank");
        if (laneCount > 1 && currentRank !== "0") {
          e.preventDefault();
          e.stopPropagation();
          updateOverlapStackRanks(lane, groupId, block);
        } else {
          openScheduleCard(event);
        }
      });
      lane.appendChild(block);
    });
  }
}

function updateOverlapStackRanks(lane, groupId, focusedBlock) {
  const siblings = Array.from(lane.querySelectorAll(`.course-block[data-group="${groupId}"]`));
  if (!siblings.length) return;

  focusedBlock.setAttribute("data-stack-rank", "0");
  focusedBlock.classList.remove("stacked-overlap");
  focusedBlock.classList.add("focused-overlap");

  let currentRank = 1;
  siblings
    .filter((s) => s !== focusedBlock)
    .sort((a, b) => Number(b.dataset.laneIndex || 0) - Number(a.dataset.laneIndex || 0))
    .forEach((sibling) => {
      sibling.setAttribute("data-stack-rank", String(currentRank));
      sibling.classList.remove("focused-overlap");
      sibling.classList.add("stacked-overlap");
      currentRank++;
    });
}

function layoutOverlaps(events, dayLabel = "x") {
  const sorted = [...events].sort((a, b) => a.startMin - b.startMin || b.endMin - a.endMin);
  const groups = [];
  let current = [];
  let currentEnd = -1;

  sorted.forEach((event) => {
    if (!current.length || event.startMin < currentEnd) {
      current.push(event);
      currentEnd = Math.max(currentEnd, event.endMin);
    } else {
      groups.push(current);
      current = [event];
      currentEnd = event.endMin;
    }
  });
  if (current.length) groups.push(current);

  let groupCounter = 0;
  return groups.flatMap((group) => {
    groupCounter++;
    const groupId = `overlap-${dayLabel}-${groupCounter}`;
    const columns = [];
    const placed = group.map((event) => {
      let columnIndex = columns.findIndex((end) => end <= event.startMin);
      if (columnIndex === -1) {
        columnIndex = columns.length;
        columns.push(event.endMin);
      } else {
        columns[columnIndex] = event.endMin;
      }
      return { event, laneIndex: columnIndex, laneCount: 1, groupId };
    });
    placed.forEach((item) => {
      item.laneCount = columns.length;
    });
    return placed;
  });
}


function hydrateCourseMinutes(courses) {
  (courses || []).forEach(event => {
    if (event.startMin == null) event.startMin = toMinutes(event.start || "09:00");
    if (event.endMin == null) event.endMin = toMinutes(event.end || "10:00");
  });
  return courses;
}
function toMinutes(time) {
  const parts = String(time || "09:00").split(":").map(Number);
  return (parts[0] || 0) * 60 + (parts[1] || 0);
}

function fromMinutes(min) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function roundDown(value, step) {
  return Math.floor(value / step) * step;
}

function roundUp(value, step) {
  return Math.ceil(value / step) * step;
}

function makeCompactTicks(startMin, endMin) {
  const ticks = new Set([startMin, endMin]);
  state.courses.forEach((event) => {
    ticks.add(event.startMin);
    ticks.add(event.endMin);
  });
  for (let minute = roundUp(startMin, 60); minute < endMin; minute += 60) ticks.add(minute);
  return Array.from(ticks).filter((minute) => minute >= startMin && minute <= endMin).sort((a, b) => a - b)
    .filter((minute, index, array) => index === 0 || minute - array[index - 1] >= 20 || minute === endMin);
}

function selectCourse(id) {
  state.selectedCourseId = id;
  switchView("course");
}

function renderCourse() {
  const course = state.courses.find((item) => item.id === state.selectedCourseId && item.type === "class") || state.courses.find((item) => item.type === "class");
  if (!course) {
    $("#courseTitle").textContent = "";
    $("#courseFiles").innerHTML = "";
    return;
  }
  state.selectedCourseId = course.id;
  $("#courseTitle").textContent = course.title;
  const files = state.files.filter((file) => file.courseId === course.id);
  $("#courseInsight").textContent = files.length
    ? `AI 已記住 ${files.length} 份 ${course.title} 資料，可以協助摘要、考前重點與弱點分析。`
    : "上傳這門課的講義、照片或錄音後，AI 會記住重點並協助考前整理。";
  $("#memoryMeter").style.width = `${Math.min(100, 28 + files.length * 18)}%`;
  $("#courseFiles").innerHTML = files.length
    ? files.map(renderThumb).join("")
    : `<div class="file-row"><i class="fa-regular fa-folder-open"></i><div><strong>尚無資料</strong><span>${text("uploadText")}</span></div></div>`;
  $$("#courseFiles [data-preview-id]").forEach((button) => button.addEventListener("click", () => openPreview(button.dataset.previewId)));
}

function renderThumb(file) {
  const icon = file.type === "image" ? "fa-image" : file.type === "audio" ? "fa-file-audio" : "fa-file-lines";
  return `<button class="thumb-card" data-preview-id="${file.id}">
    <div class="thumb-media">${file.previewData ? `<img src="${file.previewData}" alt="">` : `<i class="fa-solid ${icon}"></i>`}</div>
    <strong>${escapeHtml(file.name)}</strong>
    <span>${escapeHtml(file.summary || file.matchReason || "AI Memory")}</span>
  </button>`;
}

function renderFileRow(file, withSelect = false) {
  const icon = file.type === "image" ? "fa-image" : file.type === "audio" ? "fa-file-audio" : "fa-file-lines";
  return `<div class="file-row">
    <button class="mini-preview" data-preview-id="${file.id}" aria-label="Preview">${file.previewData ? `<img src="${file.previewData}" alt="">` : `<i class="fa-solid ${icon}"></i>`}</button>
    <div><strong>${escapeHtml(file.name)}</strong><span>${escapeHtml(file.matchReason || file.summary || "已加入 AI 記憶佇列")}</span></div>
    ${withSelect ? courseSelect(file) : ""}
  </div>`;
}

function courseSelect(file) {
  const options = [`<option value="">${text("unassigned")}</option>`]
    .concat(state.courses.filter((course) => course.type === "class").map((course) => `<option value="${course.id}" ${course.id === file.courseId ? "selected" : ""}>${escapeHtml(course.title)}</option>`));
  return `<select class="course-select" data-file-id="${file.id}">${options.join("")}</select>`;
}


let touchStartDist = 0;
let initialColumns = 3;

function initPinchToZoom() {
  const list = document.getElementById("libraryList");
  if (!list) return;

  // Touch gesture support (two finger pinch)
  list.addEventListener("touchstart", (e) => {
    if (e.touches.length === 2) {
      touchStartDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      initialColumns = state.gridColumns || 3;
    }
  });

  list.addEventListener("touchmove", (e) => {
    if (e.touches.length === 2 && touchStartDist > 0) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const ratio = dist / touchStartDist;
      
      // Pinch out (ratio > 1.35) -> Make images larger -> LESS columns
      if (ratio > 1.35) {
        if (state.gridColumns > 1) {
          state.gridColumns--;
          touchStartDist = dist;
          renderLibrary();
        }
      } 
      // Pinch in (ratio < 0.65) -> Make images smaller -> MORE columns
      else if (ratio < 0.65) {
        if (state.gridColumns < 5) {
          state.gridColumns++;
          touchStartDist = dist;
          renderLibrary();
        }
      }
    }
  });

  list.addEventListener("touchend", () => {
    touchStartDist = 0;
  });

  // Trackpad pinch gesture (wheel with ctrlKey)
  list.addEventListener("wheel", (e) => {
    if (e.ctrlKey) {
      e.preventDefault();
      if (e.deltaY > 0) {
        if (state.gridColumns < 5) {
          state.gridColumns++;
          renderLibrary();
        }
      } else {
        if (state.gridColumns > 1) {
          state.gridColumns--;
          renderLibrary();
        }
      }
    }
  }, { passive: false });
}

let zoomScale = 1;
let panX = 0;
let panY = 0;
let isPanning = false;
let startX = 0;
let startY = 0;
let prevDist = 0;

function resetZoom() {
  zoomScale = 1;
  panX = 0;
  panY = 0;
  updateZoomTransform();
}

function updateZoomTransform() {
  const img = document.getElementById("previewImage");
  if (img) {
    img.style.transform = `translate(${panX}px, ${panY}px) scale(${zoomScale})`;
  }
}

function initImageZoomAndPan() {
  const container = document.querySelector(".preview-media-container");
  const img = document.getElementById("previewImage");
  if (!container || !img) return;

  // Touch pinch-to-zoom & pan
  container.addEventListener("touchstart", (e) => {
    if (e.touches.length === 1) {
      isPanning = true;
      startX = e.touches[0].clientX - panX;
      startY = e.touches[0].clientY - panY;
    } else if (e.touches.length === 2) {
      isPanning = false;
      prevDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
    }
  });

  container.addEventListener("touchmove", (e) => {
    if (e.touches.length === 1 && isPanning) {
      panX = e.touches[0].clientX - startX;
      panY = e.touches[0].clientY - startY;
      updateZoomTransform();
    } else if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      if (prevDist > 0) {
        const factor = dist / prevDist;
        zoomScale = Math.max(0.5, Math.min(4, zoomScale * factor));
        updateZoomTransform();
      }
      prevDist = dist;
    }
  });

  container.addEventListener("touchend", () => {
    isPanning = false;
    prevDist = 0;
  });

  // Mouse pan
  container.addEventListener("mousedown", (e) => {
    isPanning = true;
    startX = e.clientX - panX;
    startY = e.clientY - panY;
    e.preventDefault();
  });

  window.addEventListener("mousemove", (e) => {
    if (isPanning) {
      panX = e.clientX - startX;
      panY = e.clientY - startY;
      updateZoomTransform();
    }
  });

  window.addEventListener("mouseup", () => {
    isPanning = false;
  });

  // Wheel zoom
  container.addEventListener("wheel", (e) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.1 : 0.9;
    zoomScale = Math.max(0.5, Math.min(4, zoomScale * factor));
    updateZoomTransform();
  }, { passive: false });
}

function renderGalleryItem(file) {
  const icon = file.type === "image" ? "fa-image" : file.type === "audio" ? "fa-file-audio" : "fa-file-lines";
  const course = state.courses.find(c => c.id === file.courseId);
  const courseTitle = course ? course.title : "未分類";
  return `<button class="gallery-card" data-preview-id="${file.id}">
    <div class="gallery-media">
      ${file.previewData ? `<img src="${file.previewData}" alt="${escapeHtml(file.name)}">` : `<div class="gallery-icon-fallback"><i class="fa-solid ${icon}"></i><span>${escapeHtml(file.name.split('.').pop() || "")}</span></div>`}
    </div>
    <div class="gallery-info">
      <span class="gallery-category">${escapeHtml(courseTitle)}</span>
    </div>
  </button>`;
}


function renderLibrary() {
  const list = $("#libraryList");
  if (!list) return;
  list.className = "library-list gallery-grid";
  if (!state.gridColumns) state.gridColumns = 3;
  list.style.setProperty("--grid-columns", state.gridColumns);

  if (!state.files.length) {
    list.innerHTML = `<div class="empty-library"><i class="fa-regular fa-folder-open"></i><strong>${text("libraryTitle")}</strong><span>${text("dropText")}</span></div>`;
    return;
  }
  list.innerHTML = state.files.map(renderGalleryItem).join("");
  $$("#libraryList [data-preview-id]").forEach((button) => button.addEventListener("click", () => openPreview(button.dataset.previewId)));
}

function renderMessages() {
  const messages = $("#messages");
  const entries = state.messages.length ? state.messages : [{ role: "bot", content: "嗨，我是 ClassOK AI。你可以問我課表、考前重點、讀書計畫，或指定某門課的資料來整理。" }];
  messages.innerHTML = entries.map((message) => `<div class="message ${message.role}"><div class="bubble">${formatMessage(message.content)}</div></div>`).join("");
  messages.scrollTop = messages.scrollHeight;
}

function formatMessage(content) {
  return escapeHtml(content).replaceAll("\n", "<br>");
}

function renderApiStatus() {
  const status = $("#apiStatus");
  status.textContent = state.apiReady ? text("apiOnline") : text("apiOffline");
  status.classList.toggle("online", state.apiReady);
}

function renderStats() {
  const fileCountNode = $("#fileCount");
  const matchCountNode = $("#matchCount");
  if (fileCountNode) fileCountNode.textContent = `${state.files.length} ${text("files")}`;
  if (matchCountNode) matchCountNode.textContent = `${state.files.filter((file) => file.courseId).length} ${text("matched")}`;
}


function calendarCursor() {
  if (!state.calendarMonth) return new Date();
  const parts = state.calendarMonth.split("-");
  return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, 1);
}

function setCalendarMonth(date) {
  state.calendarMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function cardKindLabel(eventOrKind) {
  if (!eventOrKind) return "";
  const kind = typeof eventOrKind === "string" ? eventOrKind : cardKind(eventOrKind);
  return kind === "course" ? "課程" : "事件";
}

function renderCalendarDayList() {
  const list = $("#calendarDayList");
  if (!list) return;
  const selected = state.selectedCalendarDate || dateKey(new Date());
  const date = new Date(`${selected}T00:00:00`);
  const events = Number.isNaN(date.getTime()) ? [] : eventsForDate(date);
  if (!events.length) {
    list.innerHTML = `<p style="color:var(--text-secondary,#666);text-align:center;padding:10px 0;">這天沒有事件。</p>`;
    return;
  }
  list.innerHTML = events.slice(0, 5).map((event) => `
    <div class="calendar-event ${cardKind(event)}" style="display:flex;gap:8px;align-items:center;padding:6px 0;border-bottom:1px solid var(--border-color,#eee);">
      <b style="font-size:11px;background:var(--accent-color,#1463ff);color:#fff;border-radius:4px;padding:1px 5px;">${cardKindLabel(event)}</b>
      <strong style="font-size:13px;">${escapeHtml(event.title)}</strong>
      <span style="margin-left:auto;font-size:11px;color:var(--text-muted,#999);">${event.start}-${event.end}</span>
    </div>`).join("");
}

function renderMonthCalendar() {
  const calendar = $("#monthCalendar");
  if (!calendar) return;
  const cursor = calendarCursor();
  setCalendarMonth(cursor);
  const selected = state.selectedCalendarDate || dateKey(new Date());
  const title = $("#calendarTitle");
  if (title) title.textContent = `${cursor.getFullYear()} / ${String(cursor.getMonth() + 1).padStart(2, "0")}`;

  const firstDay = cursor.getDay();
  const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
  const cells = [];
  const names = ["日", "一", "二", "三", "四", "五", "六"];
  names.forEach((name) => cells.push(`<span class="month-week">${name}</span>`));
  for (let i = 0; i < firstDay; i += 1) cells.push(`<span class="month-blank"></span>`);
  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(cursor.getFullYear(), cursor.getMonth(), day);
    const key = dateKey(date);
    const events = eventsForDate(date);
    const dots = ["course", "event"]
      .filter((kind) => events.some((e) => cardKind(e) === kind))
      .map((kind) => `<i class="${kind}"></i>`)
      .join("");
    const isToday = key === dateKey(new Date()) ? " today" : "";
    const isSelected = key === selected ? " selected" : "";
    cells.push(`<button class="month-day${isToday}${isSelected}" data-date="${key}" type="button"><strong>${day}</strong><span>${dots}</span></button>`);
  }
  calendar.innerHTML = cells.join("");
  $$("#monthCalendar [data-date]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.selectedCalendarDate = btn.dataset.date;
      save();
      renderMonthCalendar();
      renderDailyView();
    });
  });
  renderCalendarDayList();
}

function renderDailyView() {
  const list = $("#dailyViewList");
  const titleNode = $("#dailyViewTitle");
  const countNode = $("#dailyViewCount");
  if (!list || !titleNode) return;
  const selected = state.selectedCalendarDate || dateKey(new Date());
  const date = new Date(selected + "T00:00:00");
  const weekdays = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
  const dateStr = `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`;
  titleNode.textContent = `${dateStr} ${weekdays[date.getDay()]}`;
  const events = Number.isNaN(date.getTime()) ? [] : eventsForDate(date);
  if (countNode) countNode.textContent = `${events.length} 個項目`;
  if (!events.length) {
    list.innerHTML = `<div style="text-align:center;padding:30px;color:var(--text-muted,#8c8c8c);"><strong>今天沒有任何課程與事件</strong></div>`;
    return;
  }
  list.innerHTML = events.map(event => {
    const typeLabel = event.type === "class" ? "課程" : event.type === "exam" ? "考試" : "生活";
    const typeClass = event.type || "class";
    const roomInfo = event.room ? `<span style="font-size:12px;color:var(--text-secondary,#666);background:var(--bg-card-header,#f5f5f5);padding:2px 6px;border-radius:4px;">${escapeHtml(event.room)}</span>` : "";
    return `
      <div class="daily-event-item ${typeClass}" style="display:flex;gap:12px;padding:12px;border-radius:8px;border:1px solid var(--border-color,#e0e0e0);background:var(--bg-card,#fff);align-items:center;box-shadow:0 1px 3px rgba(0,0,0,0.02);">
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-width:55px;padding:4px;border-right:2px solid var(--accent-color,#1463ff);font-weight:bold;color:var(--accent-color,#1463ff);">
          <span style="font-size:13px;">${event.start}</span>
          <span style="font-size:11px;color:var(--text-muted,#8c8c8c);font-weight:normal;">${event.end}</span>
        </div>
        <div style="flex:1;display:flex;flex-direction:column;gap:4px;overflow:hidden;">
          <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
            <strong style="font-size:14px;color:var(--text-color,#000);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:75%;">${escapeHtml(event.title)}</strong>
            <span style="font-size:10px;font-weight:bold;padding:2px 6px;border-radius:4px;background:rgba(20,99,255,0.1);color:var(--accent-color,#1463ff);">${typeLabel}</span>
          </div>
          ${roomInfo ? `<div>${roomInfo}</div>` : ""}
        </div>
      </div>`;
  }).join("");
}

function renderCalendarView(viewName) {
  $$(".calendar-tabs .tab-btn").forEach(btn => {
    const isActive = btn.dataset.calendarView === viewName;
    btn.style.background = isActive ? "var(--bg-card,#fff)" : "transparent";
    btn.style.color = isActive ? "var(--accent-color,#1463ff)" : "var(--text-secondary,#666)";
    btn.style.boxShadow = isActive ? "0 2px 5px rgba(0,0,0,0.05)" : "none";
  });
  const termCalendarCard = document.querySelector(".term-calendar-card");
  const scheduleCard = document.querySelector(".schedule-card");
  const dailyViewCard = $("#dailyViewCard");
  if (termCalendarCard) termCalendarCard.classList.toggle("hidden", viewName !== "month");
  if (scheduleCard) scheduleCard.classList.toggle("hidden", viewName !== "week");
  if (dailyViewCard) dailyViewCard.classList.toggle("hidden", viewName !== "day");
  if (viewName === "day") renderDailyView();
}

function renderAll() {
  applyI18n();
  renderStats();
  renderInsight();
  renderTodayList();
  renderMonthCalendar();
  renderSchedule();
  renderCourse();
  renderLibrary();
  renderMessages();
  renderApiStatus();
  renderAuth();
  renderCalendarView(state.calendarView || "month");
}

function renderAuth() {
  const login = $("#loginScreen");
  if (!login) return;
  login.classList.toggle("hidden", Boolean(state.authUser));
  document.body.classList.toggle("auth-open", !state.authUser);
  const hint = $("#loginHint");
  if (hint) {
    const providers = [];
    if (state.authProviders.google) providers.push("Google");
    if (state.authProviders.line) providers.push("LINE");
    hint.textContent = providers.length
      ? `已啟用 ${providers.join(" / ")} OAuth 登入`
      : "尚未在 .env 設定 OAuth 金鑰，按鈕會顯示設定提醒。";
  }
  const profile = $(".profile-list article:first-child div");
  if (profile) {
    profile.innerHTML = state.authUser
      ? `<strong>${escapeHtml(state.authUser.name || "Shelly")}</strong><span>${escapeHtml((state.authUser.provider || "").toUpperCase())} 登入${state.authUser.email ? ` · ${escapeHtml(state.authUser.email)}` : ""}</span>`
      : `<strong>Shelly</strong><span>尚未登入</span>`;
  }
  if (!$("#logoutButton") && $(".profile-list")) {
    $(".profile-list").insertAdjacentHTML("beforeend", `<article class="logout-row"><i class="fa-solid fa-right-from-bracket"></i><div><strong>登出</strong><span>清除目前登入狀態</span></div><button id="logoutButton" type="button">登出</button></article>`);
    $("#logoutButton").addEventListener("click", logout);
  }
}



async function scanSchedule(file) {
  if (!file) return;
  showToast("正在辨識圖片文字...");
  const form = new FormData();
  form.append("file", file);
  try {
    const response = await fetch(getApiUrl("/api/extract-text"), { method: "POST", body: form });
    if (!response.ok) throw new Error("OCR failed");
    const result = await response.json();
    $("#scheduleText").value = result.text || "";
    openImportModal();
  } catch {
    showToast("OCR 暫時不可用，請改用文字貼上");
  }
}

async function startVoice(target) {
  if (mediaRecorder && mediaRecorder.state === "recording") {
    mediaRecorder.stop();
    return;
  }
  if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
    showToast("這個瀏覽器不支援錄音，請改用文字或拍照匯入");
    return;
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    recordedChunks = [];
    recordingTarget = target;
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = (event) => {
      if (event.data?.size) recordedChunks.push(event.data);
    };
    mediaRecorder.onstop = () => {
      stream.getTracks().forEach((track) => track.stop());
      transcribeRecording(recordingTarget, recordedChunks).catch((error) => {
        console.warn("Voice transcription failed:", error);
        showToast("語音辨識失敗，請改用文字匯入");
      });
    };
    mediaRecorder.start();
    showToast("正在錄音，再按一次語音按鈕結束");
  } catch {
    showToast("無法取得麥克風權限");
  }
}

async function transcribeRecording(target, chunks) {
  if (!chunks.length) return;
  showToast("正在用 AI 轉錄語音...");
  const blob = new Blob(chunks, { type: "audio/webm" });
  const form = new FormData();
  form.append("file", blob, "voice.webm");
  const response = await fetch(getApiUrl("/api/extract-text"), { method: "POST", body: form });
  if (!response.ok) throw new Error("transcription failed");
  const result = await response.json();
  const transcript = String(result.text || "").trim();
  if (!transcript) {
    showToast("沒有辨識到語音內容");
    return;
  }
  if (target === "chat") $("#chatInput").value = transcript;
  else {
    $("#scheduleText").value = transcript;
    openImportModal();
  }
}

async function addLibraryFiles(fileList, forcedCourseId = "") {
  const files = Array.from(fileList || []);
  if (!files.length) {
    showToast("沒有選到檔案");
    return;
  }
  let added = 0;
  let skipped = 0;
  for (const file of files) {
    if (isDuplicateFile(file)) {
      skipped += 1;
      continue;
    }
    const classification = forcedCourseId ? { courseId: forcedCourseId, reason: "手動加入此課程" } : classifyFile(file);
    const record = {
      id: `file-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: file.name,
      type: inferFileType(file.name, file.type),
      size: file.size,
      lastModified: file.lastModified || Date.now(),
      dedupeKey: makeDedupeKey(file),
      courseId: classification.courseId,
      matchReason: classification.reason,
      summary: "本機已加入，等待 AI 整理",
    };
    if (record.type === "image") record.previewData = await readImageDataUrl(file);
    state.files.push(record);
    added += 1;
    extractFileSummary(file, record).catch(() => {});
  }
  save();
  renderAll();
  if (!forcedCourseId) switchView("library");
  const parts = [];
  if (added) parts.push(`新增 ${added} 個檔案`);
  if (skipped) parts.push(`${text("duplicateSkipped")} ${skipped} 個`);
  if (parts.length) showToast(parts.join("，"));
}

async function addCourseFiles(fileList) {
  const course = state.courses.find((item) => item.id === state.selectedCourseId && item.type === "class");
  if (!course) {
    showToast("請先選擇課程");
    return;
  }
  await addLibraryFiles(fileList, course.id);
}

function makeDedupeKey(file) {
  return `${file.name.toLowerCase()}::${file.size}::${file.lastModified || 0}`;
}

function isDuplicateFile(file) {
  const key = makeDedupeKey(file);
  return state.files.some((item) => item.dedupeKey === key || (item.name.toLowerCase() === file.name.toLowerCase() && item.size === file.size));
}

function classifyFile(file) {
  const classes = state.courses.filter((course) => course.type === "class");
  if (!classes.length) return { courseId: "", reason: text("unassigned") };
  const filename = compactText(file.name);
  let best = { course: null, score: 0, reason: "" };
  classes.forEach((course) => {
    let score = 0;
    const titleKey = compactText(course.title);
    if (titleKey && filename.includes(titleKey)) score += 70;
    (course.keywords || []).forEach((keyword) => {
      if (keyword && filename.includes(compactText(keyword))) score += 28;
    });
    const fileDate = new Date(file.lastModified || Date.now());
    const fileDay = fileDate.getDay();
    const fileMinutes = fileDate.getHours() * 60 + fileDate.getMinutes();
    if (fileDay === course.day) {
      if (fileMinutes >= course.startMin - 30 && fileMinutes <= course.endMin + 90) {
        score += 55;
      } else {
        score += 10 + Math.max(0, 16 - Math.abs(fileMinutes - course.startMin) / 20);
      }
    }
    if (score > best.score) {
      best = { 
        course, 
        score, 
        reason: score >= 55 
          ? `依時間/檔名自動分類至 ${course.title}` 
          : (score >= 10 ? `同一天建立，可能屬於 ${course.title}` : `可能屬於 ${course.title}`)
      };
    }
  });
  return best.course && best.score >= 5 ? { courseId: best.course.id, reason: best.reason } : { courseId: "", reason: text("unassigned") };
}

function readImageDataUrl(file) {
  return new Promise((resolve) => {
    if (!file || !file.type?.startsWith("image/")) {
      resolve("");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = String(e.target.result || "");
      const img = new Image();
      img.onload = () => {
        try {
          const maxWidth = 300;
          const maxHeight = 300;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", 0.6));
        } catch {
          resolve(dataUrl.slice(0, 100000));
        }
      };
      img.onerror = () => resolve(dataUrl.slice(0, 100000));
      img.src = dataUrl;
    };
    reader.onerror = () => resolve("");
    reader.readAsDataURL(file);
  });
}

async function extractFileSummary(file, record) {
  const form = new FormData();
  form.append("file", file);
  try {
    const response = await fetch(getApiUrl("/api/extract-text"), { method: "POST", body: form });
    if (!response.ok) return;
    const result = await response.json();
    if (result.text) {
      record.summary = result.text.slice(0, 80);
      save();
      renderAll();
    }
  } catch {
    record.summary = "已儲存於本機 Demo";
  }
}

function inferFileType(name, mime) {
  const lower = name.toLowerCase();
  if (mime?.startsWith("image/") || [".png", ".jpg", ".jpeg", ".webp", ".heic"].some((ext) => lower.endsWith(ext))) return "image";
  if (mime?.startsWith("audio/") || [".mp3", ".wav", ".m4a", ".aac", ".ogg", ".webm"].some((ext) => lower.endsWith(ext))) return "audio";
  return "document";
}

function openPreview(fileId) {
  const file = state.files.find((item) => item.id === fileId);
  if (!file) return;
  const modal = $("#previewModal");
  const card = $("#previewCard");
  
  const options = [`<option value="">${text("unassigned")}</option>`]
    .concat(state.courses.filter((course) => course.type === "class").map((course) => `<option value="${course.id}" ${course.id === file.courseId ? "selected" : ""}>${escapeHtml(course.title)}</option>`));
  
  const selectHtml = `<select class="course-select-preview" data-file-id="${file.id}">${options.join("")}</select>`;
  
  if (file.previewData) {
    card.innerHTML = `
      <div class="preview-media-container">
        <img id="previewImage" src="${file.previewData}" alt="${escapeHtml(file.name)}">
      </div>
      <div class="preview-meta-panel">
        <strong>${escapeHtml(file.name)}</strong>
        <label style="font-size: 12px; font-weight: bold; color: var(--text-muted, #666);">分類：${selectHtml}</label>
      </div>
    `;
  } else {
    const icon = file.type === "audio" ? "fa-file-audio" : "fa-file-lines";
    card.innerHTML = `
      <div class="preview-fallback">
        <i class="fa-solid ${icon}"></i>
        <strong>${escapeHtml(file.name)}</strong>
        <span>${escapeHtml(file.summary || file.matchReason || "")}</span>
      </div>
      <div class="preview-meta-panel">
        <label style="font-size: 12px; font-weight: bold; color: var(--text-muted, #666);">分類：${selectHtml}</label>
      </div>
    `;
  }

  // Wire dropdown change event
  const select = card.querySelector(".course-select-preview");
  select.addEventListener("change", () => {
    const targetFile = state.files.find((item) => item.id === select.dataset.fileId);
    if (targetFile) {
      targetFile.courseId = select.value;
      const course = state.courses.find((course) => course.id === select.value);
      targetFile.matchReason = select.value ? `手動分類至 ${course?.title || ""}` : text("unassigned");
      save();
      renderAll();
    }
  });

  modal.classList.remove("hidden");
  resetZoom();
  initImageZoomAndPan();
}

function closePreviewModal() {
  const modal = $("#previewModal");
  if (modal) modal.classList.add("hidden");
}

async function sendChat(question) {
  const clean = String(question || "").trim();
  if (!clean) return;
  state.messages.push({ role: "user", content: clean });
  const loading = { role: "bot", content: "ClassOK 思考中..." };
  state.messages.push(loading);
  renderMessages();
  save();

  const relevantFiles = findRelevantFiles(clean);
  const vaultFileIds = relevantFiles.filter(f => f.vaultFileId).map(f => f.vaultFileId);
  const localTexts = relevantFiles.map((file) => {
    const text = file.sourceText || "";
    const truncatedText = text.length > 2000
      ? text.slice(0, 2000) + "\n... (內容過長已自動截斷) ..."
      : text;
    return `【檔案：${file.name} 內容逐字稿】\n${truncatedText}`;
  });

  let contextStr = localTexts.filter(Boolean).join("\n\n");
  if (contextStr.length > 8000) {
    contextStr = contextStr.slice(0, 8000) + "\n\n... (為維護 AI 響應效能，其餘檔案內容已安全截斷) ...";
  }

  const responseLanguage = "繁體中文";
  const strictGroundingRule = `參考規範：
1. 請優先依據下方提供的課程講義內容、OCR 辨識逐字稿或已上傳檔案回答。
2. 不可以自行編造或寫出不在資料中的內容，也不可以用一般學科知識作答。
3. 如果資料不足（OCR 沒辨識出、或者非檔案主題內），請直接說「目前資料不足，請先上傳講義或檔案以供分析。」。
4. 請簡短說明你是根據哪些檔案回答。
5. 請使用繁體中文回答。`;

  let finalQuestion = "";
  if (contextStr) {
    finalQuestion = `請使用 ${responseLanguage} 回答。\n\n${strictGroundingRule}\n\n=== 檔案資料內容 ===\n${contextStr}\n\n=== 使用者提問 ===\n${clean}`;
  } else {
    finalQuestion = `請使用 ${responseLanguage} 回答。\n\n${strictGroundingRule}\n\n=== 使用者提問 ===\n${clean}`;
  }

  try {
    const response = state.apiReady ? await fetch(getApiUrl("/api/chat"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: finalQuestion, file_ids: vaultFileIds }),
    }) : null;
    if (response?.ok) {
      const result = await response.json();
      loading.content = result.answer || localAnswer(clean);
    } else {
      loading.content = localAnswer(clean);
    }
  } catch (error) {
    console.warn("Chat failed:", error);
    loading.content = localAnswer(clean);
  }
  save();
  renderMessages();
}

function classokDayFromToken(token) {
  return {
    "\u65e5": 0,
    "\u5929": 0,
    "\u4e00": 1,
    "\u4e8c": 2,
    "\u4e09": 3,
    "\u56db": 4,
    "\u4e94": 5,
    "\u516d": 6,
  }[token] ?? null;
}

function classokNormalizeClock(value, period = "") {
  const match = String(value || "").replaceAll("\uff1a", ":").match(/(\d{1,2}):(\d{2})/);
  if (!match) return "";
  let hour = Number(match[1]);
  const minute = Number(match[2]);
  if (/下午|晚上/.test(period) && hour < 12) hour += 12;
  if (/上午|早上/.test(period) && hour === 12) hour = 0;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function courseExamForCourse(course) {
  if (!course || course.type !== "class") return null;
  const courseTitle = compactText(course.title || "");
  return state.courses.find((event) => {
    if (event.type !== "exam") return false;
    const related = compactText(event.relatedCourse || "");
    const title = compactText(event.title || "");
    const matchesCourse = related && (courseTitle.includes(related) || related.includes(courseTitle)) || title.includes(courseTitle);
    const sameDay = !Number.isInteger(event.day) || event.day === course.day;
    return matchesCourse && sameDay;
  }) || null;
}

function courseForExam(exam) {
  if (!exam || exam.type !== "exam") return null;
  const related = compactText(exam.relatedCourse || "");
  const title = compactText(exam.title || "");
  return state.courses.find((course) => {
    if (course.type !== "class") return false;
    const courseTitle = compactText(course.title || "");
    const matchesCourse = related && (courseTitle.includes(related) || related.includes(courseTitle)) || title.includes(courseTitle);
    const sameDay = !Number.isInteger(exam.day) || exam.day === course.day;
    return matchesCourse && sameDay;
  }) || null;
}

function cardKind(event) {
  if (!event) return "event";
  if (event.type === "class") return "course";
  return "event";
}

function cardKindColor(event) {
  if (event?.type === "class" && courseExamForCourse(event)) return "#ff8a3d";
  return cardKind(event) === "course" ? "#2563eb" : "#0b1736";
}

function openScheduleCard(event) {
  if (event?.type === "class") {
    selectCourse(event.id);
    return;
  }
  const course = courseForExam(event);
  if (course) selectCourse(course.id);
  else showToast(`事件：${event?.title || ""}`);
}



function renderCourse() {
  const course = state.courses.find((item) => item.id === state.selectedCourseId && item.type === "class") || state.courses.find((item) => item.type === "class");
  if (!course) {
    $("#courseTitle").textContent = "";
    $("#courseFiles").innerHTML = "";
    return;
  }
  state.selectedCourseId = course.id;
  $("#courseTitle").textContent = course.title;
  const files = state.files.filter((file) => file.courseId === course.id);
  const exam = courseExamForCourse(course);
  $("#courseInsight").textContent = exam
    ? `本課程當天有考試：${exam.title}。可以在下方修改考試名稱、時間與範圍。`
    : files.length
      ? `ClassOK 已整理 ${files.length} 份 ${course.title} 的學習資料。`
      : "這門課的講義、PDF、照片、錄音、逐字稿與 AI 摘要都會集中在這裡。";
  $("#memoryMeter").style.width = `${Math.min(100, 28 + files.length * 18 + (exam ? 18 : 0))}%`;

  let panel = $("#courseExamPanel");
  if (!panel) {
    $("#courseFiles").insertAdjacentHTML("beforebegin", `<section class="course-exam-panel" id="courseExamPanel"></section>`);
    panel = $("#courseExamPanel");
  }
  panel.innerHTML = exam ? `
    <div class="exam-panel-head"><b>考</b><div><strong>課程考試</strong><span>${dayLabel(exam.day)} ${exam.start}-${exam.end}</span></div></div>
    <label>考試名稱<input id="examTitleInput" value="${escapeHtml(exam.title)}"></label>
    <label>考試範圍<input id="examRangeInput" value="${escapeHtml(exam.range || exam.room || "")}" placeholder="例如 Chapter 3-5 / Trigger / View"></label>
    <div class="exam-row"><label>開始<input id="examStartInput" value="${exam.start}"></label><label>結束<input id="examEndInput" value="${exam.end}"></label></div>
    <button class="primary-button compact" id="saveExamButton" type="button"><i class="fa-solid fa-check"></i><span>儲存考試</span></button>
  ` : `
    <button class="soft-button course-exam-add" id="addExamButton" type="button"><i class="fa-solid fa-pen-to-square"></i><span>標記這門課有考試</span></button>
  `;
  $("#saveExamButton")?.addEventListener("click", () => {
    exam.title = classokCleanTitle($("#examTitleInput").value || `${course.title}考試`);
    exam.relatedCourse = course.title;
    exam.start = classokNormalizeClock($("#examStartInput").value) || exam.start;
    exam.end = classokNormalizeClock($("#examEndInput").value) || exam.end;
    exam.startMin = toMinutes(exam.start);
    exam.endMin = toMinutes(exam.end);
    exam.range = $("#examRangeInput").value.trim();
    exam.room = exam.range;
    save();
    renderAll();
    showToast("已更新課程考試");
  });
  $("#addExamButton")?.addEventListener("click", () => {
    state.courses.push(classokEvent(course.day, course.start, course.end, `${course.title}考試`, Date.now()));
    state.courses[state.courses.length - 1].relatedCourse = course.title;
    save();
    renderAll();
    showToast("已標記課程考試");
  });

  $("#courseFiles").innerHTML = files.length
    ? files.map(renderThumb).join("")
    : `<div class="file-row"><i class="fa-regular fa-folder-open"></i><div><strong>尚未加入資料</strong><span>${text("uploadText")}</span></div></div>`;
  $$("#courseFiles [data-preview-id]").forEach((button) => button.addEventListener("click", () => openPreview(button.dataset.previewId)));
}

function classokCleanTitle(value) {
  return String(value || "")
    .replace(/^[\s,，、:：-]+/, "")
    .replace(/^(要|有|是|的|課程|課|考|上課)\s*/, "")
    .replace(/\s*(在|於)\s*$/, "")
    .trim();
}

function classokTypeForTitle(title) {
  const text = String(title || "").toLowerCase();
  if (/考試|測驗|小考|期中|期末|quiz|midterm|final|deadline|繳交|報告|多益|toeic|ccna/.test(text)) return "exam";
  if (/游泳|唱歌|聚餐|朋友|社團|羽球|比賽|健身|運動|打工|約|吃飯|休閒|活動/.test(text)) return "life";
  return "class";
}

function classokRelatedCourse(title, type) {
  if (type !== "exam") return "";
  return classokCleanTitle(title)
    .replace(/(考試|測驗|小考|期中|期末|quiz|midterm|final|deadline|繳交|報告)$/i, "")
    .trim();
}

function classokEvent(day, start, end, title, index) {
  const cleanTitle = classokCleanTitle(title);
  if (!Number.isInteger(day) || !cleanTitle || !start || !end) return null;
  const startMin = toMinutes(start);
  const endMin = toMinutes(end);
  if (!Number.isFinite(startMin) || !Number.isFinite(endMin) || endMin <= startMin) return null;
  const type = classokTypeForTitle(cleanTitle);
  return {
    id: `event-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 7)}`,
    day,
    date: "",
    start,
    end,
    startMin,
    endMin,
    title: cleanTitle,
    room: "",
    relatedCourse: classokRelatedCourse(cleanTitle, type),
    type,
    keywords: compactText(cleanTitle).split(" ").filter(Boolean),
  };
}

function parseScheduleLocally(input) {
  const events = [];
  const weekdayPattern = /(?:\u79ae\u62dc|\u661f\u671f|\u9031|\u5468)\s*([\u4e00\u4e8c\u4e09\u56db\u4e94\u516d\u65e5\u5929])/u;
  const onlyWeekdayPattern = /^(?:\u79ae\u62dc|\u661f\u671f|\u9031|\u5468)\s*([\u4e00\u4e8c\u4e09\u56db\u4e94\u516d\u65e5\u5929])$/u;
  let currentDay = null;
  let index = 0;

  String(input || "").split(/\r?\n/).forEach((rawLine) => {
    let line = rawLine.replaceAll("\uff1a", ":").replace(/[－–—]/g, "-").trim();
    if (!line) return;

    const onlyDay = line.match(onlyWeekdayPattern);
    if (onlyDay) {
      currentDay = classokDayFromToken(onlyDay[1]);
      return;
    }

    const dayMatch = line.match(weekdayPattern);
    if (dayMatch) {
      currentDay = classokDayFromToken(dayMatch[1]);
      line = line.replace(dayMatch[0], " ").trim();
    }
    if (!Number.isInteger(currentDay)) return;

    const rangePattern = /(?:(上午|早上|下午|晚上)\s*)?(\d{1,2}:\d{2})\s*(?:-|~|到|至)\s*(\d{1,2}:\d{2})\s*([\s\S]*?)(?=(?:(?:上午|早上|下午|晚上)\s*)?\d{1,2}:\d{2}\s*(?:-|~|到|至)|$)/g;
    const matches = [...line.matchAll(rangePattern)];

    if (matches.length) {
      const firstPrefix = line.slice(0, matches[0].index).trim();
      const prefixEvent = firstPrefix.match(/^(上午|早上|下午|晚上)\s*(.+)$/);
      if (prefixEvent) {
        const period = prefixEvent[1];
        const inferred = /下午/.test(period) ? ["14:00", "16:00"] : /晚上/.test(period) ? ["19:00", "21:00"] : ["09:00", "11:00"];
        const event = classokEvent(currentDay, inferred[0], inferred[1], prefixEvent[2], index++);
        if (event) events.push(event);
      }

      matches.forEach((match) => {
        const period = match[1] || "";
        const start = classokNormalizeClock(match[2], period);
        const end = classokNormalizeClock(match[3], period);
        const event = classokEvent(currentDay, start, end, match[4], index++);
        if (event) events.push(event);
      });
      return;
    }

    const periodOnly = line.match(/^(上午|早上|下午|晚上)\s*(.+)$/);
    if (periodOnly) {
      const period = periodOnly[1];
      const inferred = /下午/.test(period) ? ["14:00", "16:00"] : /晚上/.test(period) ? ["19:00", "21:00"] : ["09:00", "11:00"];
      const event = classokEvent(currentDay, inferred[0], inferred[1], periodOnly[2], index++);
      if (event) events.push(event);
      return;
    }

    if (/考試|測驗|小考|期中|期末|quiz|midterm|final|deadline|繳交|報告|多益|toeic|ccna/i.test(line)) {
      const event = classokEvent(currentDay, "09:00", "11:00", line, index++);
      if (event) events.push(event);
    }
  });

  return dedupeEvents(events).sort((a, b) => (a.day ?? 9) - (b.day ?? 9) || a.startMin - b.startMin);
}

async function parseSchedule(input) {
  try {
    const response = await fetch(getApiUrl("/api/parse-events"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: input, language: state.lang === "zh" ? "zh-Hant" : state.lang }),
    });
    if (!response.ok) throw new Error(await response.text());
    const payload = await response.json();
    const events = Array.isArray(payload.events) ? payload.events : [];
    const aiEvents = events.map(normalizeAiEvent).filter(Boolean)
      .sort((a, b) => (a.day ?? 9) - (b.day ?? 9) || a.startMin - b.startMin);
    if (aiEvents.length) return aiEvents;
  } catch (error) {
    console.warn("Qwen parse failed, using local fallback:", error);
  }

  return parseScheduleLocally(input);
}



async function parseSchedule(input) {
  try {
    const response = await fetch(getApiUrl("/api/parse-events"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: input, language: state.lang === "zh" ? "zh-Hant" : state.lang }),
    });
    if (!response.ok) throw new Error(await response.text());
    const payload = await response.json();
    const events = Array.isArray(payload.events) ? payload.events : [];
    const aiEvents = events.map(normalizeAiEvent).filter(Boolean)
      .sort((a, b) => (a.day ?? 9) - (b.day ?? 9) || a.startMin - b.startMin);
    if (aiEvents.length) return aiEvents;
  } catch (error) {
    console.warn("Qwen parse failed, using local fallback:", error);
  }

  return parseScheduleLocally(input);
}



function localAnswer(question) {
  const lines = state.courses.slice(0, 5).map((event) => `- ${dayLabel(event.day)} ${event.start}-${event.end} ${cardKindLabel(event)} ${event.title}`).join("\n");
  if (question.toLowerCase().includes("deadline") || question.includes("考") || question.includes("提醒")) {
    return `目前有 ${state.courses.filter((event) => event.type === "exam").length} 個考試或 deadline。\n${lines || "尚未匯入時間表。"}`;
  }
  return `我可以協助整理時間表、讀書計畫與課程資料。\n${lines || "先從匯入時間表開始，ClassOK 會用 AI 分成課程、生活、考試。"}`;
}

async function checkApiStatus() {
  try {
    const response = await fetch(getApiUrl("/api/status"));
    const result = await response.json();
    state.apiReady = Boolean(result.api_ready);
  } catch {
    state.apiReady = false;
  }
  renderApiStatus();
}

async function checkAuth() {
  try {
    const response = await fetch(getApiUrl("/api/auth/me"), { credentials: "same-origin" });
    const result = await response.json();
    state.authUser = result.authenticated ? result.user : null;
    state.authProviders = result.providers || {};
    await syncFromServer();
  } catch (error) {
    console.warn("Auth status failed:", error);
    state.authUser = null;
    state.authProviders = {};
  }
  renderAuth();
}

async function startOAuth(provider) {
  const providerName = provider === "line" ? "LINE" : provider === "apple" ? "Apple" : "Google";
  showToast(`準備前往 ${providerName} 登入...`);
  try {
    const response = await fetch(getApiUrl(`/api/auth/oauth-url/${provider}`), { credentials: "same-origin" });
    if (!response.ok) {
      const message = await response.text();
      throw new Error(message);
    }
    const result = await response.json();
    window.location.href = result.url;
  } catch (error) {
    console.warn("OAuth start failed:", error);
    if (provider === "line") showToast("LINE OAuth 尚未設定 Channel ID / Secret");
    else if (provider === "apple") showToast("Apple 登入尚未設定 Client ID / Team ID / Key");
    else showToast("Google OAuth 尚未設定 Client ID / Secret");
  }
}

function startDemoLogin() {
  state.authUser = {
    id: "demo-shelly",
    name: "Shelly",
    email: "demo@classok.local",
    provider: "demo",
  };
  renderAuth();
  switchView("home");
  showToast("已進入 ClassOK Demo");
}

function ensureDemoLoginButton() {
  if ($("#demoLogin")) return;
  const panel = $(".login-panel");
  if (!panel) return;
  panel.insertAdjacentHTML(
    "beforeend",
    `<button class="login-button demo" id="demoLogin" type="button">
      <span><i class="fa-solid fa-mobile-screen-button"></i></span>
      <strong>先用 Demo 進入</strong>
    </button>`
  );
  $("#demoLogin")?.addEventListener("click", startDemoLogin);
}

async function logout() {
  await fetch(getApiUrl("/api/auth/logout"), { method: "POST", credentials: "same-origin" });
  state.authUser = null;
  renderAuth();
  switchView("home");
  showToast("已登出");
}

function findRelevantFiles(question) {
  const query = String(question || "").toLowerCase();
  const filesWithText = state.files.filter(f => f.sourceText);
  if (!filesWithText.length) return [];
  
  const scoredFiles = filesWithText.map(file => {
    let score = 0;
    const filename = file.name.toLowerCase();
    
    if (query.includes(filename)) score += 100;
    
    const filenameWords = filename.split(/[\s_\-\.]+/).filter(w => w.length > 1);
    filenameWords.forEach(word => {
      if (query.includes(word)) score += 20;
    });
    
    const course = state.courses.find(c => c.id === file.courseId);
    if (course) {
      const courseTitle = course.title.toLowerCase();
      if (query.includes(courseTitle)) score += 50;
    }
    
    const content = file.sourceText.toLowerCase();
    const keywords = query.split(/[\s,，。\.？！\?\s]+/).filter(w => w.length > 1);
    keywords.forEach(keyword => {
      if (content.includes(keyword)) score += 5;
    });
    
    return { file, score };
  });
  
  let matched = scoredFiles.filter(item => item.score > 0).sort((a, b) => b.score - a.score).map(item => item.file);
  
  if (!matched.length) {
    matched = [...filesWithText]
      .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
      .slice(0, 3);
  } else {
    matched = matched.slice(0, 4);
  }
  
  return matched;
}

function openImportScheduleModal() {
  const modal = $("#importScheduleModal");
  if (modal) {
    modal.classList.remove("hidden");
    $("#scheduleText").focus();
  }
}

function closeImportScheduleModal() {
  $("#importScheduleModal")?.classList.add("hidden");
}

function openImportEventsModal() {
  const modal = $("#importEventsModal");
  if (modal) {
    modal.classList.remove("hidden");
    $("#eventsText").focus();
  }
}

function closeImportEventsModal() {
  $("#importEventsModal")?.classList.add("hidden");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function transcribeRecording(target, chunks) {
  if (!chunks.length) return;
  showToast("正在用 AI 轉錄語音...");
  const blob = new Blob(chunks, { type: "audio/webm" });
  const form = new FormData();
  form.append("file", blob, "voice.webm");
  const response = await fetch(getApiUrl("/api/extract-text"), { method: "POST", body: form });
  if (!response.ok) throw new Error("transcription failed");
  const result = await response.json();
  const transcript = String(result.text || "").trim();
  if (!transcript) {
    showToast("沒有辨識到語音內容");
    return;
  }
  if (target === "chat") {
    $("#chatInput").value = transcript;
  } else {
    await applyVoiceScheduleCommand(transcript);
  }
}

async function applyVoiceScheduleCommand(command) {
  showToast(`聽到：${command}`);
  const response = await fetch(getApiUrl("/api/schedule-command"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      command,
      current_events: state.courses,
      language: state.lang === "zh" ? "zh-Hant" : state.lang,
    }),
  });
  if (!response.ok) throw new Error(await response.text());
  const result = await response.json();
  const action = result.action || "noop";

  if (action === "add") {
    const events = Array.isArray(result.events) ? result.events.map(normalizeAiEvent).filter(Boolean) : [];
    state.courses = dedupeEvents([...state.courses, ...events]);
    if (!state.selectedCourseId) state.selectedCourseId = state.courses.find((item) => item.type === "class")?.id || "";
    showToast(result.message || `已新增 ${events.length} 個事件`);
  } else if (action === "delete") {
    const before = state.courses.length;
    state.courses = state.courses.filter((event) => !matchesVoiceTarget(event, result.target || {}));
    showToast(result.message || `已刪除 ${before - state.courses.length} 個事件`);
  } else if (action === "update") {
    const event = state.courses.find((item) => matchesVoiceTarget(item, result.target || {}));
    if (!event) {
      showToast("找不到要修改的事件");
      return;
    }
    applyEventUpdates(event, result.updates || {});
    showToast(result.message || `已更新 ${event.title}`);
  } else {
    showToast(result.message || "我沒有聽懂要怎麼改時間表");
  }

  save();
  renderAll();
  switchView("schedule");
}

function matchesVoiceTarget(event, target) {
  if (target.type && target.type !== event.type) return false;
  if (Number.isInteger(target.day) && target.day !== event.day) return false;
  if (target.title && !compactText(event.title).includes(compactText(target.title))) return false;
  return Boolean(target.title || target.type || Number.isInteger(target.day));
}

function applyEventUpdates(event, updates) {
  ["title", "type", "day", "room", "relatedCourse"].forEach((key) => {
    if (updates[key] !== null && updates[key] !== undefined && updates[key] !== "") event[key] = updates[key];
  });
  if (updates.start) {
    event.start = String(updates.start).slice(0, 5);
    event.startMin = toMinutes(event.start);
  }
  if (updates.end) {
    event.end = String(updates.end).slice(0, 5);
    event.endMin = toMinutes(event.end);
  }
}

function wireEvents() {
  $$("[data-view-target]").forEach((button) => button.addEventListener("click", () => switchView(button.dataset.viewTarget)));
  $("#googleLogin")?.addEventListener("click", () => startOAuth("google"));
  $("#lineLogin")?.addEventListener("click", () => startOAuth("line"));
  $("#demoLogin")?.addEventListener("click", startDemoLogin);
  $("#langButton")?.addEventListener("click", () => {
    state.lang = state.lang === "zh" ? "en" : state.lang === "en" ? "ko" : "zh";
    save();
    renderAll();
  });
  $("#resetButton")?.addEventListener("click", () => {
    state.courses = [];
    state.files = [];
    state.messages = [];
    state.selectedCourseId = "";
    save();
    renderAll();
    switchView("home");
  });
  $("#openImportHome")?.addEventListener("click", openImportScheduleModal);
  $("#openImportSchedule")?.addEventListener("click", openImportScheduleModal);
  $("#openImportEvents")?.addEventListener("click", openImportEventsModal);
  $("#prevMonth")?.addEventListener("click", () => {
    const cursor = calendarCursor();
    cursor.setMonth(cursor.getMonth() - 1);
    setCalendarMonth(cursor);
    save();
    renderMonthCalendar();
  });
  $("#nextMonth")?.addEventListener("click", () => {
    const cursor = calendarCursor();
    cursor.setMonth(cursor.getMonth() + 1);
    setCalendarMonth(cursor);
    save();
    renderMonthCalendar();
  });
  $("#academicSystem")?.addEventListener("change", (event) => {
    state.academicSystem = event.target.value;
    save();
    renderMonthCalendar();
  });
  $("#scheduleInfoButton")?.addEventListener("click", () => $("#infoModal")?.classList.remove("hidden"));
  $("#closeInfo")?.addEventListener("click", () => $("#infoModal")?.classList.add("hidden"));
  $("#confirmInfo")?.addEventListener("click", () => $("#infoModal")?.classList.add("hidden"));
  $("#infoModal")?.addEventListener("click", (event) => {
    if (event.target === $("#infoModal")) $("#infoModal").classList.add("hidden");
  });
  $("#previewClose")?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    closePreviewModal();
  });
  $("#previewModal")?.addEventListener("click", (event) => {
    if (event.target === $("#previewModal")) closePreviewModal();
  });
  $("#closeImportSchedule")?.addEventListener("click", closeImportScheduleModal);
  $("#confirmImportSchedule")?.addEventListener("click", async () => {
    const value = $("#scheduleText")?.value || "";
    closeImportScheduleModal();
    await importScheduleFromTextSplit(value, "schedule");
  });
  $("#sampleBtnSchedule")?.addEventListener("click", () => {
    const txt = document.getElementById("scheduleText");
    if (txt) {
      txt.value = "114學年度 第二學期 課表\n\n星期一\n\n* 第三節 10:10-11:00｜英文｜王雅涵｜空中花園 101\n* 第四節 11:10-12:00｜英文｜王雅涵｜空中花園 101\n* 第五節 13:30-14:20｜資料庫管理系統實作｜林柏宇｜雲端基地 A5\n* 第六節 14:25-15:15｜資料庫管理系統實作｜林柏宇｜雲端基地 A5\n* 第七節 15:25-16:15｜資料庫管理系統實作｜林柏宇｜雲端基地 A5\n\n星期二\n\n* 第二節 09:10-10:00｜應用統計學｜陳冠廷｜數據之塔 202\n* 第三節 10:10-11:00｜應用統計學｜陳冠廷｜數據之塔 202\n* 第四節 11:10-12:00｜應用統計學｜陳冠廷｜數據之塔 202\n* 第五節 13:30-14:20｜機器學習與深度學習｜許家豪｜矩陣空間 404\n* 第六節 14:25-15:15｜機器學習與深度學習｜許家豪｜矩陣空間 404\n* 第七節 15:25-16:15｜機器學習與深度學習｜許家豪｜矩陣空間 404\n\n星期三\n\n* 第一節 08:10-09:00｜智慧工程與近代科技｜張哲維｜進化實驗室 99\n* 第二節 09:10-10:00｜智慧工程與近代科技｜張哲維｜進化實驗室 99\n* 第五節 13:30-14:20｜電子商務與網路行銷｜李昱辰｜虛擬市集 701\n* 第六節 14:25-15:15｜電子商務與網路行銷｜李昱辰｜虛擬市集 701\n* 第七節 15:25-16:15｜電子商務與網路行銷｜李昱辰｜虛擬市集 701\n\n星期四\n\n* 第二節 09:10-10:00｜行動應用開發｜黃子軒｜開源荒野 001\n* 第三節 10:10-11:00｜行動應用開發｜黃子軒｜開源荒野 001\n* 第四節 11:10-12:00｜行動應用開發｜黃子軒｜開源荒野 001\n* 第五節 13:30-14:20｜資訊網路｜周柏翰｜交換機房 502\n* 第六節 14:25-15:15｜資訊網路｜周柏翰｜交換機房 502\n* 第七節 15:25-16:15｜資訊網路｜周柏翰｜交換機房 502\n\n星期五\n\n* 第二節 09:10-10:00｜Linux系統｜蔡承恩｜核心終端室 604\n* 第三節 10:10-11:00｜Linux系統｜蔡承恩｜核心終端室 604\n* 第四節 11:10-12:00｜Linux系統｜蔡承恩｜核心終端室 604\n* 第五節 13:30-14:20｜資訊管理實務專題二｜吳柏霖｜夢想工廠 000\n* 第六節 14:25-15:15｜資訊管理實務專題二｜吳柏霖｜夢想工廠 000";
    }
  });
  $("#clearBtnSchedule")?.addEventListener("click", () => {
    if (confirm("確定要清空所有課表與課程資料嗎？這將無法復原。")) {
      clearSchedule();
    }
  });
  $("#voiceBtnSchedule")?.addEventListener("click", () => startVoice("schedule"));
  $("#ocrBtnSchedule")?.addEventListener("click", () => {
    state.activeOcrTarget = "schedule";
    $("#ocrInput").click();
  });

  // Events modal handlers
  $("#closeImportEvents")?.addEventListener("click", closeImportEventsModal);
  $("#confirmImportEvents")?.addEventListener("click", async () => {
    const value = $("#eventsText")?.value || "";
    closeImportEventsModal();
    await importScheduleFromTextSplit(value, "events");
  });
  $("#sampleBtnEvents")?.addEventListener("click", () => {
    const txt = document.getElementById("eventsText");
    if (txt) {
      txt.value = "星期三 19:00-21:00 籃球隊練球\n星期四 09:00-11:00 統計學小考\n星期五 14:00 專題簡報討論";
    }
  });
  $("#clearBtnEvents")?.addEventListener("click", () => {
    const txt = document.getElementById("eventsText");
    if (txt) txt.value = "";
  });
  $("#voiceBtnEvents")?.addEventListener("click", () => startVoice("events"));
  $("#ocrBtnEvents")?.addEventListener("click", () => {
    state.activeOcrTarget = "events";
    $("#ocrInput").click();
  });

  // Chat actions
  $("#sendChatBtn")?.addEventListener("click", () => {
    const input = document.getElementById("chatInput");
    if (input) {
      sendChat(input.value);
      input.value = "";
    }
  });
  $("#chatInput")?.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const input = document.getElementById("chatInput");
      if (input) {
        sendChat(input.value);
        input.value = "";
      }
    }
  });
  $("#voiceBtnChat")?.addEventListener("click", () => startVoice("chat"));

  // Library actions
  $("#libraryFileInput")?.addEventListener("change", (e) => {
    const files = e.target.files;
    if (files && files.length) {
      handleLibraryUpload(files);
    }
  });
  $("#courseFileInput")?.addEventListener("change", (e) => {
    const files = e.target.files;
    if (files && files.length) {
      handleCourseUpload(files);
    }
  });

  // Settings server url config save
  $("#saveServerUrl")?.addEventListener("click", saveServerUrl);

  // Calendar tabs view selector listeners
  $$(".calendar-tabs .tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      state.calendarView = btn.dataset.calendarView;
      save();
      renderCalendarView(state.calendarView);
    });
  });
}

function openFilePicker(selector) {
  const input = $(selector);
  if (!input) {
    showToast("找不到檔案選擇器");
    return;
  }
  input.value = "";
  input.click();
}



async function sendChat(question) {
  const clean = String(question || "").trim();
  if (!clean) return;
  state.messages.push({ role: "user", content: clean });
  const loading = { role: "bot", content: "ClassOK 思考中..." };
  state.messages.push(loading);
  renderMessages();
  save();

  const relevantFiles = findRelevantFiles(clean);
  const vaultFileIds = relevantFiles.filter(f => f.vaultFileId).map(f => f.vaultFileId);
  const localTexts = relevantFiles.map((file) => {
    const text = file.sourceText || "";
    const truncatedText = text.length > 2000
      ? text.slice(0, 2000) + "\n... (內容過長已自動截斷) ..."
      : text;
    return `【檔案：${file.name} 內容逐字稿】\n${truncatedText}`;
  });

  let contextStr = localTexts.filter(Boolean).join("\n\n");
  if (contextStr.length > 8000) {
    contextStr = contextStr.slice(0, 8000) + "\n\n... (為維護 AI 響應效能，其餘檔案內容已安全截斷) ...";
  }

  const responseLanguage = "繁體中文";
  const strictGroundingRule = `參考規範：
1. 請優先依據下方提供的課程講義內容、OCR 辨識逐字稿或已上傳檔案回答。
2. 不可以自行編造或寫出不在資料中的內容，也不可以用一般學科知識作答。
3. 如果資料不足（OCR 沒辨識出、或者非檔案主題內），請直接說「目前資料不足，請先上傳講義或檔案以供分析。」。
4. 請簡短說明你是根據哪些檔案回答。
5. 請使用繁體中文回答。`;

  let finalQuestion = "";
  if (contextStr) {
    finalQuestion = `請使用 ${responseLanguage} 回答。\n\n${strictGroundingRule}\n\n=== 檔案資料內容 ===\n${contextStr}\n\n=== 使用者提問 ===\n${clean}`;
  } else {
    finalQuestion = `請使用 ${responseLanguage} 回答。\n\n${strictGroundingRule}\n\n=== 使用者提問 ===\n${clean}`;
  }

  try {
    const response = state.apiReady ? await fetch(getApiUrl("/api/chat"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: finalQuestion, file_ids: vaultFileIds }),
    }) : null;
    if (response?.ok) {
      const result = await response.json();
      loading.content = result.answer || localAnswer(clean);
    } else {
      loading.content = localAnswer(clean);
    }
  } catch (error) {
    console.warn("Chat failed:", error);
    loading.content = localAnswer(clean);
  }
  save();
  renderMessages();
}

function localAnswer(question) {
  const classCount = state.courses.filter((event) => event.type === "class").length;
  const lifeCount = state.courses.filter((event) => event.type === "life").length;
  const examCount = state.courses.filter((event) => event.type === "exam").length;
  const nextEvents = [...state.courses]
    .sort((a, b) => (a.day ?? 9) - (b.day ?? 9) || a.startMin - b.startMin)
    .slice(0, 6)
    .map((event) => `- ${dayLabel(event.day)} ${event.start}-${event.end} ${cardKindLabel(event)}｜${event.title}`)
    .join("\n");

  if (question.includes("考") || question.toLowerCase().includes("exam") || question.toLowerCase().includes("deadline")) {
    const exams = state.courses.filter((event) => event.type === "exam")
      .map((event) => `- ${dayLabel(event.day)} ${event.start}-${event.end} ${event.title}`)
      .join("\n");
    return exams ? `目前需要注意的考試 / deadline：\n${exams}` : "目前沒有辨識到考試或 deadline。";
  }

  return `我看到了 ${classCount} 門課、${lifeCount} 個生活事件、${examCount} 個考試/deadline。\n\n接下來的事件：\n${nextEvents || "尚未匯入時間表。"}`;
}

function normalizeLoginMarkup() {
  const card = $(".login-card");
  if (!card) return;
  card.innerHTML = `
    <div class="login-bg-lines" aria-hidden="true"></div>
    <div class="login-hero">
      <img class="login-brand-logo" src="assets/logo-vertical.svg" alt="課以嗎 ClassOK" />
      <p class="login-tagline">課表驅動的 AI 學習知識管理平台</p>
    </div>
    <div class="login-copy">
      <h1>歡迎回來！<span>✦</span></h1>
      <p>選擇以下方式登入，繼續你的學習旅程</p>
    </div>
    <div class="login-panel">
      <button class="login-button google" id="googleLogin" type="button">
        <span><i class="fa-brands fa-google"></i></span>
        <strong>使用 Google 登入</strong>
      </button>
      <button class="login-button line" id="lineLogin" type="button">
        <span><i class="fa-brands fa-line"></i></span>
        <strong>使用 LINE 登入</strong>
      </button>
    </div>
    <div class="login-divider"><i></i><span>其他登入方式</span><i></i></div>
    <div class="login-terms">
      <p>登入即表示您同意</p>
      <p><a href="#" aria-label="服務條款">服務條款</a><span>・</span><a href="#" aria-label="隱私權政策">隱私權政策</a></p>
    </div>
    <small id="loginHint">需要在 .env 設定 Google / LINE OAuth 金鑰。</small>
  `;
}

function repairClassOKCopy() {
  Object.assign(typeStyles.class.label, { zh: "課程", en: "Class", ko: "수업" });
  Object.assign(typeStyles.life.label, { zh: "事件", en: "Event", ko: "일정" });
  Object.assign(typeStyles.exam.label, { zh: "考試", en: "Exam", ko: "시험" });
  Object.assign(i18n.zh, {
    positioning: "嗨，Shelly 👋",
    heroTitle: "今天準備開始學習了嗎？",
    heroSubtitle: "ClassOK 已為你整理今日課程與學習資料",
    openSchedule: "查看課表",
    askAI: "問 AI",
    courses: "今日課程",
    files: "學習資料",
    upcoming: "待複習考試",
    quickActions: "快速開始",
    importText: "匯入課表",
    uploadAll: "丟入檔案",
    library: "檔案庫",
    todayFocus: "今日課程",
    smartSchedule: "Smart Timeline",
    scheduleTitle: "時間表",
    import: "匯入",
    scan: "OCR",
    voice: "語音",
    clear: "清空",
    emptyScheduleTitle: "時間表目前是空白",
    emptyScheduleText: "貼上課程、生活事件、考試或 deadline，ClassOK 會自動分類到時間表。",
    scheduleInfo: "可以匯入課程、生活休閒、社團、聚餐、考試日期與 deadline。ClassOK 會自動辨識類型並列入時間表。",
    back: "返回",
    memoryTitle: "AI 學習記憶",
    uploadTitle: "丟入這門課的資料",
    uploadText: "PDF、照片、錄音、筆記都可以放進來",
    chatTitle: "ClassOK AI",
    navHome: "首頁",
    navSchedule: "時間",
    navLibrary: "檔案",
    importSheetTitle: "匯入時間表",
    importHint: "貼上課程、考試、deadline、聚餐、社團活動等內容，AI 會判斷課程 / 事件 / 考試。",
    sample: "範例",
    noSchedule: "先匯入時間表，ClassOK 才能整理課程、事件與考試。",
    noToday: "今天沒有安排，適合整理資料或複習。",
    apiOnline: "Online",
    apiOffline: "Demo",
    libraryTitle: "智慧檔案庫",
    dropTitle: "把所有學習資料丟到這裡",
    dropText: "點一下直接選檔，也可以拖曳進來。ClassOK 會自動分類並略過重複檔案。",
    unassigned: "尚未分類",
    duplicateSkipped: "已略過重複",
  });
}

function normalizeLoginMarkup() {
  const card = $(".login-card");
  if (!card) return;
  card.innerHTML = `
    <div class="login-bg-lines" aria-hidden="true"></div>
    <div class="login-hero">
      <img class="login-brand-logo" src="assets/logo-vertical.svg" alt="課以嗎 ClassOK" />
      <p class="login-tagline">課表驅動的 AI 學習知識管理平台</p>
    </div>
    <div class="login-copy">
      <h1>歡迎回來！<span>✦</span></h1>
      <p>選擇以下方式登入，繼續你的學習旅程</p>
    </div>
    <div class="login-panel">
      <button class="login-button google" id="googleLogin" type="button">
        <span><i class="fa-brands fa-google"></i></span>
        <strong>使用 Google 登入</strong>
      </button>
      <button class="login-button line" id="lineLogin" type="button">
        <span><i class="fa-brands fa-line"></i></span>
        <strong>使用 LINE 登入</strong>
      </button>
    </div>
    <div class="login-divider"><i></i><span>其他登入方式</span><i></i></div>
    <div class="login-terms">
      <p>登入即表示您同意</p>
      <p><a href="/terms.html" target="_blank" rel="noopener">服務條款</a><span>・</span><a href="/privacy.html" target="_blank" rel="noopener">隱私權政策</a></p>
    </div>
    <small id="loginHint">正在檢查 OAuth 設定...</small>
  `;
}

function renderAuth() {
  const login = $("#loginScreen");
  if (!login) return;
  login.classList.toggle("hidden", Boolean(state.authUser));
  document.body.classList.toggle("auth-open", !state.authUser);
  const providers = [];
  if (state.authProviders.google) providers.push("Google");
  if (state.authProviders.line) providers.push("LINE");
  const hint = $("#loginHint");
  if (hint) hint.textContent = providers.length ? `已啟用 ${providers.join(" / ")} OAuth` : "OAuth 尚未完整設定，請補 .env 憑證後重新啟動伺服器";
  const profile = $(".profile-list article:first-child div");
  if (profile) {
    profile.innerHTML = state.authUser
      ? `<strong>${escapeHtml(state.authUser.name || "Shelly")}</strong><span>${escapeHtml((state.authUser.provider || "").toUpperCase())} 登入${state.authUser.email ? ` ・ ${escapeHtml(state.authUser.email)}` : ""}</span>`
      : `<strong>Shelly</strong><span>尚未登入</span>`;
  }
  if (!$("#logoutButton") && $(".profile-list")) {
    $(".profile-list").insertAdjacentHTML("beforeend", `<article class="logout-row"><i class="fa-solid fa-right-from-bracket"></i><div><strong>登出</strong><span>清除目前登入狀態</span></div><button id="logoutButton" type="button">登出</button></article>`);
    $("#logoutButton").addEventListener("click", logout);
  }
}



async function addLibraryFiles(fileList, forcedCourseId = "") {
  const files = Array.from(fileList || []);
  if (!files.length) {
    showToast("沒有選到檔案");
    return;
  }
  showToast(`正在加入 ${files.length} 個檔案...`);
  let added = 0;
  let skipped = 0;
  for (const file of files) {
    if (isDuplicateFile(file)) {
      skipped += 1;
      continue;
    }
    const classification = forcedCourseId ? { courseId: forcedCourseId, reason: "手動放入課程" } : classifyFile(file);
    const record = {
      id: `file-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: file.name,
      type: inferFileType(file.name, file.type),
      size: file.size,
      lastModified: file.lastModified || Date.now(),
      dedupeKey: makeDedupeKey(file),
      courseId: classification.courseId,
      matchReason: classification.reason,
      summary: "正在用本機 OCR / 語音辨識讀取...",
    };
    if (record.type === "image") record.previewData = await readImageDataUrl(file);
    state.files.push(record);
    added += 1;
    extractFileSummary(file, record).catch((error) => {
      console.warn("File extraction failed:", error);
      record.summary = "已加入檔案，但 OCR / 語音辨識暫時失敗";
      save();
      renderAll();
    });
  }
  save();
  renderAll();
  if (!forcedCourseId) switchView("library");
  const parts = [];
  if (added) parts.push(`新增 ${added} 個檔案`);
  if (skipped) parts.push(`略過 ${skipped} 個重複檔`);
  showToast(parts.join("，") || "沒有新增檔案");
}

async function sendChat(question) {
  const clean = String(question || "").trim();
  if (!clean) return;
  state.messages.push({ role: "user", content: clean });
  const loading = { role: "bot", content: "ClassOK 思考中..." };
  state.messages.push(loading);
  renderMessages();
  save();

  const relevantFiles = findRelevantFiles(clean);
  const vaultFileIds = relevantFiles.filter(f => f.vaultFileId).map(f => f.vaultFileId);
  const localTexts = relevantFiles.map((file) => {
    const text = file.sourceText || "";
    const truncatedText = text.length > 2000
      ? text.slice(0, 2000) + "\n... (內容過長已自動截斷) ..."
      : text;
    return `【檔案：${file.name} 內容逐字稿】\n${truncatedText}`;
  });

  let contextStr = localTexts.filter(Boolean).join("\n\n");
  if (contextStr.length > 8000) {
    contextStr = contextStr.slice(0, 8000) + "\n\n... (為維護 AI 響應效能，其餘檔案內容已安全截斷) ...";
  }

  const responseLanguage = "繁體中文";
  const strictGroundingRule = `參考規範：
1. 請優先依據下方提供的課程講義內容、OCR 辨識逐字稿或已上傳檔案回答。
2. 不可以自行編造或寫出不在資料中的內容，也不可以用一般學科知識作答。
3. 如果資料不足（OCR 沒辨識出、或者非檔案主題內），請直接說「目前資料不足，請先上傳講義或檔案以供分析。」。
4. 請簡短說明你是根據哪些檔案回答。
5. 請使用繁體中文回答。`;

  let finalQuestion = "";
  if (contextStr) {
    finalQuestion = `請使用 ${responseLanguage} 回答。\n\n${strictGroundingRule}\n\n=== 檔案資料內容 ===\n${contextStr}\n\n=== 使用者提問 ===\n${clean}`;
  } else {
    finalQuestion = `請使用 ${responseLanguage} 回答。\n\n${strictGroundingRule}\n\n=== 使用者提問 ===\n${clean}`;
  }

  try {
    const response = state.apiReady ? await fetch(getApiUrl("/api/chat"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: finalQuestion, file_ids: vaultFileIds }),
    }) : null;
    if (response?.ok) {
      const result = await response.json();
      loading.content = result.answer || localAnswer(clean);
    } else {
      loading.content = localAnswer(clean);
    }
  } catch (error) {
    console.warn("Chat failed:", error);
    loading.content = localAnswer(clean);
  }
  save();
  renderMessages();
}

function localAnswer(question) {
  const classCount = state.courses.filter((event) => event.type === "class").length;
  const eventCount = state.courses.filter((event) => event.type === "life").length;
  const examCount = state.courses.filter((event) => event.type === "exam").length;
  const nextEvents = [...state.courses]
    .sort((a, b) => (a.day ?? 9) - (b.day ?? 9) || a.startMin - b.startMin)
    .slice(0, 6)
    .map((event) => `- ${dayLabel(event.day)} ${event.start}-${event.end} ${cardKindLabel(event)}：${event.title}`)
    .join("\n");
  if (question.includes("考") || question.toLowerCase().includes("exam") || question.toLowerCase().includes("deadline")) {
    const exams = state.courses.filter((event) => event.type === "exam")
      .map((event) => `- ${dayLabel(event.day)} ${event.start}-${event.end} ${event.title}${event.relatedCourse ? `（${event.relatedCourse}）` : ""}`)
      .join("\n");
    return exams ? `目前抓到的考試 / deadline：\n${exams}` : "目前還沒有匯入考試或 deadline。";
  }
  return `目前有 ${classCount} 個課程、${eventCount} 個事件、${examCount} 個考試。\n\n最近安排：\n${nextEvents || "還沒有匯入時間表。你可以貼上課程、生活事件或考試日期，ClassOK 會自動分類。"}`;
}

function renderMessages() {
  const messages = $("#messages");
  if (!messages) return;
  const entries = state.messages.length ? state.messages : [{ role: "bot", content: "嗨，我是 ClassOK AI。你可以問我今天有哪些課、哪些考試要準備，或請我整理已匯入的檔案。" }];
  messages.innerHTML = entries.map((message) => `<div class="message ${message.role}"><div class="bubble">${formatMessage(message.content)}</div></div>`).join("");
  messages.scrollTop = messages.scrollHeight;
}

function dayLabel(day) {
  const labels = {
    zh: ["日", "一", "二", "三", "四", "五", "六"],
    en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    ko: ["일", "월", "화", "수", "목", "금", "토"],
  };
  return labels[state.lang]?.[day] || labels.zh[day] || "";
}

async function scanSchedule(file) {
  if (!file) return;
  showToast("正在用本機 OCR 讀取...");
  const form = new FormData();
  form.append("file", file);
  try {
    const response = await fetch(getApiUrl("/api/extract-text"), { method: "POST", body: form });
    if (!response.ok) throw new Error(await response.text());
    const result = await response.json();
    $("#scheduleText").value = result.text || "";
    openImportModal();
    showToast(result.text ? "已讀取文字，請確認後匯入" : "OCR 沒有讀到文字，可以手動補一下");
  } catch (error) {
    console.warn("OCR failed:", error);
    showToast("OCR 失敗，請確認本機辨識服務已啟動");
  }
}

async function startVoice(target) {
  if (mediaRecorder && mediaRecorder.state === "recording") {
    mediaRecorder.stop();
    showToast("正在送出語音辨識...");
    return;
  }
  if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
    showToast("這個瀏覽器不支援直接錄音");
    return;
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    recordedChunks = [];
    recordingTarget = target;
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = (event) => {
      if (event.data?.size) recordedChunks.push(event.data);
    };
    mediaRecorder.onstop = () => {
      stream.getTracks().forEach((track) => track.stop());
      transcribeRecording(recordingTarget, recordedChunks).catch((error) => {
        console.warn("Voice transcription failed:", error);
        showToast("語音辨識失敗，請再試一次");
      });
    };
    mediaRecorder.start();
    showToast("開始錄音，再按一次停止");
  } catch (error) {
    console.warn("Microphone failed:", error);
    showToast("無法取得麥克風權限");
  }
}

async function transcribeRecording(target, chunks) {
  if (!chunks.length) return;
  showToast("正在用本機 Whisper 辨識...");
  const blob = new Blob(chunks, { type: "audio/webm" });
  const form = new FormData();
  form.append("file", blob, "voice.webm");
  const response = await fetch(getApiUrl("/api/extract-text"), { method: "POST", body: form });
  if (!response.ok) throw new Error(await response.text());
  const result = await response.json();
  const transcript = String(result.text || "").trim();
  if (!transcript) {
    showToast("沒有辨識到語音內容");
    return;
  }
  if (target === "chat") {
    $("#chatInput").value = transcript;
    await sendChat(transcript);
  } else {
    $("#scheduleText").value = transcript;
    await importScheduleFromText(transcript);
  }
}



function boot() {
  try {
    restore();
    initServerConfig();
    repairClassOKCopy();
    normalizeLoginMarkup();
    ensureDemoLoginButton();
    wireEvents();
    initPinchToZoom();
    repairUploadEntrypoints();
    renderAll();
    switchView(state.activeView || "home");
    checkApiStatus();
    checkAuth();
    setTimeout(() => $("#splash")?.classList.add("done"), 900);
  } catch (error) {
    console.error("Boot Error:", error);
    const splash = document.getElementById("splash");
    if (splash) {
      splash.style.background = "#8b0000";
      splash.innerHTML = `
        <div style="padding: 20px; color: white; font-family: monospace; font-size: 14px; text-align: left; max-width: 90%; overflow: auto; white-space: pre-wrap; word-break: break-all;">
          <h2 style="margin-top: 0; color: #ffcccb;">ClassOK 啟動失敗 (Boot Error)</h2>
          <p><strong>錯誤訊息：</strong>${error.message}</p>
          <p><strong>堆疊追蹤 (Stack Trace)：</strong></p>
          <pre style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 4px;">${error.stack || error}</pre>
        </div>
      `;
    } else {
      alert("Boot Error: " + (error.stack || error));
    }
  }
}

Object.assign(i18n.zh, {
  positioning: "嗨，Shelly 👋",
  heroTitle: "今天準備開始學習了嗎？",
  heroSubtitle: "ClassOK 已為你整理今日課程與學習資料",
  openSchedule: "查看課程",
  askAI: "問 AI",
  courses: "今日課程",
  files: "學習資料",
  upcoming: "待複習考試",
  quickActions: "快速加入",
  importText: "文字匯入",
  uploadAll: "一鍵丟檔",
  library: "檔案庫",
  todayFocus: "今日課程",
  smartSchedule: "課程中樞",
  scheduleTitle: "課程與時間表",
  import: "匯入",
  scan: "掃描",
  voice: "語音",
  clear: "清空",
  emptyScheduleTitle: "還沒有課程卡片",
  emptyScheduleText: "貼上課表、考試、聚餐或比賽，ClassOK 會自動整理成課程卡片與事件卡片。",
  scheduleInfoTitle: "時間表說明",
  scheduleInfo: "可以匯入課程、生活休閒、比賽、證照與考試日期；ClassOK 會自動列入時間表，並把課程相關資料集中到課程卡片。",
  infoClose: "我知道了",
  back: "返回",
  memoryTitle: "課程 AI 記憶",
  uploadTitle: "加入課程資料",
  uploadText: "PDF、照片、錄音、筆記、逐字稿、AI 摘要",
  chatTitle: "AI 學習助手",
  navHome: "首頁",
  navSchedule: "課程",
  navLibrary: "檔案",
  importSheetTitle: "匯入課程與事件",
  importHint: "可以貼上課表、考試日期、Deadline、聚餐、比賽或證照。AI 會整理成課程卡片與事件卡片。",
  sample: "範例",
  noSchedule: "先匯入課表，ClassOK 就能把課程、檔案與考試整理在一起。",
  noToday: "今天沒有課程，適合整理講義或複習考試。",
  libraryTitle: "智慧檔案庫",
  dropTitle: "一鍵丟入所有學習資料",
  dropText: "ClassOK 會背景 OCR、去除重複，並用 AI 自動分類到課程卡片。",
  unassigned: "未分類",
  duplicateSkipped: "重複檔案已自動略過",
});

typeStyles.class.label.zh = "課程";
typeStyles.life.label.zh = "事件";
typeStyles.exam.label.zh = "考試";

function dayLabel(day) {
  const labels = {
    zh: ["週日", "週一", "週二", "週三", "週四", "週五", "週六"],
    en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    ko: ["일", "월", "화", "수", "목", "금", "토"],
  };
  return labels[state.lang]?.[day] || labels.zh[day] || "";
}

function cardKindLabel(event) {
  if (typeof event === "string") {
    const kind = event;
    if (state.lang === "en") return kind === "course" ? "Course" : "Event";
    if (state.lang === "ko") return kind === "course" ? "수업" : "이벤트";
    return kind === "course" ? "課程" : "事件";
  }
  // Return the type label directly
  const t = typeStyles[event.type];
  return t?.label?.[state.lang] || t?.label?.zh || typeLabel(event.type) || "事件";
}

function openScheduleCard(event) {
  if (cardKind(event) !== "course") {
    showToast(`事件卡片：${event.title}`);
    return;
  }
  if (event.type === "class") {
    selectCourse(event.id);
    return;
  }
  const related = compactText(event.relatedCourse || event.title || "");
  const course = state.courses.find((item) => item.type === "class" && related.includes(compactText(item.title || "")));
  if (course) selectCourse(course.id);
  else showToast(`課程卡片：${event.title}`);
}

function renderInsight() {
  const title = $("#insightTitle");
  const insight = $("#insightText");
  if (!title || !insight) return;
  const nextExam = state.courses.find((item) => item.type === "exam" && cardKind(item) === "course");
  if (nextExam) {
    title.textContent = `${nextExam.title} 已加入課程卡片`;
    insight.innerHTML = `建議先整理考試範圍，再請 ClassOK 從講義、PDF、筆記與錄音中產生複習重點。`;
    return;
  }
  title.textContent = "資料庫管理期中考剩 7 天";
  insight.innerHTML = "建議複習：<strong>Trigger</strong>、<strong>Procedure</strong>、<strong>View</strong>，並把講義與筆記整理到課程卡片。";
}

function renderTodayList() {
  const list = $("#todayList");
  if (!list) return;
  const today = new Date().getDay();
  const todayEvents = state.courses.filter((event) => event.day === today);
  const display = todayEvents.length ? todayEvents : state.courses.slice(0, 3);
  if (!display.length) {
    list.innerHTML = `<div class="focus-item empty"><span class="focus-dot"></span><div><strong>還沒有今日課程</strong><span>匯入課表後，這裡會顯示今天要上的課、考試與重要事件。</span></div></div>`;
    return;
  }
  const prefix = todayEvents.length ? "" : `<div class="focus-item empty"><span class="focus-dot"></span><div><strong>今天沒有課程</strong><span>先顯示最近的課程卡片與事件卡片。</span></div></div>`;
  list.innerHTML = prefix + display.map((event) => `
    <button class="focus-item ${cardKind(event)}-focus" data-event-id="${event.id}">
      <span class="focus-dot" style="background:${cardKindColor(event)}"></span>
      <div>
        <em>${cardKindLabel(event)}</em>
        <strong>${escapeHtml(event.title)}</strong>
        <span>${dayLabel(event.day)} ${event.start}-${event.end}${event.room ? ` · ${escapeHtml(event.room)}` : ""}</span>
      </div>
      <i class="fa-solid fa-chevron-right"></i>
    </button>
  `).join("");
  $$("#todayList [data-event-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const event = state.courses.find((item) => item.id === button.dataset.eventId);
      if (event) openScheduleCard(event);
    });
  });
}

function localAnswer(question) {
  const classCount = state.courses.filter((event) => event.type === "class").length;
  const eventCount = state.courses.filter((event) => event.type === "life").length;
  const examCount = state.courses.filter((event) => event.type === "exam").length;
  const nextEvents = [...state.courses]
    .sort((a, b) => (a.day ?? 9) - (b.day ?? 9) || a.startMin - b.startMin)
    .slice(0, 6)
    .map((event) => `- ${dayLabel(event.day)} ${event.start}-${event.end} 【${cardKindLabel(event)}】${event.title}`)
    .join("\n");

  if (question.includes("考") || question.toLowerCase().includes("exam") || question.toLowerCase().includes("deadline")) {
    const exams = state.courses.filter((event) => event.type === "exam")
      .map((event) => `- ${dayLabel(event.day)} ${event.start}-${event.end} ${event.title}`)
      .join("\n");
    return exams ? `目前的考試 / deadline：\n${exams}` : "目前還沒有匯入考試或 deadline。";
  }

  return `目前有 ${classCount} 門課、${eventCount} 個生活事件、${examCount} 個考試/deadline。\n\n近期項目：\n${nextEvents || "尚未匯入時間表。"}`;
}

async function parseSchedule(input) {
  const localEvents = parseScheduleLocally(input);
  if (localEvents.length) return localEvents;

  const response = await fetch(getApiUrl("/api/parse-events"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: input, language: state.lang === "zh" ? "zh-Hant" : state.lang }),
  });
  if (!response.ok) throw new Error(await response.text());
  const payload = await response.json();
  const events = Array.isArray(payload.events) ? payload.events : [];
  return events.map(normalizeAiEvent).filter(Boolean)
    .sort((a, b) => (a.day ?? 9) - (b.day ?? 9) || a.startMin - b.startMin);
}



function classokCleanTitle(value) {
  const cleaned = classokCleanDecorations(value);
  const pipeParts = cleaned.split(/[|｜│┃]+/).map(classokCleanDecorations).filter(Boolean);
  const title = pipeParts[0] || cleaned;
  return title
    .replace(/^(?:\u8981|\u6709|\u662f|\u7684|\u8ab2\u7a0b|\u8ab2|\u8003|\u4e0a\u8ab2)\s*/, "")
    .replace(/\s*(?:\u5728|\u65bc)\s*$/, "")
    .trim();
}

function classokCleanDecorations(value) {
  return String(value || "")
    .replace(/[\u200b-\u200d\ufeff]/g, "")
    .replace(/^[\s|｜│┃:：,，、\-－–—~～]+/, "")
    .replace(/[\s|｜│┃:：,，、\-－–—~～]+$/, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function classokCleanDecorations(value) {
  return String(value || "")
    .replace(/[\u200b-\u200d\ufeff]/g, "")
    .replace(/^[\s|｜│┃:：,，、\-－–—~～]+/, "")
    .replace(/[\s|｜│┃:：,，、\-－–—~～]+$/, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function classokCleanTitle(value) {
  const cleaned = classokCleanDecorations(value);
  const pipeParts = cleaned.split(/[|｜│┃]+/).map(classokCleanDecorations).filter(Boolean);
  const title = pipeParts[0] || cleaned;
  return title
    .replace(/^(?:\u8981|\u6709|\u662f|\u7684|\u8ab2\u7a0b|\u8ab2|\u8003|\u4e0a\u8ab2)\s*/, "")
    .replace(/\s*(?:\u5728|\u65bc)\s*$/, "")
    .trim();
}

function normalizeAiEvent(event, index) {
  const start = String(event.start || "09:00").replace("：", ":").slice(0, 5);
  const end = String(event.end || "10:00").replace("：", ":").slice(0, 5);
  const startMin = toMinutes(start);
  const endMin = toMinutes(end);
  if (!Number.isFinite(startMin) || !Number.isFinite(endMin) || endMin <= startMin) return null;
  const title = classokCleanTitle(event.title || `Event ${index + 1}`);
  const relatedCourse = classokCleanTitle(event.relatedCourse || "");
  return {
    id: `event-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 7)}`,
    day: Number.isInteger(event.day) ? event.day : Number.isInteger(Number(event.day)) ? Number(event.day) : null,
    date: event.date || "",
    start,
    end,
    startMin,
    endMin,
    title,
    room: classokCleanDecorations(event.room || ""),
    relatedCourse,
    type: typeStyles[event.type] ? event.type : "life",
    keywords: compactText(`${title} ${relatedCourse}`).split(" ").filter(Boolean),
  };
}

function compactText(str) {
  return String(str || "").replace(/\s+/g, "").toLowerCase();
}

function dateKey(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function mergeContiguousCourses(events) {
  const sorted = [...events].sort((a, b) => (a.day ?? 0) - (b.day ?? 0) || a.startMin - b.startMin);
  const merged = [];
  sorted.forEach(event => {
    if (!merged.length) { merged.push({ ...event }); return; }
    const last = merged[merged.length - 1];
    const isSameDay = last.day === event.day;
    const isSameTitle = compactText(last.title) === compactText(event.title);
    const isSameType = last.type === event.type;
    const isContiguous = event.startMin >= last.startMin && event.startMin - last.endMin <= 15;
    if (isSameDay && isSameTitle && isSameType && isContiguous) {
      last.endMin = Math.max(last.endMin, event.endMin);
      last.end = event.end;
      if (event.room && last.room && !last.room.includes(event.room)) last.room += ` / ${event.room}`;
      else if (event.room && !last.room) last.room = event.room;
    } else {
      merged.push({ ...event });
    }
  });
  return merged;
}

function classokIsEventOnlyTitle(title) {
  return /會議|系務|講座|報名|截止|聚餐|朋友|討論|游泳|唱歌|社團|活動|比賽|證照|CCNA|TOEIC|多益/i.test(String(title || ""));
}

function classokIsCourseExamTitle(title) {
  return /考試|小考|期中|期末|測驗|quiz|midterm|final/i.test(String(title || ""));
}

function classokFindMatchedCourse(event, courses) {
  const related = compactText(event.relatedCourse || "");
  const title = compactText(event.title || "");
  return courses.find((course) => {
    const courseTitle = compactText(course.title || "");
    if (!courseTitle) return false;
    if (related && (courseTitle.includes(related) || related.includes(courseTitle))) return true;
    return title.includes(courseTitle);
  }) || null;
}

function classokNormalizeProductTypes(events) {
  const normalized = events.map((event) => ({ ...event, title: classokCleanTitle(event.title), relatedCourse: classokCleanTitle(event.relatedCourse || "") }));
  const courses = normalized.filter((event) => event.type === "class").concat(state.courses.filter((event) => event.type === "class"));
  return normalized.map((event) => {
    if (event.type === "class" && classokIsEventOnlyTitle(event.title)) {
      return { ...event, type: "life", relatedCourse: "" };
    }
    const matchedCourse = classokFindMatchedCourse(event, courses);
    const isExam = event.type === "exam" || classokIsCourseExamTitle(event.title);
    if (isExam && matchedCourse && !classokIsEventOnlyTitle(event.title)) {
      return { ...event, type: "exam", relatedCourse: matchedCourse.title };
    }
    if (event.type === "exam" || isExam || classokIsEventOnlyTitle(event.title)) {
      return { ...event, type: "life", relatedCourse: "" };
    }
    return event;
  });
}

function cardKind(event) {
  return event?.type === "class" ? "course" : "event";
}

function cardKindLabel(event) {
  if (typeof event === "string") return event === "course" ? "課程" : "事件";
  return event?.type === "class" ? "課程" : "事件";
}

function courseForExam(exam) {
  if (!exam || exam.type !== "exam") return null;
  return classokFindMatchedCourse(exam, state.courses.filter((course) => course.type === "class"));
}

function courseExamForCourse(course) {
  if (!course || course.type !== "class") return null;
  return state.courses.find((event) => event.type === "exam" && courseForExam(event)?.id === course.id) || null;
}

function cardKindColor(event) {
  if (event?.type === "class" && courseExamForCourse(event)) return "#ff8a3d";
  return event?.type === "class" ? "#2563eb" : "#0b1736";
}

function classokVisibleEvents() {
  return state.courses.filter((event) => !(event.type === "exam" && courseForExam(event)));
}

function eventsForDate(date) {
  const key = dateKey(date);
  const day = date.getDay();
  return classokVisibleEvents()
    .filter((event) => event.date === key || (!event.date && event.day === day))
    .sort((a, b) => a.startMin - b.startMin);
}

function renderTodayList() {
  const list = $("#todayList");
  if (!list) return;
  const today = new Date().getDay();
  const visible = classokVisibleEvents();
  const todayEvents = visible.filter((event) => event.day === today);
  const display = todayEvents.length ? todayEvents : visible.slice(0, 3);
  if (!display.length) {
    list.innerHTML = `<div class="focus-item empty"><span class="focus-dot"></span><div><strong>時間表目前是空白</strong><span>匯入課程或事件後，ClassOK 會整理到這裡。</span></div></div>`;
    return;
  }
  const prefix = todayEvents.length ? "" : `<div class="focus-item empty"><span class="focus-dot"></span><div><strong>今天沒有課程</strong><span>先顯示最近的課程與事件。</span></div></div>`;
  list.innerHTML = prefix + display.map((event) => {
    const exam = event.type === "class" ? courseExamForCourse(event) : null;
    return `
      <button class="focus-item ${cardKind(event)}-focus" data-event-id="${event.id}">
        <span class="focus-dot" style="background:${cardKindColor(event)}"></span>
        <div>
          <em>${cardKindLabel(event)}${exam ? "｜考" : ""}</em>
          <strong>${escapeHtml(event.title)}</strong>
          <span>${dayLabel(event.day)} ${event.start}-${event.end}${event.room ? ` · ${escapeHtml(event.room)}` : ""}</span>
        </div>
        <i class="fa-solid fa-chevron-right"></i>
      </button>
    `;
  }).join("");
  $$("#todayList [data-event-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const event = state.courses.find((item) => item.id === button.dataset.eventId);
      if (event) openScheduleCard(event);
    });
  });
}

async function parseSchedule(input) {
  try {
    const response = await fetch(getApiUrl("/api/parse-events"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: input, language: state.lang === "zh" ? "zh-Hant" : state.lang }),
    });
    if (!response.ok) throw new Error(await response.text());
    const payload = await response.json();
    const events = Array.isArray(payload.events) ? payload.events : [];
    const aiEvents = classokNormalizeProductTypes(events.map(normalizeAiEvent).filter(Boolean))
      .sort((a, b) => (a.day ?? 9) - (b.day ?? 9) || a.startMin - b.startMin);
    if (aiEvents.length) return aiEvents;
  } catch (error) {
    console.warn("Qwen parse failed, using local fallback:", error);
  }

  return classokNormalizeProductTypes(parseScheduleLocally(input));
}



async function addLibraryFiles(fileList, forcedCourseId = "") {
  const files = Array.from(fileList || []);
  if (!files.length) {
    console.warn("addLibraryFiles called without files");
    return;
  }

  let added = 0;
  let skipped = 0;
  for (const file of files) {
    if (isDuplicateFile(file)) {
      skipped += 1;
      continue;
    }
    const classification = forcedCourseId ? { courseId: forcedCourseId, reason: "手動放入課程" } : classifyFile(file);
    const record = {
      id: `file-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: file.name,
      type: inferFileType(file.name, file.type),
      size: file.size,
      lastModified: file.lastModified || Date.now(),
      dedupeKey: makeDedupeKey(file),
      courseId: classification.courseId,
      matchReason: classification.reason,
      summary: "正在讀取檔案內容...",
    };
    if (record.type === "image") record.previewData = await readImageDataUrl(file);
    state.files.push(record);
    added += 1;
    extractFileSummary(file, record).catch((error) => {
      console.warn("File extraction failed:", error);
      record.summary = "已加入檔案，OCR / 文字擷取稍後可重試";
      save();
      renderAll();
    });
  }

  save();
  renderAll();
  if (!forcedCourseId) switchView("library");
  const parts = [];
  if (added) parts.push(`已加入 ${added} 個檔案`);
  if (skipped) parts.push(`略過 ${skipped} 個重複檔`);
  showToast(parts.join("，") || "沒有新增檔案");
}

async function addCourseFiles(fileList) {
  const course = state.courses.find((item) => item.id === state.selectedCourseId && item.type === "class");
  if (!course) {
    showToast("請先選擇一門課");
    return;
  }
  await addLibraryFiles(fileList, course.id);
}

function replaceNodeWithoutListeners(selector) {
  const node = $(selector);
  if (!node) return null;
  const clone = node.cloneNode(true);
  node.replaceWith(clone);
  return clone;
}

function ensureUploadInput(id, accept = "", multiple = true) {
  let input = document.getElementById(id);
  if (!input) {
    input = document.createElement("input");
    input.id = id;
    document.body.appendChild(input);
  }
  input.type = "file";
  input.multiple = multiple;
  if (accept) input.accept = accept;
  input.className = "file-input-hidden";
  input.removeAttribute("hidden");
  return input;
}

function repairUploadEntrypoints() {
  const libraryInput = ensureUploadInput("libraryFileInput", "", true);
  const courseInput = ensureUploadInput("courseFileInput", "", true);
  const ocrInput = ensureUploadInput("ocrInput", "image/*,.pdf", false);

  libraryInput.onchange = async (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (!files.length) {
      showToast("沒有選到檔案，請再試一次");
      return;
    }
    await addLibraryFiles(files);
  };

  courseInput.onchange = async (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (!files.length) {
      showToast("沒有選到檔案，請再試一次");
      return;
    }
    await addCourseFiles(files);
  };

  ocrInput.onchange = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    scanSchedule(file);
  };

  const openLibrary = (event) => {
    event.stopPropagation();
    libraryInput.value = "";
    libraryInput.click();
  };
  const openCourse = (event) => {
    event.stopPropagation();
    courseInput.value = "";
    courseInput.click();
  };
    courseInput.click();
  };

  ["#libraryUploadHome", "#libraryDropZone"].forEach((selector) => {
    const node = replaceNodeWithoutListeners(selector);
    if (!node) return;
    node.removeAttribute("for");
    node.addEventListener("click", openLibrary);
    node.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") openLibrary(event);
    });
  });

  const courseNode = replaceNodeWithoutListeners("#courseUploadZone");
  if (courseNode) {
    courseNode.removeAttribute("for");
    courseNode.addEventListener("click", openCourse);
    courseNode.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") openCourse(event);
    });
  }

  const dropZone = $("#libraryDropZone");
  dropZone?.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropZone.classList.add("dragging");
  });
  dropZone?.addEventListener("dragleave", () => dropZone.classList.remove("dragging"));
  dropZone?.addEventListener("drop", async (event) => {
    event.preventDefault();
    dropZone.classList.remove("dragging");
    await addLibraryFiles(Array.from(event.dataTransfer?.files || []));
  });
}

async function addLibraryFiles(fileList, forcedCourseId = "") {
  const files = Array.from(fileList || []).filter(Boolean);
  if (!files.length) {
    showToast("沒有選到檔案，請再試一次");
    return;
  }

  if (!Array.isArray(state.files)) state.files = [];
  let added = 0;
  let skipped = 0;

  for (const file of files) {
    if (isDuplicateFile(file)) {
      skipped += 1;
      continue;
    }
    const classification = forcedCourseId ? { courseId: forcedCourseId, reason: "手動加入課程" } : classifyFile(file);
    const record = {
      id: `file-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: file.name || "未命名檔案",
      type: inferFileType(file.name || "", file.type || ""),
      size: file.size || 0,
      lastModified: file.lastModified || Date.now(),
      dedupeKey: makeDedupeKey(file),
      courseId: classification.courseId || "",
      matchReason: classification.reason || "已加入檔案庫",
      summary: "正在讀取檔案內容...",
    };
    if (record.type === "image") record.previewData = await readImageDataUrl(file);
    state.files.push(record);
    added += 1;
    extractFileSummary(file, record).catch((error) => {
      console.warn("File extraction failed:", error);
      record.summary = "已加入檔案庫，OCR / 文字摘要稍後可再執行。";
      save();
      renderAll();
    });
  }

  save();
  renderAll();
  if (!forcedCourseId) switchView("library");
  const parts = [];
  if (added) parts.push(`已加入 ${added} 個檔案`);
  if (skipped) parts.push(`略過 ${skipped} 個重複檔案`);
  showToast(parts.join("，") || "沒有新增檔案");
}

async function addCourseFiles(fileList) {
  const course = state.courses.find((item) => item.id === state.selectedCourseId);
  if (!course) {
    showToast("請先選一門課程");
    return;
  }
  await addLibraryFiles(fileList, course.id);
}

function attachInlineUploadPicker(selector, options = {}) {
  const node = replaceNodeWithoutListeners(selector);
  if (!node) return null;
  node.removeAttribute("for");
  node.classList.add("has-inline-upload");
  node.querySelectorAll("input[type='file']").forEach((input) => input.remove());

  const input = document.createElement("input");
  input.type = "file";
  input.className = "upload-inline-input";
  input.multiple = options.multiple !== false;
  if (options.accept) input.accept = options.accept;
  input.setAttribute("aria-label", options.label || "選擇檔案");

  input.addEventListener("change", async (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (!files.length) {
      showToast("沒有選到檔案，請再試一次");
      return;
    }
    node.classList.add("upload-picking");
    try {
      await options.onFiles?.(files);
    } finally {
      node.classList.remove("upload-picking");
    }
  });

  node.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    input.click();
  });

  node.appendChild(input);
  return node;
}

function repairUploadEntrypoints() {
  const ocrInput = ensureUploadInput("ocrInput", "image/*,.pdf", false);
  ocrInput.onchange = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    scanSchedule(file);
  };

  attachInlineUploadPicker("#libraryUploadHome", {
    label: "一鍵丟檔",
    onFiles: async (files) => addLibraryFiles(files),
  });

  const dropZone = attachInlineUploadPicker("#libraryDropZone", {
    label: "加入檔案庫",
    onFiles: async (files) => addLibraryFiles(files),
  });

  dropZone?.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropZone.classList.add("dragging");
  });
  dropZone?.addEventListener("dragleave", () => dropZone.classList.remove("dragging"));
  dropZone?.addEventListener("drop", async (event) => {
    event.preventDefault();
    dropZone.classList.remove("dragging");
    await addLibraryFiles(Array.from(event.dataTransfer?.files || []));
  });

  attachInlineUploadPicker("#courseUploadZone", {
    label: "加入課程檔案",
    onFiles: async (files) => addCourseFiles(files),
  });
}

function attachInlineUploadPickerStable(selector, options = {}) {
  const node = replaceNodeWithoutListeners(selector);
  if (!node) return null;
  node.removeAttribute("for");
  node.classList.add("has-inline-upload");
  node.querySelectorAll("input[type='file']").forEach((input) => input.remove());

  const input = document.createElement("input");
  input.type = "file";
  input.className = "upload-inline-input";
  input.multiple = options.multiple !== false;
  if (options.accept) input.accept = options.accept;
  input.setAttribute("aria-label", options.label || "Choose files");

  input.addEventListener("change", async (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (!files.length) return;
    node.classList.add("upload-picking");
    try {
      await options.onFiles?.(files);
    } finally {
      node.classList.remove("upload-picking");
    }
  });

  node.addEventListener("click", (event) => {
    if (event.target === input) return;
    input.click();
  });

  node.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    input.click();
  });

  node.appendChild(input);
  return node;
}

function repairUploadEntrypoints() {
  const ocrInput = ensureUploadInput("ocrInput", "image/*,.pdf", false);
  ocrInput.onchange = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (file) scanSchedule(file);
  };

  attachInlineUploadPickerStable("#libraryUploadHome", {
    label: "Upload files",
    onFiles: async (files) => addLibraryFiles(files),
  });

  const dropZone = attachInlineUploadPickerStable("#libraryDropZone", {
    label: "Upload files to library",
    onFiles: async (files) => addLibraryFiles(files),
  });

  dropZone?.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropZone.classList.add("dragging");
  });
  dropZone?.addEventListener("dragleave", () => dropZone.classList.remove("dragging"));
  dropZone?.addEventListener("drop", async (event) => {
    event.preventDefault();
    dropZone.classList.remove("dragging");
    const files = Array.from(event.dataTransfer?.files || []);
    if (files.length) await addLibraryFiles(files);
  });

  attachInlineUploadPickerStable("#courseUploadZone", {
    label: "Upload course files",
    onFiles: async (files) => addCourseFiles(files),
  });
}

function initServerConfig() {
  const serverInput = document.getElementById("serverUrlInput");
  if (serverInput) {
    serverInput.value = localStorage.getItem("classok-server-url") || "";
  }
  const saveBtn = document.getElementById("saveServerUrl");
  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      const url = serverInput.value.trim();
      if (url) {
        try {
          new URL(url); // basic validation
          localStorage.setItem("classok-server-url", url);
          showToast("伺服器網址已更新並儲存！");
          if (typeof checkApiStatus === "function") checkApiStatus();
          if (typeof checkAuth === "function") checkAuth();
        } catch (e) {
          showToast("請輸入有效的網址 (例如 http://192.168.1.100:4185)");
        }
      } else {
        localStorage.removeItem("classok-server-url");
        showToast("已清除伺服器設定，將使用預設相對路徑。");
        if (typeof checkApiStatus === "function") checkApiStatus();
        if (typeof checkAuth === "function") checkAuth();
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", boot);
