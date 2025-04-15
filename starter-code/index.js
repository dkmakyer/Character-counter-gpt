document.addEventListener("DOMContentLoaded", function () {

    const description = document.getElementById("description"); // this is for the text area
    const charCount = document.getElementById("charCount");
    const wordCount = document.getElementById("wordCount");
    const sentenceCount = document.getElementById("sentenceCount");
    const charLimitInput = document.getElementById("characterLimitInput");
    const charLimitCheckbox = document.getElementById("limit-checkbox");
    const setLimit = document.getElementById("set-limit");
    const errorMessage = document.getElementById("error-message");

    // toggle display of the character limit input when checkbox is clicked
    charLimitCheckbox.addEventListener("click", function () {
        if (charLimitInput.style.display === "block") {
            charLimitInput.style.display = "none";
        } else {
            charLimitInput.style.display = "block";
        }
    });

    // update the displayed limit value and re-validate text area on every change in limit input
    charLimitInput.addEventListener("input", function () {
        let userSetLimit = parseInt(charLimitInput.value); // extract the number from the limit input tag
        if (!isNaN(userSetLimit) && userSetLimit > 0) {
            setLimit.innerText = userSetLimit;
        } else {
            setLimit.innerText = "--";
        }
        validateTextArea(); // re-validate whenever limit changes
    });

    // validate textarea on every input
    description.addEventListener("input", validateTextArea);

    // this function handles all textarea validation and updates
    function validateTextArea() {
        // to extract the textArea input
        const descriptionText = description.value; // this is a big string

        // to update the number of characters
        const descriptionTextLength = descriptionText.length;
        charCount.innerText = String(descriptionTextLength).padStart(2, "0");

        // there is a bug for when there is symbol before a new word, the word is not counted. fix it
        // to update the number of words
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
            description.style.border = "2px solid #FE8159";
            description.style.boxShadow = "0 0 5px 5px var(--faded-purple)";
            description.setAttribute("readonly", "true"); // to make it reject any input after exceeding the character limit
            errorMessage.style.display = "block";
            setLimit.innerText = userSetLimit;
        } else {
            description.style.border = "";
            description.style.boxShadow = "";
            description.removeAttribute("readonly");
            errorMessage.style.display = "none";
        }
    }

});
