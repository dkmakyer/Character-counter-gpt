const {
  updateCharCount,
  updateWordCount,
  updateSentenceCount,
  updateReadingTime
} = require('../index');

describe('update functions based on text area input', () => {
  let charCount, wordCount, sentenceCount, readingTimeDisplay;
  
  beforeEach(() => {
    document.body.innerHTML = `
      <output class="number" id="charCount">00</output>
      <output class="number" id="wordCount">00</output>
      <output class="number" id="sentenceCount">00</output>
      <span id="reading-timer">0 minute</span>
    `;

    charCount = document.getElementById('charCount');
    wordCount = document.getElementById('wordCount');
    sentenceCount = document.getElementById('sentenceCount');
    readingTimeDisplay = document.getElementById('reading-timer');
  });

  describe('update character count based on length of text area value', () => {
    test('should correctly count characters in a string', () => {
      updateCharCount(5);
      expect(charCount.innerText).toBe('05');
    });

    test('should pad digit count less than 10 with leading zero', () => {
      updateCharCount(9);
      expect(charCount.innerText).toBe('09');
    });

    test('should maintain digit counts with more than one digit', () => {
      updateCharCount(15);
      expect(charCount.innerText).toBe('15');
    });
  });

  describe('update word count based on text area value', () => {
    test('should correctly count words in simple text', () => {
      const text = 'Amalitech will employ me';
      updateWordCount(text);
      expect(wordCount.innerText).toBe('04');
    });

    test('should handle empty string', () => {
      const text = '';
      updateWordCount(text);
      expect(wordCount.innerText).toBe('00');
    });

    test('should handle multiple spaces between words, before and after words', () => {
      const text = 'Amalitech    will    employ    me';
      updateWordCount(text);
      expect(wordCount.innerText).toBe('04');

      const secondText = '   Amalitech will employ me   ';
      updateWordCount(secondText);
      expect(wordCount.innerText).toBe('04');
    });

    test('should handle punctuation marks', () => {
      const text = 'Amalitech, will. employ! me?';
      updateWordCount(text);
      expect(wordCount.innerText).toBe('04');
    });

    test('should update reading time when counting words', () => {
      const text = 'Amalitech '.repeat(200); 
      updateWordCount(text);
      expect(readingTimeDisplay.innerText).toBe('1 minute');
    });
  });

  describe('update sentence count based on text area value', () => {
    test('should count sentences separated by periods, exclamation marks and question marks', () => {
      const text = 'I am a graduate trainee. Amalitech will employ me.';
      updateSentenceCount(text);
      expect(sentenceCount.innerText).toBe('02');
    });

    test('should count sentences separated by question marks', () => {
      const text = 'Am I a graduate trainee? Will Amalitech employ me?';
      updateSentenceCount(text);
      expect(sentenceCount.innerText).toBe('02');
    });

    test('should count sentences separated by exclamation points', () => {
      const text = 'This is Amalitech! Employ me!';;
      updateSentenceCount(text);
      expect(sentenceCount.innerText).toBe('02');
    });

    test('should handle multiple sentence punctuations', () => {
      const text = 'My name is David. Am i a graduate trainee? Watch out for me!';
      updateSentenceCount(text);
      expect(sentenceCount.innerText).toBe('03');
    });

    test('should handle empty string', () => {
      const text = '';
      updateSentenceCount(text);
      expect(sentenceCount.innerText).toBe('00');
    });

    test('should handle text with no sentence punctuation', () => {
      const text = 'Hello, My name is David';
      updateSentenceCount(text);
      expect(sentenceCount.innerText).toBe('01');
    });
  });

  describe('update the reading time based on the words in the text area', () => {
    test('should display 0 minute for 0 words', () => {
      updateReadingTime(0);
      expect(readingTimeDisplay.innerText).toBe('0 minute');
    });

    test('should round up to nearest minute', () => {
      updateReadingTime(201);
      expect(readingTimeDisplay.innerText).toBe('2 minutes');
    });

    test('should handle small word counts', () => {
      updateReadingTime(1);
      expect(readingTimeDisplay.innerText).toBe('1 minute');
      
      updateReadingTime(50);
      expect(readingTimeDisplay.innerText).toBe('1 minute');
    });

    test('should handle large word counts', () => {
      updateReadingTime(1000);
      expect(readingTimeDisplay.innerText).toBe('5 minutes');
    });
  });
});