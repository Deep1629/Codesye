import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const ProgressTracker = () => {
  const { user, token } = useContext(AuthContext);
  const [progress, setProgress] = useState({
    totalAnalyses: 0,
    averageScore: 0,
    improvementTrend: 0,
    languages: {},
    achievements: [],
    weeklyProgress: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchProgress();
    }
  }, [token]);

  const fetchProgress = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/progress', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProgress(data);
      }
    } catch (error) {
      console.error('Failed to fetch progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const achievements = [
    {
      id: 'first_analysis',
      title: 'First Analysis',
      description: 'Completed your first code analysis',
      icon: '🎯',
      unlocked: progress.totalAnalyses > 0
    },
    {
      id: 'quality_improver',
      title: 'Quality Improver',
      description: 'Improved code quality score by 2+ points',
      icon: '📈',
      unlocked: progress.improvementTrend >= 2
    },
    {
      id: 'polyglot',
      title: 'Polyglot',
      description: 'Analyzed code in 3+ languages',
      icon: '🌍',
      unlocked: Object.keys(progress.languages).length >= 3
    },
    {
      id: 'consistency',
      title: 'Consistency',
      description: 'Analyzed code for 7 consecutive days',
      icon: '🔥',
      unlocked: progress.weeklyProgress.length >= 7
    }
  ];

  const getTrendIcon = (trend) => {
    if (trend > 0) return '📈';
    if (trend < 0) return '📉';
    return '➡️';
  };

  const getTrendColor = (trend) => {
    if (trend > 0) return 'text-green-600';
    if (trend < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            <div className="h-3 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Your Progress</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{progress.totalAnalyses}</div>
            <div className="text-sm text-gray-600">Analyses</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{progress.averageScore.toFixed(1)}</div>
            <div className="text-sm text-gray-600">Avg Score</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${getTrendColor(progress.improvementTrend)}`}>
              {getTrendIcon(progress.improvementTrend)} {Math.abs(progress.improvementTrend).toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">Trend</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{Object.keys(progress.languages).length}</div>
            <div className="text-sm text-gray-600">Languages</div>
          </div>
        </div>
      </div>

      {/* Language Breakdown */}
      {Object.keys(progress.languages).length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🌍 Languages Used</h3>
          <div className="space-y-3">
            {Object.entries(progress.languages).map(([lang, stats]) => (
              <div key={lang} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">{lang.toUpperCase().slice(0, 2)}</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{lang}</div>
                    <div className="text-sm text-gray-600">{stats.count} analyses</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium text-gray-900">{stats.averageScore.toFixed(1)}/10</div>
                  <div className="text-sm text-gray-600">avg score</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weekly Progress */}
      {progress.weeklyProgress.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">📅 Weekly Activity</h3>
          <div className="flex space-x-2">
            {progress.weeklyProgress.slice(-7).map((day, index) => (
              <div key={index} className="flex-1 text-center">
                <div className={`h-8 rounded ${day.count > 0 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
                <div className="text-xs text-gray-600 mt-1">{day.count}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievements */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🏆 Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`p-4 rounded-lg border-2 ${
                achievement.unlocked
                  ? 'border-green-200 bg-green-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`text-2xl ${achievement.unlocked ? '' : 'grayscale opacity-50'}`}>
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <div className={`font-medium ${
                    achievement.unlocked ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {achievement.title}
                  </div>
                  <div className={`text-sm ${
                    achievement.unlocked ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    {achievement.description}
                  </div>
                </div>
                {achievement.unlocked && (
                  <div className="text-green-500">✓</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Learning Tips */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Learning Tips</h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
            <p className="text-sm text-gray-700">
              Try analyzing code in different languages to broaden your skills
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            <p className="text-sm text-gray-700">
              Focus on one suggestion at a time to improve gradually
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
            <p className="text-sm text-gray-700">
              Review your previous analyses to track your improvement
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker; 