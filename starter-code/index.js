const description = document.getElementById("description");
const charCount = document.getElementById("charCount");
const wordCount = document.getElementById("wordCount");
const sentenceCount = document.getElementById("sentenceCount");
const readingTimeDisplay = document.getElementById("reading-timer");
const charLimitInput = document.getElementById("characterLimitInput");
const charLimitCheckbox = document.getElementById("limit-checkbox");
const setLimit = document.getElementById("set-limit");
const errorMessage = document.getElementById("error-message");
const excludeSpacesCheckbox = document.getElementById("excludeSpaces");
const backgroundModeSetter = document.getElementById(
  "background-mode-setter"
);
const charTextTag = document.getElementById("char-text-tag");
const statText = document.querySelectorAll(".stat");
const logoImage = document.getElementById("logo-image");
const themeIcon = document.getElementById("theme-icon");
const noCharMessage = document.getElementById("no-char-message");
const showMoreContainer = document.getElementById("show-more-container");
const showMoreButton = document.getElementById("show-more-button");
const showMoreIcon = document.getElementById("show-more-icon");

let modeToggled = false;
let showMore = false;

function updateCharCount(textLength) {
  charCount.innerText = String(textLength).padStart(2, "0");
}

function updateWordCount(text) {
  let wordArray = text.split(/[\s.,:;!?(){}\[\]]+/);
  let validWordCount = updateValidWordCount(wordArray);
  wordCount.innerText = String(validWordCount).padStart(2, "0");
  updateReadingTime(validWordCount);
}

function updateValidWordCount(array) {
  let validWordCount = 0;
  for (let word of array) {
    if (word.trim() !== "") {
      validWordCount++;
    }
  }
  return validWordCount;
}

function updateReadingTime(numOfWords) {
  let numWordsPerMin = 200;
  const readingTime = Math.ceil(numOfWords / numWordsPerMin);
  readingTimeDisplay.innerText =
    readingTime === 1
      ? String(readingTime) + " minute"
      : readingTime > 1
      ? String(readingTime) + " minutes"
      : String(0) + " minute";
}

function updateSentenceCount(text) {
  let sentenceArray = text
    .split(/[.?!]+/)
    .filter((sentence) => sentence.trim() != "");
    sentenceCount.innerText = String(sentenceArray.length).padStart(2, "0");
  }

  function validateTextArea() {
    updateTextStats();
    updateLetterDensity();
    handleCharacterLimit();
  }

  function updateTextStats() {
    const descriptionText = description.value;
    const processedText = updateProcessedText(descriptionText);
    const descriptionTextLength = processedText.length;

    updateCharCount(descriptionTextLength);
    updateWordCount(descriptionText);
    updateSentenceCount(descriptionText);
    updateCharTextInfo();
  }

  function handleCharacterLimit() {
    const descriptionTextLength = description.value.length;
    let userSetLimit = parseInt(charLimitInput.value);

    if (!isNaN(userSetLimit) && descriptionTextLength > userSetLimit) {
      description.style.border = "2px solid #FE8159";
      description.style.boxShadow = "0 0 5px 5px #FE8159";
      description.setAttribute("readonly", "true");
      errorMessage.style.display = "inline-block";
      setLimit.innerText = userSetLimit;
    } else {
      description.style.border = "";
      description.style.boxShadow = "";
      description.removeAttribute("readonly");
      errorMessage.style.display = "none";
    }
  }

  function updateLetterDensity() {
    const descriptionText = description.value;
    if (descriptionText.trim() === "") {
      noCharMessage.style.display = "block";
    } else {
      noCharMessage.style.display = "none";
    }
    const letterDensityList = document.getElementById("letter-density-list");
    letterDensityList.innerText = "";

    let textObject = new Map();
    for (let char of descriptionText) {
      char = char.trim().toUpperCase();
      if (char && /^[A-Z]$/.test(char)) {
        textObject.set(char, (textObject.get(char) || 0) + 1);
      }
    }

    let totalCharacters = Array.from(textObject.values()).reduce(
      (acc, count) => acc + count,
      0
    );

    let currentCharSum = textObject.size;
    if (currentCharSum < 5) {
      showMoreContainer.classList.add("hidden");
    } else {
      showMoreContainer.classList.remove("hidden");
    }

    let allLetters = Array.from(textObject.entries());
    let renderedObject = showMore ? allLetters : allLetters.slice(0, 5);
    const sortedTextObject = Array.from(renderedObject).sort(
      (a, b) => b[1] - a[1]
    );

    // Create letter density items directly using js
    for (let [key, value] of sortedTextObject) {
      let currentPercentage = Math.floor((value / totalCharacters) * 100);

      const articleTag = document.createElement("article");
      articleTag.classList.add("letter-density-item");
      articleTag.setAttribute("role", "list-item");
      letterDensityList.appendChild(articleTag);

      const letter = document.createElement("span");
      letter.classList.add("letter");
      letter.innerText = key;
      articleTag.appendChild(letter);

      const barWrapper = document.createElement("div");
      barWrapper.classList.add("bar-container");
      articleTag.appendChild(barWrapper);

      const bar = document.createElement("div");
      bar.classList.add("bar");
      bar.style.width = `${currentPercentage}%`;
      barWrapper.appendChild(bar);

      const percentage = document.createElement("span");
      percentage.classList.add("percentage");
      percentage.innerText = `${value} (${currentPercentage}%)`;
      articleTag.appendChild(percentage);
    }
  }

  function updateProcessedText(text) {
    const processedText = excludeSpacesCheckbox.checked
      ? text.replace(/\s+/g, "")
      : text;
    return processedText;
  }

  function updateCharTextInfo() {
    charTextTag.innerText = excludeSpacesCheckbox.checked
      ? "Total Characters(no space)"
      : "Total Characters";
  }

  function initEventListeners() {
    backgroundModeSetter.addEventListener("click", toggleTheme);
    charLimitCheckbox.addEventListener("click", toggleCharLimitInput);
    excludeSpacesCheckbox.addEventListener("change", validateTextArea);
    charLimitInput.addEventListener("input", handleCharLimitInput);
    description.addEventListener("input", validateTextArea);
    showMoreContainer.addEventListener("click", toggleShowMore);
  }

  function cleanupEventListeners() {
    backgroundModeSetter.removeEventListener("click", toggleTheme);
    charLimitCheckbox.removeEventListener("click", toggleCharLimitInput);
    excludeSpacesCheckbox.removeEventListener("change", validateTextArea);
    charLimitInput.removeEventListener("input", handleCharLimitInput);
    description.removeEventListener("input", validateTextArea);
    showMoreContainer.removeEventListener("click", toggleShowMore);
  }

  function toggleTheme() {
    modeToggled = !modeToggled;
    if (modeToggled) {
      // Light mode styles
      document.documentElement.style.setProperty("--primary-bg", "#F2F2F7");
      document.documentElement.style.setProperty("--text-color", "#12131A");
      document.documentElement.style.setProperty("--bar-color", "#E4E4EF");
      statText.forEach((stat) => (stat.style.color = "#12131A"));
      logoImage.setAttribute("src", "./assets/images/logo-light-theme.svg");
      themeIcon.setAttribute("src", "./assets/images/icon-moon.svg");
      description.style.backgroundColor = "#E4E4EF";
    } else {
      // Dark mode
      document.documentElement.style.setProperty("--primary-bg", "#12131A");
      document.documentElement.style.setProperty("--text-color", "#E4E4EF");
      document.documentElement.style.setProperty("--bar-color", "#2a2b37");
      statText.forEach((stat) => (stat.style.color = "#12131A"));
      logoImage.setAttribute("src", "./assets/images/logo-dark-theme.svg");
      themeIcon.setAttribute("src", "./assets/images/icon-sun.svg");
      description.style.backgroundColor = "#21222C";
    }
    updateCaretIcon();
  }

  function toggleCharLimitInput() {
    charLimitInput.style.display =
      charLimitInput.style.display === "block" ? "none" : "block";
  }

  function handleCharLimitInput() {
    let userSetLimit = parseInt(charLimitInput.value);
    setLimit.innerText =
      !isNaN(userSetLimit) && userSetLimit > 0 ? userSetLimit : "00";
    validateTextArea();
  }

  function toggleShowMore() {
    showMore = !showMore;
    updateCaretIcon();
    validateTextArea();
  }

  function updateCaretIcon() {
    const iconBase = modeToggled ? "dark" : "light";
    const direction = showMore ? "up" : "down";
    showMoreButton.innerText = showMore ? "See less" : "See more";
    showMoreIcon.setAttribute(
      "src",
      `./assets/images/${iconBase}-caret-${direction}.svg`
    );
  }

document.addEventListener("DOMContentLoaded", function () {
  initEventListeners();
  updateCaretIcon();

  window.addEventListener("beforeunload", cleanupEventListeners);
});

module.exports = { updateCharCount, updateWordCount, updateSentenceCount, updateReadingTime };
