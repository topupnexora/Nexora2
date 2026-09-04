import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, ArrowUpDown, Gamepad2, Sparkles, X } from 'lucide-react';
import { GAMES_DATA, CATEGORIES } from '../data/games';
import { GameCard } from '../components/GameCard';

export const GamesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'popular' | 'price-low' | 'price-high' | 'name'>('popular');

  const filteredGames = useMemo(() => {
    return GAMES_DATA.filter((game) => {
      const matchesSearch =
        game.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All' || game.category === selectedCategory;

      return matchesSearch && matchesCategory;
    }).sort((a, b) => {
      if (sortBy === 'popular') {
        return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
      }
      if (sortBy === 'price-low') {
        const minA = Math.min(...a.packages.map((p) => p.price));
        const minB = Math.min(...b.packages.map((p) => p.price));
        return minA - minB;
      }
      if (sortBy === 'price-high') {
        const maxA = Math.max(...a.packages.map((p) => p.price));
        const maxB = Math.max(...b.packages.map((p) => p.price));
        return maxB - maxA;
      }
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
  }, [searchQuery, selectedCategory, sortBy]);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    if (val.trim()) {
      setSearchParams({ search: val.trim() });
    } else {
      setSearchParams({});
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSortBy('popular');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      {/* Header */}
      <div className="text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400 mb-3">
          <Gamepad2 className="w-3.5 h-3.5" />
          <span>Gaming <span className="text-red-500 font-extrabold">Top-Up</span> Catalog</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white font-display uppercase tracking-tight">
          Games Catalog
        </h1>
        <p className="text-sm text-gray-400 mt-2 max-w-xl">
          Select your game to view available diamond, UC, and credit bundles. 100% instant UID delivery.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0d0d0f] border border-white/5 rounded-2xl p-4 sm:p-5 space-y-4 backdrop-blur-md">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <input
              type="text"
              id="games-search-input"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search games by title (e.g. Free Fire, PUBG, Robux)..."
              className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 pl-11 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-4 top-3.5" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => handleSearchChange('')}
                className="absolute right-3.5 top-3 text-gray-400 hover:text-white p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
            <div className="flex items-center gap-2 bg-[#050505] border border-white/10 rounded-xl px-3 py-2.5 w-full md:w-auto">
              <ArrowUpDown className="w-4 h-4 text-gray-400 shrink-0" />
              <select
                id="games-sort-select"
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-transparent text-sm text-gray-200 focus:outline-none cursor-pointer w-full"
              >
                <option value="popular" className="bg-[#0d0d0f] text-gray-100">Sort by: Most Popular</option>
                <option value="price-low" className="bg-[#0d0d0f] text-gray-100">Price: Low to High</option>
                <option value="price-high" className="bg-[#0d0d0f] text-gray-100">Price: High to Low</option>
                <option value="name" className="bg-[#0d0d0f] text-gray-100">Title: A to Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1 shrink-0 mr-1">
            <Filter className="w-3.5 h-3.5 text-gray-500" />
            Category:
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              id={`cat-filter-${cat.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-white text-black shadow-md'
                  : 'bg-[#050505] text-gray-400 hover:text-white border border-white/10 hover:border-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count & Clear */}
      <div className="flex items-center justify-between text-xs text-gray-400 px-1">
        <span>
          Showing <strong className="text-white">{filteredGames.length}</strong> available game titles
          {searchQuery && <span> for "<strong className="text-cyan-400">{searchQuery}</strong>"</span>}
        </span>
        {(searchQuery || selectedCategory !== 'All' || sortBy !== 'popular') && (
          <button
            type="button"
            onClick={handleClearFilters}
            className="text-cyan-400 hover:text-cyan-300 font-bold uppercase tracking-wider underline underline-offset-4"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Games Grid or Empty State */}
      {filteredGames.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-[#0d0d0f] border border-white/5 rounded-2xl p-8 max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 mx-auto mb-4">
            <Gamepad2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold uppercase tracking-tight text-white">No games found</h3>
          <p className="text-xs text-gray-400 mt-1.5 max-w-sm mx-auto">
            We couldn't find any games matching "{searchQuery}". Try checking for spelling or reset filters.
          </p>
          <button
            type="button"
            onClick={handleClearFilters}
            className="mt-5 px-5 py-2.5 rounded-lg bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-cyan-400 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};
