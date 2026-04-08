import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';

import './index.css';
import { AuthProvider } from '@/hooks/useAuth';
import { MainLayout } from '@/layouts/MainLayout';
import { BuilderPage } from '@/pages/BuilderPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { LoginPage } from '@/pages/LoginPage';
import { MyBuildsPage } from '@/pages/MyBuildsPage';
import { SocComparePage } from '@/pages/SocComparePage';
import { SocDetailPage } from '@/pages/SocDetailPage';
import { SocListPage } from '@/pages/SocListPage';
import { applyTheme, resolveTheme } from '@/lib/theme';

applyTheme(resolveTheme());

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'soc', element: <SocListPage /> },
      { path: 'soc/compare', element: <SocComparePage /> },
      { path: 'soc/:id', element: <SocDetailPage /> },
      { path: 'builder', element: <BuilderPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'my-builds', element: <MyBuildsPage /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root container #root was not found.');
}

createRoot(rootElement).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
