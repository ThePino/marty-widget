import React, { useState } from 'react';
import { Play, Pause, Monitor } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { useTimer } from './hooks/useTimer';
import { LabelSelector, Label } from './components/LabelSelector';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

const App: React.FC = () => {
  // 1. Usiamo il nostro Custom Hook
  const { isRunning, toggleTimer, formatTime } = useTimer();
  
  // 2. Stato UI locale
  const [opacity, setOpacity] = useState(0.9);
  
  // 3. Gestione Etichette (Stato elevato qui perché serve sia al selettore che, in futuro, al salvataggio)
  const [activeLabelId, setActiveLabelId] = useState<string>('1');
  const [labels, setLabels] = useState<Label[]>([
    { id: '1', name: 'Sviluppo', color: '#3B82F6' },
    { id: '2', name: 'Meeting', color: '#F59E0B' },
    { id: '3', name: 'Ricerca', color: '#10B981' },
  ]);

  const activeLabel = labels.find(l => l.id === activeLabelId) || labels[0];

  const handleCreateLabel = (name: string) => {
    const newLabel = { 
      id: Date.now().toString(), 
      name, 
      color: `#${Math.floor(Math.random()*16777215).toString(16)}` 
    };
    setLabels([...labels, newLabel]);
    setActiveLabelId(newLabel.id);
  };

  return (
    <div className="flex items-center justify-center w-full h-full overflow-hidden p-2">
      <div 
        className={cn(
          "relative w-full max-w-[320px] flex flex-col",
          "border border-white/10 transition-all duration-300",
          "rounded-xl overflow-hidden shadow-2xl"
        )}
        style={{ 
          backgroundColor: `rgba(17, 24, 39, ${opacity})`,
          backdropFilter: 'blur(8px)',
        }}
      >
        <div className="flex-1 px-4 py-3 flex flex-col gap-3">
          
          <LabelSelector 
            activeLabel={activeLabel} 
            allLabels={labels} 
            onSelect={setActiveLabelId}
            onCreate={handleCreateLabel}
          />

          {/* Sezione Timer (Così semplice che possiamo lasciarla qui o estrarla in futuro) */}
          <div className="flex items-end justify-between">
            <div className="font-mono text-3xl text-white font-light tracking-wide select-none">
              {formatTime()}
            </div>
            
            <button 
              onClick={toggleTimer}
              className={cn(
                "p-2 rounded-full shadow-lg transition-all transform active:scale-95 flex items-center justify-center",
                isRunning 
                  ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/20' 
                  : 'bg-green-500 hover:bg-green-600 text-white shadow-green-500/20'
              )}
            >
              {isRunning ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            </button>
          </div>

          {/* Opacity Control */}
          <div className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity duration-200">
            <Monitor className="w-3 h-3 text-gray-400" />
            <input 
              type="range" 
              min="0.2" 
              max="1" 
              step="0.05" 
              value={opacity} 
              onChange={(e) => setOpacity(parseFloat(e.target.value))}
              className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default App;