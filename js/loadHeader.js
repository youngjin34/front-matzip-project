document.addEventListener("DOMContentLoaded", () => {
  fetch("./header.html")
    .then((response) => response.text())
    .then((data) => {
      document.querySelector("#header").innerHTML = data;
      showLoginStatus(); // 로그인 상태 확인 함수를 호출
    })
    .catch((error) => console.error("Error loading header:", error));
});

// 로그인 상태를 확인하는 함수
function showLoginStatus() {
  const loginBtn = document.querySelector("#login-btn");
  const logoutBtn = document.querySelector("#logout-btn");

  // 로그인 상태 확인
  if (localStorage.getItem("loggedIn")) {
    loginBtn.classList.add("hidden");
    logoutBtn.classList.remove("hidden");
  } else {
    loginBtn.classList.remove("hidden");
    logoutBtn.classList.add("hidden");
  }

  // 로그아웃 버튼 클릭 이벤트
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (event) => {
      event.preventDefault(); // 기본 링크 클릭 동작 방지
      localStorage.removeItem("loggedIn");
      localStorage.removeItem("loggedInUser");
      alert("로그아웃 성공!");
      window.location.reload(); // 페이지 새로고침
    });
  }
}
