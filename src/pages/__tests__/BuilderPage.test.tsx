import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { AuthProvider } from '@/hooks/useAuth';
import { BuilderPage } from '@/pages/BuilderPage';

function renderBuilder() {
  render(
    <MemoryRouter>
      <AuthProvider>
        <BuilderPage />
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('BuilderPage', () => {
  it('switches category tabs and renders products', () => {
    renderBuilder();
    fireEvent.click(screen.getByRole('button', { name: /切换到GPU/i }));
    expect(screen.getByText('Radeon RX 7800 XT')).toBeInTheDocument();
  });

  it('selects item and reflects selected state', () => {
    renderBuilder();
    const selectButtons = screen.getAllByRole('button', { name: '选择' });
    fireEvent.click(selectButtons[0]!);
    expect(screen.getByRole('button', { name: '已选择' })).toBeInTheDocument();
  });
});
