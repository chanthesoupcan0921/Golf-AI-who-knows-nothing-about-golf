import React, { useState } from 'react';
import { ClipboardList, Plus, Minus, Activity } from 'lucide-react';
import { ScorecardEntry } from '../types';
import { generateScorecardSummary } from '../services/geminiService';

const ABSURD_METRICS = [
  "Geese/Birds Struck",
  "Style Points",
  "Grass Blades Disturbed",
  "Squirrels Confused",
  "Clubs Dropped",
  "Existential Crises",
  "Wind Speed Miscalculations",
  "Sand Castles Built",
  "Water Hazards Befriended"
];

const Scorecard: React.FC = () => {
  const [metrics, setMetrics] = useState<ScorecardEntry[]>(
    ABSURD_METRICS.slice(0, 5).map((m, i) => ({
      id: i.toString(),
      hole: 1,
      metric: m,
      score: 0
    }))
  );
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const updateScore = (id: string, delta: number) => {
    setMetrics(prev => prev.map(m => 
      m.id === id ? { ...m, score: Math.max(0, m.score + delta) } : m
    ));
  };

  const generateSummary = async () => {
    setLoading(true);
    const result = await generateScorecardSummary(metrics);
    setSummary(result);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 rounded-lg shadow-2xl overflow-hidden border border-gray-700">
      <div className="bg-gray-800 p-4 text-white flex items-center justify-between border-b border-gray-700">
        <div className="flex items-center gap-2">
          <ClipboardList className="w-6 h-6 text-club-gold" />
          <h2 className="font-serif text-xl font-bold text-gray-100">The Real Scorecard</h2>
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto bg-gray-800/50">
        <div className="mb-6 p-4 bg-yellow-900/20 border border-yellow-700/50 rounded-lg">
          <p className="text-sm text-yellow-200 italic text-center">
            "Strokes" are a primitive metric. We measure what truly matters for the modern gentleman or gentlewoman.
          </p>
        </div>

        <div className="grid gap-4 mb-8">
          {metrics.map((metric) => (
            <div key={metric.id} className="bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-700 flex items-center justify-between">
              <span className="font-medium text-gray-200">{metric.metric}</span>
              <div className="flex items-center gap-4 bg-gray-900 rounded-lg p-1 border border-gray-700">
                <button 
                  onClick={() => updateScore(metric.id, -1)}
                  className="p-2 hover:bg-gray-800 rounded-md text-gray-400 hover:text-white transition-all"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-bold text-xl text-emerald-400">{metric.score}</span>
                <button 
                  onClick={() => updateScore(metric.id, 1)}
                  className="p-2 hover:bg-gray-800 rounded-md text-gray-400 hover:text-white transition-all"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={generateSummary}
          disabled={loading}
          className="w-full bg-emerald-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 mb-6 disabled:opacity-50"
        >
          {loading ? (
            <Activity className="w-5 h-5 animate-spin" />
          ) : (
            <Activity className="w-5 h-5" />
          )}
          Analyze Performance
        </button>

        {summary && (
          <div className="bg-gray-800 p-6 rounded-xl border border-club-gold/30 shadow-inner animate-fade-in">
            <h3 className="text-center font-serif text-xl text-club-gold font-bold mb-4 border-b border-gray-700 pb-2">
              Official Club Decree
            </h3>
            <p className="font-serif text-gray-300 leading-loose italic text-justify">
              {summary}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Scorecard;