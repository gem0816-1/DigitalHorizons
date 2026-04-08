import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { DashboardPage } from '@/pages/DashboardPage';

describe('DashboardPage hardware section', () => {
  it('renders hardware overview title and category cards', () => {
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    expect(screen.getByText('PC 硬件价值总览')).toBeInTheDocument();
    expect(screen.getByText('CPU')).toBeInTheDocument();
    expect(screen.getByText('GPU')).toBeInTheDocument();
  });

  it('renders additional charts for hardware analytics', () => {
    const { container } = render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );

    expect(container.querySelectorAll('.echarts-for-react').length).toBeGreaterThanOrEqual(6);
  });
});

