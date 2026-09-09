import React from 'react';
import { Sparkles, Gamepad2 } from 'lucide-react';

interface MagicLoaderProps {
  onFinish?: () => void;
}

export const MagicLoader: React.FC<MagicLoaderProps> = ({ onFinish }) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#090614] flex flex-col items-center justify-center p-6 select-none">
      
      {/* Background Magic Vapor & Rings */}
      <div className="relative flex items-center justify-center">
        
        {/* Pulsing purple mist aura */}
        <div className="absolute w-64 h-64 bg-purple-600/25 rounded-full blur-3xl animate-pulse" />
        <div className="absolute w-44 h-44 bg-cyan-500/20 rounded-full blur-2xl animate-ping" style={{ animationDuration: '3s' }} />

        {/* Rotating Energy Rings */}
        <div className="w-32 h-32 rounded-full border-2 border-dashed border-purple-500/40 animate-spin" style={{ animationDuration: '8s' }} />
        <div className="absolute w-24 h-24 rounded-full border border-cyan-400/50 animate-spin" style={{ animationDuration: '5s', animationDirection: 'reverse' }} />

        {/* Central Pulsing Magical Crystal / Gamepad */}
        <div className="absolute w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 via-indigo-600 to-cyan-400 p-[2px] shadow-[0_0_35px_rgba(168,85,247,0.7)] animate-bounce" style={{ animationDuration: '2.2s' }}>
          <div className="w-full h-full bg-[#0d091e] rounded-[14px] flex items-center justify-center">
            <Gamepad2 className="w-8 h-8 text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
          </div>
        </div>

      </div>

      {/* Brand Title */}
      <div className="mt-8 text-center space-y-1.5">
        <h2 className="text-2xl font-black tracking-wider bg-gradient-to-r from-purple-300 via-cyan-200 to-white bg-clip-text text-transparent">
          Magic<span className="text-cyan-400">Play</span>
        </h2>
        <p className="text-xs text-purple-300/80 font-medium tracking-wide">
          Загрузка магического игрового пространства...
        </p>
      </div>

    </div>
  );
};
