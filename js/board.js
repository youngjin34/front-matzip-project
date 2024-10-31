const writeBtn = document.querySelector("#write-btn");
const boardForm = document.querySelector("#board-form");
const boardTitle = document.querySelector("#board-title");
const boardContent = document.querySelector("#board-content");
const boardSubmit = document.querySelector("#board-submit");
const boardModal = document.querySelector("#modal-container");

const imageUploadInput = document.querySelector("#image-upload");
const imagePreview = document.querySelector("#image-preview");

const closeBtn = document.querySelector("#close-modal");

const boardList = document.querySelector("#board-list-items");
const boardListModal = document.querySelector("#board-list-modal");

const contextForm = document.querySelector("#context-form");
const contextInput = document.querySelector("#context");

const BOARD_KEY = "boards";
const COMMENTS_KEY = "comments";

// 이미지 업로드 시 미리보기 표시
imageUploadInput.addEventListener("change", () => {
  const selectedImage = imageUploadInput.files[0];
  if (selectedImage) {
    const reader = new FileReader();
    reader.onload = (event) => {
      imagePreview.src = event.target.result;
    };
    reader.readAsDataURL(selectedImage);
  }
});

writeBtn.addEventListener("click", () => {
  if (loggedInUser) {
    showWriteModal(); // 로그인 상태이면 모달 보여줌
  } else {
    alert("로그인 후 게시글을 작성할 수 있습니다."); // 로그인 필요 알림
  }
});

function showWriteModal() {
  boardModal.style.display = "flex";
  boardModal.style.transition = "0.3s";
}

// 닫기 버튼 누르면 모달 사라짐
closeBtn.addEventListener("click", () => {
  boardModal.style.display = "none";
  enableScroll();
});

// 모달 바깥화면 클릭 시 모달 사라짐
window.addEventListener("click", (event) => {
  if (event.target === boardModal) {
    boardModal.style.display = "none";
    enableScroll();
  }
});
window.addEventListener("click", (event) => {
  if (event.target === boardListModal) {
    boardListModal.style.display = "none";
    enableScroll();
  }
});

function disableScroll() {
  // 현재 페이지 스크롤 위치 가져오기
  scrollTop = window.scrollY || document.documentElement.scrollTop;
  scrollLeft = window.scrollX || document.documentElement.scrollLeft;

  // 스크롤을 시도하면 이전 값으로 설정
  window.onscroll = function () {
    window.scrollTo(scrollLeft, scrollTop);
  };
}

// 스크롤 활성화
function enableScroll() {
  window.onscroll = null;
}

const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

contextForm.addEventListener("submit", handleSaveContext);

function handleSaveContext(boardId) {
  const context = contextInput.value;

  const contextInfo = {
    contextId: Date.now(),
    boardId: boardId,
    userId: loggedInUser.userId,
    context: context,
    date: new Date().toLocaleString(),
  };

  const existingContexts = JSON.parse(localStorage.getItem(COMMENTS_KEY)) || [];
  existingContexts.push(contextInfo); // 새 댓글 추가
  localStorage.setItem(COMMENTS_KEY, JSON.stringify(existingContexts));

  alert("댓글 작성 완료!");
  contextInput.value = ""; // 입력 필드 초기화
  loadComments(boardId); // 새로 작성된 댓글 표시
}

// 댓글 불러오기 기능
function loadComments(boardId) {
  const contextList = document.querySelector("#context-list");
  contextList.innerHTML = ""; // 기존 댓글 초기화

  const existingContexts = JSON.parse(localStorage.getItem(COMMENTS_KEY)) || [];
  const comments = existingContexts.filter(
    (context) => context.boardId === boardId
  );

  comments.forEach((comment) => {
    const commentItem = document.createElement("div");
    commentItem.classList.add("comment-item");
    commentItem.innerHTML = `
      <span>${comment.userId}</span>
      <p>${comment.context}</p>
      <small>${comment.date}</small>
      ${
        loggedInUser && loggedInUser.userId === comment.userId
          ? `<button class="delete-comment-btn" data-id="${comment.contextId}">삭제</button>`
          : ""
      }
    `;
    contextList.appendChild(commentItem);
  });

  // 댓글 삭제 버튼 이벤트 추가
  const deleteButtons = document.querySelectorAll(".delete-comment-btn");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const contextId = event.target.dataset.id;
      deleteComment(contextId);
      loadComments(boardId); // 삭제 후 댓글 목록 다시 로드
    });
  });
}

// 댓글 삭제 함수
function deleteComment(contextId) {
  let existingContexts = JSON.parse(localStorage.getItem("contexts")) || [];
  existingContexts = existingContexts.filter(
    (context) => context.contextId !== parseInt(contextId)
  );
  localStorage.setItem("contexts", JSON.stringify(existingContexts));
}

function handleSaveBoard(event) {
  event.preventDefault();

  const title = boardTitle.value;
  const content = boardContent.value.replace(/\n/g, "<br>");
  const savedImage = imagePreview.src; // 미리보기 이미지의 src 값 (Base64)

  const boardInfo = {
    boardId: Date.now(),
    userId: loggedInUser.userId,
    title: title,
    content: content,
    date: new Date().toLocaleString(),
    image: savedImage, // Base64 이미지 추가
  };

  const existingBoards = JSON.parse(localStorage.getItem(BOARD_KEY)) || [];

  existingBoards.push(boardInfo); // 게시글 정보 추가
  localStorage.setItem(BOARD_KEY, JSON.stringify(existingBoards)); // 로컬 스토리지에 저장
  alert("게시글 작성 완료!");

  // 입력 필드 초기화
  boardTitle.value = "";
  boardContent.value = "";
  imagePreview.src = ""; // 이미지 미리보기 초기화

  location.reload(); // 페이지 새로 고침
}
boardSubmit.addEventListener("click", handleSaveBoard);

function loadBoards() {
  const existingBoards = JSON.parse(localStorage.getItem(BOARD_KEY)) || [];
  boardList.innerHTML = ""; // 기존 목록 초기화

  existingBoards.forEach((board) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `
      <span>작성자: ${board.userId}</span>
      <span>제목: ${board.title}</span>
      <span>${board.date}</span>
    `;
    listItem.classList.add("board-item");
    listItem.id = board.boardId;

    // 제목 클릭 시 모달에 상세 내용 표시
    listItem.addEventListener("click", (event) => {
      if (event.target.classList.contains("delete-btn")) {
        deleteBoard(board.boardId); // 삭제 버튼 클릭 시 삭제 함수 호출
      } else {
        showBoardDetail(board); // 제목 클릭 시 상세보기
      }
    });

    boardList.prepend(listItem);
  });
}

// 게시글 삭제 기능
function deleteBoard(boardId) {
  const existingBoards = JSON.parse(localStorage.getItem(BOARD_KEY)) || [];
  const updatedBoards = existingBoards.filter(
    (board) => board.boardId !== boardId
  ); // 선택된 게시글 제외

  localStorage.setItem(BOARD_KEY, JSON.stringify(updatedBoards)); // 업데이트된 게시글 저장
  loadBoards(); // 게시글 목록 새로고침
}

// 게시글 상세 내용 모달로 표시
function showBoardDetail(board) {
  const modalContent = document.createElement("div");

  modalContent.innerHTML = `
    <span class="board-title">${board.title}</span>
    <div class="id-date">
      <div class="board-userId"><small>${board.userId}</small></div>
      <div><small>작성일: ${board.date}</small></div>
    </div>
    <p class="board-content">${board.content}
    ${
      board.image
        ? `<img class="modal-image" src="${board.image}" alt="게시글 이미지" />`
        : ""
    }
    </p>
    ${
      loggedInUser && loggedInUser.userId === board.userId
        ? `<button class="delete-btn">삭제</button>`
        : ""
    }    
    <span class="close-btn" id="close-detail-modal">
      <img src="./images/close.png" alt="닫기" />
    </span>
    <div class="horizon"></div>
  `;

  boardListModal.innerHTML = ""; // 기존 내용 초기화
  boardListModal.appendChild(modalContent);
  boardListModal.style.display = "flex"; // 모달 열기

  // 댓글 폼의 submit 이벤트 처리
  contextForm.addEventListener("submit", (event) => {
    event.preventDefault();
    handleSaveContext(board.boardId); // 게시글 ID를 전달하여 댓글 작성
  });

  // 댓글 불러오기
  loadComments(board.boardId); // 해당 게시글의 댓글 불러오기

  // 삭제 버튼 클릭 시 게시글 삭제
  const deleteBtn = modalContent.querySelector(".delete-btn");
  if (deleteBtn) {
    deleteBtn.addEventListener("click", () => {
      const isConfirmed = confirm("게시글을 삭제하시겠습니까?");
      if (isConfirmed) {
        deleteBoard(board.boardId); // 게시글 삭제 함수 호출
        boardListModal.style.display = "none"; // 모달 닫기
      }
    });
  }

  // 상세보기 모달 닫기 기능 추가
  const closeDetailModal = document.querySelector("#close-detail-modal");
  closeDetailModal.addEventListener("click", () => {
    boardListModal.style.display = "none";
  });
}

loadBoards();
