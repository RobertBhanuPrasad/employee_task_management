import React from 'react';
import AppRoutes from './routes';
import { Provider } from 'react-redux';
import { store } from './store';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme({});

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppRoutes />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
