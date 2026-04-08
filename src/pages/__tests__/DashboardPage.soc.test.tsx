import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { DashboardPage } from '@/pages/DashboardPage';

describe('DashboardPage SoC section', () => {
  it('renders SoC section title and metric cards', () => {
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );
    expect(screen.getByText('移动 SoC 性能梯队')).toBeInTheDocument();
    expect(screen.getByText('收录SOC数量')).toBeInTheDocument();
    expect(screen.getByText('最强CPU')).toBeInTheDocument();
    expect(screen.getByText('性能与能效关系图')).toBeInTheDocument();
  });

  it('renders chart containers', () => {
    const { container } = render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );
    expect(container.querySelectorAll('.echarts-for-react').length).toBeGreaterThanOrEqual(3);
  });
});
