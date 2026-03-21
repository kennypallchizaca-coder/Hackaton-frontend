import { Twitter, Disc as Discord, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../utils/cn';

const navLinks = [
  { name: 'About', href: '#about' },
  { name: 'Collection', href: '#collection' },
  { name: 'FAQs', href: '#faqs' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-bg-dark/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <span className="text-2xl font-bold tracking-tighter text-white">
              PUNY<span className="text-accent-blue">PUNKS</span>
            </span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-text-gray hover:text-white transition-colors duration-200 text-sm font-medium"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          {/* Socials & CTA */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-4">
              <a href="#" className="text-text-gray hover:text-accent-blue transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-text-gray hover:text-accent-blue transition-colors">
                <Discord size={20} />
              </a>
            </div>
            <button className="px-6 py-2 border border-white/20 rounded-full text-sm font-medium hover:bg-white hover:text-black transition-all duration-300">
              Connect wallet
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-text-gray hover:text-white p-2"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        "md:hidden transition-all duration-300 ease-in-out",
        isOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
      )}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-card-dark border-b border-white/10">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="block px-3 py-2 text-text-gray hover:text-white text-base font-medium"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <div className="flex items-center space-x-4 px-3 py-4 border-t border-white/5">
            <a href="#" className="text-text-gray hover:text-accent-blue transition-colors">
              <Twitter size={20} />
            </a>
            <a href="#" className="text-text-gray hover:text-accent-blue transition-colors">
              <Discord size={20} />
            </a>
          </div>
          <div className="px-3 pb-4">
            <button className="w-full px-6 py-3 bg-white text-black rounded-full text-sm font-bold">
              Connect wallet
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
