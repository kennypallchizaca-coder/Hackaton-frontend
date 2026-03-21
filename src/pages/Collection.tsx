import { Loader2 } from 'lucide-react';
import { NFTCard } from '../components/NFTCard';
import { useNFTs } from '../hooks/useNFTs';
import { Link } from 'react-router-dom';

export function Collection() {
  const { nfts: myCollection, loading, error } = useNFTs({ fetchMyCollection: true });

  if (error) {
    return <div className="text-status-red text-center py-20">Failed to load collection data.</div>;
  }

  return (
    <div className="space-y-8 min-h-[80vh] flex flex-col">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold mb-4">My Collection</h1>
          <p className="text-text-gray max-w-2xl text-lg">
            Manage your assets, list them on the marketplace, or transfer them to another wallet.
          </p>
        </div>
        {!loading && myCollection.length > 0 && (
          <div className="glass px-6 py-4 rounded-2xl border-white/10">
             <span className="text-text-gray text-sm">Estimated Value</span>
             <h3 className="text-2xl font-bold text-accent-blue mt-1">~ 5.75K ETH</h3>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="animate-spin text-accent-blue" size={48} />
        </div>
      ) : myCollection.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 flex-1">
          {myCollection.map((nft) => (
            <NFTCard 
              key={nft.id} 
              nft={nft} 
              actionText="List for Sale" 
              onAction={(id) => console.log('Listing NFT', id)}
            />
          ))}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-3xl p-12 text-center">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                <span className="text-4xl">👻</span>
            </div>
            <h3 className="text-2xl font-bold mb-2">No Punks Yet</h3>
            <p className="text-text-gray mb-8 max-w-sm">
                Your collection looks a bit empty. Head over to the marketplace to get your first punk!
            </p>
            <Link to="/marketplace" className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-accent-blue transition-colors">
                Explore Market
            </Link>
        </div>
      )}
    </div>
  );
}
