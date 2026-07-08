// app/(admin)/admin/page.tsx
'use client';
import { useState } from 'react';
// These imports look in the 'components' folder, which is outside 'app'
import AddMovieForm from '@/components/AddMovieForm';
import MovieList from '@/components/MovieList';

export default function AdminPage() {
  const [refresh, setRefresh] = useState(false);
  return (
    <main className="min-h-screen bg-black text-white p-10">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <AddMovieForm onAdd={() => setRefresh(!refresh)} />
      <MovieList key={refresh ? 'a' : 'b'} />
    </main>
  );
}