const {
  updateCharCount,
  updateWordCount,
  updateSentenceCount,
  updateReadingTime
} = require('../index');

describe('Text Analysis Functions', () => {
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

  describe('updateCharCount', () => {
    test('should correctly count characters in a string', () => {
      updateCharCount(5);
      expect(charCount.innerText).toBe('05');
    });

    test('should handle zero characters', () => {
      updateCharCount(0);
      expect(charCount.innerText).toBe('00');
    });

    test('should pad single digit counts with leading zero', () => {
      updateCharCount(9);
      expect(charCount.innerText).toBe('09');
    });

    test('should not pad double digit counts', () => {
      updateCharCount(15);
      expect(charCount.innerText).toBe('15');
    });
  });

  describe('updateWordCount', () => {
    test('should correctly count words in simple text', () => {
      const text = 'This is a test';
      updateWordCount(text);
      expect(wordCount.innerText).toBe('04');
    });

    test('should handle empty string', () => {
      const text = '';
      updateWordCount(text);
      expect(wordCount.innerText).toBe('00');
    });

    test('should handle multiple spaces between words', () => {
      const text = 'This    is    a    test';
      updateWordCount(text);
      expect(wordCount.innerText).toBe('04');
    });

    test('should handle leading/trailing spaces', () => {
      const text = '   This is a test   ';
      updateWordCount(text);
      expect(wordCount.innerText).toBe('04');
    });

    test('should handle punctuation marks', () => {
      const text = 'This, is. a! test?';
      updateWordCount(text);
      expect(wordCount.innerText).toBe('04');
    });

    test('should handle complex punctuation and symbols', () => {
      const text = 'Hello (world) - this is a test... of the system!';
      updateWordCount(text);
      expect(wordCount.innerText).toBe('09');
    });

    test('should update reading time when counting words', () => {
      const text = 'word '.repeat(200); // 200 words
      updateWordCount(text);
      expect(readingTimeDisplay.innerText).toBe('1 minutes');
    });
  });

  describe('updateSentenceCount', () => {
    test('should count sentences separated by periods', () => {
      const text = 'This is sentence one. This is sentence two.';
      updateSentenceCount(text);
      expect(sentenceCount.innerText).toBe('02');
    });

    test('should count sentences separated by question marks', () => {
      const text = 'Is this sentence one? Is this sentence two?';
      updateSentenceCount(text);
      expect(sentenceCount.innerText).toBe('02');
    });

    test('should count sentences separated by exclamation points', () => {
      const text = 'This is sentence one! This is sentence two!';
      updateSentenceCount(text);
      expect(sentenceCount.innerText).toBe('02');
    });

    test('should handle mixed sentence terminators', () => {
      const text = 'Sentence one. Sentence two? Sentence three!';
      updateSentenceCount(text);
      expect(sentenceCount.innerText).toBe('03');
    });

    test('should ignore abbreviations with periods', () => {
      const text = 'This is Dr. Smith. He works at the U.S. Dept. of Agriculture.';
      updateSentenceCount(text);
      expect(sentenceCount.innerText).toBe('02');
    });

    test('should handle empty string', () => {
      const text = '';
      updateSentenceCount(text);
      expect(sentenceCount.innerText).toBe('00');
    });

    test('should handle text with no sentence terminators', () => {
      const text = 'This is a single sentence without termination';
      updateSentenceCount(text);
      expect(sentenceCount.innerText).toBe('01');
    });

    test('should handle multiple terminators in a row', () => {
      const text = 'What?! This is a test... Really!!';
      updateSentenceCount(text);
      expect(sentenceCount.innerText).toBe('02');
    });
  });

  describe('updateReadingTime', () => {
    test('should display 0 minute for 0 words', () => {
      updateReadingTime(0);
      expect(readingTimeDisplay.innerText).toBe('0 minute');
    });

    test('should display 1 minute for 200 words', () => {
      updateReadingTime(200);
      expect(readingTimeDisplay.innerText).toBe('1 minutes');
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