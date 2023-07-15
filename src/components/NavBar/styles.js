import { makeStyles } from '@mui/styles';

const drawerWidth = '240px';

export default makeStyles((theme) => ({
  toolbar: {
    height: '80px',
    display: 'flex',
    justifyContent: 'space-between',
    marginLeft: '240px',
    [theme.breakpoints.down('md')]: {
      marginLeft: 0,
      flexWrap: 'wrap'
    }
  },
  menuButton: {
    marginRight: theme.spacing(2),
    // only show on mobile devices
    [theme.breakpoints.up('sm')]: {
      display: 'none'
    }
  },
  drawer: {
    [theme.breakpoints.up('md')]: {
      width: drawerWidth,
      flexShrink: 0
    }
  },
  drawerPaper: {
    width: drawerWidth
  },
  linkButton: {
    '&:hover': {
      color: 'white !important',
      textDecoration: 'none'
    }
  }
}));
