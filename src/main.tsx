import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import '@mantine/core/styles.css';
import { MantineProvider, createTheme } from '@mantine/core';
import { light_blue, light_yellow, shading } from './constants/Color.ts';

//TODO: Setup main theme here with different colors
const theme = createTheme({
  primaryColor: 'light-blue',
  colors: {
    'light-blue': light_blue, 
    'light-yellow': light_yellow, 
    'shading': shading
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider theme={theme}>
      <App />
    </MantineProvider>
  </React.StrictMode>
)
