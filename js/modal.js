const closeBtn = document.querySelector("#close-modal");
const restaurantContainer = document.querySelector(".restaurant-container");
const restaurantModal = document.querySelector("#modal-container");
const imagePath = "./images/";

const restaurants = [
  {
    name: "청기와타운",
    imgSrc: `${imagePath}7.png`,
    address: "서울 성동구 왕십리광장로 17 지상1층 C-04호",
    menu: "수원왕갈비"
  },
  {
    name: "붓처스컷",
    imgSrc: `${imagePath}2.jpg`,
    address: "서울 중구 세종대로 136 서울파이낸스센터 지하2층",
    menu: "토마호크"
  },
  {
    name: "제일곱창",
    imgSrc: `${imagePath}8.png`,
    address: "서울 성동구 고산자로 281 1층 제일곱창",
    menu: "소곱창"
  },
  {
    name: "인생한우",
    imgSrc: `${imagePath}0.jpg`,
    address: "서울 성동구 마장로31길 43 2층",
    menu: "꽃등심"
  },
];

restaurants.forEach((restaurant, idx) => {
  const restauDiv = document.createElement("div");
  restauDiv.className = "restaurant";

  restauDiv.innerHTML = `
    <div id="restaurant_${idx}">
      <img src="${restaurant.imgSrc}" />
      <div class="overlay">${restaurant.name}</div>
    </div>
  `;
  restaurantContainer.appendChild(restauDiv);

  // 여기서 restauDiv에 직접 이벤트 리스너 추가
  restauDiv.addEventListener("click", () => {
    showModal(restaurants[idx]);
    console.log("click");

  });
});

function showModal(restaurant) {
  restaurantModal.style.display = "flex";

  // 음식 사진
  const foodImg = document.querySelector("#restaurant-img");
  foodImg.innerHTML = `<img src="${restaurant.imgSrc}" />`;

  const restaurantName = document.querySelector("#restaurant-name");
  const restaurantAddress = document.querySelector("#restaurant-address");
  const restaurantMenu = document.querySelector("#restaurant-menu");

  restaurantName.innerText = `이름: ${restaurant.name}`;
  restaurantAddress.innerText = `주소: ${restaurant.address}`;
  restaurantMenu.innerText = `주 메뉴: ${restaurant.menu}`;

  disableScroll();
}

// 닫기 버튼 누르면 모달 사라짐
closeBtn.addEventListener("click", () => {
  restaurantModal.style.display = "none";
  enableScroll();
});

// 모달 바깥화면 클릭 시 모달 사라짐
window.addEventListener("click", (event) => {
  if (event.target === restaurantModal) {
    restaurantModal.style.display = "none";
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

function enableScroll() {
  window.onscroll = null;
}
