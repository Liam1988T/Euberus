'use client';
import { useState, ChangeEvent, FormEvent } from 'react';
import { supabase } from '../lib/supabase'; // Ensure this points to your Supabase client

export default function AddMovieForm({ onAdd }: { onAdd: () => void }) {
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState('');
  const [country, setCountry] = useState('');
  const [isAddingGenre, setIsAddingGenre] = useState(false);
  const [isAddingCountry, setIsAddingCountry] = useState(false);
  const [driveLink, setDriveLink] = useState('');
  
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState('');

  const [genres] = useState(['Action', 'Comedy', 'Horror', 'Drama']);
  const [countries] = useState(['USA', 'Japan', 'South Korea', 'Thailand']);
  const [mode, setMode] = useState<'url' | 'file'>('url');
  const [imageUrl, setImageUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      let finalImageUrl = imageUrl;

      // 1. Handle File Upload to Supabase Storage
      if (mode === 'file' && file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('movies')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('movies').getPublicUrl(fileName);
        finalImageUrl = data.publicUrl;
      }

      // 2. Save to Supabase Database
      // Ensure column names match your Table Editor exactly
      const { error } = await supabase.from('movies').insert([
  { 
    title, 
    genre, 
    country, 
    driveLink, 
    imageUrl: finalImageUrl, 
    description, 
    rating,
    created_at: new Date().toISOString() 
    // DO NOT include 'id' here
  }
]);
      if (error) throw error;

      alert('Upload Success!');
      // Reset Form
      setTitle(''); setGenre(''); setCountry(''); setDriveLink(''); setImageUrl(''); 
      setDescription(''); setRating(''); setFile(null);
      onAdd(); // This triggers the refresh in AdminPage
    } catch (err: any) { 
      console.error(err); 
      alert("Error saving data: " + err.message); 
    }
  };

  const inputClass = "w-full p-4 bg-gray-950/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 outline-none text-white transition-all placeholder-gray-500";

  return (
    <form onSubmit={handleSubmit} className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-2xl border border-gray-800 shadow-2xl backdrop-blur-md space-y-4 w-full max-w-lg mx-auto">
      <div className="flex flex-col items-center justify-center text-center mb-6">
        <h2 className="text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
          EUBERUS <span className="text-white">ADMIN</span>
        </h2>
        <div className="h-1 w-20 bg-gradient-to-r from-red-600 to-transparent mt-3 rounded-full"></div>
      </div>
      
      <input className={inputClass} placeholder="Movie Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      
      <div className="flex gap-2">
        {isAddingGenre ? (
          <input className={inputClass} placeholder="Custom Genre" value={genre} onChange={(e) => setGenre(e.target.value)} />
        ) : (
          <select className={inputClass} onChange={(e) => setGenre(e.target.value)} value={genre}>
            <option value="">Select Genre</option>
            {genres.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        )}
        <button type="button" className="px-4 bg-gray-800 hover:bg-gray-700 rounded-lg text-xs font-bold transition" onClick={() => setIsAddingGenre(!isAddingGenre)}>+</button>
      </div>

      <div className="flex gap-2">
        {isAddingCountry ? (
          <input className={inputClass} placeholder="Custom Country" value={country} onChange={(e) => setCountry(e.target.value)} />
        ) : (
          <select className={inputClass} onChange={(e) => setCountry(e.target.value)} value={country}>
            <option value="">Select Country</option>
            {countries.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        )}
        <button type="button" className="px-4 bg-gray-800 hover:bg-gray-700 rounded-lg text-xs font-bold transition" onClick={() => setIsAddingCountry(!isAddingCountry)}>+</button>
      </div>

      <textarea className={inputClass} placeholder="Movie Description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
      <input type="number" step="0.1" className={inputClass} placeholder="Rating (0.0 - 10.0)" value={rating} onChange={(e) => setRating(e.target.value)} />
      
      <div className="grid grid-cols-2 gap-2 p-1 bg-gray-950 rounded-lg border border-gray-800">
        <button type="button" className={`p-2 rounded-md font-bold transition ${mode === 'url' ? 'bg-red-600 text-white shadow-lg' : 'text-gray-500'}`} onClick={() => setMode('url')}>IMAGE URL</button>
        <button type="button" className={`p-2 rounded-md font-bold transition ${mode === 'file' ? 'bg-red-600 text-white shadow-lg' : 'text-gray-500'}`} onClick={() => setMode('file')}>UPLOAD</button>
      </div>

      {mode === 'url' ? (
        <input className={inputClass} placeholder="Enter Image URL" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
      ) : (
        <input type="file" className="w-full p-3 text-sm text-gray-400 bg-gray-950/50 border border-gray-700 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-red-600 file:text-white hover:file:bg-red-700" onChange={(e: ChangeEvent<HTMLInputElement>) => e.target.files && setFile(e.target.files[0])} />
      )}
      
      <input className={inputClass} placeholder="Google Drive Shared Link" value={driveLink} onChange={(e) => setDriveLink(e.target.value)} />
      
      <button type="submit" className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 py-4 rounded-lg font-black tracking-widest text-white shadow-[0_0_20px_rgba(220,38,38,0.4)] transition-all">
        PUBLISH CONTENT
      </button>
    </form>
  );
}