import { Link, useLocation } from 'react-router-dom';

import { useAuth } from '@/hooks/useAuth';

const navigationItems = [
  { to: '/', label: '总览', match: (pathname: string) => pathname === '/' },
  {
    to: '/soc',
    label: '芯片详细信息',
    match: (pathname: string) =>
      pathname === '/soc' || (pathname.startsWith('/soc/') && !pathname.startsWith('/soc/compare')),
  },
  { to: '/soc/compare', label: '芯片对比', match: (pathname: string) => pathname === '/soc/compare' },
  { to: '/builder', label: '装机助手', match: (pathname: string) => pathname === '/builder' || pathname.startsWith('/builder?') },
];

export function SideMenu() {
  const location = useLocation();
  const { user, signOut } = useAuth();

  return (
    <div className="space-y-6">
      <nav className="space-y-2">
        {navigationItems.map((item) => {
          const active = item.match(location.pathname);
          return (
            <Link key={item.to} to={item.to} className={`menu-link ${active ? 'menu-link--active' : ''}`}>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="menu-group">
        <div className="menu-group__title">账户</div>
        <div className="space-y-2">
          {user ? (
            <>
              <Link to="/my-builds" className={`menu-link ${location.pathname === '/my-builds' ? 'menu-link--active' : ''}`}>
                我的方案
              </Link>
              <button type="button" onClick={() => void signOut()} className="menu-link w-full text-left">
                退出登录 ({user.email ?? 'user'})
              </button>
            </>
          ) : (
            <Link to="/login" className={`menu-link ${location.pathname === '/login' ? 'menu-link--active' : ''}`}>
              登录
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
