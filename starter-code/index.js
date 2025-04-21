document.addEventListener("DOMContentLoaded", function () {
  const description = document.getElementById("description");
  const charCount = document.getElementById("charCount");
  const wordCount = document.getElementById("wordCount");
  const sentenceCount = document.getElementById("sentenceCount");
  const charLimitInput = document.getElementById("characterLimitInput");
  const charLimitCheckbox = document.getElementById("limit-checkbox");
  const setLimit = document.getElementById("set-limit");
  const errorMessage = document.getElementById("error-message");
  const excludeSpacesCheckbox = document.getElementById("excludeSpaces");
  const backgroundModeSetter = document.getElementById("background-mode-setter");
  const charTextTag = document.getElementById("char-text-tag");
  const statText = document.querySelectorAll(".stat");
  const logoImage = document.getElementById("logo-image");
  const themeIcon = document.getElementById("theme-icon");
  const noCharMessage = document.getElementById("no-char-message");
  const showMoreContainer = document.getElementById("show-more-container");
  const showMoreButton = document.getElementById("show-more-button");
  const showMoreIcon = document.getElementById("show-more-icon");
  const readingTimeDisplay = document.getElementById("reading-timer");


  let modeToggled = false;
  let showMore = false;


  initEventListeners();
  updateCaretIcon(); 

  function initEventListeners() {
    backgroundModeSetter.addEventListener("click", toggleTheme);
    charLimitCheckbox.addEventListener("click", toggleCharLimitInput);
    excludeSpacesCheckbox.addEventListener("change", validateTextArea);
    charLimitInput.addEventListener("input", handleCharLimitInput);
    description.addEventListener("input", validateTextArea);
    showMoreContainer.addEventListener("click", toggleShowMore);
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
    charLimitInput.style.display = charLimitInput.style.display === "block" 
      ? "none" 
      : "block";
  }

  function handleCharLimitInput() {
    let userSetLimit = parseInt(charLimitInput.value);
    setLimit.innerText = !isNaN(userSetLimit) && userSetLimit > 0 
      ? userSetLimit 
      : "00";
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
    showMoreIcon.setAttribute("src", `./assets/images/${iconBase}-caret-${direction}.svg`);
  }

  function validateTextArea() {
    updateTextStats();
    updateLetterDensity();
    handleCharacterLimit();
  }

  function updateTextStats() {
    const descriptionText = description.value;
    
    const processedText = excludeSpacesCheckbox.checked
      ? descriptionText.replace(/\s+/g, "")
      : descriptionText;
    
    charTextTag.innerText = excludeSpacesCheckbox.checked
      ? "Total Characters(no space)"
      : "Total Characters";

    const descriptionTextLength = processedText.length;
    charCount.innerText = String(descriptionTextLength).padStart(2, "0");

    let wordArray = descriptionText.split(/[\s.,:;!?(){}\[\]]+/);
    let validWordCount = 0;
    for (let word of wordArray) {
      if (word.trim() !== "") {
        validWordCount++;
      }
    }
    wordCount.innerText = String(validWordCount).padStart(2, "0");

    let numWordsPerMin = 20;
    const readingTime = Math.ceil(validWordCount / numWordsPerMin); 
    readingTimeDisplay.innerText = readingTime > 0 ? String(readingTime) + " minutes" : String(0) + " minute";

    let sentenceArray = descriptionText
      .split(/[.?!]+/)
      .filter((sentence) => sentence.trim() != "");
    sentenceCount.innerText = String(sentenceArray.length).padStart(2, "0");
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
    if(currentCharSum < 5){
      showMoreContainer.classList.add("hidden");
    }else{
      showMoreContainer.classList.remove("hidden");
    }

    let allLetters = Array.from(textObject.entries());
    let renderedObject = showMore ? allLetters : allLetters.slice(0, 5);
    const sortedTextObject = Array.from(renderedObject).sort((a, b) => b[1] - a[1]);

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
});