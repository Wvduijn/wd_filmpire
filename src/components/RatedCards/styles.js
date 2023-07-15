import { makeStyles } from '@mui/styles';

export default makeStyles((theme) => ({
  container: {
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      justifyContent: 'center',
      width: '100%'
    }
  }
}));
