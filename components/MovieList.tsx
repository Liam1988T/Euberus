'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase'; // Ensure correct path

export default function MovieList() {
  const [movies, setMovies] = useState<any[]>([]);
  const [editingMovie, setEditingMovie] = useState<any | null>(null);
  const [playingVideo, setPlayingVideo] = useState<any | null>(null);

  const fetchMovies = async () => {
    const { data, error } = await supabase
      .from('movies')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching movies:", error);
    } else {
      setMovies(data || []);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this movie?")) return;
    
    const { error } = await supabase
      .from('movies')
      .delete()
      .eq('id', id);

    if (error) {
      alert("Error deleting: " + error.message);
    } else {
      fetchMovies(); // Refresh list after deletion
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMovie) return;
    
    try {
      const { error } = await supabase
        .from('movies')
        .update({
          title: editingMovie.title,
          imageUrl: editingMovie.imageUrl,
          genre: editingMovie.genre,
          country: editingMovie.country,
          description: editingMovie.description,
          rating: editingMovie.rating,
          driveLink: editingMovie.driveLink
        })
        .eq('id', editingMovie.id);

      if (error) throw error;
      
      setEditingMovie(null);
      fetchMovies(); // Refresh list after update
    } catch (err: any) { 
      alert("Error saving changes: " + err.message); 
    }
  };

  const getEmbedLink = (link: string) => link?.replace(/\/view.*$/, '/preview');

  return (
    <div className="p-8">
      {/* PORTRAIT GRID */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {movies.map((movie) => (
          <div key={movie.id} className="bg-slate-900/50 border border-white/5 rounded-2xl overflow-hidden hover:border-red-500/50 transition-all duration-300 group">
            <div className="h-[350px] overflow-hidden">
              <img src={movie.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={movie.title} />
            </div>
            
            <div className="p-4">
              <h3 className="font-bold text-white mb-1 truncate">{movie.title}</h3>
              <p className="text-gray-400 text-xs mb-1">{movie.genre} • {movie.country}</p>
              <p className="text-yellow-500 text-xs mb-4 font-bold">Rating: {movie.rating || 'N/A'}/10</p>
              
              <button onClick={() => setPlayingVideo(movie)} className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-sm font-bold transition mb-2">
                WATCH MOVIE
              </button>

              <div className="flex gap-2">
                <button onClick={() => setEditingMovie(movie)} className="flex-1 bg-white/5 hover:bg-yellow-600 py-1.5 rounded text-xs font-bold transition">Edit</button>
                <button onClick={() => handleDelete(movie.id)} className="flex-1 bg-white/5 hover:bg-red-900 py-1.5 rounded text-xs font-bold transition">Remove</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Video Modal */}
      {playingVideo && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl aspect-video relative">
            <button onClick={() => setPlayingVideo(null)} className="absolute -top-12 right-0 text-white font-bold hover:text-red-500">CLOSE [X]</button>
            <iframe className="w-full h-full rounded-2xl border border-white/10" src={getEmbedLink(playingVideo.driveLink)} allowFullScreen />
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingMovie && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <form onSubmit={handleUpdate} className="bg-gray-900 p-8 rounded-2xl border border-gray-700 w-full max-w-sm space-y-4 my-auto">
            <h2 className="text-xl font-bold text-white">Edit Movie</h2>
            <input className="w-full p-3 bg-black rounded border border-gray-700 text-white" value={editingMovie.title || ""} onChange={(e) => setEditingMovie({...editingMovie, title: e.target.value})} placeholder="Title" />
            <input className="w-full p-3 bg-black rounded border border-gray-700 text-white" value={editingMovie.imageUrl || ""} onChange={(e) => setEditingMovie({...editingMovie, imageUrl: e.target.value})} placeholder="Image URL" />
            <input className="w-full p-3 bg-black rounded border border-gray-700 text-white" value={editingMovie.genre || ""} onChange={(e) => setEditingMovie({...editingMovie, genre: e.target.value})} placeholder="Genre" />
            <input className="w-full p-3 bg-black rounded border border-gray-700 text-white" value={editingMovie.country || ""} onChange={(e) => setEditingMovie({...editingMovie, country: e.target.value})} placeholder="Country" />
            <textarea className="w-full p-3 bg-black rounded border border-gray-700 text-white" value={editingMovie.description || ""} onChange={(e) => setEditingMovie({...editingMovie, description: e.target.value})} placeholder="Description" rows={3} />
            <input type="number" step="0.1" className="w-full p-3 bg-black rounded border border-gray-700 text-white" value={editingMovie.rating || ""} onChange={(e) => setEditingMovie({...editingMovie, rating: e.target.value})} placeholder="Rating (0-10)" />
            <input className="w-full p-3 bg-black rounded border border-gray-700 text-white" value={editingMovie.driveLink || ""} onChange={(e) => setEditingMovie({...editingMovie, driveLink: e.target.value})} placeholder="Drive Link" />
            
            <div className="flex gap-3 pt-2">
              <button type="submit" className="flex-1 bg-green-600 py-2 rounded font-bold">Save</button>
              <button type="button" onClick={() => setEditingMovie(null)} className="flex-1 bg-gray-700 py-2 rounded font-bold">Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}