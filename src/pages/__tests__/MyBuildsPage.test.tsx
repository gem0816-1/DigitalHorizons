import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { AuthProvider } from '@/hooks/useAuth';
import { MyBuildsPage } from '@/pages/MyBuildsPage';

describe('MyBuildsPage', () => {
  it('redirects unauthenticated user to login', async () => {
    render(
      <MemoryRouter initialEntries={['/my-builds']}>
        <AuthProvider>
          <Routes>
            <Route path="/my-builds" element={<MyBuildsPage />} />
            <Route path="/login" element={<div>Login Route</div>} />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    );

    expect(await screen.findByText('Login Route')).toBeInTheDocument();
  });
});
