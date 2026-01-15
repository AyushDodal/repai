import React, { useState, useEffect } from 'react';
import { Dumbbell, Plus, Calendar, TrendingUp, User, Settings, LogOut } from 'lucide-react';

// Simulated API (replace with real backend)
const API = {
  async login(email, password) {
    // Simulate API call
    return { user: { id: 1, email, name: 'John Doe' }, apiKey: 'sk_test_' + Math.random().toString(36).substr(2, 9) };
  },
  async getWorkouts(apiKey) {
    // Simulate fetching workouts
    return [
      { id: 1, date: '2026-01-15', type: 'Chest', exercises: [
        { name: 'Bench Press', sets: 3, reps: 10, weight: 20, unit: 'kg' },
        { name: 'Cable Flys', sets: 3, reps: 12, weight: 100, unit: 'lbs' }
      ]},
      { id: 2, date: '2026-01-13', type: 'Legs', exercises: [
        { name: 'Squats', sets: 4, reps: 8, weight: 30, unit: 'kg' }
      ]}
    ];
  },
  async addWorkout(apiKey, workout) {
    // Simulate adding workout
    return { id: Date.now(), ...workout };
  },
  async getStats(apiKey) {
    return {
      totalWorkouts: 15,
      thisWeek: 3,
      totalVolume: 12500,
      streak: 5
    };
  }
};

function FitnessApp() {
  const [user, setUser] = useState(null);
  const [apiKey, setApiKey] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [stats, setStats] = useState(null);
  const [showApiKey, setShowApiKey] = useState(false);
  const [activeTab, setActiveTab] = useState('workouts');

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (apiKey) {
      loadData();
    }
  }, [apiKey]);

  const loadData = async () => {
    const [workoutsData, statsData] = await Promise.all([
      API.getWorkouts(apiKey),
      API.getStats(apiKey)
    ]);
    setWorkouts(workoutsData);
    setStats(statsData);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await API.login(email, password);
    setUser(result.user);
    setApiKey(result.apiKey);
  };

  const handleLogout = () => {
    setUser(null);
    setApiKey(null);
    setWorkouts([]);
    setStats(null);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="flex items-center justify-center mb-6">
            <Dumbbell className="w-12 h-12 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">FitTrack</h1>
          <p className="text-center text-gray-600 mb-8">Track your fitness journey with AI</p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>
            <button
              onClick={handleLogin}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              Sign In
            </button>
          </div>
          
          <p className="text-center text-sm text-gray-500 mt-4">
            Demo: Use any email/password
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Dumbbell className="w-8 h-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-800">FitTrack</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="w-4 h-4" />
              <span>{user.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Stats Dashboard */}
      {stats && (
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-sm text-gray-600 mb-1">Total Workouts</div>
              <div className="text-2xl font-bold text-gray-800">{stats.totalWorkouts}</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-sm text-gray-600 mb-1">This Week</div>
              <div className="text-2xl font-bold text-indigo-600">{stats.thisWeek}</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-sm text-gray-600 mb-1">Total Volume (lbs)</div>
              <div className="text-2xl font-bold text-gray-800">{stats.totalVolume.toLocaleString()}</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-sm text-gray-600 mb-1">Streak (days)</div>
              <div className="text-2xl font-bold text-green-600">{stats.streak}</div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('workouts')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'workouts'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Workouts
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'settings'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Settings
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {activeTab === 'workouts' && (
          <div className="space-y-4">
            {workouts.map((workout) => (
              <div key={workout.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <h3 className="font-semibold text-gray-800">{workout.type} Day</h3>
                      <p className="text-sm text-gray-500">{workout.date}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {workout.exercises.map((exercise, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2 border-t border-gray-100">
                      <div>
                        <div className="font-medium text-gray-700">{exercise.name}</div>
                        <div className="text-sm text-gray-500">
                          {exercise.sets} sets × {exercise.reps} reps
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-800">
                          {exercise.weight} {exercise.unit}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            {workouts.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Dumbbell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No workouts yet. Connect Claude Desktop to start logging!</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">API Configuration</h2>
            <p className="text-gray-600 mb-4">
              Use this API key to connect Claude Desktop to your FitTrack account.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your API Key
              </label>
              <div className="flex gap-2">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={apiKey}
                  readOnly
                  className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded font-mono text-sm"
                />
                <button
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  {showApiKey ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">Setup Instructions</h3>
              <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
                <li>Install the FitTrack MCP server (see documentation below)</li>
                <li>Add your API key to the MCP server configuration</li>
                <li>Restart Claude Desktop</li>
                <li>Start logging workouts with natural language!</li>
              </ol>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Example Usage</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p className="italic">"Hey Claude! Just finished a chest day. Did 2 sets of bench press with 20 kgs, 2 × cable flys machine @ 100lbs"</p>
                <p className="text-gray-500 mt-2">Claude will automatically log this workout to your FitTrack account.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FitnessApp;
