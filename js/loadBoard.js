const boardList = document.querySelector("#board-list-items");

const BOARD_KEY = "boards";

function loadBoards() {
  const existingBoards = JSON.parse(localStorage.getItem(BOARD_KEY)) || [];
  boardList.innerHTML = ""; // 기존 목록 초기화

  existingBoards.forEach((board, index) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `
    <span>작성자: ${board.userId}</span>
    <span>제목: ${board.title}</span>
    <span>${board.date}</span>
  `;
    listItem.classList.add("board-item");

    // 제목 클릭 시 모달에 상세 내용 표시
    listItem.addEventListener("click", () => {
      showBoardDetail(board);
    });

    boardList.prepend(listItem);
  });
}

loadBoards();
