import { useState, useEffect, useRef } from 'react';
import { translateText, LANGUAGES } from '../lib/translate';

export default function Translator() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('en');
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [history, setHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showTooltip, setShowTooltip] = useState(null);
  const inputRef = useRef(null);

  // Load favorites from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('favoriteLanguages');
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('favoriteLanguages', JSON.stringify(favorites));
  }, [favorites]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.key === 'Enter') {
        handleTranslate();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [inputText, targetLanguage]);

  const handleInputChange = (e) => {
    const text = e.target.value;
    setInputText(text);
    setCharCount(text.length);
  };

  const handleTranslate = async () => {
    if (!inputText.trim()) {
      setError('Please enter text to translate');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const translated = await translateText(inputText, sourceLanguage, targetLanguage);
      setOutputText(translated);
      setSuccess('Translation successful!');
      
      // Add to history
      setHistory([
        { text: inputText, translated, language: targetLanguage, timestamp: new Date() },
        ...history.slice(0, 9),
      ]);

      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(`${err.message}`);
      setOutputText('');
    } finally {
      setLoading(false);
    }
  };

  const handleSwap = () => {
    setInputText(outputText);
    setOutputText(inputText);
    setCharCount(outputText.length);
  };

  const handleCopy = () => {
    if (outputText) {
      navigator.clipboard.writeText(outputText);
      setSuccess('Copied to clipboard!');
      setTimeout(() => setSuccess(''), 2000);
    }
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
    setError('');
    setSuccess('');
    setCharCount(0);
    inputRef.current?.focus();
  };

  const toggleFavorite = (lang) => {
    setFavorites(
      favorites.includes(lang)
        ? favorites.filter((f) => f !== lang)
        : [...favorites, lang]
    );
  };

  const loadFromHistory = (item) => {
    setInputText(item.text);
    setOutputText(item.translated);
    setTargetLanguage(item.language);
    setCharCount(item.text.length);
    setShowHistory(false);
  };

  const languageOptions = Object.entries(LANGUAGES).map(([code, { name, flag }]) => (
    <option key={code} value={code} style={{ color: '#ffffff', backgroundColor: '#042033' }}>
      {flag} {name}
    </option>
  ));

  const favoriteLanguages = Object.entries(LANGUAGES)
    .filter(([code]) => favorites.includes(code))
    .map(([code, { name, flag }]) => (
      <button
        key={code}
        onClick={() => setTargetLanguage(code)}
        className={`px-3 py-1 rounded-lg text-sm font-semibold transition-all duration-200 ${
          targetLanguage === code
            ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/50'
            : 'bg-white/10 text-blue-200 hover:bg-white/20'
        }`}
      >
        {flag} {name}
      </button>
    ));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 p-4 md:p-8 relative overflow-x-hidden">
      {/* Enhanced animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Primary blob */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob"></div>
        
        {/* Secondary blob */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob animation-delay-2000"></div>
        
        {/* Tertiary blob */}
        <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-gradient-to-br from-cyan-600 to-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob animation-delay-4000"></div>

        {/* Additional accent blobs */}
        <div className="absolute bottom-1/4 right-0 w-72 h-72 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-3000"></div>
      </div>

      {/* Overlay grid pattern */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(255,255,255,.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none opacity-20"></div>

      <div className="relative z-10 w-full mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-12 pt-8">
          <div className="inline-block mb-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-pulse">
            <span className="text-white text-sm font-semibold">UNIVERSAL TRANSLATOR</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-300 via-blue-300 to-cyan-400 bg-clip-text text-transparent mb-3 animate-fade-in">
            Language Bridge
          </h1>
          <p className="text-blue-200 text-lg md:text-xl max-w-2xl mx-auto">
            Break language barriers instantly. Translate between 15+ languages.
          </p>
        </div>

        {/* Favorite Languages Bar */}
        {favorites.length > 0 && (
          <div className="mb-6 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-4">
            <p className="text-blue-200 text-sm font-semibold mb-3">Quick Favorites:</p>
            <div className="flex flex-wrap gap-2">
              {favoriteLanguages}
            </div>
          </div>
        )}

        {/* Main Container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Input Card */}
          <div className="group backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 shadow-2xl hover:shadow-3xl">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-lg font-semibold text-white flex items-center gap-2">
                <span className="text-2xl">{LANGUAGES[sourceLanguage]?.flag}</span> {LANGUAGES[sourceLanguage]?.name} Input
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-blue-300 font-medium">{charCount}/5000</span>
                {charCount > 0 && (
                  <div className="w-6 h-6 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full animate-pulse"></div>
                )}
              </div>
            </div>

            <textarea
              ref={inputRef}
              value={inputText}
              onChange={handleInputChange}
              placeholder="Enter your text here... (Ctrl+Enter to translate)"
              className="w-full h-48 px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white/10 resize-none transition-all duration-200 font-medium hover:border-white/30"
            />

            <div className="mt-3 h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
                style={{ width: `${(charCount / 5000) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Output Card */}
          <div className="group backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 shadow-2xl hover:shadow-3xl">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-lg font-semibold text-white flex items-center gap-2">
                <span className="text-2xl">{LANGUAGES[targetLanguage]?.flag}</span>
                {LANGUAGES[targetLanguage]?.name}
              </label>
              {outputText && (
                <span className="text-xs bg-green-500/20 text-green-300 px-3 py-1 rounded-full font-medium animate-pulse">
                  Ready
                </span>
              )}
            </div>

            <textarea
              value={outputText}
              readOnly
              placeholder="Translation will appear here..."
              className="w-full h-48 px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-blue-300/50 focus:outline-none resize-none font-medium cursor-default hover:border-white/30 transition-all"
            />
          </div>
        </div>

        {/* Language Selector & Controls */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 mb-6 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-blue-200 mb-2">From Language:</label>
              <select
                value={sourceLanguage}
                onChange={(e) => setSourceLanguage(e.target.value)}
                className="w-full px-5 py-3 bg-[#042033] border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer font-medium transition-all"
                disabled={loading}
              >
                {languageOptions}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-200 mb-2">To Language:</label>
              <select
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                className="w-full px-5 py-3 bg-[#042033] border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer font-medium transition-all"
                disabled={loading}
              >
                {languageOptions}
              </select>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4">

            <button
              onClick={() => toggleFavorite(targetLanguage)}
              onMouseEnter={() => setShowTooltip('favorite')}
              onMouseLeave={() => setShowTooltip(null)}
              className="relative px-4 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-110 shadow-2xl shadow-yellow-500/50 hover:shadow-yellow-400/70 border border-white/30 mt-6 md:mt-0"
              title="Add to favorites"
            >
              {favorites.includes(targetLanguage) ? '★' : '☆'}
              {showTooltip === 'favorite' && (
                <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  {favorites.includes(targetLanguage) ? 'Remove from favorites' : 'Add to favorites'}
                </span>
              )}
            </button>

            <button
              onClick={handleSwap}
              disabled={loading || !outputText}
              onMouseEnter={() => setShowTooltip('swap')}
              onMouseLeave={() => setShowTooltip(null)}
              className="relative px-6 py-3 bg-gradient-to-r from-cyan-600 via-blue-600 to-blue-700 hover:from-cyan-500 hover:via-blue-500 hover:to-blue-600 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-110 shadow-2xl shadow-cyan-500/50 hover:shadow-cyan-400/70 flex items-center gap-2 mt-6 md:mt-0 border border-white/20"
              title="Swap input and output"
            >
              <span>↔</span>
              <span className="hidden sm:inline">Swap</span>
              {showTooltip === 'swap' && (
                <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  Swap texts (Ctrl+S)
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-xl backdrop-blur-xl animate-slide-down">
            <p className="text-red-300 font-medium">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-500/20 border border-green-500/50 rounded-xl backdrop-blur-xl animate-slide-down">
            <p className="text-green-300 font-medium">{success}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <button
            onClick={handleTranslate}
            disabled={loading || !inputText.trim()}
            className="flex-1 sm:flex-none px-8 py-4 bg-gradient-to-r from-cyan-500 via-blue-500 to-blue-600 hover:from-cyan-400 hover:via-blue-400 hover:to-blue-500 text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-110 shadow-2xl shadow-cyan-500/60 hover:shadow-cyan-400/80 flex items-center justify-center gap-2 text-lg group border border-white/30"
          >
            {loading ? (
              <>
                <span className="inline-block animate-spin">⟳</span>
                <span>Translating...</span>
              </>
            ) : (
              <>
                <span className="text-2xl group-hover:scale-125 transition-transform">→</span>
                <span>Translate</span>
              </>
            )}
          </button>

          <button
            onClick={handleCopy}
            disabled={loading || !outputText}
            className="flex-1 sm:flex-none px-8 py-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 hover:from-emerald-400 hover:via-teal-400 hover:to-cyan-500 text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-110 shadow-2xl shadow-emerald-500/60 hover:shadow-emerald-400/80 flex items-center justify-center gap-2 text-lg group border border-white/30"
          >
            <span className="text-2xl group-hover:scale-125 transition-transform">✓</span>
            <span>Copy</span>
          </button>

          <button
            onClick={handleClear}
            disabled={loading}
            className="flex-1 sm:flex-none px-8 py-4 bg-gradient-to-r from-blue-600 via-slate-600 to-gray-700 hover:from-blue-500 hover:via-slate-500 hover:to-gray-600 text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-110 shadow-2xl shadow-blue-500/60 hover:shadow-blue-400/80 flex items-center justify-center gap-2 text-lg group border border-white/30"
          >
            <span className="text-2xl group-hover:scale-125 transition-transform">×</span>
            <span>Clear</span>
          </button>
        </div>

    
        <div className="text-center text-blue-300 text-sm">
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}




