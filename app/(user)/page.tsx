'use client';
import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../lib/firebase'; 
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation'; // Corrected import

export default function UserPortal() {
  const router = useRouter(); // Initialized router
  const [movies, setMovies] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const moviesRef = ref(database, 'movies');
    onValue(moviesRef, (snapshot) => {
      const data = snapshot.val();
      const allMovies = data ? Object.keys(data).map(k => ({ id: k, ...data[k] })).reverse() : [];
      setMovies(allMovies);
    });
  }, []);

  useEffect(() => {
    const featured = movies.slice(0, 5);
    if (featured.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featured.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [movies]);

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
              // Navigates to detail page using router
              onClick={() => router.push(`/movie/${featuredMovies[currentIndex].id}`)}
            >
              {/* Diagonal Masking Container */}
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

              {/* Title Overlay */}
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

        {/* Pagination Dots */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
          {featuredMovies.map((_, index) => (
            <button
              key={index}
              className={`h-2 w-2 rounded-full transition-all ${index === currentIndex ? 'bg-red-600 w-8' : 'bg-white/50'}`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </section>

      {/* Movie Grid Section */}
      <section className="p-8">
        <h3 className="text-2xl font-bold mb-6 border-l-4 border-red-600 pl-4">All Movies</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {movies.map((movie) => (
            <div 
              key={movie.id} 
              // Navigates to detail page using router
              onClick={() => router.push(`/movie/${movie.id}`)} 
              className="group cursor-pointer"
            >
              <div className="aspect-[2/3] bg-gray-900 rounded-lg overflow-hidden mb-3 border border-gray-800">
                <img 
                  src={movie.imageUrl} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  alt={movie.title}
                />
              </div>
              <h4 className="font-bold truncate text-sm px-1">{movie.title}</h4>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}