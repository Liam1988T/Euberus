// components/EditMovieForm.tsx
'use client';
import { useState } from 'react';
import { ref, update } from 'firebase/database';
import { database } from '../lib/firebase';

export default function EditMovieForm({ movie, onClose }: { movie: any, onClose: () => void }) {
  const [formData, setFormData] = useState(movie);

  const handleSave = async () => {
    await update(ref(database, `movies/${movie.id}`), formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 p-8 rounded-lg w-full max-w-lg space-y-4">
        <h2 className="text-xl font-bold text-white">Edit Movie</h2>
        <input 
          className="w-full p-2 bg-gray-800 text-white rounded"
          value={formData.title} 
          onChange={(e) => setFormData({...formData, title: e.target.value})} 
        />
        <textarea 
          className="w-full p-2 bg-gray-800 text-white rounded"
          value={formData.description} 
          onChange={(e) => setFormData({...formData, description: e.target.value})} 
        />
        <input 
          type="number"
          className="w-full p-2 bg-gray-800 text-white rounded"
          value={formData.rating} 
          onChange={(e) => setFormData({...formData, rating: e.target.value})} 
        />
        {/* Add Image URL input here similarly */}
        <div className="flex gap-4">
          <button onClick={handleSave} className="bg-red-600 px-4 py-2 rounded">Save</button>
          <button onClick={onClose} className="bg-gray-600 px-4 py-2 rounded">Cancel</button>
        </div>
      </div>
    </div>
  );
}