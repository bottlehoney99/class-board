const STORAGE_KEY = "class-board-state-v2";
const SCHOOL_NAME = "수원정보과학고등학교";
const CLASS_NAME = "1학년 8반";
const DEPARTMENT_NAME = "IT소프트웨어과";
const STUDENT_COUNT = 24;
const SCHOOL_HOME_URL = "https://swjb-h.goesw.kr";
const SCHOOL_SCHEDULE_URL = "https://swjb-h.goesw.kr/swjb-h/ps/schdul/selectSchdulMainList.do?mi=8607";
const SCHOOL_MEAL_URL = "https://swjb-h.goesw.kr/subList/31000019471";
const ACADEMIC_SCHEDULE_SOURCE = "2026학사일정(11.17)여름방학짧게.xlsx";
const NEIS_OFFICE_CODE = "J10";
const NEIS_SCHOOL_CODE = "7530899";

const boards = {
  notice: "공지사항",
  homework: "숙제/과제",
  supplies: "준비물",
  question: "질문",
  free: "자유게시판",
  gallery: "사진첩",
  archive: "자료실"
};

const roleNames = {
  student: "학생",
  admin: "관리자"
};

const boardCategories = ["전체", "공지", "과제", "질문", "자료", "사진", "잡담"];
const blockedExtensions = [".exe", ".bat", ".cmd", ".msi", ".js", ".vbs", ".ps1", ".scr"];
const allowedImageExtensions = [".png", ".jpg", ".jpeg", ".gif", ".webp"];
const seatingColumnCounts = [4, 5, 5, 5, 5];
const classStudents = [
  "한모세", "재홍강", "김덕용", "김동인", "김유빈", "김정연",
  "김태윤", "박건희", "박현빈", "성태우", "송유진", "우도형",
  "이병수", "이승언", "이시후", "이예은", "이준상", "임승현",
  "정세민", "정율교", "최민호", "최은호", "최재석", "황예슬"
];

const seedState = {
  currentUserId: "guest",
  guestReadable: true,
  studentName: "1-8 학생",
  fileLimitMb: 20,
  users: [
    { id: "admin01", password: "1234", name: "1-8 관리자", studentNo: "-", role: "admin", className: CLASS_NAME, approved: true }
  ],
  posts: [
    {
      id: "p1",
      board: "notice",
      category: "공지",
      title: "5월 학급 운영 안내",
      content: "수원정보과학고등학교 1학년 8반 게시판입니다.\n\n학생은 로그인 없이 게시판, 학사일정, 급식표를 확인할 수 있고 게시글 작성과 관리는 관리자만 할 수 있습니다.",
      authorId: "admin01",
      createdAt: "2026-05-06 08:30",
      views: 42,
      pinned: true,
      hidden: false,
      reported: false,
      attachments: ["학급운영안내.pdf"],
      images: [],
      comments: [
        { id: "c1", authorId: "admin01", content: "확인했습니다.", createdAt: "2026-05-06 09:05" }
      ]
    },
    {
      id: "p2",
      board: "homework",
      category: "과제",
      title: "국어 독서록 제출",
      content: "금요일까지 독서록 1편을 작성해 자료실 양식에 맞춰 제출하세요.",
      authorId: "admin01",
      createdAt: "2026-05-05 15:10",
      views: 31,
      pinned: true,
      hidden: false,
      reported: false,
      attachments: ["독서록양식.hwp"],
      images: [],
      comments: []
    },
    {
      id: "p3",
      board: "supplies",
      category: "공지",
      title: "내일 미술 준비물",
      content: "수채화 도구, 앞치마, 신문지를 준비해주세요.",
      authorId: "admin01",
      createdAt: "2026-05-04 13:45",
      views: 57,
      pinned: false,
      hidden: false,
      reported: false,
      attachments: [],
      images: [],
      comments: []
    },
    {
      id: "p4",
      board: "question",
      category: "질문",
      title: "수학 42쪽 3번 풀이 질문",
      content: "질문 게시판 예시입니다. 실제 운영에서는 관리자가 공지성 질문과 답변을 정리해 올릴 수 있습니다.",
      authorId: "admin01",
      createdAt: "2026-05-03 20:18",
      views: 18,
      pinned: false,
      hidden: false,
      reported: false,
      attachments: [],
      images: [],
      comments: [
        { id: "c2", authorId: "admin01", content: "내일 아침에 칠판에 예시로 설명할게요.", createdAt: "2026-05-03 21:04" }
      ]
    },
    {
      id: "p5",
      board: "free",
      category: "잡담",
      title: "체육대회 응원 문구 추천",
      content: "1학년 8반 응원 문구 아이디어를 모아 공지할 예정입니다.",
      authorId: "admin01",
      createdAt: "2026-05-02 18:22",
      views: 24,
      pinned: false,
      hidden: false,
      reported: false,
      attachments: [],
      images: [],
      comments: []
    },
    {
      id: "p6",
      board: "gallery",
      category: "사진",
      title: "과학 실험 활동 사진",
      content: "모둠별 실험 장면을 사진첩에 정리했습니다.",
      authorId: "admin01",
      createdAt: "2026-05-01 16:30",
      views: 66,
      pinned: false,
      hidden: false,
      reported: false,
      attachments: ["science-lab.jpg"],
      images: ["science-lab.jpg"],
      comments: []
    },
    {
      id: "p7",
      board: "archive",
      category: "자료",
      title: "학급 회의록 양식",
      content: "학급 회의 때 사용할 회의록 양식입니다.",
      authorId: "admin01",
      createdAt: "2026-04-29 12:00",
      views: 12,
      pinned: false,
      hidden: false,
      reported: false,
      attachments: ["회의록양식.docx"],
      images: [],
      comments: []
    }
  ],
  events: [
    { date: "2026-05-07", title: "미술 수행평가" },
    { date: "2026-05-11", title: "학급 회의" },
    { date: "2026-05-15", title: "체육대회" },
    { date: "2026-05-20", title: "수학 단원평가" },
    { date: "2026-05-27", title: "진로 활동" }
  ],
  notifications: [
    { id: "n1", text: "새 공지: 5월 학급 운영 안내", createdAt: "2026-05-06 08:30", read: false },
    { id: "n2", text: "국어 독서록 제출 일정이 등록되었습니다.", createdAt: "2026-05-05 15:10", read: false }
  ],
  seating: {
    seats: createDefaultSeats(),
    lastChangedAt: ""
  }
};

let state = loadState();
let activeView = "home";
let activeBoard = "notice";
let activePostId = null;
let editingPostId = null;
let searchTerm = "";

const $ = (selector) => document.querySelector(selector);

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  const loaded = saved ? JSON.parse(saved) : cloneSeedState();
  if (!loaded.users.some((user) => user.id === "admin01")) {
    loaded.users.push(seedState.users[0]);
  }
  if (!loaded.studentName) {
    loaded.studentName = "1-8 학생";
  }
  if (!loaded.seating || !Array.isArray(loaded.seating.seats) || loaded.seating.seats.length !== STUDENT_COUNT) {
    loaded.seating = cloneSeedState().seating;
  }
  return loaded;
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function cloneSeedState() {
  return JSON.parse(JSON.stringify(seedState));
}

function currentUser() {
  if (state.currentUserId === "guest") {
    return { id: "student", name: state.studentName || "1-8 학생", role: "student", approved: true };
  }
  return state.users.find((user) => user.id === state.currentUserId) || state.users[0];
}

function canRead() {
  return currentUser().role === "student" || currentUser().role === "admin" || state.guestReadable;
}

function canWrite(board) {
  const role = currentUser().role;
  return role === "student" || role === "admin";
}

function canComment() {
  const role = currentUser().role;
  return role === "student" || role === "admin";
}

function canManagePost(post) {
  const user = currentUser();
  return user.role === "admin";
}

function canAdmin() {
  return currentUser().role === "admin";
}

function authorName(id) {
  if (id === "student") return state.studentName || "1-8 학생";
  return state.users.find((user) => user.id === id)?.name || "알 수 없음";
}

function nowText() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function uid(prefix) {
  return `${prefix}${Date.now()}${Math.random().toString(16).slice(2, 6)}`;
}

function createDefaultSeats() {
  return classStudents.map((student, index) => ({ id: `seat-${index + 1}`, student, locked: false }));
}

function shuffled(items) {
  const copy = items.slice();
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function seatIndex(columnIndex, rowIndex) {
  let index = 0;
  for (let i = 0; i < columnIndex; i += 1) index += seatingColumnCounts[i];
  return index + rowIndex;
}

function frontFirstSeatIndexes() {
  const maxRows = Math.max(...seatingColumnCounts);
  const indexes = [];
  for (let rowIndex = 0; rowIndex < maxRows; rowIndex += 1) {
    for (let columnIndex = 0; columnIndex < seatingColumnCounts.length; columnIndex += 1) {
      if (rowIndex < seatingColumnCounts[columnIndex]) {
        indexes.push(seatIndex(columnIndex, rowIndex));
      }
    }
  }
  return indexes;
}

function seatingStats() {
  const locked = state.seating.seats.filter((seat) => seat.locked).length;
  return { locked, random: STUDENT_COUNT - locked };
}

function visiblePosts() {
  const user = currentUser();
  return state.posts.filter((post) => !post.hidden || user.role === "admin");
}

function postsForBoard(board) {
  return visiblePosts()
    .filter((post) => post.board === board)
    .filter((post) => {
      if (!searchTerm) return true;
      const haystack = `${post.title} ${post.content} ${post.category} ${authorName(post.authorId)}`.toLowerCase();
      return haystack.includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.createdAt.localeCompare(a.createdAt));
}

function setView(view, board) {
  activeView = view;
  if (board) activeBoard = board;
  $(".auth-panel").classList.add("hidden");
  document.querySelectorAll(".view").forEach((el) => el.classList.add("hidden"));
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.toggle("active", item.dataset.view === view && (!item.dataset.board || item.dataset.board === activeBoard));
  });

  const viewMap = {
    home: "#homeView",
    board: "#boardView",
    detail: "#detailView",
    editor: "#editorView",
    calendar: "#calendarView",
    meal: "#mealView",
    seating: "#seatingView",
    mypage: "#mypageView",
    admin: "#adminView"
  };

  $(viewMap[view]).classList.remove("hidden");
  render();
}

function render() {
  renderShell();
  if (activeView === "home") renderHome();
  if (activeView === "board") renderBoard();
  if (activeView === "detail") renderDetail();
  if (activeView === "editor") renderEditor();
  if (activeView === "calendar") renderCalendar();
  if (activeView === "meal") renderMeal();
  if (activeView === "seating") renderSeating();
  if (activeView === "mypage") renderMyPage();
  if (activeView === "admin") renderAdmin();
  renderNotifications();
}

function renderShell() {
  const user = currentUser();
  $("#currentUserLabel").textContent = user.role === "student" ? "학생 모드" : `${user.name} · ${roleNames[user.role]}`;
  $("#loginToggle").textContent = user.role === "student" ? "관리자 로그인" : "관리자 메뉴";
  $(".admin-link").classList.toggle("hidden", user.role !== "admin");
  $("#notificationCount").textContent = state.notifications.filter((item) => !item.read).length;
}

function renderHome() {
  const recent = visiblePosts().slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);
  const pinned = visiblePosts().filter((post) => post.pinned).slice(0, 4);
  $("#homeView").innerHTML = `
    <div class="hero">
      <div class="hero-copy">
        <h1>오늘 필요한 학급 소식을 한곳에서</h1>
        <p>${SCHOOL_NAME} ${DEPARTMENT_NAME} ${CLASS_NAME} 학생들이 로그인 없이 공지, 과제, 준비물, 학사일정, 급식표를 확인하는 게시판입니다.</p>
      </div>
      <div class="hero-visual" aria-label="교실 활동 이미지"></div>
    </div>
    <div class="stats">
      <div class="stat"><span>반 인원</span><strong>${STUDENT_COUNT}</strong></div>
      <div class="stat"><span>전체 글</span><strong>${visiblePosts().length}</strong></div>
      <div class="stat"><span>고정 공지</span><strong>${pinned.length}</strong></div>
      <div class="stat"><span>학과</span><strong>IT/SW</strong></div>
    </div>
    <div class="dashboard-grid">
      <section>
        <div class="section-head"><h2>최신 글</h2><button data-view-target="board" data-board-target="notice">게시판 보기</button></div>
        <div class="post-list">${recent.map(postCard).join("") || empty("아직 게시글이 없습니다.")}</div>
      </section>
      <section>
        <div class="section-head"><h2>학교 정보</h2></div>
        <div class="source-panel">
          <h3>${SCHOOL_NAME}</h3>
          <p class="meta">${DEPARTMENT_NAME} · ${CLASS_NAME} · ${STUDENT_COUNT}명</p>
          <a href="${SCHOOL_HOME_URL}" target="_blank" rel="noopener">학교 홈페이지 열기</a>
          <a href="${SCHOOL_SCHEDULE_URL}" target="_blank" rel="noopener">공식 학사일정 보기</a>
          <a href="${SCHOOL_MEAL_URL}" target="_blank" rel="noopener">공식 급식메뉴 보기</a>
          <p class="meta">학사일정 기준 자료: ${ACADEMIC_SCHEDULE_SOURCE}</p>
        </div>
      </section>
    </div>
  `;
}

function renderBoard() {
  if (!canRead()) {
    $("#boardView").innerHTML = empty("비회원 열람이 꺼져 있습니다. 로그인 후 이용해주세요.");
    return;
  }

  const posts = postsForBoard(activeBoard);
  $("#boardView").innerHTML = `
    <div class="section-head">
      <h2>${boards[activeBoard]}</h2>
      <div class="toolbar">
        <select id="categoryFilter" aria-label="카테고리">
          ${boardCategories.map((cat) => `<option>${cat}</option>`).join("")}
        </select>
        <button id="newPostBtn" class="primary" type="button" ${canWrite(activeBoard) ? "" : "disabled"}>글쓰기</button>
      </div>
    </div>
    <div id="boardList" class="post-list">${posts.map(postCard).join("") || empty("조건에 맞는 게시글이 없습니다.")}</div>
  `;
}

function postCard(post) {
  const comments = post.comments?.length || 0;
  return `
    <article class="post-card" data-post-id="${post.id}">
      <div>
        <div class="badges">
          ${post.pinned ? `<span class="badge pin">중요</span>` : ""}
          ${post.hidden ? `<span class="badge hidden-post">숨김</span>` : ""}
          ${post.images?.length ? `<span class="badge photo">이미지</span>` : ""}
          <span class="badge">${boards[post.board]}</span>
          <span class="badge">${post.category}</span>
        </div>
        <h3>${escapeHtml(post.title)}</h3>
        <p>${escapeHtml(post.content).slice(0, 100)}${post.content.length > 100 ? "..." : ""}</p>
        <div class="meta">${escapeHtml(post.authorName || authorName(post.authorId))} · ${post.createdAt} · 조회 ${post.views} · 댓글 ${comments}</div>
      </div>
      <div class="post-actions">
        <button type="button" title="열기" data-open-post="${post.id}">보기</button>
      </div>
    </article>
  `;
}

function renderDetail() {
  const post = state.posts.find((item) => item.id === activePostId);
  if (!post) {
    $("#detailView").innerHTML = empty("게시글을 찾을 수 없습니다.");
    return;
  }
  const manageable = canManagePost(post);
  $("#detailView").innerHTML = `
    <div class="detail">
      <div class="toolbar">
        <button type="button" data-view-target="board" data-board-target="${post.board}">목록</button>
        ${manageable ? `<button type="button" data-edit-post="${post.id}">수정</button><button class="danger" type="button" data-delete-post="${post.id}">삭제</button>` : ""}
        ${currentUser().role === "admin" ? `<button type="button" data-pin-post="${post.id}">${post.pinned ? "고정 해제" : "상단 고정"}</button>` : ""}
        <button type="button" data-report-post="${post.id}">신고</button>
      </div>
      <article class="detail-body">
        <div class="badges">
          ${post.pinned ? `<span class="badge pin">중요</span>` : ""}
          <span class="badge">${boards[post.board]}</span>
          <span class="badge">${post.category}</span>
        </div>
        <h1>${escapeHtml(post.title)}</h1>
        <div class="meta">${escapeHtml(post.authorName || authorName(post.authorId))} · ${post.createdAt} · 조회 ${post.views}</div>
        <div class="detail-content">${escapeHtml(post.content)}</div>
        <div class="attachment-list">${(post.attachments || []).map((file) => `<span class="attachment">${escapeHtml(file)}</span>`).join("")}</div>
      </article>
      <section>
        <div class="section-head"><h2>댓글 ${post.comments.length}</h2></div>
        <div class="comments">${post.comments.map(commentView).join("") || empty("댓글이 없습니다.")}</div>
        ${canComment() ? `
          <form id="commentForm" class="comment-form">
            ${currentUser().role === "student" ? `<input name="authorName" placeholder="이름 또는 별명" value="${escapeAttr(state.studentName || "1-8 학생")}" required>` : ""}
            <textarea name="content" placeholder="댓글을 입력하세요" required></textarea>
            <button class="primary" type="submit">댓글 등록</button>
          </form>` : `<div class="empty">댓글 작성이 꺼져 있습니다.</div>`}
      </section>
    </div>
  `;
}

function commentView(comment) {
  const mine = currentUser().role === "admin";
  return `
    <div class="comment">
      <strong>${escapeHtml(comment.authorName || authorName(comment.authorId))}</strong>
      <div class="meta">${comment.createdAt}</div>
      <p>${escapeHtml(comment.content)}</p>
      ${mine ? `<button class="danger" type="button" data-delete-comment="${comment.id}">삭제</button>` : ""}
    </div>
  `;
}

function renderEditor() {
  const post = editingPostId ? state.posts.find((item) => item.id === editingPostId) : null;
  const board = post?.board || activeBoard;
  $("#editorView").innerHTML = `
    <form id="postForm" class="editor-grid">
      <section class="form-panel">
        <h2>${post ? "글 수정" : "새 글 작성"}</h2>
        ${currentUser().role === "student" && !post ? `<label>작성자<input name="authorName" required value="${escapeAttr(state.studentName || "1-8 학생")}" placeholder="이름 또는 별명"></label>` : ""}
        <label>제목<input name="title" required value="${escapeAttr(post?.title || "")}"></label>
        <label>내용<textarea name="content" required>${escapeHtml(post?.content || "")}</textarea></label>
        <label>첨부파일<input name="files" type="file" multiple></label>
        <div class="toolbar">
          <button type="button" data-view-target="board" data-board-target="${board}">취소</button>
          <button class="primary" type="submit">저장</button>
        </div>
      </section>
      <aside class="form-panel">
        <h2>게시 설정</h2>
        <label>게시판
          <select name="board">
            ${Object.entries(boards).map(([key, name]) => `<option value="${key}" ${key === board ? "selected" : ""}>${name}</option>`).join("")}
          </select>
        </label>
        <label>말머리
          <select name="category">
            ${boardCategories.filter((cat) => cat !== "전체").map((cat) => `<option ${cat === (post?.category || "공지") ? "selected" : ""}>${cat}</option>`).join("")}
          </select>
        </label>
        ${currentUser().role === "admin" ? `<label><input name="pinned" type="checkbox" ${post?.pinned ? "checked" : ""}> 중요 공지 상단 고정</label>` : `<p class="meta">학생 글은 공개 게시글로 등록되며, 수정/삭제와 상단 고정은 관리자만 할 수 있습니다.</p>`}
      </aside>
    </form>
  `;
}

function renderCalendar() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i += 1) cells.push(`<div class="day"></div>`);
  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const events = state.events.filter((event) => event.date === date);
    cells.push(`<div class="day"><strong>${day}</strong>${events.map((event) => `<span class="event">${escapeHtml(event.title)}</span>`).join("")}</div>`);
  }
  $("#calendarView").innerHTML = `
    <div class="section-head">
      <h2>${year}년 ${month + 1}월 학사일정</h2>
      <a href="${SCHOOL_SCHEDULE_URL}" target="_blank" rel="noopener">학교 홈페이지에서 보기</a>
    </div>
    <div class="source-grid">
      <div>
        <div class="calendar-grid" id="calendarGrid">${cells.join("")}</div>
      </div>
      <aside class="source-panel">
        <h3>학사일정 기준</h3>
        <p class="meta">기준 자료는 ${ACADEMIC_SCHEDULE_SOURCE}입니다. 자동 표시가 가능한 달은 나이스 공개 일정으로 보강합니다.</p>
        <div id="scheduleStatus" class="empty">학사일정을 불러오는 중입니다.</div>
      </aside>
    </div>
  `;
  loadSchedule(year, month + 1);
}

function renderMeal() {
  $("#mealView").innerHTML = `
    <div class="section-head">
      <h2>급식표</h2>
      <a href="${SCHOOL_MEAL_URL}" target="_blank" rel="noopener">학교 홈페이지에서 보기</a>
    </div>
    <div class="source-grid">
      <section>
        <div id="mealList" class="meal-list">${empty("급식표를 불러오는 중입니다.")}</div>
      </section>
      <aside class="source-panel">
        <h3>${SCHOOL_NAME} 급식</h3>
        <p class="meta">학교 홈페이지의 급식메뉴 경로를 연결하고, 표시는 나이스 급식 공개 데이터를 사용합니다.</p>
        <a href="${SCHOOL_MEAL_URL}" target="_blank" rel="noopener">공식 급식메뉴 페이지</a>
        <a href="${SCHOOL_HOME_URL}" target="_blank" rel="noopener">학교 홈페이지</a>
      </aside>
    </div>
  `;
  loadMeals();
}

function ymd(date) {
  return `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
}

function formatYmd(value) {
  return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
}

function neisUrl(path, params) {
  const query = new URLSearchParams({
    Type: "json",
    pIndex: "1",
    pSize: "100",
    ATPT_OFCDC_SC_CODE: NEIS_OFFICE_CODE,
    SD_SCHUL_CODE: NEIS_SCHOOL_CODE,
    ...params
  });
  return `https://open.neis.go.kr/hub/${path}?${query.toString()}`;
}

async function loadSchedule(year, month) {
  const from = `${year}${String(month).padStart(2, "0")}01`;
  const to = `${year}${String(month).padStart(2, "0")}${String(new Date(year, month, 0).getDate()).padStart(2, "0")}`;
  try {
    const response = await fetch(neisUrl("SchoolSchedule", { AA_FROM_YMD: from, AA_TO_YMD: to }));
    const data = await response.json();
    const rows = data.SchoolSchedule?.[1]?.row || [];
    state.events = rows
      .filter((row) => row.ONE_GRADE_EVENT_YN !== "N")
      .map((row) => ({ date: formatYmd(row.AA_YMD), title: row.EVENT_NM }));
    saveState();
    $("#scheduleStatus").innerHTML = rows.length
      ? `공식 일정 ${rows.length}건을 불러왔습니다.`
      : "이번 달 등록된 공식 일정이 없습니다.";
    renderCalendarCells(year, month);
  } catch (error) {
    $("#scheduleStatus").innerHTML = `자동 불러오기에 실패했습니다. <a href="${SCHOOL_SCHEDULE_URL}" target="_blank" rel="noopener">학교 홈페이지 학사일정</a>에서 확인해주세요.`;
  }
}

function renderCalendarCells(year, month) {
  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i += 1) cells.push(`<div class="day"></div>`);
  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const events = state.events.filter((event) => event.date === date);
    cells.push(`<div class="day"><strong>${day}</strong>${events.map((event) => `<span class="event">${escapeHtml(event.title)}</span>`).join("")}</div>`);
  }
  $("#calendarGrid").innerHTML = cells.join("");
}

async function loadMeals() {
  const today = new Date();
  const start = new Date(today);
  const end = new Date(today);
  end.setDate(end.getDate() + 6);
  try {
    const response = await fetch(neisUrl("mealServiceDietInfo", { MLSV_FROM_YMD: ymd(start), MLSV_TO_YMD: ymd(end) }));
    const data = await response.json();
    const rows = data.mealServiceDietInfo?.[1]?.row || [];
    $("#mealList").innerHTML = rows.length ? rows.map((row) => `
      <article class="meal-day">
        <strong>${formatYmd(row.MLSV_YMD)} · ${row.MMEAL_SC_NM}</strong>
        <p>${cleanMeal(row.DDISH_NM)}</p>
      </article>
    `).join("") : empty("이번 주 등록된 급식 정보가 없습니다.");
  } catch (error) {
    $("#mealList").innerHTML = empty("급식 자동 불러오기에 실패했습니다. 오른쪽 공식 급식메뉴 페이지에서 확인해주세요.");
  }
}

function cleanMeal(menu) {
  return menu
    .replaceAll("<br/>", "\n")
    .replace(/\([0-9.]+\)/g, "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean)
    .join(", ");
}

function renderSeating() {
  const stats = seatingStats();
  const fixedStudents = state.seating.seats.filter((seat) => seat.locked).map((seat) => seat.student);
  const columns = seatingColumnCounts.map((count, columnIndex) => {
    const seats = Array.from({ length: count }, (_, rowIndex) => {
      const index = seatIndex(columnIndex, rowIndex);
      const seat = state.seating.seats[index];
      const frontLabel = rowIndex === 0 ? `<span class="front-tag">앞</span>` : "";
      return `
        <div class="seat-card ${seat.locked ? "locked" : ""}">
          <div class="seat-meta">
            <span>${columnIndex + 1}열-${rowIndex + 1}</span>
            ${frontLabel}
          </div>
          <strong>${escapeHtml(seat.student)}</strong>
          <label class="lock-control">
            <input type="checkbox" data-seat-lock="${index}" ${seat.locked ? "checked" : ""}>
            고정
          </label>
        </div>
      `;
    }).join("");
    return `<div class="seat-column" aria-label="${columnIndex + 1}열">${seats}</div>`;
  }).join("");

  $("#seatingView").innerHTML = `
    <div class="section-head">
      <div>
        <h2>학급 자리바꾸기</h2>
        <p class="meta">교탁 쪽 앞자리부터 보입니다. 좌석은 왼쪽부터 4명, 5명, 5명, 5명, 5명으로 구성했습니다.</p>
      </div>
      <div class="toolbar">
        <button id="frontFixBtn" type="button">앞자리 고정 적용</button>
        <button id="shuffleSeatsBtn" class="primary" type="button">랜덤 자리바꾸기</button>
      </div>
    </div>

    <div class="seating-layout">
      <section class="panel seating-board-panel">
        <div class="teacher-desk">교탁</div>
        <div class="seating-board">${columns}</div>
      </section>

      <aside class="form-panel">
        <h2>고정 학생 선택</h2>
        <p class="meta">눈이 잘 안 보이는 학생을 체크한 뒤 앞자리 고정 적용을 누르면 앞줄부터 배치하고 고정합니다.</p>
        <div class="student-check-list">
          ${classStudents.map((student) => `
            <label class="student-check">
              <input type="checkbox" data-front-student="${escapeAttr(student)}" ${fixedStudents.includes(student) ? "checked" : ""}>
              ${escapeHtml(student)}
            </label>
          `).join("")}
        </div>
        <div class="seat-summary">
          <span>고정 ${stats.locked}명</span>
          <span>랜덤 ${stats.random}명</span>
          <span>전체 ${STUDENT_COUNT}명</span>
        </div>
        <button id="unlockSeatsBtn" type="button">전체 고정 해제</button>
        <button id="resetSeatsBtn" class="danger" type="button">명렬표 순서로 초기화</button>
        <p class="meta">${state.seating.lastChangedAt ? `마지막 변경: ${state.seating.lastChangedAt}` : "아직 자리바꾸기를 실행하지 않았습니다."}</p>
      </aside>
    </div>
  `;
}

function shuffleUnlockedSeats() {
  const lockedStudents = new Set(state.seating.seats.filter((seat) => seat.locked).map((seat) => seat.student));
  const studentsToShuffle = shuffled(classStudents.filter((student) => !lockedStudents.has(student)));
  let cursor = 0;
  state.seating.seats = state.seating.seats.map((seat) => {
    if (seat.locked) return seat;
    const student = studentsToShuffle[cursor];
    cursor += 1;
    return { ...seat, student };
  });
  state.seating.lastChangedAt = nowText();
  saveState();
  render();
}

function applyFrontFixedSeats() {
  const checked = Array.from(document.querySelectorAll("[data-front-student]:checked")).map((input) => input.dataset.frontStudent);
  const fixedSet = new Set(checked);
  const fixedStudents = checked.filter((student) => classStudents.includes(student)).slice(0, STUDENT_COUNT);
  const remainingStudents = shuffled(classStudents.filter((student) => !fixedSet.has(student)));
  const nextSeats = state.seating.seats.map((seat) => ({ ...seat, locked: false }));
  const frontIndexes = frontFirstSeatIndexes();

  fixedStudents.forEach((student, index) => {
    const seatIndex = frontIndexes[index];
    nextSeats[seatIndex] = { ...nextSeats[seatIndex], student, locked: true };
  });

  let cursor = 0;
  nextSeats.forEach((seat, index) => {
    if (seat.locked) return;
    seat.student = remainingStudents[cursor];
    cursor += 1;
  });

  state.seating.seats = nextSeats;
  state.seating.lastChangedAt = nowText();
  saveState();
  render();
}

function renderMyPage() {
  const user = currentUser();
  $("#mypageView").innerHTML = `
    <section class="form-panel">
      <h2>마이페이지</h2>
      <p><strong>${user.name}</strong> · ${roleNames[user.role]} · ${user.className || ""}</p>
      <p class="meta">내가 작성한 글 ${state.posts.filter((post) => post.authorId === user.id).length}개</p>
      <button id="logoutBtn" class="danger" type="button">로그아웃</button>
    </section>
  `;
}

function renderAdmin() {
  if (!canAdmin()) {
    $("#adminView").innerHTML = empty("관리자만 접근할 수 있습니다.");
    return;
  }
  const reported = state.posts.filter((post) => post.reported);
  const allPosts = state.posts.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  $("#adminView").innerHTML = `
    <div class="admin-grid">
      <section class="panel">
        <div class="section-head">
          <h2>전체 게시물 관리</h2>
          <button id="adminNewPost" class="primary" type="button">새 글 작성</button>
        </div>
        <table class="table">
          <thead><tr><th>게시글</th><th>게시판</th><th>상태</th><th>관리</th></tr></thead>
          <tbody>
            ${allPosts.map((post) => `
              <tr>
                <td>
                  <strong>${escapeHtml(post.title)}</strong>
                  <div class="meta">${authorName(post.authorId)} · ${post.createdAt} · 조회 ${post.views} · 댓글 ${post.comments.length}</div>
                </td>
                <td>${boards[post.board]}<div class="meta">${post.category}</div></td>
                <td>
                  ${post.pinned ? `<span class="badge pin">중요</span>` : ""}
                  ${post.hidden ? `<span class="badge hidden-post">숨김</span>` : `<span class="badge">공개</span>`}
                  ${post.reported ? `<span class="badge hidden-post">신고</span>` : ""}
                </td>
                <td>
                  <div class="post-actions admin-actions">
                    <button type="button" data-open-post="${post.id}">보기</button>
                    <button type="button" data-edit-post="${post.id}">수정</button>
                    <button type="button" data-pin-post="${post.id}">${post.pinned ? "고정해제" : "고정"}</button>
                    <button type="button" data-admin-toggle-hidden="${post.id}">${post.hidden ? "공개" : "숨김"}</button>
                    <button class="danger" type="button" data-delete-post="${post.id}">삭제</button>
                  </div>
                </td>
              </tr>
            `).join("") || `<tr><td colspan="4">${empty("게시글이 없습니다.")}</td></tr>`}
          </tbody>
        </table>
      </section>
      <section class="form-panel">
        <h2>게시판 설정</h2>
        <label><input id="guestReadable" type="checkbox" ${state.guestReadable ? "checked" : ""}> 비회원 열람 허용</label>
        <p class="meta">학생은 로그인 없이 글 열람, 글 작성, 댓글 작성이 가능하고, 수정/삭제와 게시판 관리는 관리자만 할 수 있습니다.</p>
        <label>첨부파일 용량 제한(MB)<input id="fileLimitMb" type="number" min="1" max="100" value="${state.fileLimitMb}"></label>
        <h2>명렬표</h2>
        <p class="meta">${CLASS_NAME} ${STUDENT_COUNT}명</p>
        <div class="attachment-list">${classStudents.map((name, index) => `<span class="attachment">${index + 1}. ${escapeHtml(name)}</span>`).join("")}</div>
        <h2>신고 처리</h2>
        <div class="post-list">${reported.map((post) => `
          <div class="post-card">
            <div><strong>${escapeHtml(post.title)}</strong><div class="meta">${boards[post.board]} · ${authorName(post.authorId)}</div></div>
            <div class="post-actions"><button data-hide-post="${post.id}">${post.hidden ? "해제" : "숨김"}</button></div>
          </div>
        `).join("") || empty("신고된 글이 없습니다.")}</div>
      </section>
    </div>
  `;
}

function renderNotifications() {
  $("#notificationList").innerHTML = state.notifications.map((item) => `
    <div class="notice-item">
      <strong>${escapeHtml(item.text)}</strong>
      <div class="meta">${item.createdAt} · ${item.read ? "읽음" : "새 알림"}</div>
    </div>
  `).join("") || empty("알림이 없습니다.");
}

function empty(text) {
  return `<div class="empty">${text}</div>`;
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(text) {
  return escapeHtml(text).replaceAll("\n", " ");
}

function validateFiles(fileList) {
  const files = Array.from(fileList);
  const limitBytes = state.fileLimitMb * 1024 * 1024;
  const blocked = files.find((file) => blockedExtensions.some((ext) => file.name.toLowerCase().endsWith(ext)));
  if (blocked) return `${blocked.name} 파일 형식은 업로드할 수 없습니다.`;
  const tooLarge = files.find((file) => file.size > limitBytes);
  if (tooLarge) return `${tooLarge.name} 파일이 ${state.fileLimitMb}MB 제한을 초과했습니다.`;
  return "";
}

function isImageFile(name) {
  return allowedImageExtensions.some((ext) => name.toLowerCase().endsWith(ext));
}

function loginAdmin(form) {
  const data = new FormData(form);
  const id = String(data.get("id") || "").trim();
  const password = String(data.get("password") || "").trim();
  let user = state.users.find((item) => item.id === id && item.password === password && item.role === "admin" && item.approved);

  if (!user && id === "admin01" && password === "1234") {
    user = seedState.users[0];
    state.users = state.users.filter((item) => item.id !== "admin01");
    state.users.unshift(user);
  }

  if (!user) {
    alert("관리자 아이디와 비밀번호를 확인해주세요.");
    return;
  }

  state.currentUserId = user.id;
  saveState();
  setView("admin");
}

document.addEventListener("click", (event) => {
  const target = event.target;
  const nav = target.closest(".nav-item");
  if (nav) setView(nav.dataset.view, nav.dataset.board);

  const viewTarget = target.closest("[data-view-target]");
  if (viewTarget) setView(viewTarget.dataset.viewTarget, viewTarget.dataset.boardTarget);

  const openPost = target.closest("[data-open-post]");
  if (openPost) {
    const post = state.posts.find((item) => item.id === openPost.dataset.openPost);
    post.views += 1;
    activePostId = post.id;
    saveState();
    setView("detail");
  }

  const editPost = target.closest("[data-edit-post]");
  if (editPost) {
    editingPostId = editPost.dataset.editPost;
    setView("editor");
  }

  const deletePost = target.closest("[data-delete-post]");
  if (deletePost && confirm("게시글을 삭제할까요?")) {
    const post = state.posts.find((item) => item.id === deletePost.dataset.deletePost);
    state.posts = state.posts.filter((item) => item.id !== deletePost.dataset.deletePost);
    saveState();
    if (activeView === "admin") {
      render();
    } else {
      setView("board", post.board);
    }
  }

  const pinPost = target.closest("[data-pin-post]");
  if (pinPost) {
    const post = state.posts.find((item) => item.id === pinPost.dataset.pinPost);
    post.pinned = !post.pinned;
    saveState();
    render();
  }

  const reportPost = target.closest("[data-report-post]");
  if (reportPost) {
    const post = state.posts.find((item) => item.id === reportPost.dataset.reportPost);
    post.reported = true;
    state.notifications.unshift({ id: uid("n"), text: `신고 접수: ${post.title}`, createdAt: nowText(), read: false });
    saveState();
    render();
  }

  const deleteComment = target.closest("[data-delete-comment]");
  if (deleteComment) {
    const post = state.posts.find((item) => item.id === activePostId);
    post.comments = post.comments.filter((comment) => comment.id !== deleteComment.dataset.deleteComment);
    saveState();
    render();
  }

  if (target.id === "newPostBtn") {
    editingPostId = null;
    setView("editor");
  }

  if (target.id === "adminNewPost") {
    editingPostId = null;
    activeBoard = "notice";
    setView("editor");
  }

  if (target.id === "loginToggle") {
    if (currentUser().role === "student") {
      $("#authPanel").classList.toggle("hidden");
    } else {
      setView("mypage");
    }
  }

  if (target.id === "adminLoginBtn") {
    event.preventDefault();
    loginAdmin(target.closest("form"));
  }

  if (target.id === "logoutBtn") {
    state.currentUserId = "guest";
    saveState();
    setView("home");
  }

  if (target.id === "openNotifications") {
    $("#notificationDrawer").classList.remove("hidden");
    state.notifications.forEach((item) => item.read = true);
    saveState();
    renderShell();
  }

  if (target.id === "closeNotifications" || target.id === "notificationDrawer") {
    $("#notificationDrawer").classList.add("hidden");
  }

  if (target.id === "shuffleSeatsBtn") {
    shuffleUnlockedSeats();
  }

  if (target.id === "frontFixBtn") {
    applyFrontFixedSeats();
  }

  if (target.id === "unlockSeatsBtn") {
    state.seating.seats = state.seating.seats.map((seat) => ({ ...seat, locked: false }));
    state.seating.lastChangedAt = nowText();
    saveState();
    render();
  }

  if (target.id === "resetSeatsBtn" && confirm("현재 자리 배치를 명렬표 순서로 초기화할까요?")) {
    state.seating = { seats: createDefaultSeats(), lastChangedAt: nowText() };
    saveState();
    render();
  }

  const approveUser = target.closest("[data-approve-user]");
  if (approveUser) {
    const user = state.users.find((item) => item.id === approveUser.dataset.approveUser);
    user.approved = !user.approved;
    saveState();
    render();
  }

  const hidePost = target.closest("[data-hide-post]");
  if (hidePost) {
    const post = state.posts.find((item) => item.id === hidePost.dataset.hidePost);
    post.hidden = !post.hidden;
    saveState();
    render();
  }

  const adminToggleHidden = target.closest("[data-admin-toggle-hidden]");
  if (adminToggleHidden) {
    const post = state.posts.find((item) => item.id === adminToggleHidden.dataset.adminToggleHidden);
    post.hidden = !post.hidden;
    saveState();
    render();
  }
});

document.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.target;

  if (form.id === "searchForm") {
    searchTerm = $("#searchInput").value.trim();
    setView("board", activeBoard);
  }

  if (form.id === "loginForm") {
    loginAdmin(form);
  }

  if (form.id === "postForm") {
    const data = new FormData(form);
    const fileError = validateFiles(form.elements.files.files);
    if (fileError) {
      alert(fileError);
      return;
    }
    const fileNames = Array.from(form.elements.files.files).map((file) => file.name);
    const selectedBoard = data.get("board");
    if (!canWrite(selectedBoard)) {
      alert("해당 게시판에 글을 작성할 권한이 없습니다.");
      return;
    }
    const payload = {
      board: selectedBoard,
      category: data.get("category"),
      title: data.get("title"),
      content: data.get("content"),
      pinned: data.get("pinned") === "on" && currentUser().role === "admin",
      attachments: fileNames,
      images: fileNames.filter(isImageFile)
    };
    if (editingPostId) {
      Object.assign(state.posts.find((post) => post.id === editingPostId), payload);
      activePostId = editingPostId;
    } else {
      const authorNameInput = String(data.get("authorName") || state.studentName || "1-8 학생").trim();
      if (currentUser().role === "student") {
        state.studentName = authorNameInput;
      }
      const post = {
        id: uid("p"),
        ...payload,
        authorId: currentUser().id,
        authorName: currentUser().role === "student" ? authorNameInput : currentUser().name,
        createdAt: nowText(),
        views: 0,
        hidden: false,
        reported: false,
        comments: []
      };
      state.posts.unshift(post);
      activePostId = post.id;
      state.notifications.unshift({ id: uid("n"), text: `새 글: ${post.title}`, createdAt: nowText(), read: false });
    }
    editingPostId = null;
    saveState();
    setView("detail");
  }

  if (form.id === "commentForm") {
    if (!canComment()) {
      alert("현재 댓글을 작성할 수 없습니다.");
      return;
    }
    const post = state.posts.find((item) => item.id === activePostId);
    const data = new FormData(form);
    const authorNameInput = String(data.get("authorName") || state.studentName || "1-8 학생").trim();
    if (currentUser().role === "student") {
      state.studentName = authorNameInput;
    }
    post.comments.push({
      id: uid("c"),
      authorId: currentUser().id,
      authorName: currentUser().role === "student" ? authorNameInput : currentUser().name,
      content: data.get("content"),
      createdAt: nowText()
    });
    state.notifications.unshift({ id: uid("n"), text: `댓글 등록: ${post.title}`, createdAt: nowText(), read: false });
    saveState();
    render();
  }
});

document.addEventListener("change", (event) => {
  if (event.target.id === "categoryFilter") {
    const category = event.target.value;
    const posts = postsForBoard(activeBoard).filter((post) => category === "전체" || post.category === category);
    $("#boardList").innerHTML = posts.map(postCard).join("") || empty("조건에 맞는 게시글이 없습니다.");
  }

  if (["guestReadable"].includes(event.target.id)) {
    state[event.target.id] = event.target.checked;
    saveState();
  }

  if (event.target.id === "fileLimitMb") {
    state.fileLimitMb = Number(event.target.value);
    saveState();
  }

  const seatLock = event.target.closest("[data-seat-lock]");
  if (seatLock) {
    const index = Number(seatLock.dataset.seatLock);
    state.seating.seats[index].locked = seatLock.checked;
    state.seating.lastChangedAt = nowText();
    saveState();
    render();
  }
});

setView("home");
