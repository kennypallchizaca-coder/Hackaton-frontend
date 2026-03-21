import {  Plus, Minus } from 'lucide-react';
import { useState } from 'react';

const faqs = [
  {
    question: "What are Puny Punks?",
    answer: "Puny Punks are 10,000 uniquely generated characters. No two are exactly alike, and each one of them can be officially owned by a single person on the Ethereum blockchain."
  },
  {
    question: "How do I buy a Puny Punk?",
    answer: "You can buy a Puny Punk on our marketplace or on secondary markets like OpenSea. You will need an Ethereum wallet like MetaMask to complete the transaction."
  },
  {
    question: "Are Puny Punks a good investment?",
    answer: "NFTs are highly volatile assets and should be treated with caution. We recommend doing your own research before making any purchase."
  },
  {
    question: "What makes a Punk rare?",
    answer: "Rarity is determined by the combination of attributes like background color, hair style, accessories, and type (Alien, Ape, Zombie, etc.)."
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faqs" className="py-24 bg-bg-dark">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-white text-center mb-16">
          Frequently Asked Questions
        </h2>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="glass rounded-2xl overflow-hidden"
            >
              <button
                className="w-full px-8 py-6 flex items-center justify-between text-left"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="text-xl font-bold text-white leading-tight">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <Minus className="text-accent-blue" size={24} />
                ) : (
                  <Plus className="text-white/50" size={24} />
                )}
              </button>
              
              <div 
                className={`px-8 transition-all duration-300 ease-in-out ${
                  openIndex === index ? "max-h-48 pb-6 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
                }`}
              >
                <p className="text-text-gray leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
