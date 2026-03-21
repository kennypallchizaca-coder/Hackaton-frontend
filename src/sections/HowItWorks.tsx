import { Wallet, Search, ShoppingBag } from 'lucide-react';

const steps = [
  {
    icon: <Wallet className="text-accent-blue" size={32} />,
    title: "Connect your wallet",
    description: "Connect your Metamask or Coinbase wallet to get started. Puny Punks are minted on Ethereum."
  },
  {
    icon: <Search className="text-status-purple" size={32} />,
    title: "Browse Collection",
    description: "Explore 10,000 unique punks. Filter by rarity, background color, and specific attributes."
  },
  {
    icon: <ShoppingBag className="text-status-red" size={32} />,
    title: "Mint & Trade",
    description: "Officially own your favorite punk. Each one is a unique NFT that can be traded on our marketplace."
  }
];

export function HowItWorks() {
  return (
    <section id="about" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-16">
          How it works
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {/* Connector line for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-1/2 w-full h-[1px] bg-white/10 -z-10" />
              )}
              
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-8 border border-white/10 group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300 relative">
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-black border border-white/10 flex items-center justify-center text-xs font-bold text-white">
                    0{index + 1}
                  </div>
                  {step.icon}
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-4">
                  {step.title}
                </h3>
                <p className="text-text-gray leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-24 p-12 glass rounded-[40px] text-left flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
             <h3 className="text-3xl font-bold text-white mb-6">
                Ready to join the movement?
             </h3>
             <p className="text-text-gray text-lg mb-8">
                Join our Discord community to stay updated on new drops and marketplace features.
             </p>
             <button className="px-8 py-4 bg-status-purple text-white font-bold rounded-full hover:bg-opacity-80 transition-all">
                Join our Discord
             </button>
          </div>
          <div className="w-full md:w-auto flex -space-x-6 overflow-hidden p-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-24 h-24 rounded-2xl bg-white/10 border-2 border-black flex items-center justify-center overflow-hidden rotate-12">
                 <div className="w-full h-full bg-gradient-to-br from-white/20 to-transparent" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
