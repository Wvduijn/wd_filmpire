import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  ListItemButton,
  ListItemIcon,
  Box,
  CircularProgress
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/styles';

// services
import { useGetGenresQuery } from '../../services/TMDB';

// icons
import genreIcons from '../../assets/genres';

// styling
import useStyles from './styles';

// reducers
import { selectGenreOrCategory } from '../../features/currentGenreOrCategory';

const categories = [
  { label: 'Popular', value: 'popular' },
  { label: 'Top Rated', value: 'top_rated' },
  { label: 'Upcoming', value: 'upcoming' }
];

const SideBar = ({ setMobileOpen }) => {
  const { genreIdOrCategoryName } = useSelector((state) => state.currentGenreOrCategory);
  const { data, isFetching } = useGetGenresQuery();
  const theme = useTheme();
  const classes = useStyles();
  const dispatch = useDispatch();
  // logo
  const redLogo = 'https://fontmeme.com/permalink/210930/8531c658a743debe1e1aa1a2fc82006e.png';
  const blueLogo = 'https://fontmeme.com/permalink/210930/6854ae5c7f76597cf8680e48a2c8a50a.png';

  if (isFetching) {
    return (
      <Box display='flex' justifyContent='center'>
        <CircularProgress size='4rem' />
      </Box>
    );
  }

  // useEffect(() => {
  //   setMobileOpen(false);
  // }, [genreIdOrCategoryName]);

  return (
    <>
      <Link to='/' className={classes.imageLink}>
        <img
          className={classes.image}
          src={theme.palette.mode === 'light' ? redLogo : blueLogo}
          alt='Filmpire Logo'
        />
      </Link>
      <Divider />
      <List>
        <ListSubheader>Categories</ListSubheader>
        {categories.map(({ label, value }) => (
          <Link key={value} className={classes.links} to='/'>
            <ListItem onClick={() => dispatch(selectGenreOrCategory(value))} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <img
                    src={genreIcons[label.toLowerCase()]}
                    alt={label}
                    className={classes.genreImage}
                    height={30}
                  />
                </ListItemIcon>
                <ListItemText primary={label} />
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
      </List>
      <Divider />
      <List>
        <ListSubheader>Genres</ListSubheader>
        {isFetching ? (
          <Box display='flex' justifyContent='center'>
            <CircularProgress />
          </Box>
        ) : (
          data.genres.map(({ name, id }) => (
            <Link key={id} className={classes.links} to='/'>
              <ListItem onClick={() => dispatch(selectGenreOrCategory(id))} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <img
                      src={genreIcons[name.toLowerCase()]}
                      alt={name}
                      className={classes.genreImage}
                      height={30}
                    />
                  </ListItemIcon>
                  <ListItemText primary={name} />
                </ListItemButton>
              </ListItem>
            </Link>
          ))
        )}
      </List>
    </>
  );
};

export default SideBar;
