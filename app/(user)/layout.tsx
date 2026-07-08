import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'EUBERUS | Premium Movie Portal',
  description: 'The best place to stream your favorite movies.',
};


// app/(user)/layout.tsx
export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav className="relative flex items-center justify-between px-8 py-6 bg-black/80 backdrop-blur-md sticky top-0 z-50 border-b border-white/5">
        
        {/* Logo - Left */}
        <h1 className="text-2xl font-black text-red-600 tracking-tighter">EUBERUS</h1>
        
        {/* Centered Navigation Links */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex gap-8 font-bold text-sm text-gray-400">
          <a href="/" className="hover:text-white transition-colors duration-300">HOME</a>
          <a href="#" className="hover:text-white transition-colors duration-300">MOVIES</a>
          <a href="#" className="hover:text-white transition-colors duration-300">TV-SERIES</a>
          <a href="#" className="hover:text-white transition-colors duration-300">CONTACT-US</a>
        </div>

        {/* Right side placeholder to keep the center balanced (hidden Login button area) */}
        <div className="w-[100px]">
          {/* <a href="/admin" className="hidden bg-white text-black px-6 py-2 rounded-full font-bold text-sm hover:bg-gray-200 transition">
            LOGIN
          </a> */}
        </div>
      </nav>
      {children}
    </>
  );
}