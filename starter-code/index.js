document.addEventListener("DOMContentLoaded", function () {

    const description = document.getElementById("description"); // this is for the text area
    const charCount = document.getElementById("charCount");
    const wordCount = document.getElementById("wordCount");
    const sentenceCount = document.getElementById("sentenceCount");
    const charLimitInput = document.getElementById("characterLimitInput");
    const charLimitCheckbox = document.getElementById("limit-checkbox");
    const setLimit = document.getElementById("set-limit");//for the error messages' number itself
    const errorMessage = document.getElementById("error-message");//the entire error message tag
    const excludeSpacesCheckbox = document.getElementById("excludeSpaces");
    const backgroundModeSetter = document.getElementById("background-mode-setter");
    const body = document.body;
    const charTextTag = document.getElementById("char-text-tag");
    const statText = document.querySelectorAll(".stat");
    const logoImage = document.getElementById("logo-image");
    const themeIcon = document.getElementById("theme-icon");
    const barContainer = document.querySelectorAll(".bar-container");
    
    let modeToggled = false;
    
    backgroundModeSetter.addEventListener("click", function(){
        modeToggled = !modeToggled;//dynamically change the theme
        if(modeToggled){//for light mode
            document.documentElement.style.setProperty("--primary-bg", "#F2F2F7");
            document.documentElement.style.setProperty("--text-color", "#12131A");
            statText.forEach(stat => stat.style.color = "#12131A");
            logoImage.setAttribute("src", "./assets/images/logo-light-theme.svg");
            themeIcon.setAttribute("src", "./assets/images/icon-moon.svg");
            description.style.backgroundColor = "#DEBAFC";
            barContainer.forEach(container => container.style.backgroundColor = "#DEBAFC");
        }else{
            document.documentElement.style.setProperty("--primary-bg", "#12131A");
            document.documentElement.style.setProperty("--text-color", "#E4E4EF");
            statText.forEach(stat => stat.style.color = "#12131A");
            logoImage.setAttribute("src", "./assets/images/logo-dark-theme.svg");
            themeIcon.setAttribute("src", "./assets/images/icon-sun.svg");
            description.style.backgroundColor = "#21222C";
            barContainer.forEach(container => container.style.backgroundColor = "#21222C");
        }
    })
    
    // toggle display of the character limit input when checkbox is clicked
    charLimitCheckbox.addEventListener("click", function () {
        if (charLimitInput.style.display === "block") {
            charLimitInput.style.display = "none";//hide the input that receives the character limit number
        } else {
            charLimitInput.style.display = "block";
        }
    });
    
    // update counts when the excludeSpaces checkbox is toggled
    excludeSpacesCheckbox.addEventListener("change", function () {
        validateTextArea(); // re-run validation with new space setting
    });

    // update the displayed limit value and re-validate text area on every change in limit input
    charLimitInput.addEventListener("input", function () {
        let userSetLimit = parseInt(charLimitInput.value); // extract the number from the limit input tag
        if (!isNaN(userSetLimit) && userSetLimit > 0) {
            setLimit.innerText = userSetLimit;
        } else {
            setLimit.innerText = "00";
        }
        validateTextArea(); // re-validate whenever limit changes
    });

    // validate textarea on every input
    description.addEventListener("input", validateTextArea);

    // this function handles all textarea validation and updates
    function validateTextArea() {
        // to extract the textArea input
        const descriptionText = description.value; // this is a big string

        // check whether spaces should be excluded
        let processedText = null;
        if(excludeSpacesCheckbox.checked){
            processedText = descriptionText.replace(/\s+/g, "");
            charTextTag.innerText = "Total Characters(no space)"
        } else {
            processedText = descriptionText;
            charTextTag.innerText = "Total Characters"
        }

        // to update the number of characters
        const descriptionTextLength = processedText.length;
        charCount.innerText = String(descriptionTextLength).padStart(2, "0");

        let wordArray = descriptionText.split(/[\s.:;!?(){}\[\]]+/);
        let validWordCount = 0;
        for (let word of wordArray) {
            if (word.trim() !== "") {
                validWordCount++;
            }
        }
        wordCount.innerText = String(validWordCount).padStart(2, "0");

        // to update the number of sentences
        let sentenceArray = descriptionText
            .split(/[.?!]+/)
            .filter(sentence => sentence.trim() != ""); // to convert the string into an array, and trim every sentence to remove the empty spaces because deleting all the textArea content leaves one space which is counted as one length
        sentenceCount.innerText = String(sentenceArray.length).padStart(2, "0");

        // to set the character limit
        let userSetLimit = parseInt(charLimitInput.value); // extract the number from the limit input tag
        if (!isNaN(userSetLimit) && descriptionTextLength > userSetLimit) {
            // description.style.border = `2px solid ${}`;
            description.style.boxShadow = "0 0 5px 5px var(--faded-purple)";
            description.setAttribute("readonly", "true"); // to make it reject any input after exceeding the character limit
            errorMessage.style.display = "inline-block";
            setLimit.innerText = userSetLimit;
        } else {
            description.style.border = "";
            description.style.boxShadow = "";
            description.removeAttribute("readonly");
            errorMessage.style.display = "none";
        }
    }
});