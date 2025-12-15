import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface RegisterPanelProps {
  onSuccess: () => void;
}

export const RegisterPanel: React.FC<RegisterPanelProps> = ({ onSuccess }) => {
  const { register } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    setLoading(true);
    setError(null);
    try {
      await register(email, password, username);
      onSuccess();
    } catch (e: any) {
      setError(e.message || '注册失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 w-full max-w-xl rounded-2xl border border-indigo-100 bg-indigo-50 p-6">
      <div className="grid gap-3 md:grid-cols-3">
        <input
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="用户名"
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
        />
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="邮箱"
          type="email"
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
        />
        <input
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="密码"
          type="password"
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
        />
      </div>

      {error && (
        <p className="mt-3 text-sm text-red-600">{error}</p>
      )}

      <button
        onClick={handleRegister}
        disabled={loading}
        className="mt-4 rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500 transition disabled:opacity-50"
      >
        {loading ? '注册中...' : '注册并开始学习'}
      </button>
    </div>
  );
};
