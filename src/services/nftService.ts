import { type NFT } from '../components/NFTCard';
import { mockNFTs } from '../data/mockNFTs';

// Mock delay to simulate network request
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const nftService = {
  /**
   * Fetch all available NFTs in the marketplace
   */
  async getAllNFTs(): Promise<NFT[]> {
    // In a real app, this would be: return (await api.get('/nfts')).data;
    await delay(800); 
    return [...mockNFTs];
  },

  /**
   * Fetch a specific NFT by ID
   */
  async getNFTById(id: string): Promise<NFT | null> {
    // return (await api.get(`/nfts/${id}`)).data;
    await delay(500);
    const nft = mockNFTs.find(n => n.id === id);
    return nft || null;
  },

  /**
   * Fetch NFTs belonging to the current user
   */
  async getMyCollection(): Promise<NFT[]> {
    // return (await api.get('/users/me/collection')).data;
    await delay(1000);
    return mockNFTs.slice(2, 5); // Simulate owned NFTs
  }
};
