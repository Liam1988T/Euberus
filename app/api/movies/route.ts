// app/api/movies/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Ensure this matches the exact URL from your Firebase console
    // Example: https://euberus-movies-default-rtdb.asia-southeast1.firebasedatabase.app
    const FIREBASE_URL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;
    
    if (!FIREBASE_URL) {
      throw new Error('Firebase URL is not defined in environment variables');
    }

    const response = await fetch(`${FIREBASE_URL}/movies.json`);
    
    if (!response.ok) {
      console.error('Firebase Fetch Error:', response.status, response.statusText);
      throw new Error(`Firebase responded with ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Proxy Error:', error);
    return NextResponse.json({ error: 'Failed to fetch from Firebase' }, { status: 500 });
  }
}