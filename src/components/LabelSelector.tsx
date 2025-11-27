import React, { useState } from 'react';
import { ChevronDown, Plus } from 'lucide-react';

export interface Label {
  id: string;
  name: string;
  color: string;
}

interface LabelSelectorProps {
  activeLabel: Label;
  allLabels: Label[];
  onSelect: (id: string) => void;
  onCreate: (name: string) => void;
}

export const LabelSelector: React.FC<LabelSelectorProps> = ({ 
  activeLabel, 
  allLabels, 
  onSelect, 
  onCreate 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCreate = () => {
    const name = prompt("Nome nuova etichetta:");
    if (name) {
      onCreate(name);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative z-50"> 
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-white/5 hover:bg-white/10 px-2 py-1.5 rounded text-white text-xs font-medium transition-colors border border-white/5"
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full shadow-sm" style={{ backgroundColor: activeLabel.color }} />
          <span className="truncate max-w-[120px]">{activeLabel.name}</span>
        </div>
        <ChevronDown className="w-3 h-3 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-1 bg-gray-800 rounded-lg shadow-xl border border-gray-700 max-h-32 overflow-y-auto">
          {allLabels.map(label => (
            <div 
              key={label.id}
              onClick={() => { onSelect(label.id); setIsOpen(false); }}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-700 cursor-pointer text-gray-200 text-xs"
            >
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: label.color }} />
              {label.name}
            </div>
          ))}
          <div 
            onClick={handleCreate}
            className="flex items-center gap-2 px-3 py-2 bg-gray-900/50 hover:bg-blue-600/20 cursor-pointer text-blue-400 text-xs border-t border-gray-700 sticky bottom-0 backdrop-blur-sm"
          >
            <Plus className="w-3 h-3" /> Nuova
          </div>
        </div>
      )}
    </div>
  );
};