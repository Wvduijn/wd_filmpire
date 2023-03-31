import React, { useState, useEffect } from 'react';
import {
  Box,
  CircularProgress,
  useMediaQuery,
  Typography
} from '@mui/material';
import { useSelector } from 'react-redux';
// services
import { useGetMoviesQuery } from '../../services/TMDB';
// components
import MovieList from '../MovieList/MovieList';

import { selectGenreOrCategory } from '../../features/currentGenreOrCategory';

const Movies = () => {
  const [page, setPage] = useState(1);
  const { genreIdOrCategoryName } = useSelector(
    (state) => state.currentGenreOrCategory
  );
  console.log('PAGE', page);
  console.log('GENREID', genreIdOrCategoryName);
  const { data, isFetching, error } = useGetMoviesQuery({
    genreIdOrCategoryName,
    page
  });

  if (isFetching) {
    return (
      <Box display='flex' justifyContent='center'>
        <CircularProgress size='4rem' />
      </Box>
    );
  }
  if (!data.results.length) {
    return (
      <Box display='flex' alignItems='center' mt='20px'>
        <Typography variant='h4'>
          No movies that match that name.
          <br /> Please search for something else.
        </Typography>
      </Box>
    );
  }

  if (error) return 'An error has occured';
  return <MovieList movies={data} />;
};

export default Movies;
