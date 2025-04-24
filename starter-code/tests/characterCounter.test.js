const {
  updateCharCount,
  updateWordCount,
  updateSentenceCount,
  updateReadingTime, 
} = require('../index');

describe('update functions based on text area input', () => {
  let charCount, wordCount, sentenceCount, readingTimeDisplay, description, errorMessage, setLimit;
  
  beforeEach(() => {
    document.body.innerHTML = `
    <section aria-labelledby="text-description" class="text-area-container">
      <div>
        <textarea class="description" placeholder="Start Typing here...(or paste your text)"
        id="description"></textarea>
        <p class="error-message hidden" id="error-message">
          <img src="./assets/images/icon-info.svg" alt="warning-icon"> Limit reached! your text exceeds <span
          id="set-limit">300</span> characters.
        </p>
      </div>
      <fieldset>
        <div class="options">
          <div class="option-group">
            <input type="checkbox" id="excludeSpaces" name="analysis-options">
            <label for="excludeSpaces">Exclude Spaces</label>
          </div>
          <div class="option-group second-option">
            <input type="checkbox" id="limit-checkbox" name="analysis-options">
            <label for="limit-checkbox">Set Character Limit</label>
            <input type="number" id="characterLimitInput" class="styled-limiter hidden">
          </div>
        </div>
        <span class="reading-time">Approx. reading time: &lt;<span id="reading-timer">0 minute</span></span>
      </fieldset>
    </section>
    
    
    <section class="stats" aria-labelledby="stats-details">
      <div class="stat stat1" role="figure" aria-label="Total characters">
        <output class="number" id="charCount">00</output>
        <p id="char-text-tag">Total Characters</p>
      </div>
      <div class="stat stat2" role="figure" aria-label="Word count">
        <output class="number" id="wordCount">00</output>
        <p>Word Count</p>
      </div>
      <div class="stat stat3" role="figure" aria-label="Sentence count">
        <output class="number" id="sentenceCount">00</output>
        <p>Sentence Count</p>
      </div>
    </section>
    `;

    description = document.getElementById('description');
    errorMessage = document.getElementById('error-message');
    setLimit = document.getElementById('set-limit');
    charLimitInput = document.getElementById('characterLimitInput');
    charLimitCheckbox = document.getElementById('limit-checkbox');
    charCount = document.getElementById('charCount');
    wordCount = document.getElementById('wordCount');
    sentenceCount = document.getElementById('sentenceCount');
    readingTimeDisplay = document.getElementById('reading-timer');

  });

  afterEach(() => {
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