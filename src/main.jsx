import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

import { RouterProvider } from "react-router-dom";
import router from './Routes/router';

import AuthProvider from './providers/AuthProvider';
import CartProvider from './providers/CartProvider';
import { HelmetProvider } from 'react-helmet-async';

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <HelmetProvider>
            <div className='max-w-screen-xl mx-auto'>
              <RouterProvider router={router} />
            </div>
          </HelmetProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);