'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isMinimized, setIsMinimized] = useState(false);
  const pathname = usePathname();

  const navs = [
    { name: 'Publish Content', path: '/admin' },
    { name: 'Dashboard', path: '/admin/dashboard' },
    { name: 'Modal Settings', path: '/admin/modal' },
  ];

  return (
    // 'h-screen overflow-hidden' ensures the full page stays locked 
    // to prevent double-scrollbars
    <div className="flex h-screen bg-black text-white">
      
      {/* 'sticky top-0 h-screen' keeps the sidebar locked while 
        the main content scrolls independently.
      */}
      <aside className={`border-r border-gray-800 p-6 flex flex-col gap-6 transition-all duration-300 sticky top-0 h-screen ${isMinimized ? 'w-20' : 'w-64'}`}>
        <div className="flex items-center justify-between">
          {!isMinimized && <h1 className="text-xl font-black text-red-600">ADMIN</h1>}
          <button onClick={() => setIsMinimized(!isMinimized)} className="text-gray-400 hover:text-white">
            {isMinimized ? '→' : '←'}
          </button>
        </div>

        <nav className="flex flex-col gap-2">
          {navs.map((link) => (
            <Link key={link.path} href={link.path} title={link.name}
              className={`p-3 rounded-lg flex items-center gap-4 ${pathname === link.path ? 'bg-red-600' : 'hover:bg-gray-900'}`}>
              <span className="font-bold">{link.name.charAt(0)}</span>
              {!isMinimized && <span>{link.name}</span>}
            </Link>
          ))}
        </nav>
      </aside>

      {/* 'flex-1 overflow-y-auto' makes the main content scroll 
        while the sidebar stays perfectly still.
      */}
      <main className="flex-1 overflow-y-auto p-10">
        {children}
      </main>
    </div>
  );
}