import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { SocDetailPage } from '@/pages/SocDetailPage';

describe('SocDetailPage', () => {
  it('renders detail page for valid SoC id', () => {
    render(
      <MemoryRouter initialEntries={['/soc/snapdragon-8-elite-gen-5']}>
        <Routes>
          <Route path="/soc/:id" element={<SocDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Snapdragon 8 Elite Gen 5')).toBeInTheDocument();
    expect(screen.getByText('搭载设备')).toBeInTheDocument();
  });

  it('shows not found for invalid id', () => {
    render(
      <MemoryRouter initialEntries={['/soc/not-exist']}>
        <Routes>
          <Route path="/soc/:id" element={<SocDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('未找到 SoC')).toBeInTheDocument();
  });
});


