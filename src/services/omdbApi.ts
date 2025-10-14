import axios, { AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: `${API_BASE_URL}/tmdb`,
  headers: {
    accept: 'application/json',
  },
  timeout: 15000, // Reduced from 30000
});

const retryRequest = async <T>(
  request: () => Promise<T>,
  retries: number = 2, // Reduced from 3
  delay: number = 1000 // Reduced from 2000
): Promise<T> => {
  for (let i = 0; i < retries; i++) {
    try {
      return await request();
    } catch (error) {
      const isLastRetry = i === retries - 1;

      if (axios.isAxiosError(error)) {
        const shouldRetry =
          !error.response ||
          error.response.status >= 500 ||
          error.code === 'ECONNABORTED' ||
          error.code === 'ETIMEDOUT';

        if (!shouldRetry || isLastRetry) {
          throw error;
        }
      } else if (isLastRetry) {
        throw error;
      }

      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }
  throw new Error('Max retries exceeded');
};

export interface Movie {
  id: number;
  title: string;
  release_date: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  vote_average: number;
  genre_ids: number[];
}

export interface MovieListItem {
  imdbID: string;
  Title: string;
  Poster: string;
  Year: string;
  vote_average?: number;
}

export interface MovieDetails extends Movie {
  runtime: number;
  genres: { id: number; name: string }[];
  status: string;
  tagline: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface MovieDetailsWithCredits extends MovieDetails {
  cast: CastMember[];
}

// Helper function to ensure equal distribution
const distributeMoviesEqually = (
  hollywood: Movie[],
  bollywood: Movie[],
  tollywood: Movie[],
  countPerIndustry: number = 7
): Movie[] => {
  const mixedMovies: Movie[] = [];
  
  // Take exact count from each industry
  const hollywoodSlice = hollywood.slice(0, countPerIndustry);
  const bollywoodSlice = bollywood.slice(0, countPerIndustry);
  const tollywoodSlice = tollywood.slice(0, countPerIndustry);
  
  // Interleave movies for better distribution
  const maxLength = Math.max(
    hollywoodSlice.length,
    bollywoodSlice.length,
    tollywoodSlice.length
  );
  
  for (let i = 0; i < maxLength; i++) {
    if (i < hollywoodSlice.length) mixedMovies.push(hollywoodSlice[i]);
    if (i < bollywoodSlice.length) mixedMovies.push(bollywoodSlice[i]);
    if (i < tollywoodSlice.length) mixedMovies.push(tollywoodSlice[i]);
  }
  
  return mixedMovies;
};

export const getPopularMovies = async () => {
  try {
    const dateLimit = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    // Fetch all in parallel with Promise.allSettled for better error handling
    const [hollywood, bollywood, tollywood] = await Promise.allSettled([
      retryRequest(() =>
        api.get('/discover/movie', {
          params: {
            language: 'en-US',
            region: 'US',
            sort_by: 'popularity.desc',
            page: 1,
            'primary_release_date.gte': dateLimit,
          },
        })
      ),
      retryRequest(() =>
        api.get('/discover/movie', {
          params: {
            language: 'hi-IN',
            region: 'IN',
            with_original_language: 'hi',
            sort_by: 'popularity.desc',
            page: 1,
            'primary_release_date.gte': dateLimit,
          },
        })
      ),
      retryRequest(() =>
        api.get('/discover/movie', {
          params: {
            language: 'en-US',
            region: 'IN',
            with_original_language: 'te',
            sort_by: 'popularity.desc',
            page: 1,
            'primary_release_date.gte': dateLimit,
          },
        })
      ),
    ]);

    const hollywoodMovies = hollywood.status === 'fulfilled' ? hollywood.value.data.results : [];
    const bollywoodMovies = bollywood.status === 'fulfilled' ? bollywood.value.data.results : [];
    const tollywoodMovies = tollywood.status === 'fulfilled' ? tollywood.value.data.results : [];

    // Ensure equal ratio: 7 from each industry
    const mixedMovies = distributeMoviesEqually(
      hollywoodMovies,
      bollywoodMovies,
      tollywoodMovies,
      7
    );

    return { results: mixedMovies };
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    return { results: [] };
  }
};

export const getNowPlayingMovies = async (page: number = 1): Promise<MovieListItem[]> => {
  try {
    // Fetch all in parallel
    const [bollywood, tollywood, hollywood] = await Promise.allSettled([
      retryRequest(() =>
        api.get('/movie/now_playing', {
          params: {
            language: 'en-US',
            region: 'IN',
            with_original_language: 'hi',
            page,
          },
        })
      ),
      retryRequest(() =>
        api.get('/movie/now_playing', {
          params: {
            language: 'en-US',
            region: 'IN',
            with_original_language: 'te',
            page,
          },
        })
      ),
      retryRequest(() =>
        api.get('/movie/now_playing', {
          params: {
            language: 'en-US',
            region: 'US',
            with_original_language: 'en',
            page,
          },
        })
      ),
    ]);

    const bollywoodMovies = bollywood.status === 'fulfilled' ? bollywood.value.data.results : [];
    const tollywoodMovies = tollywood.status === 'fulfilled' ? tollywood.value.data.results : [];
    const hollywoodMovies = hollywood.status === 'fulfilled' ? hollywood.value.data.results : [];

    // Ensure equal distribution: 7 from each
    const mixedMovies = distributeMoviesEqually(
      hollywoodMovies,
      bollywoodMovies,
      tollywoodMovies,
      7
    );

    // Remove duplicates based on movie ID
    const uniqueMoviesMap = new Map<number, Movie>();
    mixedMovies.forEach((movie: Movie) => {
      if (!uniqueMoviesMap.has(movie.id)) {
        uniqueMoviesMap.set(movie.id, movie);
      }
    });

    const uniqueMovies = Array.from(uniqueMoviesMap.values());

    return uniqueMovies.map((movie: Movie) => ({
      imdbID: movie.id.toString(),
      Title: movie.title,
      Poster: movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : 'N/A',
      Year: movie.release_date ? movie.release_date.split('-')[0] : 'N/A',
      vote_average: movie.vote_average,
    }));
  } catch (error) {
    console.error('Error fetching now playing movies:', error);
    return [];
  }
};

export const getUpcomingMovies = async (page: number = 1) => {
  try {
    const response = await retryRequest(() =>
      api.get('/movie/upcoming', {
        params: {
          language: 'en-US',
          page,
        },
      })
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching upcoming movies:', error);
    return { results: [] };
  }
};

export const getMovieCredits = async (id: number) => {
  const response = await api.get(`/movie/${id}/credits`);
  return response.data;
};

export const searchMovies = async (query: string): Promise<MovieListItem[]> => {
  const response = await api.get('/search/movie', {
    params: {
      query,
      language: 'en-US',
    },
  });

  const movies = response.data.results || [];
  return movies.map((movie: Movie) => ({
    imdbID: movie.id.toString(),
    Title: movie.title,
    Poster: movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : 'N/A',
    Year: movie.release_date ? movie.release_date.split('-')[0] : 'N/A',
    vote_average: movie.vote_average,
  }));
};

export const getMovieById = async (id: number): Promise<MovieDetails> => {
  const response = await api.get(`/movie/${id}`, {
    params: {
      language: 'en-US',
    },
  });
  return response.data;
};

export const getMovieVideos = async (id: number) => {
  const response = await api.get(`/movie/${id}/videos`, {
    params: {
      language: 'en-US',
    },
  });
  return response.data;
};

export const getMovieDetailsWithCredits = async (id: number): Promise<MovieDetailsWithCredits> => {
  const [movieDetails, credits] = await Promise.all([
    getMovieById(id),
    getMovieCredits(id),
  ]);

  return {
    ...movieDetails,
    cast: credits.cast.slice(0, 20),
  };
};

export interface MovieReview {
  id: string;
  author: string;
  author_details: {
    name: string;
    username: string;
    avatar_path: string | null;
    rating: number | null;
  };
  content: string;
  created_at: string;
  updated_at: string;
}

export const getMovieReviews = async (id: number): Promise<MovieReview[]> => {
  const response = await api.get(`/movie/${id}/reviews`, {
    params: {
      language: 'en-US',
      page: 1,
    },
  });
  return response.data.results.slice(0, 6);
};

export const getSimilarMovies = async (id: number): Promise<Movie[]> => {
  const response = await api.get(`/movie/${id}/similar`, {
    params: {
      language: 'en-US',
      page: 1,
    },
  });
  return response.data.results.slice(0, 12);
};