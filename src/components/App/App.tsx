import ReactPaginateModule from 'react-paginate';
import type { ReactPaginateProps } from 'react-paginate';
import type { ComponentType } from 'react';
import type { Movie } from '../../types/movie';
import { fetchMovies } from '../../services/movieService';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieModal from '../MovieModal/MovieModal';
import css from './App.module.css';

type ModuleWithDefault<T> = {
  default: T;
};

const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<
    ComponentType<ReactPaginateProps>
  >
).default;

export function App() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  const {
    data,
    isLoading,
    isError,
    isSuccess,
    isFetching,
  } = useQuery({
      queryKey: ['movies', searchQuery, page],
      queryFn: () => fetchMovies(searchQuery, page),
      enabled: Boolean(searchQuery),
      placeholderData: keepPreviousData,
  });
  
  useEffect(() => {
    if (isSuccess && data.results.length === 0) {
      toast.error('No movies found');
    }
  }, [isSuccess, data]);

  const handleSearch = (value: string) => {
    setSelectedMovie(null);
    setSearchQuery(value);
    setPage(1);
  };


  return (
    <>
      <Toaster />
      <SearchBar onSubmit={handleSearch} />
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}


      {isLoading ? (
        <Loader />
      ) : isError ? (
        <ErrorMessage />
        ) : (
        <>
        { data && data.results.length > 0 && (
          <MovieGrid
            movies={data.results}
            onSelect={(movie) => setSelectedMovie(movie)}
          />
        )}
        
        {isFetching && <p>Updating results...</p>}
        
        {data && data.total_pages > 1 && (
          <ReactPaginate
            pageCount={data.total_pages}
            pageRangeDisplayed={5}
            marginPagesDisplayed={1}
            onPageChange={({ selected }) => setPage(selected + 1)}
            forcePage={page - 1}
            containerClassName={css.pagination}
            activeClassName={css.active}
            nextLabel="→"
            previousLabel="←"
          />
        )}
        </>
      )}
    </>
  );
}

export default App;