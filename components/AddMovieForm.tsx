'use client';
import { useState, FormEvent } from 'react'; // Added FormEvent
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function AddMovieForm() {
  const [title, setTitle] = useState('');

  // Added : FormEvent to 'e' to fix the TypeScript error
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'movies'), {
        title: title,
        createdAt: new Date(),
      });
      setTitle('');
      alert('Movie added successfully!');
    } catch (error) {
      console.error('Error adding movie: ', error);
      alert('Error adding movie - check console');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border border-gray-300 rounded mt-5">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter movie title"
        className="border p-2 text-black rounded"
        required
      />
      <button type="submit" className="ml-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Add Movie
      </button>
    </form>
  );
}