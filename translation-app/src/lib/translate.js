/**
 * Translate text using MyMemory Translation API (free, no auth required)
 * @param {string} text - The text to translate
 * @param {string} sourceLanguage - Source language code (e.g., 'en', 'es', 'fr')
 * @param {string} targetLanguage - Target language code (e.g., 'es', 'fr', 'de', 'ja', 'zh')
 * @returns {Promise<string>} - The translated text
 */
export const translateText = async (text, sourceLanguage, targetLanguage) => {
  if (!text.trim()) {
    throw new Error('Please enter text to translate');
  }

  try {
    // MyMemory API - free, no authentication needed
    const encodedText = encodeURIComponent(text);
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=${sourceLanguage}|${targetLanguage}`
    );

    if (!response.ok) {
      throw new Error(
        `API Error: ${response.status} - ${response.statusText}`
      );
    }

    const data = await response.json();

    // Check for API errors
    if (data.responseStatus === 403) {
      throw new Error('Translation limit reached. Please try again later.');
    }

    if (data.responseStatus !== 200) {
      throw new Error(`API Error: ${data.responseDetails || 'Unknown error'}`);
    }

    // Extract translated text
    if (data.responseData && data.responseData.translatedText) {
      return data.responseData.translatedText;
    }

    throw new Error('Invalid response from translation service');
  } catch (error) {
    console.error('Translation error:', error);
    throw new Error(
      error.message || 'Failed to translate text. Please try again.'
    );
  }
};

/**
 * Supported languages for translation
 */
export const LANGUAGES = {
  en: { name: 'English', flag: '🇺🇸' },
  es: { name: 'Spanish', flag: '🇪🇸' },
  fr: { name: 'French', flag: '🇫🇷' },
  de: { name: 'German', flag: '🇩🇪' },
  it: { name: 'Italian', flag: '🇮🇹' },
  pt: { name: 'Portuguese', flag: '🇵🇹' },
  ru: { name: 'Russian', flag: '🇷🇺' },
  ja: { name: 'Japanese', flag: '🇯🇵' },
  ko: { name: 'Korean', flag: '🇰🇷' },
  zh: { name: 'Chinese (Simplified)', flag: '🇨🇳' },
  ar: { name: 'Arabic', flag: '🇸🇦' },
  hi: { name: 'Hindi', flag: '🇮🇳' },
  tr: { name: 'Turkish', flag: '🇹🇷' },
  pl: { name: 'Polish', flag: '🇵🇱' },
  nl: { name: 'Dutch', flag: '🇳🇱' },
  sv: { name: 'Swedish', flag: '🇸🇪' },
  el: { name: 'Greek', flag: '🇬🇷' },
  th: { name: 'Thai', flag: '🇹🇭' },
  vi: { name: 'Vietnamese', flag: '🇻🇳' },
};
