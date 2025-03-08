import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { routes } from './routes';
import ModelInitializer from './components/ModelInitializer';

function App() {
  return (
    <>
      <ModelInitializer />
      <RouterProvider
        router={createBrowserRouter(routes)}
      >
      </RouterProvider>
    </>
  )
}

export default App; 