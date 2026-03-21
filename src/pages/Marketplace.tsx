import { useState, useMemo } from 'react';
import { Filter, ChevronDown, Loader2 } from 'lucide-react';
import { NFTCard } from '../components/NFTCard';
import { useNFTs } from '../hooks/useNFTs';

export function Marketplace() {
  const [activeFilter, setActiveFilter] = useState('All');
  const { nfts, loading, error } = useNFTs();
  
  const filters = ['All', 'Alien', 'Ape', 'Zombie', 'Classic'];

  const filteredNFTs = useMemo(() => {
    if (activeFilter === 'All') return nfts;
    return nfts.filter(nft => nft.type === activeFilter);
  }, [nfts, activeFilter]);

  if (error) {
    return <div className="text-status-red text-center py-20">Failed to load marketplace data.</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-4">Marketplace</h1>
        <p className="text-text-gray max-w-2xl text-lg">
          Browse, buy, and trade the most exclusive punks. Verified transactions via smart contracts.
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-4 border-y border-white/5 focus-within:border-white/10 transition-colors bg-bg-dark sticky top-0 z-20">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto hide-scrollbar">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeFilter === filter 
                  ? 'bg-white text-black' 
                  : 'bg-white/5 text-text-gray hover:text-white hover:bg-white/10 border border-transparent'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm font-medium hover:bg-white/10 transition-colors">
            <Filter size={16} className="mr-2" /> Filters
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-between px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm font-medium hover:bg-white/10 transition-colors min-w-[140px]">
            Recently Listed <ChevronDown size={16} className="ml-2 text-text-gray" />
          </button>
        </div>
      </div>

      {/* Grid or Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-32">
          <Loader2 className="animate-spin text-accent-blue" size={48} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredNFTs.map(nft => (
            <NFTCard key={nft.id} nft={nft} actionText="Buy / Offer" />
          ))}
          {/* Fill the grid with some mock clones for visual heft */}
          {filteredNFTs.map(nft => (
            <NFTCard key={`${nft.id}-copy`} nft={{...nft, id: `${nft.id}-c`, price: (parseFloat(nft.price) * 1.1).toFixed(2) + " ETH"}} actionText="Buy / Offer" />
          ))}
        </div>
      )}
    </div>
  );
}
