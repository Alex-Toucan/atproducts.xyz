// ============================
// 🔧 GAME PAGE CONFIGURATION
// ============================

const GAME_DATA = {
  title: "Hill Climb Racing",
  developer: "Blink Games",
  rating: "⭐ 4.2",
  ageRating: "Rated for 3+",
  plays: "10K+ Plays",
  bannerImage: "sl/banner.jpg",
  icon: "favicon.ico",
  playLink: "page.html",
  description:
    "Hill Climb Racing is not your average platformer — it’s a rage-filled challenge that tests your patience and timing at every step!",

  features: [
    "🔥 Fast-paced gameplay with unpredictable twists.",
    "💀 Instant respawns to keep you in the action.",
    "🎮 Play directly in your browser — no downloads required.",
    "🏆 Compete with friends for the fastest completion."
  ],

  screenshots: [
    "sl/banner.jpg"
  ]
};

// ============================
// 🧩 DYNAMIC PAGE SETUP
// ============================
document.addEventListener("DOMContentLoaded", async () => {
  // Game header
  document.querySelector(".game-text h1").textContent = GAME_DATA.title;
  document.querySelector(".developer").textContent = GAME_DATA.developer;
  document.querySelector(".stats").innerHTML = `
    <div>${GAME_DATA.rating}</div>
    <div>${GAME_DATA.ageRating}</div>
    <div>${GAME_DATA.plays}</div>
  `;

  // Banner & Icon
  document.querySelector(".banner-full img").src = GAME_DATA.bannerImage;
  document.querySelector(".game-icon img").src = GAME_DATA.icon;

  // Play buttons
  document.querySelector(".play-btn").href = GAME_DATA.playLink;
  document.querySelector(".floating-play").href = GAME_DATA.playLink;

  // Description
  document.querySelector(".description p").textContent = GAME_DATA.description;

  // Features
  const featureList = document.querySelector(".features");
  featureList.innerHTML = "";
  GAME_DATA.features.forEach(f => {
    const li = document.createElement("li");
    li.textContent = f;
    featureList.appendChild(li);
  });

  // Screenshots
  const screenshotContainer = document.querySelector(".screenshots");
  screenshotContainer.innerHTML = "";
  GAME_DATA.screenshots.forEach(src => {
    const img = document.createElement("img");
    img.src = src;
    img.alt = "Screenshot";
    img.loading = "lazy";
    screenshotContainer.appendChild(img);
  });

  // ================= DYNAMIC MORE GAMES =================
  try {
    const res = await fetch(window.RELATED_GAMES_API);
    const allGames = await res.json();

    // Exclude current game
    const currentPage = window.location.pathname.replace(/^.*\/G\//, "G/");
    const filteredGames = allGames.filter(g => g.page !== currentPage);

    // Pick random games
    const randomGames = filteredGames
      .sort(() => 0.5 - Math.random())
      .slice(0, window.MORE_GAMES_COUNT);

    const relatedContainer = document.querySelector(".related-games .game-grid");
    relatedContainer.innerHTML = "";

    randomGames.forEach(game => {
      const a = document.createElement("a");
      a.href = "../../" + game.page; // prepend ../../
      a.innerHTML = `
        <img src="../../${game.thumbnail}" alt="${game.title}" loading="lazy">
        <span>${game.title}</span>
      `;
      relatedContainer.appendChild(a);
    });
  } catch (err) {
    console.error("Failed to fetch related games:", err);
  }
});
