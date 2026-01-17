import { supabase } from "./supabase";

import React, { useState, useEffect } from 'react';
import { Dumbbell, Plus, Calendar, TrendingUp, User, Settings, LogOut, Edit3, Trash2 } from 'lucide-react';

function App() {
  
  const [workouts, setWorkouts] = useState([]);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('workouts');

  // Modal/form state
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formTitle, setFormTitle] = useState('');
  const [formDate, setFormDate] = useState(() => new Date().toISOString().slice(0,10));
  const [formExercises, setFormExercises] = useState([{ name: '', sets: 3, reps: 8, weight: '', unit: 'kg' }]);





  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("table1")
        .select("*")
        .order("date", { ascending: false });
  
      // group rows → workouts
      const grouped = Object.values(
        data.reduce((acc, row) => {
          const key = `${row.date}-${row.device_id || "default"}`;
          if (!acc[key]) {
            acc[key] = {
              id: key,
              date: row.date,
              type: "Workout",
              exercises: []
            };
          }
          acc[key].exercises.push({
            name: row.exercise,
            sets: row.sets,
            reps: row.reps,
            weight: row.weight,
            unit: "kg"
          });
          return acc;
        }, {})
      );
  
      setWorkouts(grouped);
    };
  
    load();
  }, []);

  
  useEffect(() => {
    // basic stats calculation
    const total = workouts.length;
    const thisWeek = workouts.filter(w => {
      const wDate = new Date(w.date);
      const now = new Date();
      const weekAgo = new Date();
      weekAgo.setDate(now.getDate() - 7);
      return wDate >= weekAgo && wDate <= now;
    }).length;
    const totalVolume = workouts.reduce((sum, w) => {
      return sum + (w.exercises || []).reduce((s, e) => s + ((e.weight||0) * (e.sets||0) * (e.reps||0)), 0);
    }, 0);
    setStats({ totalWorkouts: total, thisWeek, totalVolume, streak: 5 });
  }, [workouts]);

  const openAddModal = () => {
    setEditingId(null);
    setFormTitle('');
    setFormDate(new Date().toISOString().slice(0,10));
    setFormExercises([{ name: '', sets: 3, reps: 8, weight: '', unit: 'kg' }]);
    setShowModal(true);
  };

  const openEditModal = (workout) => {
    setEditingId(workout.id);
    setFormTitle(workout.type || '');
    setFormDate(workout.date ? workout.date.slice(0,10) : new Date().toISOString().slice(0,10));
    setFormExercises((workout.exercises || []).map(e => ({ ...e })));
    if ((workout.exercises || []).length === 0) setFormExercises([{ name: '', sets: 3, reps: 8, weight: '', unit: 'kg' }]);
    setShowModal(true);
  };

  const handleAddExercise = () => {
    setFormExercises(prev => ([...prev, { name: '', sets: 3, reps: 8, weight: '', unit: 'kg' }]));
  };

  const handleRemoveExercise = (idx) => {
    setFormExercises(prev => prev.filter((_, i) => i !== idx));
  };

  const handleExerciseChange = (idx, field, value) => {
    setFormExercises(prev => prev.map((ex, i) => i === idx ? { ...ex, [field]: value } : ex));
  };

  const handleSave = async (e) => {
    e.preventDefault();
  
    const rows = formExercises
      .filter(e => e.name)
      .map(e => ({
        date: formDate,
        exercise: e.name,
        sets: Number(e.sets),
        reps: Number(e.reps),
        weight: e.weight ? Number(e.weight) : null,
        raw_text: JSON.stringify(e)
      }));
  
    if (rows.length === 0) return alert("Add at least one exercise");
  
    await supabase.from("table1").insert(rows);
  
    setShowModal(false);
    window.location.reload(); // MVP-safe refresh
  };


  const handleDelete = (id) => {
    if (!confirm('Delete this workout?')) return;
    setWorkouts(prev => prev.filter(w => w.id !== id));
  };

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
            <button onClick={openAddModal} className="inline-flex items-center gap-2 bg-indigo-600 text-white px-3 py-2 rounded hover:bg-indigo-700">
              <Plus className="w-4 h-4" /> Add Workout
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
                      <h3 className="font-semibold text-gray-800">{workout.type}</h3>
                      <p className="text-sm text-gray-500">{workout.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => alert("Edit coming soon")} className="text-gray-500 hover:text-gray-800">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => alert("Delete coming soon")} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </button>
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
                          {exercise.weight !== null && exercise.weight !== undefined ? `${exercise.weight} ${exercise.unit || ''}` : ''}
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
                <p>No workouts yet. Click "Add Workout" to create one.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Settings</h2>
            <p className="text-gray-600">Local-only MVP: workouts are stored in your browser's localStorage.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{editingId ? 'Edit Workout' : 'Add Workout'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500">Close</button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input value={formTitle} onChange={(e) => setFormTitle(e.target.value)} className="w-full px-4 py-2 border rounded" placeholder="Chest Day, Leg Day, etc." />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)} className="px-3 py-2 border rounded" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Exercises</label>
                <div className="space-y-2">
                  {formExercises.map((ex, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                      <input value={ex.name} onChange={(e) => handleExerciseChange(idx, 'name', e.target.value)} placeholder="Exercise name" className="col-span-5 px-3 py-2 border rounded" />
                      <input value={ex.sets} onChange={(e) => handleExerciseChange(idx, 'sets', e.target.value)} type="number" min="0" className="col-span-2 px-3 py-2 border rounded" />
                      <input value={ex.reps} onChange={(e) => handleExerciseChange(idx, 'reps', e.target.value)} type="number" min="0" className="col-span-2 px-3 py-2 border rounded" />
                      <input value={ex.weight || ''} onChange={(e) => handleExerciseChange(idx, 'weight', e.target.value)} type="number" step="0.1" className="col-span-2 px-3 py-2 border rounded" placeholder="weight" />
                      <select value={ex.unit || 'kg'} onChange={(e) => handleExerciseChange(idx, 'unit', e.target.value)} className="col-span-1 px-2 py-2 border rounded">
                        <option>kg</option>
                        <option>lbs</option>
                        <option></option>
                      </select>
                      <div className="col-span-12 flex justify-end">
                        <button type="button" onClick={() => handleRemoveExercise(idx)} className="text-red-500">Remove</button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-3">
                  <button type="button" onClick={handleAddExercise} className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 rounded">
                    <Plus className="w-4 h-4" /> Add Exercise
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded border">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded bg-indigo-600 text-white">Save Workout</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
