const username = document.querySelector("#username");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const confirmPassword = document.querySelector("#confirm-password");

const registerBtn = document.querySelector("#register-btn");

function handleSaveUserInfo(event) {
  event.preventDefault();

  const userId = username.value;
  const userEmail = email.value;
  const userPassword = password.value;
  const userConfirmPwd = confirmPassword.value;

  if (userPassword !== userConfirmPwd) {
    alert("비밀번호가 일치하지 않습니다.");
    return;
  }

  const userInfo = {
    userId: userId,
    userEmail: userEmail,
    userPassword: userPassword,
  };

  const existingUsers = JSON.parse(localStorage.getItem("users")) || [];

  // 새 사용자 정보를 배열에 추가
  existingUsers.push(userInfo);

  localStorage.setItem("users", JSON.stringify(existingUsers));
  alert("회원가입이 성공적으로 완료되었습니다!");

  location.reload();
}

registerBtn.addEventListener("click", handleSaveUserInfo);
