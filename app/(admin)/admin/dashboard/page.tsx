'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function AdminDashboard() {
  const [views, setViews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const COLORS = ['#dc2626', '#b91c1c', '#991b1b', '#7f1d1d'];

  useEffect(() => {
    const fetchViews = async () => {
      const { data, error } = await supabase
        .from('movie_views')
        .select('movie_id, view_count');

      if (error) {
        console.error("Error fetching views:", error);
      } else {
        setViews(data || []);
      }
      setLoading(false);
    };

    fetchViews();
  }, []);

  if (loading) return <div className="p-8 text-white">Loading Admin Data...</div>;

  return (
    <div className="p-8 bg-black text-white min-h-screen space-y-10">
      <h1 className="text-3xl font-bold mb-6">Admin: Movie View Counts</h1>

      {/* Charts Section */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
          <h2 className="text-lg font-semibold mb-4">View Trends</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={views}>
                <XAxis dataKey="movie_id" hide />
                <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333' }} />
                <Bar dataKey="view_count" fill="#dc2626" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
          <h2 className="text-lg font-semibold mb-4">Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={views} dataKey="view_count" nameKey="movie_id" cx="50%" cy="50%" outerRadius={80}>
                  {views.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Existing Data Table */}
      <table className="w-full text-left border-collapse bg-gray-900 rounded-lg overflow-hidden">
        <thead>
          <tr className="border-b border-gray-800">
            <th className="p-4">Movie ID</th>
            <th className="p-4">Views</th>
          </tr>
        </thead>
        <tbody>
          {views.map((row) => (
            <tr key={row.movie_id} className="border-b border-gray-800 hover:bg-gray-800 transition">
              <td className="p-4 font-mono">{row.movie_id}</td>
              <td className="p-4 font-bold text-red-500">{row.view_count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}