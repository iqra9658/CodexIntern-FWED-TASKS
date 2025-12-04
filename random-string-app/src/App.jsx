import { useState, useCallback, useEffect } from 'react';
import './App.css';
import { generateRandomString, copyToClipboard } from './utils';

function App() {
  const [randomStr, setRandomStr] = useState('');
  const [length, setLength] = useState(12);
  const [lower, setLower] = useState(true);
  const [upper, setUpper] = useState(true);
  const [digits, setDigits] = useState(true);
  const [symbols, setSymbols] = useState(false);
  const [copied, setCopied] = useState(false);
  const [autoGenerate, setAutoGenerate] = useState(false);

  // Generate string
  const generate = useCallback(() => {
    const s = generateRandomString(length, { lower, upper, digits, symbols });
    setRandomStr(s);
    return s;
  }, [length, lower, upper, digits, symbols]);

  // Auto-generate if enabled
  useEffect(() => { if (autoGenerate) generate(); }, [autoGenerate, generate]);
  
  // Generate on initial load
  useEffect(() => { generate(); }, []);

  // Reset copied indicator
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  return (
    <div className="card">
      <h1>Random String App</h1>

      <label>
        Length:
        <input
          type="number"
          min="1"
          value={length}
          onChange={(e) => setLength(Math.max(1, Number(e.target.value)))}
        />
      </label>

      <div className="checkboxes">
        <label><input type="checkbox" checked={lower} onChange={e => setLower(e.target.checked)} /> lower</label>
        <label><input type="checkbox" checked={upper} onChange={e => setUpper(e.target.checked)} /> UPPER</label>
        <label><input type="checkbox" checked={digits} onChange={e => setDigits(e.target.checked)} /> digits</label>
        <label><input type="checkbox" checked={symbols} onChange={e => setSymbols(e.target.checked)} /> symbols</label>
      </div>

      <label>
        <input type="checkbox" checked={autoGenerate} onChange={e => setAutoGenerate(e.target.checked)} /> Auto-generate
      </label>

      <div className="actions">
        <button onClick={() => generate()}>Generate</button>
        <button onClick={async () => { await copyToClipboard(randomStr); setCopied(true); }}>Copy</button>
        {copied && <span className="copied">Copied!</span>}
      </div>

      <div className="output">
        <code>{randomStr}</code>
      </div>
    </div>
  );
}

export default App;
