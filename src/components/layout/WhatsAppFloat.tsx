'use client';
import { MessageCircle, X, User } from 'lucide-react';
import { useEffect, useState } from 'react';

export function WhatsAppFloat() {
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const agents = [
    { name: 'Agent 1', number: '254733949512' },
    { name: 'Agent 2', number: '254714972502' }
  ];

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 transition-all duration-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
      
      {/* Menu Popup */}
      <div className={`bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100 mb-2' : 'scale-0 opacity-0 h-0 w-0 mb-0 pointer-events-none'}`}>
        <div className="bg-[#25D366] p-4 text-white">
          <h4 className="font-bold">Chat with us!</h4>
          <p className="text-sm opacity-90">Select an agent to message</p>
        </div>
        <div className="p-2 w-64 flex flex-col gap-1">
          {agents.map((agent, i) => (
            <a
              key={i}
              href={`https://wa.me/${agent.number}?text=Hello!%20I'm%20interested%20in%20BF%20Suma%20products.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-xl transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 flex-shrink-0">
                <User size={20} />
              </div>
              <div>
                <div className="font-bold text-slate-900 text-sm">{agent.name}</div>
                <div className="text-xs text-slate-500">Available</div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-300"
        aria-label="Toggle WhatsApp Menu"
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={32} />}
        {!isOpen && <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-30 animate-ping -z-10"></span>}
      </button>
    </div>
  );
}
