'use client'; 
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [modal, setModal] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('hideModalForever')) {
      const fetchModal = async () => {
        const { data } = await supabase
          .from('modal_settings')
          .select('*')
          .eq('id', 1)
          .single();

        if (data && data.is_active) {
          setModal(data);
          setShowModal(true);
        }
      };
      fetchModal();
    }
  }, []);

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem('hideModalForever', 'true');
    }
    setShowModal(false);
  };

  const navLinks = (
    <>
      <a href="/" className="hover:text-white transition-colors duration-300">HOME</a>
      <a href="#" className="hover:text-white transition-colors duration-300">MOVIES</a>
      <a href="#" className="hover:text-white transition-colors duration-300">TV-SERIES</a>
      <a href="#" className="hover:text-white transition-colors duration-300">CONTACT-US</a>
    </>
  );

  return (
    <>
      {/* Modal Popup - Portrait Style */}
      {showModal && modal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative bg-gray-900 p-4 rounded-lg border border-red-600 w-full max-w-xs shadow-2xl flex flex-col">
            
            {/* Close Button (X) */}
            <button 
              onClick={handleClose} 
              className="absolute top-2 right-2 text-white hover:text-red-500 font-bold text-xl p-1 z-10"
            >
              ✕
            </button>

            {/* Portrait Image */}
            {modal.image_url && (
              <img src={modal.image_url} alt="Modal" className="w-full aspect-[3/4] object-cover rounded mb-4" />
            )}
            
            <h2 className="text-xl font-bold text-white mb-2">{modal.title}</h2>
            <p className="text-gray-300 mb-6 text-sm flex-grow">{modal.content}</p>
            
            <label className="flex items-center text-xs text-gray-400 mb-4 cursor-pointer">
              <input type="checkbox" className="mr-2" checked={dontShowAgain} onChange={(e) => setDontShowAgain(e.target.checked)} />
              Don't show this again
            </label>
          </div>
        </div>
      )}

      <nav className="flex items-center justify-between px-8 py-6 bg-black/80 backdrop-blur-md sticky top-0 z-50 border-b border-white/5">
        <h1 className="text-2xl font-black text-red-600 tracking-tighter">EUBERUS</h1>
        <div className="hidden md:flex gap-8 font-bold text-sm text-gray-400">
          {navLinks}
        </div>
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </nav>

      {isOpen && (
        <div className="md:hidden bg-black/95 p-8 flex flex-col gap-6 font-bold text-lg text-white border-b border-white/10">
          {navLinks}
        </div>
      )}
      {children}
    </>
  );
}