'use client';
import { useEffect, useState } from 'react';
import { database } from '../lib/firebase';
import { ref, onValue, remove, update } from 'firebase/database';

export default function MovieList() {
  const [movies, setMovies] = useState<any[]>([]);
  const [editingMovie, setEditingMovie] = useState<any | null>(null);
  const [playingVideo, setPlayingVideo] = useState<any | null>(null);

  useEffect(() => {
    const moviesRef = ref(database, 'movies');
    onValue(moviesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const movieList = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setMovies(movieList.reverse());
      } else {
        setMovies([]);
      }
    });
  }, []);

  const handleDelete = (id: string) => {
    if (confirm("Delete this movie?")) remove(ref(database, `movies/${id}`));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMovie) return;
    try {
      await update(ref(database, `movies/${editingMovie.id}`), editingMovie);
      setEditingMovie(null);
    } catch (err) { alert("Error saving changes"); }
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