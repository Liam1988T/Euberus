'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function MovieDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [movie, setMovie] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchMovieData = async () => {
      // 1. Fetch current movie
      const { data: movieData, error: movieError } = await supabase
        .from('movies')
        .select('*')
        .eq('id', id)
        .single();

      if (movieError) {
        console.error("Error fetching movie:", movieError);
        return;
      }
      setMovie(movieData);

      // 2. Fetch recommendations (Same genre, not the current one)
      const { data: recData } = await supabase
        .from('movies')
        .select('*')
        .eq('genre', movieData.genre)
        .neq('id', id)
        .limit(4);

      setRecommendations(recData || []);
    };

    fetchMovieData();
  }, [id]);

  // Combined function: Increments view count then opens the modal
  const handleWatchNow = async () => {
    const movieId = Array.isArray(id) ? id[0] : id;
    if (!movieId) return;
    
    // Call the database RPC function to increment the view count
    const { error } = await supabase.rpc('increment_movie_view', { 
      input_movie_id: movieId 
    });
    
    if (error) {
      console.error("Error incrementing view count:", JSON.stringify(error, null, 2));
    }

    // Open the modal after the trigger
    setIsModalOpen(true);
  };

  const getEmbedLink = (link: string) => {
    if (!link) return "";
    return link.replace(/\/view.*$/, '/preview');
  };

  if (!movie) return <div className="p-20 text-center text-white min-h-screen bg-black">Loading...</div>;

  return (
    <main className="min-h-screen bg-black text-white p-8 md:p-20">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
        <img src={movie.imageUrl} className="w-full aspect-[2/3] object-cover rounded-2xl shadow-2xl border border-gray-800" alt={movie.title} />
        
        <div className="space-y-6">
          {/* Header Section: Title and Premium Back Button */}
          <div className="flex justify-between items-start gap-4">
            <h1 className="text-5xl font-black tracking-tighter leading-none">{movie.title}</h1>
            <button 
              onClick={() => router.back()} 
              className="group flex items-center justify-center w-12 h-12 bg-white/5 hover:bg-red-600 border border-white/10 hover:border-red-500 rounded-full transition-all duration-300 backdrop-blur-sm"
              aria-label="Go back"
            >
              <svg 
                className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>

          <div className="flex gap-4 text-red-500 font-bold">
            <span>{movie.genre}</span>
            {movie.country && <span>{movie.country}</span>}
            {movie.rating && <span>★ {movie.rating}/10</span>}
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl font-bold border-b border-gray-800 pb-2">Description</h3>
            <p className="text-gray-300 leading-relaxed">{movie.description || "No description available."}</p>
          </div>

          <div className="pt-4 space-y-2 border-t border-gray-800">
            {movie.starring && <p className="text-sm"><span className="text-white font-bold">Starring:</span> <span className="text-gray-400">{movie.starring}</span></p>}
            {movie.script && <p className="text-sm"><span className="text-white font-bold">Script:</span> <span className="text-gray-400">{movie.script}</span></p>}
          </div>

          <button 
            onClick={handleWatchNow}
            className="w-full text-center bg-red-600 hover:bg-red-700 py-4 rounded-lg font-black text-xl transition-all shadow-[0_0_20px_rgba(220,38,38,0.3)]"
          >
            WATCH MOVIE NOW
          </button>
        </div>
      </div>

      {recommendations.length > 0 && (
        <section className="max-w-5xl mx-auto mt-20">
          <h3 className="text-2xl font-bold mb-8 border-l-4 border-red-600 pl-4">More Like This</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {recommendations.map((rec) => (
              <div key={rec.id} onClick={() => router.push(`/movie/${rec.id}`)} className="cursor-pointer group">
                <div className="aspect-[2/3] overflow-hidden rounded-lg bg-gray-900 mb-2 border border-gray-800">
                  <img src={rec.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <h4 className="font-bold truncate text-sm">{rec.title}</h4>
              </div>
            ))}
          </div>
        </section>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl aspect-video relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute -top-12 right-0 text-white font-bold hover:text-red-500 text-xl">CLOSE [X]</button>
            <iframe 
              className="w-full h-full rounded-2xl border border-white/10" 
              src={getEmbedLink(movie.driveLink)} 
              allowFullScreen 
            />
          </div>
        </div>
      )}
    </main>
  );
}