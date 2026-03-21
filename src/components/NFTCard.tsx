export interface NFT {
  id: string;
  name: string;
  price: string;
  usdPrice: string;
  image: string;
  type: string;
  rarity: string;
}

interface NFTCardProps {
  nft: NFT;
  onAction?: (id: string) => void;
  actionText?: string;
}

export function NFTCard({ nft, onAction, actionText = "Buy Now" }: NFTCardProps) {
  return (
    <div className="glass rounded-3xl p-6 hover:translate-y-[-4px] transition-all duration-300 group cursor-pointer flex flex-col h-full border border-white/5 hover:border-white/20">
      <div className="aspect-square rounded-2xl bg-white/5 mb-6 overflow-hidden relative">
        <img 
          src={nft.image} 
          alt={nft.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 pixelated" 
        />
        <div className="absolute top-4 right-4 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-[10px] font-bold text-white border border-white/10 shadow-sm">
          {nft.rarity}
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-2">
        <span className="text-text-gray text-xs font-semibold uppercase tracking-wider">{nft.type}</span>
        <span className="text-accent-blue text-sm font-bold">{nft.price}</span>
      </div>
      
      <div className="flex items-end justify-between mt-auto">
        <h4 className="text-white text-lg font-bold truncate pr-2">{nft.name}</h4>
        <span className="text-white/40 text-xs font-medium whitespace-nowrap">{nft.usdPrice}</span>
      </div>
      
      <button 
        className="w-full mt-6 py-2.5 bg-white/5 hover:bg-white text-white hover:text-black border border-white/10 hover:border-white rounded-xl text-sm font-bold transition-all"
        onClick={(e) => {
          e.stopPropagation();
          onAction?.(nft.id);
        }}
      >
        {actionText}
      </button>
    </div>
  );
}
