'use client';
import { useState } from 'react';
import AddMovieForm from '@/components/AddMovieForm';
import MovieList from '@/components/MovieList';

export default function AdminPage() {
  const [refresh, setRefresh] = useState(false);
  // NEW: State for search and filter
  const [search, setSearch] = useState('');
  const [genreFilter, setGenreFilter] = useState('All Genres');

  return (
    <div className="space-y-8">
      {/* Search & Filter Bar (Placed here so it can control MovieList) */}
      <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 flex flex-col sm:flex-row gap-3">
        <input 
          type="text" 
          placeholder="Search movies..." 
          className="flex-1 bg-black border border-gray-800 p-3 rounded-lg text-white outline-none focus:border-red-600"
          onChange={(e) => setSearch(e.target.value)}
        />
        <select 
          className="bg-black border border-gray-800 p-3 rounded-lg text-white"
          onChange={(e) => setGenreFilter(e.target.value)}
        >
          <option>All Genres</option>
          <option>Action</option>
          <option>Horror</option>
          <option>Drama</option>
        </select>
      </div>

      <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
        <h1 className="text-xl font-bold mb-4">Add New Movie</h1>
        <AddMovieForm onAdd={() => setRefresh(!refresh)} />
      </div>

      <MovieList key={refresh ? 'a' : 'b'} searchQuery={search} genreFilter={genreFilter} />
    </div>
  );
}