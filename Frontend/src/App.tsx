import { useState, useEffect, useRef } from 'react';

const detectLanguage = (code: string) => {
  const c = code.trim();
  if (!c) return 'Auto';
  
  if (/def\s+\w+\(|import\s+(math|os|sys|numpy|pandas)|print\(|class\s+\w+:/i.test(c)) return 'Python';
  if (/function\s+\w+\(|const\s+\w+\s*=|let\s+\w+\s*=|console\.log\(|document\./.test(c)) return 'JavaScript';
  if (/(public|private)\s+class\s+|System\.out\.println\(|public\s+static\s+void\s+main/.test(c)) return 'Java';
  if (/#include\s+<.*>|std::cout|int\s+main\(\)/.test(c)) return 'C++';
  if (/<\?php|\$\w+\s*=|echo\s+/.test(c)) return 'PHP';
  if (/<html>|<div|<\w+>.*<\/\w+>/.test(c)) return 'HTML';
  if (/@apply|margin:|padding:|\.\w+\s*\{/.test(c)) return 'CSS';
  if (/SELECT\s+.*\s+FROM\s+/i.test(c)) return 'SQL';
  if (/fn\s+\w+\(|println!/.test(c)) return 'Rust';
  if (/package\s+main|func\s+main\(\)/.test(c)) return 'Go';
  
  return 'Text'; // Fallback
};

const getLanguageColor = (lang: string) => {
  switch (lang) {
    case 'Python': return '#3572A5'; // Typical python blue
    case 'JavaScript': return '#f1e05a';
    case 'Java': return '#b07219';
    case 'C++': return '#f34b7d';
    case 'PHP': return '#4F5D95';
    case 'HTML': return '#e34c26';
    case 'CSS': return '#563d7c';
    case 'SQL': return '#e38c00';
    case 'Rust': return '#dea584';
    case 'Go': return '#00ADD8';
    case 'Auto': return '#9ca3af'; // Neutral gray
    default: return '#9ca3af';
  }
};

interface AnalysisResult {
  language: string;
  bugs: string[];
  improvements: string[];
  explanation: string;
  optimized_code: string;
  score: number;
  time: string;
  sources?: string[];
  fallback?: boolean;
}

export default function App() {
  const [code, setCode] = useState("");
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedLang, setDetectedLang] = useState("Auto");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);
  const detectTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    setCode(newCode);

    setIsDetecting(true);
    setDetectedLang("Detecting...");

    if (detectTimeoutRef.current) {
      clearTimeout(detectTimeoutRef.current);
    }

    detectTimeoutRef.current = window.setTimeout(() => {
      setDetectedLang(detectLanguage(newCode));
      setIsDetecting(false);
    }, 600); // simulate some processing time
  };

  const handleClear = () => {
    setCode("");
    setDetectedLang("Auto");
    setIsDetecting(false);
    setResult(null);
    setAnalyzeError(null);
  };

  const handleAnalyze = async () => {
    if (!code.trim() || isAnalyzing) return;

    setIsAnalyzing(true);
    setAnalyzeError(null);

    try {
      const baseUrl = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${baseUrl}/api/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language_hint: detectedLang !== 'Auto' ? detectedLang : null }),
      });

      if (!res.ok) {
        throw new Error(`Server responded with status ${res.status}`);
      }

      const data: AnalysisResult = await res.json();
      setResult(data);

      if (data.language) {
        setDetectedLang(data.language);
      }
    } catch (err) {
      console.error('[LogicLLM] Analyze request failed:', err);
      setAnalyzeError(
        err instanceof Error
          ? err.message
          : 'Unable to reach the analysis service. Please try again.'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSample = () => {
    setCode(`def calculate_factorial(n):
    # This function calculates the factorial of a number
    if n < 0:
        return "Error: Factorial is not defined for negative numbers."
    elif n == 0:
        return 1
    else:
        result = 1
        for i in range(1, n + 1):
            result *= i
        return result

# Example usage
number = 5
print(f"The factorial of {number} is {calculate_factorial(number)}")`);
    
    setIsDetecting(true);
    setDetectedLang("Detecting...");
    setTimeout(() => {
      setDetectedLang("Python");
      setIsDetecting(false);
    }, 600);
  };

  return (
    <div className="h-screen relative overflow-hidden flex flex-col text-on-surface">
      <div 
        className="fixed inset-0 z-[-2] bg-cover bg-center"
        style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDwcsGV7If2tUBgIn7HghA0tjfBj8WA0pMqKHfbTagnpmNkpUR-1Gi1MFHnnufqF96dNX1ywBLoZMXrGs3cildRUJvF6YlRFV3556pjkXMBIocQpiafqP8tFPdMNroCJTvlpyMl3rhYg5xgSVDJSpUjdDht6aK7YGINomWu_xgMLNQY5AAoHVCJLeCWW2lEDYOCplHwNWfGf_4ypfHBf6_mQGYQ5Od8u3eyoV-R4cK30Ke4fMjZlAYoPw")' }}
      ></div>
      <div className={`fixed inset-0 z-[-1] backdrop-blur-3xl transition-colors duration-500 ${isDarkMode ? 'bg-[#0f0d13]/80' : 'bg-white/60'}`}></div>
      
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>

      <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-margin-desktop py-4 bg-surface/45 backdrop-blur-[40px] border-b border-white/10 shadow-[0_8px_32px_0_rgba(53,37,205,0.1)]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-primary font-headline-lg text-headline-lg">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>terminal</span>
            <span>LogicLLM</span>
          </div>
          <span className="text-secondary font-body-md text-body-md hidden md:inline-block ml-2 border-l border-outline-variant pl-4">Intelligent Code Analysis</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="glass-button px-3 py-1 rounded-full flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: '"FILL" 1' }}>auto_awesome</span>
            <span className="font-label-sm text-label-sm text-primary">Gemini&nbsp;</span>
          </div>
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="text-primary hover:bg-surface-variant transition-colors duration-300 p-2 rounded-full scale-95 active:scale-90"
            aria-label="Toggle dark mode"
          >
            <span className="material-symbols-outlined">{isDarkMode ? 'light_mode' : 'dark_mode'}</span>
          </button>
        </div>
      </nav>

      <main className="flex-grow pt-[100px] pb-margin-desktop px-margin-mobile md:px-margin-desktop flex flex-col md:flex-row gap-gutter min-h-0">
        
        {/* Source Code Panel */}
        <section className="flex-1 glass-panel rounded-[24px] p-container-padding flex flex-col gap-4 relative overflow-hidden">
          <header className="flex justify-between items-center relative z-10">
            <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">Source Code</h2>
            <div className="bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm px-3 py-1.5 rounded-full border border-outline-variant/50 flex items-center gap-2 select-none">
              {isDetecting ? (
                <span className="material-symbols-outlined animate-spin text-[16px] text-outline">sync</span>
              ) : detectedLang === 'Auto' ? (
                <span className="material-symbols-outlined text-[16px] text-outline">radar</span>
              ) : (
                <span 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: getLanguageColor(detectedLang) }}
                ></span>
              )}
              {detectedLang}
            </div>
          </header>
          
          <div className="flex-grow glass-inset rounded-xl p-4 relative z-10 overflow-hidden flex flex-col min-h-0">
            <textarea 
              value={code}
              onChange={handleCodeChange}
              placeholder="Paste or type your code here..."
              className="flex-grow w-full h-full bg-transparent resize-none outline-none custom-scrollbar font-mono text-sm leading-relaxed text-on-surface-variant placeholder:text-outline-variant/50"
              spellCheck="false"
            />
          </div>
          
          <footer className="flex justify-between items-center relative z-10 pt-2 border-t border-outline-variant/30">
            <span className="font-label-sm text-label-sm text-secondary">
              {code.length} chars | {code.split('\\n').length} lines
            </span>
            <div className="flex gap-3">
              <button onClick={handleClear} className="glass-button text-primary font-label-sm text-label-sm px-4 py-2 rounded-lg hover:bg-white/60 transition-colors">Clear</button>
              <button onClick={handleSample} className="glass-button text-primary font-label-sm text-label-sm px-4 py-2 rounded-lg hover:bg-white/60 transition-colors">Try Sample</button>
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !code.trim()}
                className="bg-primary text-on-primary font-label-sm text-label-sm px-6 py-2 rounded-lg shadow-[0_4px_12px_rgba(53,37,205,0.4)] hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary"
              >
                <span className={`material-symbols-outlined text-[18px] ${isAnalyzing ? 'animate-spin' : ''}`}>
                  {isAnalyzing ? 'sync' : 'psychology'}
                </span>
                {isAnalyzing ? 'Analyzing...' : 'Analyze Code'}
              </button>
            </div>
          </footer>
        </section>

        {/* Right Panel: Analysis Results */}
        <section className="flex-1 glass-panel rounded-[24px] p-container-padding flex flex-col gap-6 relative overflow-hidden">
          <header className="flex justify-between items-center relative z-10">
            <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">Analysis Results</h2>
            <div className="flex gap-2">
              <button
                onClick={() => result && navigator.clipboard.writeText(JSON.stringify(result, null, 2))}
                disabled={!result}
                className="glass-button p-2 rounded-full text-secondary hover:text-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-[20px]">content_copy</span>
              </button>
              <button
                onClick={() => {
                  if (!result) return;
                  const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'logicllm-analysis-report.json';
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                disabled={!result}
                className="glass-button p-2 rounded-full text-secondary hover:text-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-[20px]">download</span>
              </button>
            </div>
          </header>
          
          <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2 relative z-10">
            <div className="glass-button px-4 py-1.5 rounded-full flex items-center gap-2 border-white/40">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: getLanguageColor(result?.language || detectedLang) }}
              ></span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">{result?.language || detectedLang}</span>
            </div>
            <div className="glass-button px-4 py-1.5 rounded-full flex items-center gap-2 border-white/40">
              <span className="material-symbols-outlined text-primary text-[18px]" style={{ fontVariationSettings: '"FILL" 1' }}>analytics</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Score: {result ? `${result.score}/100` : '--/100'}</span>
            </div>
            <div className="glass-button px-4 py-1.5 rounded-full flex items-center gap-2 border-white/40">
              <span className="material-symbols-outlined text-primary text-[18px]">timer</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Time: {result?.time || '--'}</span>
            </div>
          </div>
          
          <div className="flex-grow flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2 relative z-10 min-h-0">
            {!result && !isAnalyzing && !analyzeError && (
              <div className="flex-grow flex flex-col items-center justify-center text-center gap-2 py-12 opacity-60">
                <span className="material-symbols-outlined text-[40px] text-outline">terminal</span>
                <p className="font-body-md text-body-md text-secondary text-sm max-w-[240px]">
                  Paste your code on the left and hit "Analyze Code" to see results here.
                </p>
              </div>
            )}

            {isAnalyzing && (
              <div className="flex-grow flex flex-col items-center justify-center text-center gap-3 py-12">
                <span className="material-symbols-outlined text-[32px] text-primary animate-spin">sync</span>
                <p className="font-body-md text-body-md text-secondary text-sm">Analyzing your code...</p>
              </div>
            )}

            {analyzeError && !isAnalyzing && (
              <div className="glass-panel-heavy rounded-xl p-4 border-l-4 border-l-error">
                <div className="flex items-center gap-2 text-error mb-2">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>error</span>
                  <h3 className="font-label-sm text-label-sm">Analysis Failed</h3>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant text-sm">{analyzeError}</p>
              </div>
            )}

            {result && !isAnalyzing && (
              <>
                <div className={`glass-panel-heavy rounded-xl p-4 border-l-4 ${result.bugs.length > 0 ? 'border-l-error' : 'border-l-[#16a34a]'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div className={`flex items-center gap-2 ${result.bugs.length > 0 ? 'text-error' : 'text-[#16a34a]'}`}>
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>
                        {result.bugs.length > 0 ? 'bug_report' : 'check_circle'}
                      </span>
                      <h3 className="font-label-sm text-label-sm">{result.bugs.length > 0 ? 'Bugs Found' : 'No Bugs Found'}</h3>
                    </div>
                    {result.bugs.length > 0 && (
                      <span className="bg-error/10 text-error text-[11px] font-bold px-2 py-0.5 rounded">{result.bugs.length}</span>
                    )}
                  </div>
                  {result.bugs.length > 0 ? (
                    <ul className="flex flex-col gap-2">
                      {result.bugs.map((bug, i) => (
                        <li key={i} className="font-body-md text-body-md text-on-surface-variant text-sm">• {bug}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="font-body-md text-body-md text-on-surface-variant text-sm">No bugs detected — your code looks clean!</p>
                  )}
                </div>

                <div className="glass-panel-heavy rounded-xl p-4 border-l-4 border-l-[#d97706]">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2 text-[#d97706]">
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>lightbulb</span>
                      <h3 className="font-label-sm text-label-sm">Suggestions & Improvements</h3>
                    </div>
                    {result.improvements.length > 0 && (
                      <span className="bg-[#d97706]/10 text-[#d97706] text-[11px] font-bold px-2 py-0.5 rounded">{result.improvements.length}</span>
                    )}
                  </div>
                  {result.improvements.length > 0 ? (
                    <ul className="flex flex-col gap-2">
                      {result.improvements.map((tip, i) => (
                        <li key={i} className="font-body-md text-body-md text-on-surface-variant text-sm">• {tip}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="font-body-md text-body-md text-on-surface-variant text-sm">No additional suggestions.</p>
                  )}
                </div>

                <div className="glass-panel-heavy rounded-xl p-4 border-l-4 border-l-primary">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2 text-primary">
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>info</span>
                      <h3 className="font-label-sm text-label-sm">Code Explanation</h3>
                    </div>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant text-sm">{result.explanation}</p>
                </div>

                <div className="glass-panel-heavy rounded-xl p-4 border-l-4 border-l-[#0d9488]">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2 text-[#0d9488]">
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>auto_fix_high</span>
                      <h3 className="font-label-sm text-label-sm">Optimized Code</h3>
                    </div>
                  </div>
                  {result.optimized_code ? (
                    <div className="glass-inset rounded-lg p-3 relative group">
                      <button
                        onClick={() => navigator.clipboard.writeText(result.optimized_code)}
                        className="absolute top-2 right-2 p-1.5 rounded-md bg-white/20 hover:bg-white/40 text-on-surface-variant transition-colors"
                      >
                        <span className="material-symbols-outlined text-[16px]">content_copy</span>
                      </button>
                      <pre className="font-mono text-[13px] leading-relaxed text-on-surface-variant overflow-x-auto custom-scrollbar"><code>{result.optimized_code}</code></pre>
                    </div>
                  ) : (
                    <p className="font-body-md text-body-md text-secondary text-sm italic">No optimized version was returned for this code.</p>
                  )}
                </div>

                {result.sources && result.sources.length > 0 && (
                  <div className="glass-panel-heavy rounded-xl p-4 border-l-4 border-l-[#8b5cf6]">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2 text-[#8b5cf6]">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>library_books</span>
                        <h3 className="font-label-sm text-label-sm">Knowledge Base Sources</h3>
                      </div>
                    </div>
                    <ul className="flex flex-col gap-2">
                      {result.sources.map((src, i) => (
                        <li key={i} className="font-body-md text-body-md text-on-surface-variant text-sm flex items-center gap-2">
                          <span className="material-symbols-outlined text-[14px] text-outline">description</span>
                          {src}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
