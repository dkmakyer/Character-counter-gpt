document.addEventListener("DOMContentLoaded", function () {

const description = document.getElementById("description");
const charCount = document.getElementById("charCount");
const wordCount = document.getElementById("wordCount");
const sentenceCount = document.getElementById("sentenceCount");


description.addEventListener("input", function () {
    //to extract the textArea input
    const descriptionText = description.value;//this is a big string
    
    //to update the number of characters
    const descriptionTextLength = descriptionText.length;
    charCount.innerText = descriptionTextLength;

    //to update the number of words
    let wordArray = descriptionText.split(" ");
    wordCount.innerText = wordArray.length;

    //to update the number of sentences
    let sentenceArray = descriptionText.split(/[.?!]+/);
    sentenceCount.innerText = sentenceArray.length; 
    
})

})