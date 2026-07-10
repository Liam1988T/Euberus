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
    <div className="flex h-screen bg-black text-white overflow-hidden">
      {/* Sidebar: Fixed width to prevent layout shifting */}
      <aside 
        className={`border-r border-gray-800 p-6 flex flex-col gap-8 transition-all duration-300 flex-shrink-0 ${isMinimized ? 'w-20' : 'w-64'}`}
      >
        <div className="flex items-center justify-between">
          {!isMinimized && <h1 className="text-xl font-black text-red-600 truncate">EUBERUS</h1>}
          <button onClick={() => setIsMinimized(!isMinimized)} className="text-gray-400 hover:text-white p-2">
            {isMinimized ? '→' : '←'}
          </button>
        </div>

        <nav className="flex flex-col gap-2">
          {navs.map((link) => (
            <Link 
              key={link.path} 
              href={link.path} 
              title={link.name}
              className={`p-3 rounded-lg flex items-center gap-4 transition-colors ${
                pathname === link.path ? 'bg-red-600 text-white' : 'hover:bg-gray-900 text-gray-400'
              }`}
            >
              <span className="font-bold">{link.name.charAt(0)}</span>
              {!isMinimized && <span className="truncate">{link.name}</span>}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-black">
       <div className="max-w-7xl mx-auto p-6 lg:p-10">
          
          {/* Header/Search Section */}
          <header className="mb-10">
            <h2 className="text-2xl font-bold mb-6">Admin Portal</h2>
                    </header>

          {/* Page Content */}
          <section>
            {children}
          </section>
        </div>
      </main>
    </div>
  );
}