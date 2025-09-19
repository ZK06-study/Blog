'use strict';

// - 이 앱은 localStorage를 간단한 DB처럼 사용합니다.

// 0) 상수
const STORAGE_KEY = 'posts';

// 1) 안전한 JSON 파싱
function safeParseJSON(text, fallback) {
  // TODO: try/catch로 JSON.parse(text) 실행, 실패 시 fallback 반환
  return fallback; // 임시 반환
}

// 2) 스토리지 읽기: 저장된 글 배열 불러오기
function loadPosts() {
  // TODO: localStorage에서 STORAGE_KEY 값을 읽고 safeParseJSON으로 배열 복원
  return []; // 임시
}

// 3) 스토리지 쓰기: 글 배열 저장
function savePosts(posts) {
  // TODO: JSON.stringify(posts)로 직렬화하여 localStorage에 저장
}

// 4) 새 글 객체 생성
function createPost({ title, content }) {
  // TODO: crypto.randomUUID()로 id 생성, createdAt/updatedAt(ISO) 포함한 객체 반환
  return { id: 'TEMP', title, content, createdAt: '', updatedAt: '' };
}

// 5) DOM 참조
const refs = {
  year: document.getElementById('year'),
  newBtn: document.getElementById('new-post-btn'),
  list: document.getElementById('post-list'),
  editor: document.getElementById('editor'),
  editorTitle: document.getElementById('editor-title'),
  form: document.getElementById('post-form'),
  titleInput: document.getElementById('title-input'),
  contentInput: document.getElementById('content-input'),
  saveBtn: document.getElementById('save-post-btn'),
  cancelBtn: document.getElementById('cancel-edit-btn'),
};

// 6) 목록 렌더링
function renderList(posts) {
  // TODO: 빈 목록 메시지/카드 UI를 만들어 refs.list에 렌더
}

// 7) HTML 이스케이프
function escapeHTML(text) {
  // TODO: &, <, >, ", ' 를 적절히 이스케이프
  return String(text);
}

// 8) 날짜 포맷
function formatDate(iso) {
  // TODO: YYYY-MM-DD HH:mm 형식으로 변환
  return iso;
}

// 9) 에디터 열기/닫기
function openEditor(mode, post) {
  // TODO: mode에 따라 제목 설정 및 입력값 세팅/초기화
}

function closeEditor() {
  // TODO: 에디터 숨김 및 상태 초기화
}

// 10) 초기화
function init() {
  // TODO: year 세팅
  // TODO: 초기 렌더(renderList(loadPosts()))

  // TODO: 새 글 버튼 클릭 시 openEditor('new')
  // refs.newBtn.addEventListener('click', () => {});

  // TODO: 취소 버튼 클릭 시 closeEditor()
  // refs.cancelBtn.addEventListener('click', () => {});

  // TODO: 제출 핸들러 - 신규/수정 분기 및 저장
  refs.form.addEventListener('submit', (e) => {
    e.preventDefault();
    // TODO: 제목/내용 읽기, 공백 검증
    // TODO: editingId 유무로 수정/신규 처리
    // TODO: savePosts, renderList 후 에디터 닫기
  });

  // TODO: 목록에서 수정/삭제 버튼 이벤트 위임
  refs.list.addEventListener('click', (e) => {
    const target = e.target;
    // TODO: data-action(edit/delete), data-id 활용
  });
}

// 11) 엔트리 포인트
document.addEventListener('DOMContentLoaded', init);


