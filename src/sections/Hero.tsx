import { ArrowRight } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-accent-blue/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-status-purple/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-accent-blue mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-blue opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-blue"></span>
          </span>
          <span>10,000 Unique Punky Punks Live Now</span>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 leading-[1.1]">
          The project that inspired the <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-accent-blue">
            modern CryptoArt movement
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-lg md:text-xl text-text-gray mb-12 leading-relaxed">
          Puny Punks are 10,000 uniquely generated characters. No two are exactly alike, and each one of them can be officially owned by a single person on the Ethereum blockchain.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="w-full sm:w-auto px-10 py-4 bg-white text-black font-bold rounded-full hover:bg-accent-blue transition-all duration-300 flex items-center justify-center group">
            Mint now
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
          </button>
          <button className="w-full sm:w-auto px-10 py-4 border border-white/20 font-bold rounded-full hover:bg-white/5 transition-all duration-300">
            View collection
          </button>
        </div>

        {/* Hero Image Mockup / Visual */}
        <div className="mt-20 relative">
          <div className="glass rounded-3xl p-4 overflow-hidden shadow-2xl">
            <div className="aspect-[16/9] bg-[#111] rounded-2xl flex items-center justify-center overflow-hidden">
               {/* Visual representation of grid of punks */}
               <div className="grid grid-cols-4 md:grid-cols-8 gap-2 p-2 w-full h-full opacity-40">
                  {Array.from({ length: 32 }).map((_, i) => (
                    <div key={i} className="aspect-square rounded-md bg-white/5 animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
                  ))}
               </div>
               <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl md:text-6xl font-black text-white/20 uppercase tracking-[0.2em]">Puny Punks</span>
               </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-status-red/20 rounded-full blur-2xl animate-pulse" />
          <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-status-blue/20 rounded-full blur-2xl animate-pulse" />
        </div>
      </div>
    </section>
  );
}
