import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import ProgressTracker from './ProgressTracker';

const CodeEditor = ({ onAnalysisComplete }) => {
  const { user, token } = useContext(AuthContext);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [problemTitle, setProblemTitle] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [activeTab, setActiveTab] = useState('editor');
  const editorRef = useRef(null);
  const debounceRef = useRef(null);

  const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'csharp', label: 'C#' },
    { value: 'go', label: 'Go' },
    { value: 'rust', label: 'Rust' },
    { value: 'typescript', label: 'TypeScript' }
  ];

  const skillLevels = [
    { value: 'beginner', label: 'Beginner', color: 'bg-green-100 text-green-800' },
    { value: 'intermediate', label: 'Intermediate', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'advanced', label: 'Advanced', color: 'bg-red-100 text-red-800' }
  ];

  const [skillLevel, setSkillLevel] = useState('intermediate');

  // Debounced real-time analysis
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (code.length > 50) {
      debounceRef.current = setTimeout(() => {
        analyzeCode();
      }, 2000);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [code, language, skillLevel]);

  const analyzeCode = async () => {
    if (!code.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/analyze', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          language,
          problemTitle,
          problemDescription,
          skillLevel
        }),
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      setAnalysis(data);
      setSuggestions(data.suggestions || []);
      setShowSuggestions(true);
      
      // Save the analysis for progress tracking
      await saveAnalysis(data);
      
      if (onAnalysisComplete) {
        onAnalysisComplete(data);
      }
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveAnalysis = async (analysisData) => {
    try {
      await fetch('http://localhost:3000/api/reviews', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          language,
          problemTitle,
          problemDescription,
          analysis: analysisData
        }),
      });
    } catch (error) {
      console.error('Failed to save analysis:', error);
    }
  };

  const applySuggestion = (suggestion) => {
    if (suggestion.replacement) {
      // Replace the entire code with the replacement for structural changes
      setCode(suggestion.replacement);
    }
    setSelectedSuggestion(null);
  };

  const getSuggestionIcon = (type) => {
    switch (type) {
      case 'error': return '🔴';
      case 'warning': return '🟡';
      case 'suggestion': return '💡';
      case 'style': return '🎨';
      default: return '💡';
    }
  };

  const getQualityColor = (score) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const tabs = [
    { id: 'editor', label: 'Code Editor', icon: '💻' },
    { id: 'progress', label: 'Progress', icon: '📊' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">
                ✨ StudentCode
              </h1>
              <span className="text-sm text-gray-500">Grammarly for Code</span>
            </div>
            
            {/* Tab Navigation */}
            <div className="flex space-x-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {activeTab === 'editor' ? (
          <>
            {/* Configuration */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Programming Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {languages.map(lang => (
                      <option key={lang.value} value={lang.value}>
                        {lang.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skill Level
                  </label>
                  <select
                    value={skillLevel}
                    onChange={(e) => setSkillLevel(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {skillLevels.map(level => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Problem Title
                  </label>
                  <input
                    type="text"
                    value={problemTitle}
                    onChange={(e) => setProblemTitle(e.target.value)}
                    placeholder="e.g., Binary Search Implementation"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="flex items-end">
                  <button
                    onClick={analyzeCode}
                    disabled={loading || !code.trim()}
                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Analyzing...' : 'Analyze Code'}
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Code Editor */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="border-b border-gray-200 p-4">
                    <h2 className="text-lg font-semibold text-gray-900">Code Editor</h2>
                    <p className="text-sm text-gray-600">Write your code and get real-time feedback</p>
                  </div>
                  
                  <div className="p-4">
                    <textarea
                      ref={editorRef}
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder={`// Start coding here...
// Example for ${language}:

`}
                      className="w-full h-96 p-4 font-mono text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      spellCheck="false"
                    />
                  </div>
                  
                  {loading && (
                    <div className="border-t border-gray-200 p-4 bg-blue-50">
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        <span className="text-sm text-blue-600">Analyzing your code...</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Analysis Panel */}
              <div className="space-y-6">
                {/* Time and Space Complexity */}
                {analysis && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">⏱️ Time & Space Complexity</h3>
                    <div className="mb-2">
                      <span className="font-medium text-gray-700">Time Complexity:</span>
                      <span className="ml-2 text-blue-700 font-mono">{analysis.time_complexity}</span>
                    </div>
                    {analysis.time_complexity_explanation && (
                      <div className="text-xs text-gray-600 mb-2">{analysis.time_complexity_explanation}</div>
                    )}
                    <div className="mb-2">
                      <span className="font-medium text-gray-700">Space Complexity:</span>
                      <span className="ml-2 text-purple-700 font-mono">{analysis.space_complexity}</span>
                    </div>
                    {analysis.space_complexity_explanation && (
                      <div className="text-xs text-gray-600">{analysis.space_complexity_explanation}</div>
                    )}
                  </div>
                )}

                {/* Quality Score */}
                {analysis && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Code Quality Score</h3>
                    <div className="text-center">
                      <div className={`text-4xl font-bold ${getQualityColor(analysis.quality_score)}`}>
                        {analysis.quality_score}/10
                      </div>
                      <div className="text-sm text-gray-600 mt-2">
                        {analysis.quality_score >= 8 ? 'Excellent!' : 
                         analysis.quality_score >= 6 ? 'Good work!' : 'Needs improvement'}
                      </div>
                    </div>
                  </div>
                )}

                {/* Real-time Suggestions */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      💡 Suggestions ({suggestions.length})
                    </h3>
                    <div className="space-y-3">
                      {suggestions.slice(0, 5).map((suggestion, index) => (
                        <div
                          key={index}
                          className="p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer"
                          onClick={() => setSelectedSuggestion(suggestion)}
                        >
                          <div className="flex items-start space-x-2">
                            <span className="text-lg">{getSuggestionIcon(suggestion.type)}</span>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {suggestion.title}
                              </p>
                              <p className="text-xs text-gray-600 mt-1">
                                {suggestion.description}
                              </p>
                              {suggestion.line && (
                                <p className="text-xs text-blue-600 mt-1">
                                  Line {suggestion.line}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Learning Insights */}
                {analysis && analysis.learning_tips && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">🎓 Learning Insights</h3>
                    <div className="space-y-2">
                      {analysis.learning_tips.map((tip, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <span className="text-blue-500 mt-1">•</span>
                          <p className="text-sm text-gray-700">{tip}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setCode('')}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                      🗑️ Clear Code
                    </button>
                    <button
                      onClick={() => {
                        const sampleCode = language === 'javascript' ? 
                          `function example() {
    // Your code here
    console.log("Hello, World!");
}` :
                        language === 'python' ?
                        `def example():
    # Your code here
    print("Hello, World!")` :
                        `// Your code here
console.log("Hello, World!");`;
                        setCode(sampleCode);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                      📝 Load Template
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <ProgressTracker />
        )}

        {/* Suggestion Modal */}
        {selectedSuggestion && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {getSuggestionIcon(selectedSuggestion.type)} {selectedSuggestion.title}
              </h3>
              <p className="text-gray-700 mb-4">{selectedSuggestion.description}</p>
              
              {selectedSuggestion.replacement && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Suggested Fix:</p>
                  <div className="bg-gray-100 p-3 rounded-md font-mono text-sm">
                    {selectedSuggestion.replacement}
                  </div>
                </div>
              )}
              
              <div className="flex space-x-3">
                {selectedSuggestion.replacement && (
                  <button
                    onClick={() => applySuggestion(selectedSuggestion)}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Apply Fix
                  </button>
                )}
                <button
                  onClick={() => setSelectedSuggestion(null)}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeEditor; 