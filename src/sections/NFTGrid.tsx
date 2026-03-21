import { mockNFTs } from '../data/mockNFTs';
import { ExternalLink } from 'lucide-react';

export function NFTGrid() {
  return (
    <section id="collection" className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl text-left">
            <h2 className="text-accent-blue text-sm font-bold uppercase tracking-widest mb-4">
              Recent Transactions
            </h2>
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Largest sales from the <br />
              <span className="text-white/50">official collection</span>
            </h3>
            <p className="text-text-gray text-lg">
              Explore the most valuable punks in the ecosystem. Each transaction is verified on the Ethereum blockchain.
            </p>
          </div>
          <button className="px-8 py-4 border border-white/10 rounded-full text-sm font-bold hover:bg-white/5 transition-colors flex items-center group">
            View all sales
            <ExternalLink className="ml-2 opacity-50 group-hover:opacity-100 transition-opacity" size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockNFTs.map((nft) => (
            <div 
              key={nft.id} 
              className="glass rounded-3xl p-6 hover:translate-y-[-8px] transition-all duration-300 group cursor-pointer"
            >
              <div className="aspect-square rounded-2xl bg-white/5 mb-6 overflow-hidden relative">
                <img 
                  src={nft.image} 
                  alt={nft.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 pixelated" 
                  style={{ imageRendering: 'pixelated' }}
                />
                <div className="absolute top-4 right-4 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-[10px] font-bold text-white border border-white/10">
                  {nft.rarity}
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-2">
                <span className="text-text-gray text-sm font-medium">{nft.type}</span>
                <span className="text-accent-blue text-sm font-bold">{nft.price}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <h4 className="text-white text-xl font-bold">{nft.name}</h4>
                <span className="text-white/30 text-xs">{nft.usdPrice}</span>
              </div>
              
              <button className="w-full mt-6 py-3 border border-white/5 bg-white/5 rounded-2xl text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                Buy on Marketplace
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
