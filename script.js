    // [세트 3 / 평가 3-1] 이벤트 → 상태 변경 → 화면 업데이트
    // 이벤트: 버튼 클릭 / 상태 변경: open 이름표 붙이기·떼기 / 화면 업데이트: CSS가 이름표를 보고 메뉴를 보이거나 숨김
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

    // [세트 4] IntersectionObserver: 요소가 화면에 들어왔는지 지켜보다가 들어오면 visible 이름표를 붙인다.
    // 처음 observe할 때도 한 번 알려주므로 isIntersecting으로 확인한다.
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

    const STATE = { theme: "light", menuOpen: false };

    function render() {
      document.documentElement.classList.toggle("dark", STATE.theme === "dark");
      links.classList.toggle("open", STATE.menuOpen);
    }
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

    if (localStorage.getItem("theme") === "dark") {
      STATE.theme = "dark";
    }
    render()
