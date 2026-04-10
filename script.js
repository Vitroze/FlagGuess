let allButtonCountry = document.querySelectorAll("#choose-button");
var chooseCountry = "";
let guiCountry = document.getElementById("choose-country");
let loadingContainer = document.querySelector(".loading-container");
let gameContainer = document.querySelector(".game-container");
let allContinent = {
  everyone: "Tout",
  europe: "Europe",
  asia: "Asie",
  africa: "Afrique",
  america: "Amérique",
  oceania: "Océanie",
};

let Languages = {
  ["fra"]: {
    title: "Quiz de Drapeaux",
    everyone: "Tout",
    europe: "Europe",
    asia: "Asie",
    africa: "Afrique",
    america: "Amérique",
    oceania: "Océanie",
    score: "Score: {numberScore} - Meilleur score: {bestScore}",
    choose_country: "Vous avez choisi: {country}",
    no_data: "Veuillez choisir une région",
    loading: "Chargement...",
    correct: "Bonne réponse !",
    correct_text: "La bonne réponse est {country}.",
    incorrect: "Mauvaise réponse !",
    incorrect_text:
      "La bonne réponse était {country}. Votre score final est {score}.",
    play_again: "Rejouer",
    try_again: "Recommencer",
    invalid_selection_title: "Sélection invalide",
    invalid_selection_text: "Veuillez sélectionner un continent valide.",
    invalid_language_title: "Langue invalide",
    ok: "OK",
    language_changed_title: "Langue changée",
    language_changed_text:
      "La langue a été changée en {language}. Fermer la notification pour rafraîchir la page et appliquer les changements.",
    settings: "Paramètres",
    language: "Langue",
    reset_score: "Réinitialisation du score",
    reset_cache: "Réinitialisation du cache (Score non compris)",
    reset: "Réinitialiser",
    reset_score_text: "Êtes-vous sûr de vouloir réinitialiser votre score ?",
    reset_score_success: "Votre score a été réinitialisé.",
    cancel: "Annuler",
    reset_cache_text:
      "Êtes-vous sûr de vouloir réinitialiser le cache ? Cela nécessitera de retélécharger les données des pays, mais votre score ne sera pas affecté.",
    reset_cache_success:
      "Le cache a été réinitialisé. Les données des pays seront retéléchargées lorsque vous commencerez une nouvelle partie.",
    time_up_title: "Temps écoulé !",
    time_up_text: "Vous avez manqué de temps ! Essayez à nouveau.",
  },
  ["cym"]: {
    title: "Flag Quiz",
    everyone: "All",
    europe: "Europe",
    asia: "Asia",
    africa: "Africa",
    america: "America",
    oceania: "Oceania",
    score: "Score: {numberScore} - Best Score: {bestScore}",
    choose_country: "You have chosen: {country}",
    no_data: "Please choose a region",
    loading: "Loading...",
    correct: "Correct!",
    correct_text: "The correct answer is {country}.",
    incorrect: "Incorrect!",
    incorrect_text:
      "The correct answer was {country}. Your final score is {score}.",
    play_again: "Play Again",
    try_again: "Retry",
    invalid_selection_title: "Invalid Selection",
    invalid_selection_text: "Please select a valid continent.",
    invalid_language_title: "Invalid Language",
    ok: "OK",
    language_changed_title: "Language Changed",
    language_changed_text:
      "The language has been changed to {language}. Close the notification for refreshing the page to apply changes.",
    settings: "Settings",
    language: "Language",
    reset_score: "Reset Score",
    reset_cache: "Reset Cache (Score not included)",
    reset: "Reset",
    reset_score_text: "Are you sure you want to reset your score?",
    reset_score_success: "Your score has been reset.",
    cancel: "Cancel",
    reset_cache_text:
      "Are you sure you want to reset the cache? This requires redownloading country data, but your score will not be affected.",
    reset_cache_success:
      "The cache has been reset. Country data will be redownloaded when you start a new game.",
  },
};

function getLanguage(id, defaultChoose) {
  let savedLanguage = localStorage.getItem("language") || "fra";

  return Languages[savedLanguage] && Languages[savedLanguage][id]
    ? Languages[savedLanguage][id]
    : defaultChoose;
}

document.addEventListener("DOMContentLoaded", function () {
  const savedLanguage = localStorage.getItem("language") || "fra";
  const languageElements = document.querySelectorAll("[data-language]");
  languageElements.forEach((element) => {
    const languageKey = element.getAttribute("data-language");
    if (Languages[savedLanguage] && Languages[savedLanguage][languageKey]) {
      element.textContent = Languages[savedLanguage][languageKey];
    }
  });

  document.title = getLanguage("title", "Country Quiz");
});

function updateCountryDisplay() {
  if (!chooseCountry || !allContinent[chooseCountry]) {
    console.warn("Invalid country choice: " + chooseCountry);
    return;
  }

  savedLanguage = localStorage.getItem("language") || "fra";
  guiCountry.textContent = getLanguage(
    "choose_country",
    "You have chosen: {country}",
  ).replace("{country}", allContinent[chooseCountry]);
  guiCountry.hidden = false;
}

let TTL = 3600;
function getCache(continent) {
  const cacheKey = `countries_${continent}`;
  const cachedData = localStorage.getItem(cacheKey);
  if (cachedData) {
    const { data, timestamp } = JSON.parse(cachedData);
    const now = Date.now();
    if (now - timestamp < TTL * 1000) {
      return data;
    } else {
      localStorage.removeItem(cacheKey);
    }
  }
  return null;
}

function setCache(continent, data) {
  const cacheKey = `countries_${continent}`;
  const cacheValue = {
    data: data,
    timestamp: Date.now(),
  };
  localStorage.setItem(cacheKey, JSON.stringify(cacheValue));
}

function setHiddenLoading(hidden) {
  if (hidden) {
    loadingContainer.classList.add("hidden");
  } else {
    loadingContainer.classList.remove("hidden");
  }
}

let quizData = [];

function randomCountry(countries) {
  if (!countries || countries.length === 0) {
    console.warn("No countries available for random selection.");
    return null;
  }

  const randomIndex = Math.floor(Math.random() * countries.length);
  return countries[randomIndex];
}

function removeGameContent() {
  const flagImage = document.querySelector(".flag-image");
  if (flagImage) {
    flagImage.remove();
  }

  const optionButtons = document.querySelectorAll(".option-button");
  optionButtons.forEach((button) => button.remove());
}

async function searchCountry() {
  if (!chooseCountry) {
    console.warn("No country selected.");
    return;
  }

  removeGameContent();
  cache = getCache(chooseCountry);
  if (cache) {
    setHiddenLoading(true);
    quizData = cache;
    return randomCountry(cache);
  }

  try {
    var response;
    if (chooseCountry === "everyone") {
      response = await fetch(
        `https://restcountries.com/v3.1/all?fields=name,flags,translations`,
      );
    } else {
      response = await fetch(
        `https://restcountries.com/v3.1/region/${chooseCountry}?fields=name,flags,translations`,
      );
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    setCache(chooseCountry, data);
    setHiddenLoading(true);

    quizData = data;
    return randomCountry(data);
  } catch (error) {
    console.error("Error fetching country data:", error);
  }
}

function getCountryName(country) {
  let keyLanguage = localStorage.getItem("language") || "fra";
  if (
    !country ||
    !country["translations"] ||
    !country["translations"][keyLanguage] ||
    !country["translations"][keyLanguage]["common"]
  ) {
    console.warn("Invalid country data for getting name.");
    return country && country.name && country.name.common;
  }

  return country["translations"][keyLanguage]["common"];
}

function pickRandomCountry(goodCountry) {
  if (!goodCountry) {
    console.warn("No good country provided for picking random country.");
    return null;
  }

  const allCountries = quizData;
  if (!allCountries || allCountries.length === 0) {
    console.warn("No countries available in quiz data.");
    return null;
  }

  const goodCountryName = getCountryName(goodCountry);
  const options = new Set();
  options.add(goodCountryName);

  while (options.size < 4) {
    const randomCountry =
      allCountries[Math.floor(Math.random() * allCountries.length)];
    const randomCountryName = getCountryName(randomCountry);
    if (randomCountryName && !options.has(randomCountryName)) {
      options.add(randomCountryName);
    }
  }

  return Array.from(options).sort(() => Math.random() - 0.5);
}

function createIfNotExistsFlagContainer() {
  let div = document.querySelector(".flag-container");
  if (!div) {
    div = document.createElement("div");
    div.classList.add("flag-container");
    gameContainer.appendChild(div);
  }

  return div;
}

function createIfNotExistsOptionContainer() {
  let div = document.querySelector(".option-container");
  if (!div) {
    div = document.createElement("div");
    div.classList.add("option-container");
    gameContainer.appendChild(div);
  }

  return div;
}

function createFlagImage(country) {
  if (!country || !country.flags || !country.flags.png) {
    console.warn("Invalid country data for creating flag image.");
    return null;
  }

  div = createIfNotExistsFlagContainer();

  if (document.querySelector(".flag-image")) {
    document.querySelector(".flag-image").remove();
  }

  const img = document.createElement("img");
  img.src = country.flags.png;
  img.alt = `Flag of ${country.name.common}`;
  img.classList.add("flag-image");
  div.appendChild(img);

  return img;
}

function createOptionButton(country) {
  div = createIfNotExistsOptionContainer();

  if (document.querySelectorAll(".option-button").length > 3) {
    document
      .querySelectorAll(".option-button")
      .forEach((button) => button.remove());
  }

  const button = document.createElement("button");
  button.textContent = country;
  button.classList.add("option-button");
  buttonCheckCorrect(button, getCountryName(countrySelected));
  div.appendChild(button);
  return button;
}

function sendAlert(title, text, icon, confirmButtonText, callback) {
  if (!confirmButtonText) {
    confirmButtonText = "OK";
  }

  Swal.fire({
    title: title,
    text: text,
    icon: icon,
    confirmButtonText: confirmButtonText,
  }).then(() => {
    if (callback) {
      callback();
    }
  });
}

score = 0;

function updateScore(noUpdate) {
  if (!noUpdate) {
    score += 1;

    if (localStorage && localStorage.getItem("score") < score) {
      localStorage.setItem("score", score);
    }
  }

  const scoreElement = document.getElementById("score");
  if (scoreElement) {
    scoreElement.textContent = getLanguage(
      "score",
      `Score: {numberScore} - Best Score: {bestScore}`,
    )
      .replace("{numberScore}", score)
      .replace(
        "{bestScore}",
        localStorage ? localStorage.getItem("score") || 0 : 0,
      );
  }
}

let loadingInterval;
function buttonCheckCorrect(button, correctCountry) {
  button.addEventListener("click", function () {
    clearInterval(loadingInterval);
    if (button.textContent === correctCountry) {
      sendAlert(
        getLanguage("correct", "Correct !"),
        getLanguage("correct_text", `The correct answer is {country}.`).replace(
          "{country}",
          correctCountry,
        ),
        "success",
        getLanguage("play_again", "Play Again"),
        () => {
          startGame();
          updateScore();
          clearInterval(loadingInterval);
        },
      );
    } else {
      sendAlert(
        getLanguage("incorrect", "Incorrect !"),
        getLanguage(
          "incorrect_text",
          `The correct answer was {country}. Your final score is {score}.`,
        )
          .replace("{country}", correctCountry)
          .replace("{score}", score),
        "error",
        getLanguage("try_again", "Retry"),
        () => {
          restartGame();
        },
      );
    }
  });
}

function restartGame() {
  score = 0;
  updateScore(true);
  startGame();
}

let loadingBar = document.querySelector(".loading-progress");
let loadingTime = 0;
let loadingDuration = localStorage.getItem("timerDuration")
  ? parseInt(localStorage.getItem("timerDuration")) * 1000
  : 15000;
let storageTimer = localStorage.getItem("activateTimer");
let activateTimer = storageTimer !== null ? storageTimer === "true" : true;

function startLoadingBar() {
  if (!activateTimer) return;

  loadingTime = 0;
  loadingBar.style.width = "0%";
  loadingBar.classList.remove("hidden");
  loadingInterval = setInterval(() => {
    if (!activateTimer) {
      loadingBar.classList.add("hidden");
      return;
    }

    loadingTime += 100;
    const progress = Math.min((loadingTime / loadingDuration) * 100, 100);
    loadingBar.style.width = progress + "%";
    if (progress >= 100) {
      clearInterval(loadingInterval);
      sendAlert(
        getLanguage("time_up_title", "Time's up!"),
        getLanguage("time_up_text", "You ran out of time! Try again."),
        "error",
        getLanguage("try_again", "Retry"),
        () => {
          restartGame();
        },
      );
    }
  }, 100);
}

function stopLoadingBar() {
  if (!activateTimer) return;
  clearInterval(loadingInterval);
  loadingBar.style.width = "0%";
  loadingBar.classList.add("hidden");
}

async function startGame() {
  setHiddenLoading(false);
  countrySelected = await searchCountry();
  stopLoadingBar();
  createFlagImage(countrySelected);
  allResponses = pickRandomCountry(countrySelected);

  allResponses.forEach((response) => {
    createOptionButton(response);
  });

  startLoadingBar();
}

let no_data = document.getElementById("no-data");

stopLoadingBar();
allButtonCountry.forEach((button) => {
  button.addEventListener("click", async function () {
    let country = this.getAttribute("data-country");
    if (!country || !allContinent[country]) {
      sendAlert(
        getLanguage("invalid_selection_title", "Invalid Selection"),
        getLanguage(
          "invalid_selection_text",
          "Please select a valid continent.",
        ),
        "error",
        getLanguage("ok", "OK"),
      );
      return;
    }

    if (no_data) {
      no_data.hidden = true;
    }
    chooseCountry = country;
    updateCountryDisplay();
    startGame();
  });
});

document.addEventListener("DOMContentLoaded", function () {
  updateScore(true);
});

let settingsButton = document.getElementById("settings-button");
let settingsContent = document.querySelector(".settings-menu");
let backgroundDark = document.querySelector(".background-dark");

function showSettings() {
  if (settingsContent) {
    settingsContent.classList.remove("hidden");
  }

  if (backgroundDark) {
    backgroundDark.classList.remove("hidden");
  }
}

function hideSettings() {
  if (settingsContent) {
    settingsContent.classList.add("hidden");
  }

  if (backgroundDark) {
    backgroundDark.classList.add("hidden");
  }
}

if (settingsButton) {
  settingsButton.addEventListener("click", function () {
    showSettings();
  });
}

let closeButton = document.querySelector(".close-button");
if (closeButton) {
  closeButton.addEventListener("click", function () {
    hideSettings();
  });
}

listLanguages = {
  fra: "Français",
  cym: "English",
};

function changeLanguage(lang) {
  if (!lang || !listLanguages[lang]) {
    sendAlert(
      getLanguage("invalid_language_title", "Invalid Language"),
      getLanguage("invalid_selection_text", "Please select a valid continent."),
      "error",
      getLanguage("ok", "OK"),
    );
    return;
  }

  localStorage.setItem("language", lang);
  sendAlert(
    getLanguage("language_changed_title", "Language Changed"),
    getLanguage(
      "language_changed_text",
      `Language has been changed to ${listLanguages[lang]}. Please refresh the page to apply changes.`,
    ).replace("{language}", listLanguages[lang]),
    "success",
    getLanguage("ok", "OK"),
    () => {
      location.reload();
    },
  );
}

function addLanguage(languageSelect, id, language) {
  const option = document.createElement("option");
  option.value = id;
  option.textContent = language;
  languageSelect.appendChild(option);
}

let languageSelect = document.getElementById("language-select");
if (languageSelect) {
  Object.entries(listLanguages).forEach(([id, language]) => {
    addLanguage(languageSelect, id, language);
  });

  let savedLanguage = localStorage.getItem("language") || "fra";
  if (listLanguages[savedLanguage]) {
    languageSelect.value = savedLanguage;
  }
  languageSelect.addEventListener("change", function () {
    changeLanguage(this.value);
  });
}

let resetScoreButton = document.getElementById("reset-score-button");
if (resetScoreButton) {
  resetScoreButton.addEventListener("click", function () {
    Swal.fire({
      title: getLanguage("reset_score", "Reset Score"),
      text: getLanguage(
        "reset_score_text",
        "Are you sure you want to reset your score?",
      ),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: getLanguage("reset", "Reset"),
      cancelButtonText: getLanguage("cancel", "Cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("score");
        updateScore(true);
        sendAlert(
          getLanguage("reset_score", "Reset Score"),
          getLanguage("reset_score_success", "Your score has been reset."),
          "success",
          getLanguage("ok", "OK"),
        );
      }
    });
  });
}

let resetCacheButton = document.getElementById("reset-cache-button");
if (resetCacheButton) {
  resetCacheButton.addEventListener("click", function () {
    Swal.fire({
      title: getLanguage("reset_cache", "Reset Cache"),
      text: getLanguage(
        "reset_cache_text",
        "Are you sure you want to reset the cache? This requires redownloading country data, but your score will not be affected.",
      ),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: getLanguage("reset", "Reset"),
      cancelButtonText: getLanguage("cancel", "Cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith("countries_")) {
            localStorage.removeItem(key);
          }
        });
        sendAlert(
          getLanguage("reset_cache", "Reset Cache"),
          getLanguage(
            "reset_cache_success",
            "Cache has been reset. Country data will be redownloaded when you start a new game.",
          ),
          "success",
          getLanguage("ok", "OK"),
          () => {
            location.reload();
          },
        );
      }
    });
  });
}

let slider = document.getElementById("timer-duration");
if (slider) {
  let duration_value = document.getElementById("timer-duration-value");
  slider.addEventListener("input", function () {
    loadingDuration = parseInt(this.value) * 1000;
    localStorage.setItem("timerDuration", this.value);

    if (duration_value) {
      let min = parseInt(slider.min);
      let max = parseInt(slider.max);
      let value = parseInt(this.value);

      duration_value.textContent = `${this.value}`;

      const percent = ((value - min) / (max - min)) * 100;
      duration_value.style.left = `${percent}%`;
    }
  });

  slider.dispatchEvent(new Event("input"));
}

let timerToggle = document.getElementById("timer-toggle");
function updateTimerToggle() {
  if (!timerToggle) return;

  loadingBar.style.width = "0%";
  if (activateTimer && chooseCountry.length > 0) {
    loadingBar.classList.remove("hidden");
  } else {
    loadingBar.classList.add("hidden");
  }
}

if (timerToggle) {
  timerToggle.addEventListener("change", function () {
    activateTimer = this.checked;

    updateTimerToggle();

    localStorage.setItem("activateTimer", this.checked);
  });

  timerToggle.checked = activateTimer;
}

updateTimerToggle();
