import { useState, useEffect } from 'react';
import { type NFT } from '../components/NFTCard';
import { nftService } from '../services/nftService';

interface UseNFTsOptions {
  fetchMyCollection?: boolean;
}

export function useNFTs(options: UseNFTsOptions = {}) {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      setLoading(true);
      setError(null);
      
      try {
        const data = options.fetchMyCollection 
          ? await nftService.getMyCollection()
          : await nftService.getAllNFTs();
          
        if (isMounted) {
          setNfts(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Error fetching NFTs');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [options.fetchMyCollection]);

  return { nfts, loading, error };
}
