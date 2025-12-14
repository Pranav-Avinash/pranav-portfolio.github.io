// ========= DOM READY =========
(function () {
  function init() {
    console.log("Initializing script...");

    // ===== MOBILE NAV TOGGLE =====
    const navToggle = document.querySelector(".nav-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (navToggle && navLinks) {
      navToggle.addEventListener("click", function () {
        const isOpen = navLinks.classList.toggle("open");
        navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      });

      navLinks.addEventListener("click", function (e) {
        if (e.target.classList.contains("nav-link")) {
          navLinks.classList.remove("open");
          navToggle.setAttribute("aria-expanded", "false");
        }
      });
    }

    // ===== SMOOTH SCROLLING =====
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function (e) {
        const targetId = link.getAttribute("href");
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });

    // ===== ACTIVE NAV LINK ON SCROLL =====
    const sections = document.querySelectorAll("main section[id]");
    const navLinkNodes = document.querySelectorAll(".nav-link");

    function onScroll() {
      let currentId = null;

      sections.forEach(function (section) {
        const rect = section.getBoundingClientRect();
        const offsetTop = rect.top + window.scrollY;
        if (window.scrollY + 120 >= offsetTop) {
          currentId = section.id;
        }
      });

      navLinkNodes.forEach(function (link) {
        const href = link.getAttribute("href");
        if (href === "#" + currentId) {
          link.classList.add("active");
        } else if (href && href.startsWith("#")) {
          link.classList.remove("active");
        }
      });
    }

    if (navLinkNodes.length > 0) {
      window.addEventListener("scroll", onScroll);
      onScroll();
    }

    // ===== FOOTER YEAR =====
    const yearSpan = document.getElementById("year");
    if (yearSpan) {
      yearSpan.textContent = new Date().getFullYear();
    }

    // ===== HERO MINI-GAME (WASD) =====
    const gameViewport = document.getElementById("gameViewport");
    const gameInfo = document.getElementById("gameInfo");

    console.log("Game elements:", gameViewport, gameInfo);

    if (gameViewport && gameInfo) {
      // Map data: 5 rows x 7 cols
      const mapData = [
        [
          { type: "grass", label: "Hey! I’m Pranav – welcome to my little mini-map portfolio." },
          { type: "campus", label: "I’m a Computer Science student specialising in Data Science." },
          { type: "campus", label: "I’m looking to join serious tech clubs and learn from seniors." },
          { type: "grass", label: "" },
          { type: "fun", label: "I game on an ASUS TUF F16 (RTX) – Valorant Gold 3 & Clash Royale enjoyer." },
          { type: "fun", label: "" },
          { type: "grass", label: "" }
        ],
        [
          { type: "campus", label: "I care more about progress than perfection – I’m okay with not knowing and figuring it out." },
          { type: "campus", label: "Data, ML, and building software that actually ships are what I’m aiming for." },
          { type: "grass", label: "" },
          { type: "music", label: "I’ve led my school music band and play the electric guitar." },
          { type: "music", label: "" },
          { type: "fun", label: "I love trying new games – always down to learn new stuff, in code or outside it." },
          { type: "grass", label: "" }
        ],
        [
          { type: "campus", label: "I’m an enthusiastic learner with a strong work ethic." },
          { type: "campus", label: "" },
          { type: "grass", label: "" },
          { type: "grass", label: "Move around to see different parts of my story." },
          { type: "sports", label: "I’ve led my basketball team – lots of experience in team coordination and pressure situations." },
          { type: "sports", label: "" },
          { type: "grass", label: "" }
        ],
        [
          { type: "campus", label: "I want tech clubs where I can contribute to projects, not just sit in meetings." },
          { type: "grass", label: "" },
          { type: "music", label: "I’m comfortable on stage – presenting, performing, and speaking in front of people." },
          { type: "music", label: "" },
          { type: "sports", label: "" },
          { type: "fun", label: "Chess is another hobby – I enjoy thinking a few moves ahead." },
          { type: "grass", label: "" }
        ],
        [
          { type: "grass", label: "" },
          { type: "campus", label: "Former CCA (co-curricular) Captain of my school – lots of event and people management." },
          { type: "campus", label: "I was Mr APS RK Puram – representing all-round involvement and confidence." },
          { type: "grass", label: "" },
          { type: "fun", label: "If you’re from a tech club: I’m very coachable and very motivated. Put me to work." },
          { type: "grass", label: "" },
          { type: "grass", label: "" }
        ]
      ];

      const mapRows = mapData.length;
      const mapCols = mapData[0].length;

      // Start roughly in the middle
      let playerPosition = {
        x: Math.floor(mapCols / 2),
        y: Math.floor(mapRows / 2)
      };

      function createMap() {
        gameViewport.innerHTML = "";

        for (let y = 0; y < mapRows; y++) {
          for (let x = 0; x < mapCols; x++) {
            const tileEl = document.createElement("div");
            const data = mapData[y][x];

            tileEl.classList.add("game-tile");
            tileEl.classList.add(data.type);
            tileEl.dataset.x = String(x);
            tileEl.dataset.y = String(y);
            tileEl.dataset.label = data.label || "";

            let symbol = "🌿";
            if (data.type === "campus") symbol = "🎓";
            if (data.type === "music") symbol = "🎵";
            if (data.type === "sports") symbol = "🏀";
            if (data.type === "fun") symbol = "⭐";

            tileEl.textContent = symbol;
            gameViewport.appendChild(tileEl);
          }
        }
      }

      function updatePlayerTile() {
        const current = document.querySelector(".game-tile.player-on");
        if (current) current.classList.remove("player-on");

        const selector =
          '.game-tile[data-x="' +
          playerPosition.x +
          '"][data-y="' +
          playerPosition.y +
          '"]';

        const next = document.querySelector(selector);
        if (next) {
          next.classList.add("player-on");
          const label = next.dataset.label || "";
          gameInfo.textContent =
            label.trim().length > 0
              ? label
              : "WASD around to discover more parts of my story.";
        }
      }

      function movePlayer(dx, dy) {
        const newX = playerPosition.x + dx;
        const newY = playerPosition.y + dy;

        if (newX < 0 || newX >= mapCols || newY < 0 || newY >= mapRows) {
          return;
        }

        playerPosition.x = newX;
        playerPosition.y = newY;
        updatePlayerTile();
      }

      // Keyboard controls
      window.addEventListener("keydown", function (e) {
        const key = e.key.toLowerCase();

        if (["w", "a", "s", "d"].includes(key)) {
          e.preventDefault();
        }

        if (key === "w") movePlayer(0, -1);
        if (key === "s") movePlayer(0, 1);
        if (key === "a") movePlayer(-1, 0);
        if (key === "d") movePlayer(1, 0);
      });

      createMap();
      updatePlayerTile();
    } else {
      console.error("Game Viewport or Info not found!");
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

// ===== VISUALIZE OVERLAY (Global) =====
window.openVisualize = function () {
  const overlay = document.getElementById("visualizeOverlay");
  if (overlay) {
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden"; // Prevent scrolling
  }
};

window.closeVisualize = function () {
  const overlay = document.getElementById("visualizeOverlay");
  if (overlay) {
    overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = ""; // Restore scrolling
  }
};
