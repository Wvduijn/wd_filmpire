import React, { useState, useEffect } from 'react';
import {
  Typography,
  Modal,
  Button,
  ButtonGroup,
  Grid,
  Box,
  CircularProgress,
  useMediaQuery,
  Rating
} from '@mui/material';
import {
  Movie as MovieIcon,
  Theaters,
  Language,
  PlusOne,
  Favorite,
  FavoriteBorderOutlined,
  Remove,
  ArrowBack,
  FavoriteOutlined
} from '@mui/icons-material';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
// reducers
import { selectGenreOrCategory } from '../../features/currentGenreOrCategory';
import {
  useGetListQuery,
  useGetMovieQuery,
  useGetRecommendationQuery
} from '../../services/TMDB';

import useStyles from './styles';
import MovieList from '../MovieList/MovieList';
import { userSelector } from '../../features/auth';

// icons
import genreIcons from '../../assets/genres';

const MovieInformation = () => {
  const { user } = useSelector(userSelector);
  console.log('USER', user);
  const { id } = useParams();
  const [isMovieFavorited, setIsMovieFavorited] = useState(false);
  const [isMovieWatchlisted, setIsMovieWatchlisted] = useState(false);
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const dispatch = useDispatch();

  const { data, isFetching, error } = useGetMovieQuery(id);
  const { data: favoriteMovies } = useGetListQuery({ listName: 'favorite/movies', accountId: user.id, sessionId: localStorage.getItem('session_id'), page: 1 });
  const { data: watchListMovies } = useGetListQuery({ listName: 'watchlist/movies', accountId: user.id, sessionId: localStorage.getItem('session_id'), page: 1 });
  const { data: recommendations, isFetching: isRecommendationsFetching } = useGetRecommendationQuery({ list: '/recommendations', movieId: id });

  useEffect(() => {
    setIsMovieFavorited(!!favoriteMovies?.results?.find((movie) => movie?.id === data?.id));
  }, [favoriteMovies, data]);

  useEffect(() => {
    setIsMovieFavorited(!!watchListMovies?.results?.find((movie) => movie?.id === data?.id));
  }, [watchListMovies, data]);

  if (isRecommendationsFetching || isFetching) {
    return (
      <Box display='flex' justifyContent='center'>
        <CircularProgress size='8rem' />
      </Box>
    );
  }
  if (error) {
    return (
      <Box display='flex' justifyContent='center'>
        <Link to='/'>Oops.. something has gone wrong - Go back</Link>
      </Box>
    );
  }

  const addToFavorites = async () => {
    await axios.post(
      `https://api.themoviedb.org/3/account/${user.id}/favorite?api_key=${
        process.env.REACT_APP_TMDB_KEY
      }&session_id=${localStorage.getItem('session_id')}`,
      { media_type: 'movie', media_id: id, favorite: !isMovieFavorited }
    );

    setIsMovieFavorited((prev) => !prev);
  };

  const addToWatchlist = async () => {
    await axios.post(
      `https://api.themoviedb.org/3/account/${user.id}/watchlist?api_key=${
        process.env.REACT_APP_TMDB_KEY
      }&session_id=${localStorage.getItem('session_id')}`,
      { media_type: 'movie', media_id: id, watchlist: !isMovieWatchlisted }
    );

    setIsMovieWatchlisted((prev) => !prev);
  };
  return (
    <Grid container className={classes.containerSpaceAround}>
      <Grid
        item
        sm={12}
        lg={4}
        padding={3}
        style={{ display: 'flex', marginBottom: '30px' }}
      >
        <img
          className={classes.poster}
          src={`https://image.tmdb.org/t/p/w500/${data?.poster_path}`}
          alt={data?.title}
        />
      </Grid>
      <Grid item container direction='column' lg={7}>
        <Typography variant='h3' alignItems='center' gutterBottom>
          {data?.title} ({data.release_date.split('-')[0]})
        </Typography>
        <Typography variant='h5' alignItems='center' gutterBottom>
          {data?.title} ({data.tagline})
        </Typography>
        <Grid item className={classes.containerSpaceAround}>
          <Box display='flex' align='center'>
            <Rating readOnly value={data.vote_average / 2} />
            <Typography
              variant='subtitle1'
              gutterBottom
              style={{ marginLeft: '10px' }}
            >
              {data?.vote_average} / 10
            </Typography>
          </Box>
          <Typography variant='h6' align='center' gutterBottom>
            {data?.runtime}min{' '}
            {data?.spoken_languages.length > 0
              ? `| Language: ${data?.spoken_languages[0]?.english_name}`
              : ''}
          </Typography>
        </Grid>
        <Grid item className={classes.genresContainer}>
          {data?.genres?.map((genre, i) => (
            <Link
              component='button'
              key={i}
              className={classes.link}
              to='/'
              onClick={() => dispatch(selectGenreOrCategory(genre.id))}
              style={{ textDecoration: 'none' }}
            >
              <img
                src={genreIcons[genre.name.toLowerCase()]}
                alt={genre.name}
                className={classes.genreImage}
                height={30}
              />
              <Typography color='textPrimary' variant='subtitle1'>
                {genre?.name}
              </Typography>
            </Link>
          ))}
        </Grid>
        <Typography variant='h5' gutterBottom style={{ marginTop: '10px' }}>
          Overview
        </Typography>
        <Typography style={{ marginBottom: '2rem' }}>
          {data?.overview}
        </Typography>
      </Grid>
      <Grid item container className={classes.genresContainer}>
        <Grid container className={classes.genresContainer}>
          <Typography variant='h5' gutterBottom>
            Top Cast
          </Typography>
        </Grid>

        {data
          && data.credits.cast
            .map(
              (character, i) => character.profile_path && (
              <Grid
                item
                key={i}
                lg={2}
                md={4}
                xs={6}
                component={Link}
                to={`/actors/${character.id}`}
                style={{
                  textDecoration: 'none',
                  width: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'column'
                }}
              >
                <img
                  className={classes.castImage}
                  src={`https://image.tmdb.org/t/p/w500/${character.profile_path}`}
                  alt={character.name}
                />
                <Typography color='textPrimary'>
                  {character?.name}
                </Typography>
                <Typography color='textSecondary'>
                  {character?.character.split('/')[0]}
                </Typography>
              </Grid>
              )
            )
            .slice(0, 6)}
      </Grid>
      <Grid
        item
        container
        style={{ marginTop: '2rem' }}
        className={classes.genresContainer}
      >
        <div className={classes.buttonsContainer}>
          <Grid item xs={12} sm={6} className={classes.buttonsContainer}>
            <ButtonGroup size='medium' variant='outlined'>
              <Button
                target='_blank'
                rel='noopener norefferer'
                href={data?.homepage}
                endIcon={<Language />}
              >
                Website
              </Button>
              <Button
                target='_blank'
                rel='noopener norefferer'
                href={`https://www.imdb.com/title/${data?.imdb_id}`}
                endIcon={<MovieIcon />}
              >
                IMDB
              </Button>
              <Button
                onClick={() => setOpen(true)}
                href='#'
                endIcon={<Theaters />}
              >
                Trailer
              </Button>
            </ButtonGroup>
          </Grid>
          <Grid item xs={12} sm={6} className={classes.buttonsContainer}>
            <ButtonGroup size='medium' variant='outlined'>
              <Button
                onClick={addToFavorites}
                href='#'
                endIcon={isMovieFavorited ? <FavoriteBorderOutlined /> : <Favorite />}
              >
                {isMovieFavorited ? 'Unfavorite' : 'Favorite'}
              </Button>
              <Button
                onClick={addToWatchlist}
                href='#'
                endIcon={isMovieWatchlisted ? <Remove /> : <PlusOne />}
              >
                {isMovieWatchlisted ? 'Unwatch' : 'Watch'}
              </Button>
              <Button
                endIcon={<ArrowBack />}
                sx={{ borderColor: 'primary.main' }}
              >
                <Typography
                  component={Link}
                  to='/'
                  variant='subtitle2'
                  style={{ textDecoration: 'none' }}
                  sx={{ color: '#1976D2 !important' }}
                >
                  Back
                </Typography>
              </Button>
            </ButtonGroup>
          </Grid>
        </div>
      </Grid>
      <Box marginTop='5rem' width='100%'>
        <Typography variant='h3' gutterBottom align='center'>
          You might also like:
        </Typography>
        {recommendations && recommendations.results.length ? (
          <MovieList movies={recommendations} numberOfMovies={12} />
        ) : (
          <Box>Sorry nothing was found...</Box>
        )}
      </Box>
      <Modal
        closeAfterTransition
        className={classes.modal}
        open={open}
        onClose={() => setOpen(false)}
      >
        {data?.videos?.results?.length > 0 && (
          <iframe
            autoPlay
            title='Trailer'
            className={classes.video}
            src={`https://www.youtube.com/embed/${data.videos.results[0].key}`}
            allow='autoplay'
          />
        )}
      </Modal>
    </Grid>
  );
};

export default MovieInformation;
