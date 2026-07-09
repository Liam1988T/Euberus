'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function ModalSettingsPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isActive, setIsActive] = useState(true);

  const saveModal = async () => {
    const { error } = await supabase
      .from('modal_settings')
      .upsert({ id: 1, title, content, image_url: imageUrl, is_active: isActive });
    
    if (error) alert('Error saving: ' + error.message);
    else alert('Modal updated successfully!');
  };

  return (
    <div className="p-10 text-white min-h-screen bg-black">
      <h1 className="text-2xl font-bold mb-6">Manage Landing Modal</h1>
      <input className="block w-full p-2 mb-4 bg-gray-800 rounded" placeholder="Title" onChange={e => setTitle(e.target.value)} />
      <textarea className="block w-full p-2 mb-4 bg-gray-800 rounded" placeholder="Content" onChange={e => setContent(e.target.value)} />
      <input className="block w-full p-2 mb-4 bg-gray-800 rounded" placeholder="Image URL (optional)" onChange={e => setImageUrl(e.target.value)} />
      <label className="flex items-center gap-2 mb-6 cursor-pointer">
        <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} />
        Active
      </label>
      <button onClick={saveModal} className="bg-red-600 px-6 py-2 rounded font-bold hover:bg-red-700">Save Modal</button>
    </div>
  );
}