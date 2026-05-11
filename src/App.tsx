import React, { useState, useMemo } from 'react';
import { Search, Briefcase, CheckCircle2, XCircle, Trophy, ArrowRight, Sparkles } from 'lucide-react';

const JOBS: Record<string, string[]> = {
  "Data Scientist": ["python", "machine learning", "statistics", "pandas", "numpy"],
  "Web Developer": ["html", "css", "javascript", "react", "nodejs"],
  "Data Analyst": ["python", "sql", "excel", "powerbi", "statistics"],
  "Software Engineer": ["java", "python", "data structures", "algorithms"],
  "AI Engineer": ["python", "machine learning", "deep learning", "tensorflow"]
};

interface JobResult {
  job: string;
  matchPercent: number;
  matched: string[];
  missing: string[];
}

export default function App() {
  const [input, setInput] = useState('');
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  const results = useMemo(() => {
    if (!input.trim()) return [];

    // Split by comma or space, clean up whitespace, remove empty strings
    const studentSkills = input
      .toLowerCase()
      .split(/[\s,]+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const studentSkillsSet = new Set(studentSkills);

    const analysis: JobResult[] = Object.entries(JOBS).map(([job, skills]) => {
      const matched = skills.filter(skill => studentSkillsSet.has(skill));
      const missing = skills.filter(skill => !studentSkillsSet.has(skill));
      const matchPercent = (matched.length / skills.length) * 100;

      return {
        job,
        matchPercent,
        matched,
        missing
      };
    });

    // Sort by match percentage descending
    return analysis.sort((a, b) => b.matchPercent - a.matchPercent);
  }, [input, hasAnalyzed]); // Only recompute when input changes, but we control visibility with hasAnalyzed

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      setHasAnalyzed(true);
    }
  };

  const handleReset = () => {
    setInput('');
    setHasAnalyzed(false);
  };

  const topRoles = results.slice(0, 3);
  const bestJob = results.length > 0 ? results[0] : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-violet-500/30">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-violet-400">
            <Briefcase className="w-6 h-6" />
            <h1 className="text-xl font-bold tracking-tight text-slate-50">Skill Gap Analyzer</h1>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Input Section */}
        <div className="bg-slate-900 rounded-2xl shadow-sm border border-slate-800 p-6 sm:p-10 mb-8">
          <div className="max-w-2xl mx-auto text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-slate-50 mb-4">
              Discover your career match
            </h2>
            <p className="text-slate-400 text-lg">
              Enter the skills you know, and we'll analyze how well they match top tech roles and show you what to learn next.
            </p>
          </div>

          <form onSubmit={handleAnalyze} className="max-w-2xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-500" />
              </div>
              <input
                type="text"
                className="block w-full pl-11 pr-4 py-4 bg-slate-950 border border-slate-800 rounded-xl text-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-colors placeholder:text-slate-500 text-slate-50"
                placeholder="e.g. python, html, css, machine learning"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setHasAnalyzed(false);
                }}
              />
            </div>
            <div className="mt-4 flex justify-center gap-4">
              <button
                type="submit"
                disabled={!input.trim()}
                className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 text-white font-medium rounded-xl hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-violet-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Sparkles className="w-5 h-5" />
                Analyze My Skills
              </button>
              {hasAnalyzed && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center px-6 py-3 bg-slate-800 text-slate-300 font-medium rounded-xl border border-slate-700 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-slate-500 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Results Section */}
        {hasAnalyzed && results.length > 0 && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Top Match Highlight */}
            {bestJob && bestJob.matchPercent > 0 && (
              <div className="bg-gradient-to-br from-violet-600 to-fuchsia-700 rounded-2xl shadow-lg p-8 text-white text-center border border-violet-500/20">
                <Trophy className="w-12 h-12 mx-auto text-yellow-300 mb-4" />
                <h3 className="text-lg font-medium text-violet-100 mb-1">Your Best Match</h3>
                <div className="text-4xl font-bold mb-2">{bestJob.job}</div>
                <div className="text-violet-100 text-lg">
                  {bestJob.matchPercent.toFixed(0)}% skill alignment
                </div>
              </div>
            )}

            {/* Top 3 Roles */}
            <div>
              <h3 className="text-2xl font-bold text-slate-50 mb-6 flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-violet-400" />
                Top Recommended Roles
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {topRoles.map((result, index) => (
                  <div key={result.job} className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-slate-800 text-slate-400 text-xs font-bold px-3 py-1 rounded-bl-lg">
                      #{index + 1}
                    </div>
                    <h4 className="text-xl font-bold text-slate-50 mb-2">{result.job}</h4>
                    <div className="flex items-end gap-2 mb-4">
                      <span className="text-3xl font-bold text-violet-400">{result.matchPercent.toFixed(0)}%</span>
                      <span className="text-slate-400 mb-1">match</span>
                    </div>
                    
                    <div className="w-full bg-slate-800 rounded-full h-2 mb-6">
                      <div 
                        className="bg-violet-500 h-2 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${result.matchPercent}%` }}
                      ></div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">You have ({result.matched.length})</div>
                        <div className="flex flex-wrap gap-1.5">
                          {result.matched.length > 0 ? result.matched.map(skill => (
                            <span key={skill} className="inline-flex items-center px-2 py-1 rounded-md bg-green-500/10 text-green-400 text-xs font-medium border border-green-500/20">
                              {skill}
                            </span>
                          )) : <span className="text-sm text-slate-500 italic">None</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Skill Gap Analysis */}
            <div>
              <h3 className="text-2xl font-bold text-slate-50 mb-6 flex items-center gap-2">
                <Search className="w-6 h-6 text-violet-400" />
                Detailed Skill Gap Analysis
              </h3>
              <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-sm overflow-hidden">
                <div className="divide-y divide-slate-800">
                  {results.map((result) => (
                    <div key={result.job} className="p-6 sm:p-8 hover:bg-slate-800/50 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                        <h4 className="text-xl font-bold text-slate-50">{result.job}</h4>
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-violet-500/10 text-violet-300 font-semibold text-sm border border-violet-500/20">
                          {result.matchPercent.toFixed(1)}% Match
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Matched Skills */}
                        <div>
                          <h5 className="flex items-center gap-2 text-sm font-semibold text-slate-50 mb-3">
                            <CheckCircle2 className="w-4 h-4 text-green-400" />
                            Matched Skills
                          </h5>
                          {result.matched.length > 0 ? (
                            <ul className="space-y-2">
                              {result.matched.map(skill => (
                                <li key={skill} className="flex items-center gap-2 text-slate-300 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                                  <span className="capitalize">{skill}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <div className="text-slate-400 italic text-sm p-3 bg-slate-950 rounded-lg border border-slate-800">
                              No matching skills found.
                            </div>
                          )}
                        </div>

                        {/* Missing Skills */}
                        <div>
                          <h5 className="flex items-center gap-2 text-sm font-semibold text-slate-50 mb-3">
                            <XCircle className="w-4 h-4 text-red-400" />
                            Missing Skills to Learn
                          </h5>
                          {result.missing.length > 0 ? (
                            <ul className="space-y-2">
                              {result.missing.map(skill => (
                                <li key={skill} className="flex items-center gap-2 text-slate-300 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                                  <span className="capitalize">{skill}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <div className="text-slate-400 italic text-sm p-3 bg-slate-950 rounded-lg border border-slate-800">
                              You have all the required skills!
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Empty State / No Results yet */}
        {hasAnalyzed && results.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg">Please enter some skills to see your matches.</p>
          </div>
        )}
      </main>
    </div>
  );
}
