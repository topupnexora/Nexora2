import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, ChevronRight, ShieldCheck, Flame } from 'lucide-react';
import { Game } from '../types';
import { formatPrice } from '../utils/format';
import { HighlightTopUp } from './HighlightTopUp';

interface GameCardProps {
  game: Game;
}

export const GameCard: React.FC<GameCardProps> = ({ game }) => {
  const lowestPrice = Math.min(...game.packages.map((p) => p.price));

  return (
    <Link 
      to={`/game/${game.id}`}
      id={`game-card-${game.id}`}
      className="group relative bg-[#0d0d0f] hover:bg-[#121216] border border-white/5 hover:border-cyan-500/40 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-400"
    >
      {/* Top badges */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-gray-300 border border-white/10 shadow-sm">
          {game.category}
        </span>
        {game.popular && (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-orange-500 to-amber-500 text-white flex items-center gap-1 shadow-md shadow-orange-500/20">
            <Flame className="w-3 h-3 fill-white" />
            Popular
          </span>
        )}
      </div>

      <div className="absolute top-3 right-3 z-10">
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-cyan-400 border border-cyan-500/30 flex items-center gap-1">
          <Zap className="w-3 h-3 text-cyan-400 fill-cyan-400" />
          {game.deliveryTime}
        </span>
      </div>

      {/* Game Image Header */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[#050505]">
        <img
          src={game.image}
          alt={game.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0f] via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[10px] text-gray-500 uppercase tracking-wider mb-1.5">
            <span>{game.publisher}</span>
            <span>{game.packages.length} Packages</span>
          </div>

          <h3 className="text-base font-bold text-gray-100 group-hover:text-cyan-400 uppercase tracking-tight transition-colors line-clamp-1 font-display">
            {game.name}
          </h3>

          <p className="mt-1.5 text-xs text-gray-400 line-clamp-2 leading-relaxed">
            <HighlightTopUp text={game.description} redClassName="text-red-500 font-semibold" />
          </p>
        </div>

        {/* Pricing and Action */}
        <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider block">
              Starts From
            </span>
            <span className="text-base font-extrabold text-white">
              {formatPrice(lowestPrice)}
            </span>
          </div>

          <div
            id={`btn-topup-${game.id}`}
            className="inline-flex items-center gap-1 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-tight text-black bg-white group-hover:bg-cyan-400 transition-colors shadow-sm"
          >
            <span><span className="text-red-600 font-extrabold">Top Up</span></span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
};
