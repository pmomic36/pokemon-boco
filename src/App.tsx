/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Info, Home, BookOpen, Github, ExternalLink, Loader2, Zap, Flame, Droplets, Leaf, Ghost, Sparkles } from 'lucide-react';
import { cn } from './lib/utils';

interface Pokemon {
  id: number;
  name: string;
  types: string[];
  image: string;
  height: number;
  weight: number;
  stats: { name: string; value: number }[];
}

const TYPE_COLORS: Record<string, string> = {
  electric: 'bg-yellow-400 text-yellow-950',
  fire: 'bg-orange-500 text-white',
  water: 'bg-blue-500 text-white',
  grass: 'bg-green-500 text-white',
  poison: 'bg-purple-500 text-white',
  flying: 'bg-indigo-300 text-indigo-950',
  bug: 'bg-lime-500 text-white',
  normal: 'bg-slate-400 text-white',
  ground: 'bg-amber-700 text-white',
  fairy: 'bg-pink-300 text-pink-950',
  fighting: 'bg-red-700 text-white',
  psychic: 'bg-pink-500 text-white',
  rock: 'bg-stone-600 text-white',
  steel: 'bg-zinc-400 text-zinc-950',
  ice: 'bg-cyan-300 text-cyan-950',
  ghost: 'bg-violet-800 text-white',
  dragon: 'bg-indigo-700 text-white',
  dark: 'bg-stone-800 text-white',
};

const TYPE_ICONS: Record<string, React.ReactNode> = {
  electric: <Zap className="w-3 h-3" />,
  fire: <Flame className="w-3 h-3" />,
  water: <Droplets className="w-3 h-3" />,
  grass: <Leaf className="w-3 h-3" />,
  ghost: <Ghost className="w-3 h-3" />,
  fairy: <Sparkles className="w-3 h-3" />,
};

export default function App() {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        setLoading(true);
        // Fetch first 151 Pokémon (Gen 1)
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
        const data = await response.json();
        
        const detailedData = await Promise.all(
          data.results.map(async (p: { url: string }) => {
            const res = await fetch(p.url);
            const details = await res.json();
            return {
              id: details.id,
              name: details.name,
              types: details.types.map((t: any) => t.type.name),
              image: details.sprites.other['official-artwork'].front_default || details.sprites.front_default,
              height: details.height / 10, // decimeters to meters
              weight: details.weight / 10, // hectograms to kg
              stats: details.stats.map((s: any) => ({
                name: s.stat.name,
                value: s.base_stat
              }))
            };
          })
        );
        
        setPokemonList(detailedData);
      } catch (error) {
        console.error('Error fetching Pokémon:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, []);

  const filteredPokemon = pokemonList.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.id.toString().includes(searchQuery)
  );

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Header */}
      <header className="bg-pokemon-red text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-full border-4 border-slate-800 flex items-center justify-center shadow-inner relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1/2 bg-red-500 border-b-2 border-slate-800" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-slate-800 rounded-full z-10" />
            </div>
            <h1 className="text-3xl font-display font-bold tracking-tight">Pokémon World</h1>
          </div>
          
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or ID..."
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-full text-white placeholder:text-white/50 focus:outline-none focus:bg-white/20 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-slate-900 text-white/70 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 flex justify-center">
          <button className="px-6 py-3 flex items-center gap-2 hover:text-white hover:bg-white/5 transition-colors border-b-2 border-pokemon-yellow text-white">
            <Home className="w-4 h-4" />
            <span className="text-sm font-medium uppercase tracking-wider">Home</span>
          </button>
          <button className="px-6 py-3 flex items-center gap-2 hover:text-white hover:bg-white/5 transition-colors border-b-2 border-transparent">
            <BookOpen className="w-4 h-4" />
            <span className="text-sm font-medium uppercase tracking-wider">Pokédex</span>
          </button>
          <button className="px-6 py-3 flex items-center gap-2 hover:text-white hover:bg-white/5 transition-colors border-b-2 border-transparent">
            <Info className="w-4 h-4" />
            <span className="text-sm font-medium uppercase tracking-wider">About</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 py-8 w-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-12 h-12 text-pokemon-blue animate-spin" />
            <p className="text-slate-500 font-medium animate-pulse">Loading Pokémon data...</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-display font-bold text-slate-800">
                {searchQuery ? `Search Results (${filteredPokemon.length})` : 'Featured Pokémon'}
              </h2>
              <div className="text-sm text-slate-500 font-medium">
                Showing {filteredPokemon.length} of {pokemonList.length}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredPokemon.map((pokemon, index) => (
                  <motion.div
                    key={pokemon.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.02 }}
                    whileHover={{ y: -5 }}
                    onClick={() => setSelectedPokemon(pokemon)}
                    className="group bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all cursor-pointer border border-slate-100 relative overflow-hidden"
                  >
                    {/* Background Pattern */}
                    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-slate-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500" />
                    
                    <div className="relative aspect-square mb-4 bg-slate-50 rounded-xl p-4 flex items-center justify-center group-hover:bg-pokemon-yellow/10 transition-colors">
                      <img
                        src={pokemon.image}
                        alt={pokemon.name}
                        className="w-full h-full object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute top-2 right-2 text-xs font-mono font-bold text-slate-300">
                        #{pokemon.id.toString().padStart(3, '0')}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold capitalize text-slate-800 mb-2 group-hover:text-pokemon-blue transition-colors">
                      {pokemon.name}
                    </h3>
                    
                    <div className="flex flex-wrap gap-1.5">
                      {pokemon.types.map(type => (
                        <span
                          key={type}
                          className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm",
                            TYPE_COLORS[type] || 'bg-slate-200 text-slate-700'
                          )}
                        >
                          {TYPE_ICONS[type]}
                          {type}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {filteredPokemon.length === 0 && (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-full mb-4">
                  <Search className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">No Pokémon found</h3>
                <p className="text-slate-500">Try searching for a different name or ID.</p>
              </div>
            )}
          </>
        )}
      </main>

      {/* Modal / Detail View */}
      <AnimatePresence>
        {selectedPokemon && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPokemon(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
            >
              <button 
                onClick={() => setSelectedPokemon(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-white/20 hover:bg-white/40 rounded-full text-white md:text-slate-400 md:bg-transparent transition-colors"
              >
                <Info className="w-6 h-6 rotate-180" />
              </button>

              {/* Left Side: Image & Types */}
              <div className={cn(
                "w-full md:w-2/5 p-8 flex flex-col items-center justify-center relative overflow-hidden",
                TYPE_COLORS[selectedPokemon.types[0]].split(' ')[0]
              )}>
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                   <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                      <div className="w-64 h-64 border-[20px] border-white rounded-full opacity-20" />
                   </div>
                </div>
                
                <motion.img
                  layoutId={`image-${selectedPokemon.id}`}
                  src={selectedPokemon.image}
                  alt={selectedPokemon.name}
                  className="w-48 h-48 object-contain drop-shadow-2xl relative z-10"
                  referrerPolicy="no-referrer"
                />
                
                <div className="mt-6 flex gap-2 relative z-10">
                  {selectedPokemon.types.map(type => (
                    <span
                      key={type}
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-white/30 bg-white/20 text-white backdrop-blur-md"
                      )}
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right Side: Stats & Info */}
              <div className="w-full md:w-3/5 p-8 bg-white">
                <div className="mb-6">
                  <span className="text-sm font-mono font-bold text-slate-400">#{selectedPokemon.id.toString().padStart(3, '0')}</span>
                  <h2 className="text-3xl font-display font-bold capitalize text-slate-800">{selectedPokemon.name}</h2>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-slate-50 p-3 rounded-2xl">
                    <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">Height</p>
                    <p className="text-lg font-bold text-slate-700">{selectedPokemon.height}m</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl">
                    <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1">Weight</p>
                    <p className="text-lg font-bold text-slate-700">{selectedPokemon.weight}kg</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs uppercase tracking-widest font-bold text-slate-400">Base Stats</h4>
                  {selectedPokemon.stats.map(stat => (
                    <div key={stat.name} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold capitalize">
                        <span className="text-slate-500">{stat.name.replace('-', ' ')}</span>
                        <span className="text-slate-800">{stat.value}</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(100, (stat.value / 150) * 100)}%` }}
                          className={cn(
                            "h-full rounded-full",
                            stat.value > 100 ? "bg-green-500" : stat.value > 60 ? "bg-pokemon-blue" : "bg-pokemon-red"
                          )}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <button className="w-full mt-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  View More Details
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-pokemon-red rounded-full border-2 border-white" />
                <h3 className="text-xl font-display font-bold">Pokémon World</h3>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Explore the vast world of Pokémon. Discover their types, stats, and unique characteristics in our comprehensive Pokédex.
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-bold uppercase tracking-widest text-pokemon-yellow mb-6">Quick Links</h4>
              <ul className="space-y-3 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pokédex</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Items</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Locations</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold uppercase tracking-widest text-pokemon-yellow mb-6">Connect</h4>
              <div className="flex gap-4">
                <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
                  <Github className="w-5 h-5" />
                </a>
                <a href="#" className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
                  <ExternalLink className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500 font-medium">
            <p>© 2026 Pokémon World Explorer. All rights reserved.</p>
            <p>Data provided by <a href="https://pokeapi.co/" className="text-pokemon-blue hover:underline">PokéAPI</a></p>
          </div>
        </div>
      </footer>
    </div>
  );
}
