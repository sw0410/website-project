  // script.js: 페이지의 동작(메뉴, 스크롤 등장, 다크 모드)을 담당한다.

  // 1. 메뉴(☰): 클릭 → STATE.menuOpen 변경 → render()로 화면에 반영
  const menuBtn = document.querySelector("#menu-btn");
  const links = document.querySelector("#menu-links");
  // 메뉴버튼을 누르면 닫혀있던걸 열거나, 열려있는걸 닫는다
  menuBtn.addEventListener("click", function () {
    if (STATE.menuOpen) {
      STATE.menuOpen = false;
    }
    else{
      STATE.menuOpen = true;
    }
    render();
  });

  // 2. 스크롤 등장: 화면에 들어온 .reveal 요소에 visible 클래스를 붙인다.
  //    (observe를 시작할 때도 한 번 알려주므로 isIntersecting으로 확인한다.)
  const targets = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },{ threshold: 0.2 });

  targets.forEach((el) => {
    observer.observe(el);
  });

  // 3. 상태와 화면: STATE가 유일한 기준이고, render()가 STATE를 보고 화면(dark, open 클래스)을 만든다.
  const STATE = { theme: "light", menuOpen: false, repoStatus: "loading", repos: [], emailError: "", scrollY: 0, nameError: "", messageError: "" };
  function render() {
// STATE.theme 값("light" 또는 "dark")을 html의 data-theme 속성에 그대로 적는다.
    document.documentElement.setAttribute("data-theme", STATE.theme);
    links.classList.toggle("active", STATE.menuOpen);
    const retryBtn = document.querySelector("#retry-btn");
    retryBtn.classList.toggle("show", STATE.repoStatus === "error");
    const topBtn = document.querySelector("#top-btn");
    topBtn.classList.toggle("show", STATE.scrollY > 300);
    const nav = document.querySelector("nav");
    nav.classList.toggle("scrolled", STATE.scrollY > 60);
    const msg = document.querySelector("#repo-msg");
    if (STATE.repoStatus === "loading") {
      msg.textContent = "불러오는 중…";
    } else if (STATE.repoStatus === "error") {
      msg.textContent = "프로젝트를 불러올 수 없습니다";
    } else if (STATE.repoStatus === "empty") {
      msg.textContent = "표시할 프로젝트가 없습니다";
    } else {
      msg.textContent = "";   // success: 문구 없이 목록만
    }
    
    const list = document.querySelector("#repo-list");
    list.textContent = "";      // 상자 비우기
    const items = STATE.repos.map(({ name, html_url }) => {
      const li = document.createElement("li");
      li.innerHTML = `<article><h3>${name}</h3><a href="${html_url}">저장소 보기</a></article>`;
      return li;   // li를 들고 map에게 돌아감 → items에 쌓임
    });

    items.forEach(function (li) {
      document.querySelector("#repo-list").append(li);
    });
    const emailMsg = document.querySelector("#email-error");
    if (STATE.emailError === "format") {
      emailMsg.textContent = "이메일 형식 오류 입니다.";
    } else if (STATE.emailError === "empty") {
      emailMsg.textContent = "이메일을 입력해 주세요.";
    } else {
      emailMsg.textContent = "";
    }
    const nameMsg = document.querySelector("#name-error");
    if (STATE.nameError === "empty") {
      nameMsg.textContent = "이름을 입력해 주세요.";
    } else {
      nameMsg.textContent = "";
    }
    const messageMsg = document.querySelector("#message-error");
    if (STATE.messageError === "empty") {
      messageMsg.textContent = "메시지를 입력해 주세요.";
    } else {
      messageMsg.textContent = "";
    }
  }

  // 4. 다크 모드: 클릭 → STATE.theme 변경 → localStorage에 저장 → render()
  const themeBtn = document.querySelector("#theme-btn");
  themeBtn.addEventListener("click", function () {
    if (STATE.theme === "dark") {
      STATE.theme = "light";
    } else {
      STATE.theme = "dark";
    }
    localStorage.setItem("theme", STATE.theme);
    render();
  });

  // 5. 페이지가 열릴 때: 저장된 테마를 읽어 STATE를 복원하고 화면에 반영
  if (localStorage.getItem("theme") === "dark") {
    STATE.theme = "dark";
  }
  render()


// 6. GitHub 저장소 불러오기: 요청 → 기다림 → 목록 받기
async function loadRepos() {
  try {
    const res = await fetch("https://api.github.com/users/sw0410/repos");
    if (!res.ok) throw new Error(`요청 실패: ${res.status}`);
    const repos = await res.json();
    STATE.repos = repos;
    if (repos.length === 0) {
      STATE.repoStatus = "empty";
    } else {
      STATE.repoStatus = "success";
    }
  } catch (error) {
    STATE.repoStatus = "error";
  }
  render();
}
loadRepos();
// 재시도: 클릭 → 상태를 로딩으로 → 화면 반영 → 다시 요청
const retryBtn = document.querySelector("#retry-btn");
retryBtn.addEventListener("click", () => {
  STATE.repoStatus = "loading";
  render();
  loadRepos();
});

// 7. 문의 폼: 제출 → 검사 → 오류 문구
const form = document.querySelector("#contact-form");
form.addEventListener("submit", function (event) {
  event.preventDefault();
  const nameInput = document.querySelector("#name");
  if (nameInput.value === "") {
    STATE.nameError = "empty";
  } else {
    STATE.nameError = "";
  }
  const messageInput = document.querySelector("#message");
  if (messageInput.value === "") {
    STATE.messageError = "empty";
  } else {
    STATE.messageError = "";
  }
  const emailInput = document.querySelector("#email");
  if (emailInput.value === "") {
    STATE.emailError = "empty";
  } else if (emailInput.value.includes("@")) {
    STATE.emailError = "";
  } else {
    STATE.emailError = "format";
  }
  render();
});

// 8. 스크롤: 내린 위치를 STATE에 저장 → render()
window.addEventListener("scroll", () => {
  STATE.scrollY = window.scrollY;
  render();
});

// 탑 버튼: 클릭하면 맨 위로 부드럽게
document.querySelector("#top-btn").addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
