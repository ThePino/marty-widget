import React, { useState, useEffect } from 'react';
import { Play, Pause, GripHorizontal, Plus, ChevronDown, Monitor } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { IElectronAPI } from '@my-electron/ipc-interface';

// Funzione helper per unire le classi Tailwind
function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

interface Label {
  id: string;
  name: string;
  color: string;
}

// Mock per l'ambiente di browser (quando non gira in Electron)
const mockElectron: IElectronAPI = {
  setIgnoreMouse: (ignore: boolean) => console.log(`[Electron] Ignore mouse: ${ignore}`),
  saveTimeLog: async (data: any) => console.log(`[Electron] Saving log`, data)
};

const getElectron = () => {
  // @ts-ignore - window.electronAPI è definito in preload.ts
  return window.electronAPI || mockElectron;
};

const App: React.FC = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [opacity, setOpacity] = useState(0.9);
  const [activeLabelId, setActiveLabelId] = useState<string>('1');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Etichette di default
  const [labels, setLabels] = useState<Label[]>([
    { id: '1', name: 'Sviluppo', color: '#3B82F6' },
    { id: '2', name: 'Meeting', color: '#F59E0B' },
    { id: '3', name: 'Ricerca', color: '#10B981' },
  ]);

  // Logica del Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const activeLabel = labels.find(l => l.id === activeLabelId) || labels[0];

  const handleCreateLabel = () => {
    const name = prompt("Nome nuova etichetta:");
    if (name) {
      const newLabel = { 
        id: Date.now().toString(), 
        name, 
        color: `#${Math.floor(Math.random()*16777215).toString(16)}` 
      };
      setLabels([...labels, newLabel]);
      setActiveLabelId(newLabel.id);
      setIsDropdownOpen(false);
    }
  };

  return (
    // Container principale che riempie la finestra trasparente
    <div className="flex items-center justify-center w-full h-full overflow-hidden p-2">
      
      <div 
        className={cn(
          "relative w-full max-w-[320px] flex flex-col",
          "border border-white/10 transition-all duration-300",
          "rounded-xl overflow-hidden shadow-2xl"
        )}
        style={{ 
          backgroundColor: `rgba(17, 24, 39, ${opacity})`,
          backdropFilter: 'blur(8px)', // Effetto vetro
        }}
      >
        {/* --- HEADER (Drag Area) --- */}
        <div className="flex items-center justify-between px-3 py-2 bg-white/5 cursor-move select-none" style={{ WebkitAppRegion: 'drag' } as any}>
          <GripHorizontal className="text-gray-400 w-4 h-4" />
          
        </div>

        {/* --- CONTENUTO --- */}
        <div className="flex-1 px-4 py-3 flex flex-col gap-3">
          
          {/* Label Selector */}
          <div className="relative z-50"> 
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between bg-white/5 hover:bg-white/10 px-2 py-1.5 rounded text-white text-xs font-medium transition-colors border border-white/5"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full shadow-sm" style={{ backgroundColor: activeLabel.color }} />
                <span className="truncate max-w-[120px]">{activeLabel.name}</span>
              </div>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 w-full mt-1 bg-gray-800 rounded-lg shadow-xl border border-gray-700 max-h-32 overflow-y-auto">
                {labels.map(label => (
                  <div 
                    key={label.id}
                    onClick={() => { setActiveLabelId(label.id); setIsDropdownOpen(false); }}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-700 cursor-pointer text-gray-200 text-xs"
                  >
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: label.color }} />
                    {label.name}
                  </div>
                ))}
                <div 
                  onClick={handleCreateLabel}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-900/50 hover:bg-blue-600/20 cursor-pointer text-blue-400 text-xs border-t border-gray-700 sticky bottom-0 backdrop-blur-sm"
                >
                  <Plus className="w-3 h-3" /> Nuova
                </div>
              </div>
            )}
          </div>

          {/* Timer & Play Button */}
          <div className="flex items-end justify-between">
            <div className="font-mono text-3xl text-white font-light tracking-wide select-none">
              {formatTime(time)}
            </div>
            
            <button 
              onClick={() => setIsRunning(!isRunning)}
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

          {/* Footer Opacity Slider */}
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