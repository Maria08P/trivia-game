import React, { useState } from 'react';
import { Search, Sparkles, Shield, Compass, BookOpen, X, ChevronRight } from 'lucide-react';
import { HAIRLESS_CREATURES, HairlessCreature } from '../data/hairlessData';
import { elevatorSynth } from '../audio/elevatorSynth';

export const CreatureCompendium: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeCreature, setActiveCreature] = useState<HairlessCreature | null>(null);

  const categories = [
    { id: 'all', label: 'All Creatures' },
    { id: 'Subterranean', label: 'Subterranean' },
    { id: 'Cetacean', label: 'Marine & Cetaceans' },
    { id: 'Domestic', label: 'Domestic Mutants' },
    { id: 'Amphibian', label: 'Amphibians & Reptiles' },
  ];

  const filteredCreatures = HAIRLESS_CREATURES.filter((c) => {
    const matchesSearch =
      c.commonName.toLowerCase().includes(search.toLowerCase()) ||
      c.scientificName.toLowerCase().includes(search.toLowerCase()) ||
      c.quirk.toLowerCase().includes(search.toLowerCase());

    if (selectedCategory === 'all') return matchesSearch;
    if (selectedCategory === 'Subterranean') return matchesSearch && c.category.includes('Subterranean');
    if (selectedCategory === 'Cetacean') return matchesSearch && (c.category.includes('Cetacean') || c.category.includes('Marine'));
    if (selectedCategory === 'Domestic') return matchesSearch && c.category.includes('Domestic');
    if (selectedCategory === 'Amphibian') return matchesSearch && (c.category.includes('Amphibian') || c.category.includes('Reptile'));
    return matchesSearch;
  });

  const handleOpenDetail = (creature: HairlessCreature) => {
    setActiveCreature(creature);
    elevatorSynth.playElevatorChime('single');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      
      {/* Compendium Header */}
      <div className="bg-gradient-to-r from-[#093224] to-[#041A11] border border-amber-500/30 rounded-3xl p-6 sm:p-8 mb-6 shadow-2xl relative overflow-hidden">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-mono font-bold tracking-wider text-amber-300 uppercase">
              The Velvet Elevator Archives
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display gold-gradient-text mb-3">
            Hairless Hall of Fame
          </h2>
          <p className="text-sm text-emerald-200/90 leading-relaxed">
            Explore the biological wonders of animals who traded fur for hydrodynamics, subterranean speed, gigantothermic cooling, or remarkable genetic quirks.
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-6">
        
        {/* Category Filter Pills (Functional Buttons) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-amber-400 to-amber-600 text-[#051A12] font-bold shadow-md shadow-amber-950/40'
                  : 'bg-emerald-950/70 hover:bg-emerald-900 text-emerald-200/80 border border-amber-500/20'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-400/60" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search hairless fauna..."
            className="w-full bg-[#03170E] border border-amber-500/25 rounded-full pl-9 pr-4 py-2 text-xs text-amber-100 placeholder:text-emerald-400/40 focus:outline-none focus:ring-1 focus:ring-amber-400"
          />
        </div>

      </div>

      {/* Creature Plaque Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCreatures.map((creature) => (
          <div
            key={creature.id}
            onClick={() => handleOpenDetail(creature)}
            className="bg-gradient-to-b from-[#082E21] to-[#041910] border border-amber-500/30 hover:border-amber-400/70 rounded-3xl p-5 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col justify-between group"
          >
            <div>
              {/* Category & Status */}
              <div className="flex items-center justify-between gap-2 mb-3 text-[11px] font-mono">
                <span className="text-amber-400/90 font-medium">
                  {creature.category}
                </span>
                <span className="text-emerald-300/60">
                  {creature.conservationStatus}
                </span>
              </div>

              {/* Title & Scientific Name */}
              <h3 className="text-lg font-bold font-display text-amber-100 group-hover:text-amber-300 transition-colors mb-0.5">
                {creature.commonName}
              </h3>
              <p className="text-xs text-emerald-300/70 italic font-serif mb-3">
                {creature.scientificName}
              </p>

              {/* Hair Status Badge */}
              <div className="p-2.5 rounded-2xl bg-[#03150D]/80 border border-amber-500/20 text-xs text-amber-200/90 mb-3">
                <span className="font-semibold text-amber-300 block text-[10px] uppercase font-mono mb-0.5">
                  Coat Status
                </span>
                <p className="line-clamp-2 text-emerald-100/90 text-xs">
                  {creature.hairStatus}
                </p>
              </div>

              {/* Quirk snippet */}
              <p className="text-xs text-emerald-200/80 line-clamp-3 leading-relaxed mb-4">
                {creature.quirk}
              </p>
            </div>

            {/* Read Deep Dive Affordance */}
            <div className="pt-3 border-t border-amber-500/15 flex items-center justify-between text-xs font-semibold text-amber-300 group-hover:text-amber-200">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Superpower: {creature.superpower.slice(0, 24)}...</span>
              </span>
              <ChevronRight className="w-4 h-4 text-amber-400 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {filteredCreatures.length === 0 && (
        <div className="text-center py-16 bg-[#041910] border border-amber-500/20 rounded-3xl">
          <p className="text-amber-300/80 text-sm">No hairless creatures matched your search filter.</p>
        </div>
      )}

      {/* Detail Modal / Drawer */}
      {activeCreature && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gradient-to-b from-[#093425] to-[#041910] border-2 border-amber-400/60 rounded-3xl p-6 sm:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative animate-fadeIn">
            
            {/* Close Button */}
            <button
              onClick={() => setActiveCreature(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-emerald-950/80 hover:bg-emerald-900 border border-amber-500/40 text-amber-300 flex items-center justify-center transition-transform active:scale-95 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <span className="text-xs font-mono tracking-widest text-amber-300 uppercase block mb-1">
              Archival Plaque · {activeCreature.category}
            </span>
            <h3 className="text-2xl font-bold font-display text-amber-100 mb-1">
              {activeCreature.commonName}
            </h3>
            <p className="text-sm italic font-serif text-emerald-300/80 mb-5">
              {activeCreature.scientificName} · {activeCreature.conservationStatus}
            </p>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="bg-[#03150D] border border-amber-500/20 rounded-2xl p-4">
                <h4 className="font-mono font-bold text-amber-300 uppercase text-[11px] mb-1">
                  Hairlessness Origins & Coat
                </h4>
                <p className="text-emerald-100/90 leading-relaxed mb-2">
                  {activeCreature.hairStatus}
                </p>
                <p className="text-emerald-200/80 leading-relaxed text-xs">
                  {activeCreature.evolutionaryReason}
                </p>
              </div>

              <div className="bg-[#03150D] border border-amber-500/20 rounded-2xl p-4">
                <h4 className="font-mono font-bold text-amber-300 uppercase text-[11px] mb-1">
                  Fascinating Quirk
                </h4>
                <p className="text-emerald-100/90 leading-relaxed">
                  {activeCreature.quirk}
                </p>
              </div>

              <div className="bg-[#03150D] border border-amber-500/20 rounded-2xl p-4">
                <h4 className="font-mono font-bold text-amber-300 uppercase text-[11px] mb-1">
                  Survival Superpower
                </h4>
                <p className="text-emerald-100/90 leading-relaxed">
                  {activeCreature.superpower}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-emerald-300/70 pt-2 border-t border-amber-500/15">
                <span>Diet: {activeCreature.diet}</span>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setActiveCreature(null)}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-[#051A12] font-bold text-xs shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              >
                Return to Compendium
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
