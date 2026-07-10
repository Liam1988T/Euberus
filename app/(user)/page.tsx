'use client';
import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

export default function UserPortal() {
  const router = useRouter();
  const [movies, setMovies] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [genreFilter, setGenreFilter] = useState('All Genres');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const { data, error } = await supabase
          .from('movies')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setMovies(data || []);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };
    fetchMovies();
  }, []);

  useEffect(() => {
    const featured = movies.slice(0, 5);
    if (featured.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featured.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [movies]);

  // Filtering Logic
  const filteredMovies = useMemo(() => {
    return movies.filter((movie) => {
      const matchesSearch = movie.title?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGenre = genreFilter === 'All Genres' || movie.genre === genreFilter;
      return matchesSearch && matchesGenre;
    });
  }, [movies, searchQuery, genreFilter]);

  const genres = ['All Genres', ...Array.from(new Set(movies.map((m) => m.genre).filter(Boolean)))];
  const featuredMovies = movies.slice(0, 5);

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Premium Cinematic Slideshow */}
      <section className="relative h-[60vh] w-full overflow-hidden">
        <AnimatePresence mode="wait">
          {featuredMovies.length > 0 && (
            <motion.div
              key={featuredMovies[currentIndex].id}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="absolute inset-0 cursor-pointer"
              onClick={() => router.push(`/movie/${featuredMovies[currentIndex].id}`)}
            >
              <div 
                className="w-full h-full"
                style={{
                  WebkitMaskImage: 'linear-gradient(45deg, transparent 5%, black 40%, black 60%, transparent 95%)',
                  maskImage: 'linear-gradient(45deg, transparent 5%, black 40%, black 60%, transparent 95%)',
                }}
              >
                <img 
                  src={featuredMovies[currentIndex].imageUrl} 
                  className="w-full h-full object-cover scale-110"
                  alt={featuredMovies[currentIndex].title}
                />
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex flex-col justify-end p-12">
                <h1 className="text-6xl font-black mb-2 tracking-tighter">
                  {featuredMovies[currentIndex].title}
                </h1>
                <p className="text-xl text-gray-300 font-bold tracking-widest uppercase">
                  {featuredMovies[currentIndex].genre || 'LATEST RELEASE'}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Search and Filter Section */}
      <section className="sticky top-[80px] z-40 bg-black/80 backdrop-blur-md border-b border-white/10 px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4">
          <input 
            type="text" 
            placeholder="Search movies..." 
            className="flex-1 bg-gray-900 border border-gray-700 px-4 py-2 rounded-lg text-white outline-none focus:border-red-600"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select 
            className="bg-gray-900 border border-gray-700 px-4 py-2 rounded-lg text-white outline-none focus:border-red-600"
            onChange={(e) => setGenreFilter(e.target.value)}
          >
            {genres.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
      </section>

      {/* Movie Catalog Grid */}
      <section className="py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {filteredMovies.map((movie) => (
            <div 
              key={movie.id} 
              className="bg-slate-900/50 border border-white/5 rounded-2xl overflow-hidden hover:border-red-500/50 transition-all duration-300 group flex flex-col"
            >
              <div 
                className="relative w-full aspect-[2/3] overflow-hidden cursor-pointer"
                onClick={() => router.push(`/movie/${movie.id}`)}
              >
                <img 
                  src={movie.imageUrl} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  alt={movie.title} 
                />
              </div>
              
              <div className="p-4 flex flex-col flex-grow">
                <h4 className="font-bold text-white mb-1 leading-tight break-words text-sm">
                  {movie.title}
                </h4>
                <p className="text-gray-400 text-xs mb-1">{movie.genre}</p>
                <p className="text-yellow-500 text-xs font-bold mb-4">
                  Rating: {movie.rating || 'N/A'}/10
                </p>
                
                <button 
                  onClick={() => router.push(`/movie/${movie.id}`)}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-sm font-bold transition mt-auto"
                >
                  WATCH NOW
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}