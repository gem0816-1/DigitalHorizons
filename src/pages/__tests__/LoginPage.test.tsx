import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { AuthProvider } from '@/hooks/useAuth';
import { LoginPage } from '@/pages/LoginPage';

function renderLogin() {
  render(
    <MemoryRouter>
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('LoginPage', () => {
  it('switches between login and register tabs', () => {
    renderLogin();
    fireEvent.click(screen.getByRole('button', { name: 'Register' }));
    expect(screen.getByText('Create account')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));
    expect(screen.getByText('Sign in')).toBeInTheDocument();
  });

  it('shows validation errors when inputs are invalid', () => {
    renderLogin();
    const signInButtons = screen.getAllByRole('button', { name: 'Sign In' });
    fireEvent.click(signInButtons[1]!);
    expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument();
  });
});
