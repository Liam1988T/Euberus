'use client';
import { useState } from 'react';
import { supabase } from '../lib/supabase'; // Ensure the path is correct

export default function EditMovieForm({ movie, onClose, onRefresh }: { movie: any, onClose: () => void, onRefresh: () => void }) {
  const [formData, setFormData] = useState(movie);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    
    // Supabase update query
    const { error } = await supabase
      .from('movies')
      .update({
        title: formData.title,
        description: formData.description,
        rating: formData.rating,
        imageUrl: formData.imageUrl, // Added this as requested
        genre: formData.genre,       // Included to ensure fields aren't lost
        country: formData.country,
        driveLink: formData.driveLink
      })
      .eq('id', movie.id);

    if (error) {
      console.error("Error updating movie:", error);
      alert("Failed to update movie.");
    } else {
      onRefresh(); // Refresh the list in the parent component
      onClose();   // Close the modal
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 p-8 rounded-lg w-full max-w-lg space-y-4">
        <h2 className="text-xl font-bold text-white">Edit Movie</h2>
        
        <input 
          className="w-full p-2 bg-gray-800 text-white rounded"
          placeholder="Title"
          value={formData.title} 
          onChange={(e) => setFormData({...formData, title: e.target.value})} 
        />
        
        <textarea 
          className="w-full p-2 bg-gray-800 text-white rounded"
          placeholder="Description"
          value={formData.description} 
          onChange={(e) => setFormData({...formData, description: e.target.value})} 
        />
        
        <input 
          type="number"
          step="0.1"
          className="w-full p-2 bg-gray-800 text-white rounded"
          placeholder="Rating"
          value={formData.rating} 
          onChange={(e) => setFormData({...formData, rating: e.target.value})} 
        />

        <input 
          className="w-full p-2 bg-gray-800 text-white rounded"
          placeholder="Image URL"
          value={formData.imageUrl} 
          onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} 
        />

        <div className="flex gap-4">
          <button 
            onClick={handleSave} 
            disabled={loading}
            className="bg-red-600 px-4 py-2 rounded font-bold hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <button onClick={onClose} className="bg-gray-600 px-4 py-2 rounded">Cancel</button>
        </div>
      </div>
    </div>
  );
}