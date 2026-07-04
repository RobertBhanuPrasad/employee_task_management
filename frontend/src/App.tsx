import React from 'react';
import AppRoutes from './routes';
import { Provider } from 'react-redux';
import { store } from './store';
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from './styles/theme';

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
