import { useEffect, useRef, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

import { HamburgerButton } from '@/components/HamburgerButton';
import { SideMenu } from '@/components/SideMenu';
import { applyTheme, persistTheme, resolveTheme, type ThemeMode } from '@/lib/theme';

export function MainLayout() {
  const location = useLocation();
  const themeTransitionDuration = 820;
  const [theme, setTheme] = useState<ThemeMode>(() => resolveTheme());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const desktopToggleRef = useRef<HTMLButtonElement | null>(null);
  const themeCleanupTimeoutRef = useRef<number | null>(null);
  const pendingThemeRef = useRef<ThemeMode | null>(null);
  const sidebarId = 'primary-sidebar';

  useEffect(() => {
    applyTheme(theme);
    persistTheme(theme);
    pendingThemeRef.current = null;
  }, [theme]);

  useEffect(() => {
    return () => {
      if (themeCleanupTimeoutRef.current !== null) {
        window.clearTimeout(themeCleanupTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isSidebarOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSidebarOpen(false);
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isSidebarOpen]);

  const runThemeTransition = (nextTheme: ThemeMode, source: HTMLButtonElement | null) => {
    const root = document.documentElement;
    const rect = source?.getBoundingClientRect();
    const x = rect ? rect.left + rect.width / 2 : window.innerWidth - 48;
    const y = rect ? rect.top + rect.height / 2 : 48;
    const maxX = Math.max(x, window.innerWidth - x);
    const maxY = Math.max(y, window.innerHeight - y);
    const rippleRadius = Math.hypot(maxX, maxY) + 64;
    const transitionOverlay = nextTheme === 'dark' ? 'rgba(13, 18, 26, 0.98)' : 'rgba(245, 248, 253, 0.96)';
    const transitionGlow = nextTheme === 'dark' ? 'rgba(41, 151, 255, 0.18)' : 'rgba(108, 173, 255, 0.18)';

    if (themeCleanupTimeoutRef.current !== null) {
      window.clearTimeout(themeCleanupTimeoutRef.current);
      themeCleanupTimeoutRef.current = null;
    }

    root.style.setProperty('--theme-origin-x', `${x}px`);
    root.style.setProperty('--theme-origin-y', `${y}px`);
    root.style.setProperty('--theme-ripple-radius', `${rippleRadius}px`);
    root.style.setProperty('--theme-transition-overlay', transitionOverlay);
    root.style.setProperty('--theme-transition-glow', transitionGlow);
    root.classList.remove('theme-animating');

    void root.offsetWidth;
    root.classList.add('theme-animating');
    pendingThemeRef.current = nextTheme;
    setTheme(nextTheme);

    themeCleanupTimeoutRef.current = window.setTimeout(() => {
      root.classList.remove('theme-animating');
      themeCleanupTimeoutRef.current = null;
    }, themeTransitionDuration);
  };

  const handleThemeToggle = (source: HTMLButtonElement | null) => {
    const baseTheme = pendingThemeRef.current ?? theme;
    runThemeTransition(baseTheme === 'light' ? 'dark' : 'light', source);
  };

  const activeTheme = pendingThemeRef.current ?? theme;
  const themeToggleLabel = activeTheme === 'light' ? '深色' : '浅色';
  const themeToggleTitle = `切换到${themeToggleLabel}模式`;
  const isDarkThemeActive = activeTheme === 'dark';

  return (
    <div className={`page-shell app-shell ${isSidebarOpen ? 'app-shell--menu-open' : ''}`.trim()}>
      <aside id={sidebarId} className={`app-sidebar ${isSidebarOpen ? 'app-sidebar--open' : ''}`.trim()}>
        <div className="app-sidebar__header">
          <Link to="/" className="app-brand app-brand--with-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="app-brand__icon size-6"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m6.75 7.5 3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0 0 21 18V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v12a2.25 2.25 0 0 0 2.25 2.25Z"
              />
            </svg>
            <span>数码视界</span>
          </Link>
          <button
            ref={desktopToggleRef}
            type="button"
            aria-label="切换亮暗主题"
            aria-pressed={isDarkThemeActive}
            title={themeToggleTitle}
            onClick={() => handleThemeToggle(desktopToggleRef.current)}
            className="theme-toggle"
          >
            <span className="theme-toggle__track">
              <span className="theme-toggle__thumb" />
            </span>
            <span className="theme-toggle__label hidden sm:inline">{themeToggleLabel}</span>
          </button>
        </div>
        <SideMenu />
      </aside>

      <div className="app-content">
        <header className="app-topbar">
          <div className="app-topbar__left">
            <HamburgerButton
              open={isSidebarOpen}
              onClick={() => setIsSidebarOpen((open) => !open)}
              ariaControls={sidebarId}
              ariaLabelOpen="打开导航菜单"
              ariaLabelClose="关闭导航菜单"
              className="app-menu-toggle"
            />
            <Link to="/" className="app-brand app-brand--mobile">
              数码视界
            </Link>
          </div>
        </header>
        <main className="page-main">
          <Outlet />
        </main>
      </div>

      <button
        type="button"
        aria-label="点击关闭导航菜单"
        aria-hidden={!isSidebarOpen}
        tabIndex={isSidebarOpen ? 0 : -1}
        onClick={() => setIsSidebarOpen(false)}
        className={`app-sidebar-overlay ${isSidebarOpen ? 'app-sidebar-overlay--visible' : ''}`.trim()}
      />
    </div>
  );
}
