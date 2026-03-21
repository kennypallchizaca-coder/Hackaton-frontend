import { Twitter, Disc as Discord, Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="py-12 border-t border-white/5 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center">
            <span className="text-xl font-bold tracking-tighter text-white">
              PUNY<span className="text-accent-blue">PUNKS</span>
            </span>
            <span className="ml-8 text-sm text-text-gray">
              © 2026 Puny Punks. All rights reserved.
            </span>
          </div>
          
          <div className="flex items-center space-x-8">
            <a href="#" className="text-sm text-text-gray hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-sm text-text-gray hover:text-white transition-colors">Terms of Service</a>
            <div className="flex items-center space-x-4 border-l border-white/10 pl-8">
               <a href="#" className="text-text-gray hover:text-accent-blue transition-colors">
                 <Twitter size={18} />
               </a>
               <a href="#" className="text-text-gray hover:text-accent-blue transition-colors">
                 <Discord size={18} />
               </a>
               <a href="#" className="text-text-gray hover:text-accent-blue transition-colors">
                 <Github size={18} />
               </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
