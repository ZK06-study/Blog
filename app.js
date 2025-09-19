'use strict';

// 이 앱은 localStorage를 간단한 DB처럼 사용합니다.
// key는 'posts' 하나만 사용하며, 값은 배열(JSON 문자열)로 저장됩니다.

// 상수: 스토리지 키
const STORAGE_KEY = 'posts';

// 유틸: 안전한 JSON 파싱
function safeParseJSON(text, fallback) {
  try {
    return JSON.parse(text);
  } catch (_) {
    return fallback;
  }
}

// 1) 스토리지 읽기: 현재 저장된 모든 글 배열을 반환
function loadPosts() {
  const raw = localStorage.getItem(STORAGE_KEY);
  const posts = safeParseJSON(raw, []);
  if (!Array.isArray(posts)) return [];
  return posts;
}

// 2) 스토리지 쓰기: 글 배열을 저장
function savePosts(posts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

// 3) 새 글 객체 생성 헬퍼
function createPost({ title, content }) {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    title: String(title || '').trim(),
    content: String(content || '').trim(),
    createdAt: now,
    updatedAt: now,
  };
}

// 4) DOM 캐시
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

// 5) 렌더링: 글 목록을 화면에 표시
function renderList(posts) {
  refs.list.innerHTML = '';
  if (!posts.length) {
    refs.list.innerHTML = '<p>아직 작성된 글이 없습니다. "새 글"을 눌러 시작해보세요.</p>';
    return;
  }

  const fragment = document.createDocumentFragment();
  posts
    .slice()
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .forEach((post) => {
      const card = document.createElement('article');
      card.className = 'post-card';
      card.innerHTML = `
        <h3>${escapeHTML(post.title) || '(제목 없음)'}</h3>
        <time datetime="${post.updatedAt}">수정: ${formatDate(post.updatedAt)}</time>
        <p>${escapeHTML(post.content).slice(0, 160)}</p>
        <div class="actions">
          <button data-action="edit" data-id="${post.id}">수정</button>
          <button data-action="delete" data-id="${post.id}">삭제</button>
        </div>
      `;
      fragment.appendChild(card);
    });
  refs.list.appendChild(fragment);
}

// 6) HTML 이스케이프(간단)
function escapeHTML(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// 7) 날짜 포맷(간단)
function formatDate(iso) {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${dd} ${hh}:${mm}`;
}

// 8) 에디터 표시/숨김
function openEditor(mode, post) {
  refs.editor.hidden = false;
  refs.editorTitle.textContent = mode === 'edit' ? '글 수정' : '새 글 작성';
  if (mode === 'edit' && post) {
    refs.form.dataset.editingId = post.id;
    refs.titleInput.value = post.title;
    refs.contentInput.value = post.content;
  } else {
    delete refs.form.dataset.editingId;
    refs.form.reset();
  }
  refs.titleInput.focus();
}

function closeEditor() {
  refs.editor.hidden = true;
  delete refs.form.dataset.editingId;
  refs.form.reset();
}

// 9) 초기화
function init() {
  // 푸터 연도
  if (refs.year) refs.year.textContent = new Date().getFullYear();

  // 최초 렌더
  renderList(loadPosts());

  // 이벤트: 새 글 버튼
  refs.newBtn.addEventListener('click', () => openEditor('new'));

  // 이벤트: 에디터 취소
  refs.cancelBtn.addEventListener('click', () => closeEditor());

  // 이벤트: 글 저장(신규/수정 공용)
  refs.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = refs.titleInput.value;
    const content = refs.contentInput.value;

    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 입력하세요.');
      return;
    }

    const posts = loadPosts();
    const editingId = refs.form.dataset.editingId;
    if (editingId) {
      // 수정
      const idx = posts.findIndex((p) => p.id === editingId);
      if (idx !== -1) {
        posts[idx] = {
          ...posts[idx],
          title: title.trim(),
          content: content.trim(),
          updatedAt: new Date().toISOString(),
        };
      }
      savePosts(posts);
    } else {
      // 신규
      const newPost = createPost({ title, content });
      posts.push(newPost);
      savePosts(posts);
    }

    renderList(loadPosts());
    closeEditor();
  });

  // 이벤트 위임: 목록의 수정/삭제
  refs.list.addEventListener('click', (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    const action = target.dataset.action;
    const id = target.dataset.id;
    if (!action || !id) return;

    if (action === 'edit') {
      const post = loadPosts().find((p) => p.id === id);
      if (post) openEditor('edit', post);
      return;
    }

    if (action === 'delete') {
      if (!confirm('정말 삭제하시겠어요?')) return;
      const posts = loadPosts().filter((p) => p.id !== id);
      savePosts(posts);
      renderList(posts);
      return;
    }
  });
}

// 엔트리 포인트
document.addEventListener('DOMContentLoaded', init);


