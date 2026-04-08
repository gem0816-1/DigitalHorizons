import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

import { FormInput } from '@/components/FormInput';
import { useAuth } from '@/hooks/useAuth';

interface FormState {
  email: string;
  password: string;
  confirmPassword: string;
}

export function LoginPage() {
  const { user, signIn, signUp } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormState>({ email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [authError, setAuthError] = useState('');
  const navigate = useNavigate();

  if (user) {
    return <Navigate to="/" replace />;
  }

  const title = isRegister ? '创建账户' : '登录';

  const validate = (): boolean => {
    const nextErrors: Partial<FormState> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.trim())) {
      nextErrors.email = '请输入有效邮箱地址。';
    }
    if (form.password.trim().length < 6) {
      nextErrors.password = '密码至少需要 6 位。';
    }
    if (isRegister && form.confirmPassword !== form.password) {
      nextErrors.confirmPassword = '两次输入的密码不一致。';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const submit = async () => {
    setAuthError('');
    if (!validate()) {
      return;
    }
    setLoading(true);
    try {
      const result = isRegister
        ? await signUp(form.email.trim(), form.password)
        : await signIn(form.email.trim(), form.password);
      if (result.error) {
        setAuthError(result.error);
        return;
      }
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/48 p-4 backdrop-blur-sm">
      <div className="w-full max-w-[520px] rounded-[2rem] border border-black/8 bg-[var(--surface-white)] p-6 shadow-[0_30px_120px_rgba(15,23,42,0.22)] sm:p-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <div className="text-[0.72rem] uppercase tracking-[0.22em] text-black/38">账户</div>
            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[var(--page-ink)]">{title}</h1>
          </div>
          <button
            type="button"
            aria-label="关闭登录窗口"
            onClick={() => navigate(-1)}
            className="rounded-full border border-black/8 px-3 py-1.5 text-sm text-black/55 transition hover:border-black/16 hover:text-black/80"
          >
            关闭
          </button>
        </div>

        <div className="mb-6 flex gap-2 rounded-full bg-black/5 p-1">
          <button
            type="button"
            onClick={() => setIsRegister(false)}
            className={`flex-1 rounded-full px-4 py-2 text-sm transition ${!isRegister ? 'bg-[#1d1d1f] text-white' : 'text-black/56'}`}
          >
            登录
          </button>
          <button
            type="button"
            onClick={() => setIsRegister(true)}
            className={`flex-1 rounded-full px-4 py-2 text-sm transition ${isRegister ? 'bg-[#1d1d1f] text-white' : 'text-black/56'}`}
          >
            注册
          </button>
        </div>

        <div className="space-y-3">
          <FormInput
            id="email"
            label="邮箱"
            type="email"
            value={form.email}
            error={errors.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
          />
          <FormInput
            id="password"
            label="密码"
            type="password"
            value={form.password}
            error={errors.password}
            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
          />
          {isRegister ? (
            <FormInput
              id="confirm-password"
              label="确认密码"
              type="password"
              value={form.confirmPassword}
              error={errors.confirmPassword}
              onChange={(event) => setForm((prev) => ({ ...prev, confirmPassword: event.target.value }))}
            />
          ) : null}
        </div>

        {authError ? <div className="mt-3 text-sm text-red-600">{authError}</div> : null}

        <button
          type="button"
          disabled={loading}
          onClick={submit}
          className="mt-5 w-full rounded-full bg-[#0071e3] px-4 py-3 text-sm text-white transition hover:bg-[#0066cc] disabled:opacity-60"
        >
          {loading ? '处理中...' : isRegister ? '创建账户' : '登录'}
        </button>
      </div>
    </div>
  );
}
