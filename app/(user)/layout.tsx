'use client'; // This is required for useState
import { useState } from 'react';

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

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
      <nav className="flex items-center justify-between px-8 py-6 bg-black/80 backdrop-blur-md sticky top-0 z-50 border-b border-white/5">
        
        {/* Logo */}
        <h1 className="text-2xl font-black text-red-600 tracking-tighter">EUBERUS</h1>
        
        {/* Desktop Navigation Links */}
        <div className="hidden md:flex gap-8 font-bold text-sm text-gray-400">
          {navLinks}
        </div>

        {/* Hamburger Button (Mobile) */}
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden bg-black/95 p-8 flex flex-col gap-6 font-bold text-lg text-white border-b border-white/10">
          {navLinks}
        </div>
      )}

      {children}
    </>
  );
}