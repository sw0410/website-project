  // script.js: 페이지의 동작(메뉴, 스크롤 등장, 다크 모드)을 담당한다.

  // 1. 메뉴(☰): 클릭 → STATE.menuOpen 변경 → render()로 화면에 반영
  const menuBtn = document.getElementById("menu-btn");
  const links = document.getElementById("menu-links");
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
  });
  targets.forEach(function (el) {
    observer.observe(el);
  });

  // 3. 상태와 화면: STATE가 유일한 기준이고, render()가 STATE를 보고 화면(dark, open 클래스)을 만든다.
  const STATE = { theme: "light", menuOpen: false, repoStatus: "loading", repos: [] };

  function render() {
    //  STATE.theme === "dark" 이면 dark class를 붙이고 false면 뗀다.
    document.documentElement.classList.toggle("dark", STATE.theme === "dark");
    links.classList.toggle("open", STATE.menuOpen);
    const msg = document.getElementById("repo-msg");
    if (STATE.repoStatus === "loading") {
      msg.textContent = "불러오는 중…";
    } else if (STATE.repoStatus === "error") {
      msg.textContent = "저장소를 불러오지 못했어요.";
    } else if (STATE.repoStatus === "empty") {
      msg.textContent = "아직 공개 저장소가 없어요.";
    } else {
      msg.textContent = "";   // success: 문구 없이 목록만
    }
    const list = document.getElementById("repo-list");
    list.textContent = "";      // 상자 비우기
    const items = STATE.repos.map(function (repo) {
    const a = document.createElement("a");
    a.textContent = repo.name;
    a.href = repo.html_url;
    const li = document.createElement("li");
    li.append(a)   // 상자(li).append(넣을 것: 변수 a)
    return li;     // li를 들고 map에게 돌아감 → items에 쌓임
    });

    items.forEach(function (li) {
      document.getElementById("repo-list").append(li);
    });
  }

  // 4. 다크 모드: 클릭 → STATE.theme 변경 → localStorage에 저장 → render()
  const themeBtn = document.getElementById("theme-btn");
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
  console.log("1. 요청 보냄");
  const res = await fetch("https://api.github.com/users/sw0410/repos");
  const repos = await res.json();
  console.log("2. 저장소 개수:", repos.length);
  repos.forEach(function (el) {
  console.log(el.name)});
  STATE.repos = repos;
  STATE.repoStatus = "success";
  render();
}
loadRepos();
console.log("3. loadRepos 다음 줄");

