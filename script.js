    // script.js: 페이지의 동작(메뉴, 스크롤 등장, 다크 모드)을 담당한다.

    // 1. 메뉴(☰): 클릭 → STATE.menuOpen 변경 → render()로 화면에 반영
    const menuBtn = document.getElementById("menu-btn");
    const links = document.getElementById("menu-links");
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
    const STATE = { theme: "light", menuOpen: false };

    function render() {
      document.documentElement.classList.toggle("dark", STATE.theme === "dark");
      links.classList.toggle("open", STATE.menuOpen);
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
