import { act, fireEvent, render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AuthProvider } from '@/hooks/useAuth';
import { MainLayout } from '@/layouts/MainLayout';

function renderLayout(path = '/') {
  const router = createMemoryRouter(
    [
      {
        path: '/',
        element: <MainLayout />,
        children: [{ index: true, element: <div>Dashboard</div> }],
      },
    ],
    { initialEntries: [path] }
  );
  render(
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

describe('MainLayout', () => {
  beforeEach(() => {
    window.localStorage.removeItem('theme');
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.classList.remove('dark', 'theme-animating');
    vi.unstubAllGlobals();
  });

  it('renders theme toggle controls for desktop and mobile headers', () => {
    renderLayout();
    const toggleButtons = screen.getAllByRole('button', { name: '切换亮暗主题' });
    expect(toggleButtons).toHaveLength(2);
    expect(screen.getAllByText('深色')).toHaveLength(2);
    expect(screen.getByRole('button', { name: '打开导航菜单' })).toBeInTheDocument();
  });

  it('toggles sidebar drawer from the hamburger and overlay buttons', () => {
    renderLayout();
    const sidebar = document.getElementById('primary-sidebar');
    expect(sidebar).toBeTruthy();
    expect(sidebar).not.toHaveClass('app-sidebar--open');

    const menuToggleButton = screen.getByRole('button', { name: '打开导航菜单' });
    fireEvent.click(menuToggleButton);

    expect(sidebar).toHaveClass('app-sidebar--open');
    expect(menuToggleButton).toHaveAttribute('aria-expanded', 'true');

    const overlayCloseButton = screen.getByRole('button', { name: '点击关闭导航菜单' });
    fireEvent.click(overlayCloseButton);

    expect(sidebar).not.toHaveClass('app-sidebar--open');
    expect(screen.getByRole('button', { name: '打开导航菜单' })).toHaveAttribute('aria-expanded', 'false');
  });

  it('uses system preference when no explicit theme is stored', () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockImplementation((query: string) => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }))
    );

    renderLayout();

    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('contains navigation links', () => {
    renderLayout();
    expect(screen.getByText('芯片详细信息')).toBeInTheDocument();
    expect(screen.getByText('芯片对比')).toBeInTheDocument();
    expect(screen.getByText('装机助手')).toBeInTheDocument();
  });

  it('sets ripple origin and radius from the toggle button and clears animation class', () => {
    vi.useFakeTimers();

    try {
      renderLayout();
      const themeToggle = document.querySelector('aside .theme-toggle');
      expect(themeToggle).toBeTruthy();

      fireEvent.click(themeToggle as HTMLButtonElement);

      const root = document.documentElement;
      const originX = root.style.getPropertyValue('--theme-origin-x');
      const originY = root.style.getPropertyValue('--theme-origin-y');
      const rippleRadius = root.style.getPropertyValue('--theme-ripple-radius');

      expect(originX.endsWith('px')).toBe(true);
      expect(originY.endsWith('px')).toBe(true);
      expect(rippleRadius.endsWith('px')).toBe(true);
      expect(Number.parseFloat(rippleRadius)).toBeGreaterThan(0);
      expect(root.classList.contains('theme-animating')).toBe(true);
      expect(root.classList.contains('dark')).toBe(true);
      expect(screen.getAllByText('浅色')).toHaveLength(2);

      act(() => {
        vi.advanceTimersByTime(820);
      });
      expect(root.classList.contains('theme-animating')).toBe(false);
    } finally {
      vi.useRealTimers();
    }
  });
});
