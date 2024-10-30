document.getElementById("signup").addEventListener("click", function () {
  document.querySelector(".pinkbox").style.transform = "translateX(80%)";
  document.querySelector(".signin").classList.add("nodisplay");
  document.querySelector(".signup").classList.remove("nodisplay");
});

document.getElementById("signin").addEventListener("click", function () {
  document.querySelector(".pinkbox").style.transform = "translateX(0%)";
  document.querySelector(".signup").classList.add("nodisplay");
  document.querySelector(".signin").classList.remove("nodisplay");
});

const loginBtn = document.querySelector("#signin-btn");
const usernameInput = document.querySelector("#signin-id");
const passwordInput = document.querySelector("#signin-pwd");

loginBtn.addEventListener("click", (event) => {
  event.preventDefault();

  const storedUsers = JSON.parse(localStorage.getItem("users"));
  const signinId = usernameInput.value;
  const signinPwd = passwordInput.value;

  const user = storedUsers.find(
    (user) => user.userId === signinId && user.userPassword === signinPwd
  );

  if (user) {
    alert("로그인 성공");
    localStorage.setItem("loggedIn", true);
    localStorage.setItem("loggedInUser", JSON.stringify(user));
    window.location.href = "../index.html";
  } else {
    alert("아이디 또는 비밀번호가 일치하지 않습니다.");
  }
});
