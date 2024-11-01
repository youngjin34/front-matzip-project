const itemsPerPage = 9; // 한 페이지에 표시할 게시글 수
let currentPage = 1; // 현재 페이지 번호
let totalBoards = []; // 전체 게시글 배열

const BOARD_KEY = "boards";

// 게시글 로드 및 페이지네이션 초기화
function loadBoards() {
  totalBoards = JSON.parse(localStorage.getItem(BOARD_KEY)) || [];
  renderBoards();
  renderPagination();
}

// 게시글 렌더링
function renderBoards() {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const boardsToDisplay = totalBoards.slice(startIndex, endIndex);

  const boardList = document.querySelector("#board-list-items");
  boardList.innerHTML = ""; // 기존 목록 초기화

  boardsToDisplay.forEach((board) => {
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

// 페이지네이션 렌더링
function renderPagination() {
  const paginationContainer = document.querySelector("#pagination");
  paginationContainer.innerHTML = ""; // 기존 페이지네이션 초기화

  const totalPages = Math.ceil(totalBoards.length / itemsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("button");
    pageButton.textContent = i;
    pageButton.classList.add("page-button");

    // 현재 페이지 버튼 강조
    if (i === currentPage) {
      pageButton.classList.add("active");
    }

    // 페이지 버튼 클릭 시 페이지 변경
    pageButton.addEventListener("click", () => {
      currentPage = i;
      renderBoards(); // 게시글 렌더링
      renderPagination(); // 페이지네이션 렌더링
    });

    paginationContainer.appendChild(pageButton);
  }
}

// 초기 로드
loadBoards();
