import axios from 'axios';
import type { TMDBResponse } from '../types/movie';

export async function searchMovies(
  query: string,
  page: number = 1
): Promise<TMDBResponse> {
  const token = import.meta.env.VITE_TMDB_API_KEY;

  const response = await axios.get<TMDBResponse>(
    'https://api.themoviedb.org/3/search/movie',
    {
      params: {
        query,
        page,
      },
      headers: {
        Authorization: `Bearer ${token}`,
        accept: 'application/json',
      },
    }
  );

  return response.data;
}