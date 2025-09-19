'use strict';

// - 이 앱은 localStorage를 간단한 DB처럼 사용합니다.

// 0) 상수
const STORAGE_KEY = 'posts';

// 1) 안전한 JSON 파싱
function safeParseJSON(text, fallback) {
  // TODO: try/catch로 JSON.parse(text) 실행, 실패 시 fallback 반환
  try {
    if (!text) {
      return 
    }
    console.log("safeParseJSON")
    return JSON.parse(text)
    
  } catch (error) { 
    console.warn("JSON Parse Error", error)
     return fallback; // 임시 반환
  }
 
}

// 2) 스토리지 읽기: 저장된 글 배열 불러오기
function loadPosts() {
  const posts = localStorage.getItem(STORAGE_KEY)
  return safeParseJSON(posts,[])
}

// 3) 스토리지 쓰기: 글 배열 저장
function savePosts(posts) {
  try {
    if (!posts) {
      console.warn("⛔️ 포스트가 존재하지 않습니다.")
      return
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts))
  } catch (error) { 
    console.warn("⛔️ 저장에 실패했습니다.")
  }
}

// 4) 새 글 객체 생성
function createPost({ title, content }) {
  const date = new Date().toISOString()
  
  return { id: crypto.randomUUID(), title, content, createdAt: date, updatedAt: date };
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

  refs.list.innerHTML = posts.map((post) => {
  
  return `
    <div class="post-card" data-id="${post.id}">
      <h3 class="post-title">${escapeHTML(post.title)}</h3>
      <p class="post-content">${escapeHTML(post.content)}</p>
      <div class="post-meta">
        <span class="post-date">작성일: ${formatDate(post.createdAt)}</span>
        <button class="edit-btn" data-action="edit" data-id="${post.id}">수정</button>
        <button class="delete-btn" data-action="delete" data-id="${post.id}">삭제</button>
      </div>
    </div>
  `;
}).join('');
  
  
}

// 7) HTML 이스케이프
function escapeHTML(text) {
  // TODO: &, <, >, ", ' 를 적절히 이스케이프
  return String(text);
}

// 8) 날짜 포맷
function formatDate(iso) {
  
  const date = new Date(iso);

  const getYear = date.getFullYear();
  const getMonth = String(date.getMonth() + 1).padStart(2, "0")
  const getDay = String(date.getDate()).padStart(2, "0")
  const hour = String(date.getHours()).padStart(2, "0")
  const min = String(date.getMinutes()).padStart(2, "0")
  return `${getYear}-${getMonth}-${getDay} ${hour}:${min}`

  
  // TODO: YYYY-MM-DD HH:mm 형식으로 변환

  return iso;
}

// 9) 에디터 열기/닫기
function openEditor(mode, post) {
  if (mode === "new") {
    refs.editor.removeAttribute('hidden')
  refs.titleInput.focus() 
  }
}

function closeEditor() {
  
  refs.editor.setAttribute('hidden', "true")
  refs.titleInput.value = "";
  refs.contentInput.value = "";

}

// 10) 초기화
function init() {
  // TODO: year 세팅 -> ? 
  //  year 역할 : 

  
  renderList(loadPosts())

  refs.newBtn.addEventListener('click', () => {
    openEditor("new")
  });

  refs.cancelBtn.addEventListener('click', () => {
    closeEditor()
  });

  // TODO: 제출 핸들러 - 신규/수정 분기 및 저장
  refs.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = refs.titleInput.value.trim();
    const content = refs.contentInput.value.trim();

    if (!title || !content) {
      alert("모두 입력해주세요")
      return 
    }
    const posts = loadPosts()
    const newPost = createPost({ title, content })

    posts.push(newPost)
    savePosts(posts)
    


    // TODO: editingId 유무로 수정/신규 처리
    

    
    renderList(posts)
    closeEditor()
  });

  // TODO: 목록에서 수정/삭제 버튼 이벤트 위임
  refs.list.addEventListener('click', (e) => {
    const target = e.target;

    // TODO: data-action(edit/delete), data-id 활용
  });
}

// 11) 엔트리 포인트
document.addEventListener('DOMContentLoaded', init);


