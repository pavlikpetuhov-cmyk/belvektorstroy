import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Lock, User, Plus, Trash2, FileText, Users, ClipboardList, LogOut, Calculator } from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL || '';

// Auth Context
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (phone, password) => {
    const res = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'Ошибка входа');
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const register = async (phone, password, name, role) => {
    const res = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, password, name, role })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'Ошибка регистрации');
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const getToken = () => localStorage.getItem('token');

  return { user, loading, login, register, logout, getToken };
};

// Fetch helper
const authFetch = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers
    }
  });
  if (res.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }
  return res;
};

// Login Page
export const LoginPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('client');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    if (auth.user) {
      navigate('/dashboard');
    }
  }, [auth.user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isRegister) {
        await auth.register(phone, password, name, role);
      } else {
        await auth.login(phone, password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4 pt-20">
      <div className="w-full max-w-md">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-center mb-8">
          {isRegister ? 'Регистрация' : 'Вход в кабинет'}
        </h1>
        
        <form onSubmit={handleSubmit} className="bg-[#1C1C1C] p-8 border-2 border-zinc-800">
          {isRegister && (
            <div className="mb-4">
              <label className="block text-zinc-400 text-sm uppercase tracking-wider mb-2">Ваше имя</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#0A0A0A] border-2 border-zinc-800 focus:border-[#FF5F1F] pl-12 pr-4 py-3 text-white outline-none"
                  placeholder="Иван Иванов"
                  required
                />
              </div>
            </div>
          )}
          
          <div className="mb-4">
            <label className="block text-zinc-400 text-sm uppercase tracking-wider mb-2">Телефон</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#0A0A0A] border-2 border-zinc-800 focus:border-[#FF5F1F] pl-12 pr-4 py-3 text-white outline-none"
                placeholder="+7 925 759 09 03"
                required
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-zinc-400 text-sm uppercase tracking-wider mb-2">Пароль</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0A0A0A] border-2 border-zinc-800 focus:border-[#FF5F1F] pl-12 pr-4 py-3 text-white outline-none"
                placeholder="••••••••"
                required
              />
            </div>
          </div>
          
          {isRegister && (
            <div className="mb-6">
              <label className="block text-zinc-400 text-sm uppercase tracking-wider mb-2">Тип аккаунта</label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setRole('client')}
                  className={`flex-1 py-3 border-2 transition-colors ${role === 'client' ? 'border-[#FF5F1F] text-white' : 'border-zinc-800 text-zinc-500'}`}
                >
                  Клиент
                </button>
                <button
                  type="button"
                  onClick={() => setRole('manager')}
                  className={`flex-1 py-3 border-2 transition-colors ${role === 'manager' ? 'border-[#FF5F1F] text-white' : 'border-zinc-800 text-zinc-500'}`}
                >
                  Менеджер
                </button>
              </div>
            </div>
          )}
          
          {error && (
            <div className="mb-4 bg-red-900/50 border border-red-500 text-red-400 px-4 py-3 text-sm">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FF5F1F] text-white hover:bg-[#E04F16] py-4 font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
          >
            {loading ? 'Загрузка...' : (isRegister ? 'Зарегистрироваться' : 'Войти')}
          </button>
          
          <p className="text-center text-zinc-500 mt-6">
            {isRegister ? 'Уже есть аккаунт?' : 'Нет аккаунта?'}{' '}
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-[#FF5F1F] hover:underline"
            >
              {isRegister ? 'Войти' : 'Регистрация'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

// Dashboard Page
export const DashboardPage = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [measurements, setMeasurements] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.loading && !auth.user) {
      navigate('/login');
      return;
    }
    loadData();
  }, [auth.user, auth.loading]);

  const loadData = async () => {
    try {
      const [measRes, propRes] = await Promise.all([
        authFetch('/api/measurements'),
        authFetch('/api/proposals')
      ]);
      setMeasurements(await measRes.json());
      setProposals(await propRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (auth.loading || loading) {
    return <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center pt-20">
      <p className="text-zinc-400">Загрузка...</p>
    </div>;
  }

  const isManager = auth.user?.role === 'manager';

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="font-heading text-3xl md:text-4xl font-bold">
              {isManager ? 'Панель менеджера' : 'Личный кабинет'}
            </h1>
            <p className="text-zinc-400 mt-1">Добро пожаловать, {auth.user?.name}</p>
          </div>
          <div className="flex gap-3">
            {isManager && (
              <button
                onClick={() => navigate('/measurement/new')}
                className="bg-[#FF5F1F] text-white hover:bg-[#E04F16] px-6 py-3 font-bold uppercase text-sm tracking-wider flex items-center gap-2"
              >
                <Plus size={20} />
                Новый замер
              </button>
            )}
            <button
              onClick={() => { auth.logout(); navigate('/'); }}
              className="bg-zinc-800 text-white hover:bg-zinc-700 px-6 py-3 font-bold uppercase text-sm tracking-wider flex items-center gap-2"
            >
              <LogOut size={20} />
              Выход
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#1C1C1C] p-6 border-2 border-zinc-800">
            <p className="text-zinc-400 text-sm uppercase tracking-wider">Замеров</p>
            <p className="font-heading text-3xl font-bold text-[#FF5F1F] mt-2">{measurements.length}</p>
          </div>
          <div className="bg-[#1C1C1C] p-6 border-2 border-zinc-800">
            <p className="text-zinc-400 text-sm uppercase tracking-wider">КП</p>
            <p className="font-heading text-3xl font-bold text-[#FF5F1F] mt-2">{proposals.length}</p>
          </div>
          <div className="bg-[#1C1C1C] p-6 border-2 border-zinc-800">
            <p className="text-zinc-400 text-sm uppercase tracking-wider">В работе</p>
            <p className="font-heading text-3xl font-bold text-white mt-2">
              {measurements.filter(m => m.status !== 'Завершён').length}
            </p>
          </div>
          <div className="bg-[#1C1C1C] p-6 border-2 border-zinc-800">
            <p className="text-zinc-400 text-sm uppercase tracking-wider">Общая площадь</p>
            <p className="font-heading text-3xl font-bold text-white mt-2">
              {Math.round(measurements.reduce((s, m) => s + m.net_area, 0))} м²
            </p>
          </div>
        </div>

        {/* Measurements List */}
        <div className="bg-[#1C1C1C] border-2 border-zinc-800 mb-8">
          <div className="p-6 border-b border-zinc-800 flex items-center gap-3">
            <ClipboardList className="text-[#FF5F1F]" />
            <h2 className="font-heading text-xl font-bold uppercase">Замеры</h2>
          </div>
          
          {measurements.length === 0 ? (
            <p className="p-6 text-zinc-500">Нет замеров</p>
          ) : (
            <div className="divide-y divide-zinc-800">
              {measurements.map(m => (
                <div key={m.id} className="p-6 hover:bg-zinc-800/50 transition-colors">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div>
                      <p className="font-bold text-lg">{m.client_name}</p>
                      <p className="text-zinc-400 text-sm">{m.address}</p>
                      <p className="text-zinc-500 text-sm mt-1">
                        {new Date(m.created_at).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                    <div className="flex flex-col md:items-end gap-2">
                      <span className={`px-3 py-1 text-sm font-medium ${
                        m.status === 'Завершён' ? 'bg-green-900/50 text-green-400' :
                        m.status === 'КП сформировано' ? 'bg-blue-900/50 text-blue-400' :
                        'bg-yellow-900/50 text-yellow-400'
                      }`}>
                        {m.status}
                      </span>
                      <p className="font-heading text-2xl font-bold text-[#FF5F1F]">
                        {m.net_area.toFixed(1)} м²
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/measurement/${m.id}`)}
                          className="text-sm text-zinc-400 hover:text-white"
                        >
                          Подробнее
                        </button>
                        {isManager && !m.proposal_id && (
                          <button
                            onClick={() => navigate(`/proposal/new/${m.id}`)}
                            className="text-sm text-[#FF5F1F] hover:underline"
                          >
                            Создать КП
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Proposals List */}
        <div className="bg-[#1C1C1C] border-2 border-zinc-800">
          <div className="p-6 border-b border-zinc-800 flex items-center gap-3">
            <FileText className="text-[#FF5F1F]" />
            <h2 className="font-heading text-xl font-bold uppercase">Коммерческие предложения</h2>
          </div>
          
          {proposals.length === 0 ? (
            <p className="p-6 text-zinc-500">Нет КП</p>
          ) : (
            <div className="divide-y divide-zinc-800">
              {proposals.map(p => (
                <div key={p.id} className="p-6 hover:bg-zinc-800/50 transition-colors">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div>
                      <p className="font-bold text-lg">{p.client_name}</p>
                      <p className="text-zinc-400 text-sm">{p.address}</p>
                      <p className="text-zinc-500 text-sm mt-1">
                        {new Date(p.created_at).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                    <div className="flex flex-col md:items-end gap-2">
                      <span className={`px-3 py-1 text-sm font-medium ${
                        p.status === 'Принято' ? 'bg-green-900/50 text-green-400' :
                        p.status === 'Отклонено' ? 'bg-red-900/50 text-red-400' :
                        'bg-blue-900/50 text-blue-400'
                      }`}>
                        {p.status}
                      </span>
                      <p className="font-heading text-2xl font-bold text-[#FF5F1F]">
                        {p.total_cost.toLocaleString('ru-RU')} ₽
                      </p>
                      <button
                        onClick={() => navigate(`/proposal/${p.id}`)}
                        className="text-sm text-zinc-400 hover:text-white"
                      >
                        Подробнее
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// New Measurement Page
export const NewMeasurementPage = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const [clientPhone, setClientPhone] = useState('');
  const [clientName, setClientName] = useState('');
  const [address, setAddress] = useState('');
  const [walls, setWalls] = useState([{ name: 'Стена 1', length: 0, height: 2.7, area: 0 }]);
  const [openings, setOpenings] = useState([]);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!auth.loading && (!auth.user || auth.user.role !== 'manager')) {
      navigate('/login');
    }
  }, [auth.user, auth.loading]);

  const updateWall = (index, field, value) => {
    const newWalls = [...walls];
    newWalls[index][field] = parseFloat(value) || 0;
    newWalls[index].area = newWalls[index].length * newWalls[index].height;
    setWalls(newWalls);
  };

  const addWall = () => {
    setWalls([...walls, { name: `Стена ${walls.length + 1}`, length: 0, height: 2.7, area: 0 }]);
  };

  const removeWall = (index) => {
    if (walls.length > 1) {
      setWalls(walls.filter((_, i) => i !== index));
    }
  };

  const addOpening = (wallName) => {
    setOpenings([...openings, { wall_name: wallName, width: 0, height: 0, area: 0 }]);
  };

  const updateOpening = (index, field, value) => {
    const newOpenings = [...openings];
    newOpenings[index][field] = field === 'wall_name' ? value : (parseFloat(value) || 0);
    if (field !== 'wall_name') {
      newOpenings[index].area = newOpenings[index].width * newOpenings[index].height;
    }
    setOpenings(newOpenings);
  };

  const removeOpening = (index) => {
    setOpenings(openings.filter((_, i) => i !== index));
  };

  const totalWallArea = walls.reduce((s, w) => s + w.area, 0);
  const totalOpeningArea = openings.reduce((s, o) => s + o.area, 0);
  const netArea = Math.max(0, totalWallArea - totalOpeningArea);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await authFetch('/api/measurements', {
        method: 'POST',
        body: JSON.stringify({
          client_phone: clientPhone,
          client_name: clientName,
          address,
          walls,
          openings,
          total_wall_area: totalWallArea,
          total_opening_area: totalOpeningArea,
          net_area: netArea,
          notes
        })
      });
      if (res.ok) {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-heading text-3xl md:text-4xl font-bold mb-8 flex items-center gap-3">
          <Calculator className="text-[#FF5F1F]" />
          Новый замер
        </h1>

        <form onSubmit={handleSubmit}>
          {/* Client Info */}
          <div className="bg-[#1C1C1C] p-6 border-2 border-zinc-800 mb-6">
            <h2 className="font-heading text-xl font-bold uppercase mb-4">Данные клиента</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-zinc-400 text-sm uppercase tracking-wider mb-2">Телефон</label>
                <input
                  type="tel"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full bg-[#0A0A0A] border-2 border-zinc-800 focus:border-[#FF5F1F] px-4 py-3 text-white outline-none"
                  placeholder="+7 925 123 45 67"
                  required
                />
              </div>
              <div>
                <label className="block text-zinc-400 text-sm uppercase tracking-wider mb-2">ФИО</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full bg-[#0A0A0A] border-2 border-zinc-800 focus:border-[#FF5F1F] px-4 py-3 text-white outline-none"
                  placeholder="Иванов Иван Иванович"
                  required
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-zinc-400 text-sm uppercase tracking-wider mb-2">Адрес объекта</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-[#0A0A0A] border-2 border-zinc-800 focus:border-[#FF5F1F] px-4 py-3 text-white outline-none"
                placeholder="г. Москва, ул. Примерная, д. 1, кв. 1"
                required
              />
            </div>
          </div>

          {/* Walls */}
          <div className="bg-[#1C1C1C] p-6 border-2 border-zinc-800 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-heading text-xl font-bold uppercase">Стены помещения</h2>
              <button
                type="button"
                onClick={addWall}
                className="bg-[#FF5F1F] text-white hover:bg-[#E04F16] px-4 py-2 text-sm font-bold uppercase flex items-center gap-2"
              >
                <Plus size={16} />
                Добавить стену
              </button>
            </div>

            <div className="space-y-4">
              {walls.map((wall, i) => (
                <div key={i} className="bg-[#0A0A0A] p-4 border border-zinc-800">
                  <div className="flex justify-between items-center mb-3">
                    <input
                      type="text"
                      value={wall.name}
                      onChange={(e) => {
                        const newWalls = [...walls];
                        newWalls[i].name = e.target.value;
                        setWalls(newWalls);
                      }}
                      className="bg-transparent border-b border-zinc-700 text-white font-bold outline-none focus:border-[#FF5F1F]"
                    />
                    <button
                      type="button"
                      onClick={() => removeWall(i)}
                      className="text-zinc-500 hover:text-red-500"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-zinc-500 text-xs mb-1">Длина (м)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={wall.length || ''}
                        onChange={(e) => updateWall(i, 'length', e.target.value)}
                        className="w-full bg-[#1C1C1C] border border-zinc-700 focus:border-[#FF5F1F] px-3 py-2 text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-500 text-xs mb-1">Высота (м)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={wall.height || ''}
                        onChange={(e) => updateWall(i, 'height', e.target.value)}
                        className="w-full bg-[#1C1C1C] border border-zinc-700 focus:border-[#FF5F1F] px-3 py-2 text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-500 text-xs mb-1">Площадь (м²)</label>
                      <div className="bg-[#1C1C1C] border border-zinc-700 px-3 py-2 text-[#FF5F1F] font-bold">
                        {wall.area.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => addOpening(wall.name)}
                    className="mt-3 text-sm text-zinc-400 hover:text-[#FF5F1F] flex items-center gap-1"
                  >
                    <Plus size={14} />
                    Добавить проём
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Openings */}
          {openings.length > 0 && (
            <div className="bg-[#1C1C1C] p-6 border-2 border-zinc-800 mb-6">
              <h2 className="font-heading text-xl font-bold uppercase mb-4">Проёмы (окна, двери)</h2>
              <div className="space-y-4">
                {openings.map((opening, i) => (
                  <div key={i} className="bg-[#0A0A0A] p-4 border border-zinc-800">
                    <div className="flex justify-between items-center mb-3">
                      <select
                        value={opening.wall_name}
                        onChange={(e) => updateOpening(i, 'wall_name', e.target.value)}
                        className="bg-transparent border-b border-zinc-700 text-white outline-none focus:border-[#FF5F1F]"
                      >
                        {walls.map((w, wi) => (
                          <option key={wi} value={w.name}>{w.name}</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => removeOpening(i)}
                        className="text-zinc-500 hover:text-red-500"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-zinc-500 text-xs mb-1">Ширина (м)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={opening.width || ''}
                          onChange={(e) => updateOpening(i, 'width', e.target.value)}
                          className="w-full bg-[#1C1C1C] border border-zinc-700 focus:border-[#FF5F1F] px-3 py-2 text-white outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-zinc-500 text-xs mb-1">Высота (м)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={opening.height || ''}
                          onChange={(e) => updateOpening(i, 'height', e.target.value)}
                          className="w-full bg-[#1C1C1C] border border-zinc-700 focus:border-[#FF5F1F] px-3 py-2 text-white outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-zinc-500 text-xs mb-1">Площадь (м²)</label>
                        <div className="bg-[#1C1C1C] border border-zinc-700 px-3 py-2 text-red-400 font-bold">
                          -{opening.area.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="bg-[#1C1C1C] p-6 border-2 border-zinc-800 mb-6">
            <label className="block text-zinc-400 text-sm uppercase tracking-wider mb-2">Примечания</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#0A0A0A] border-2 border-zinc-800 focus:border-[#FF5F1F] px-4 py-3 text-white outline-none h-24 resize-none"
              placeholder="Дополнительная информация..."
            />
          </div>

          {/* Summary */}
          <div className="bg-[#FF5F1F]/10 border-2 border-[#FF5F1F] p-6 mb-6">
            <h2 className="font-heading text-xl font-bold uppercase mb-4">Итого</h2>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-zinc-400 text-sm">Площадь стен</p>
                <p className="font-heading text-2xl font-bold text-white">{totalWallArea.toFixed(2)} м²</p>
              </div>
              <div>
                <p className="text-zinc-400 text-sm">Площадь проёмов</p>
                <p className="font-heading text-2xl font-bold text-red-400">-{totalOpeningArea.toFixed(2)} м²</p>
              </div>
              <div>
                <p className="text-zinc-400 text-sm">Чистая площадь</p>
                <p className="font-heading text-3xl font-bold text-[#FF5F1F]">{netArea.toFixed(2)} м²</p>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex-1 bg-zinc-800 text-white hover:bg-zinc-700 py-4 font-bold uppercase tracking-wider"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={saving || netArea <= 0}
              className="flex-1 bg-[#FF5F1F] text-white hover:bg-[#E04F16] py-4 font-bold uppercase tracking-wider disabled:opacity-50"
            >
              {saving ? 'Сохранение...' : 'Сохранить замер'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// New Proposal Page
export const NewProposalPage = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const [measurement, setMeasurement] = useState(null);
  const [pricePerSqm, setPricePerSqm] = useState(450);
  const [additionalWorks, setAdditionalWorks] = useState([]);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const measurementId = window.location.pathname.split('/').pop();

  useEffect(() => {
    if (!auth.loading && (!auth.user || auth.user.role !== 'manager')) {
      navigate('/login');
      return;
    }
    loadMeasurement();
  }, [auth.user, auth.loading]);

  const loadMeasurement = async () => {
    try {
      const res = await authFetch(`/api/measurements/${measurementId}`);
      if (res.ok) {
        setMeasurement(await res.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addWork = () => {
    setAdditionalWorks([...additionalWorks, { name: '', cost: 0 }]);
  };

  const updateWork = (index, field, value) => {
    const newWorks = [...additionalWorks];
    newWorks[index][field] = field === 'cost' ? (parseFloat(value) || 0) : value;
    setAdditionalWorks(newWorks);
  };

  const removeWork = (index) => {
    setAdditionalWorks(additionalWorks.filter((_, i) => i !== index));
  };

  if (!measurement) {
    return <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center pt-20">
      <p className="text-zinc-400">Загрузка...</p>
    </div>;
  }

  const baseCost = measurement.net_area * pricePerSqm;
  const additionalCost = additionalWorks.reduce((s, w) => s + w.cost, 0);
  const subtotal = baseCost + additionalCost;
  const discountAmount = subtotal * (discountPercent / 100);
  const totalCost = subtotal - discountAmount;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await authFetch('/api/proposals', {
        method: 'POST',
        body: JSON.stringify({
          measurement_id: measurementId,
          price_per_sqm: pricePerSqm,
          additional_works: additionalWorks,
          discount_percent: discountPercent,
          notes
        })
      });
      if (res.ok) {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-heading text-3xl md:text-4xl font-bold mb-8 flex items-center gap-3">
          <FileText className="text-[#FF5F1F]" />
          Коммерческое предложение
        </h1>

        {/* Client Info */}
        <div className="bg-[#1C1C1C] p-6 border-2 border-zinc-800 mb-6">
          <h2 className="font-heading text-xl font-bold uppercase mb-4">Данные заказа</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-zinc-400 text-sm">Клиент</p>
              <p className="text-white font-bold">{measurement.client_name}</p>
            </div>
            <div>
              <p className="text-zinc-400 text-sm">Телефон</p>
              <p className="text-white">{measurement.client_phone}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-zinc-400 text-sm">Адрес</p>
              <p className="text-white">{measurement.address}</p>
            </div>
            <div>
              <p className="text-zinc-400 text-sm">Площадь штукатурки</p>
              <p className="font-heading text-2xl font-bold text-[#FF5F1F]">{measurement.net_area.toFixed(2)} м²</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Pricing */}
          <div className="bg-[#1C1C1C] p-6 border-2 border-zinc-800 mb-6">
            <h2 className="font-heading text-xl font-bold uppercase mb-4">Расценки</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-zinc-400 text-sm uppercase tracking-wider mb-2">Цена за м²</label>
                <input
                  type="number"
                  value={pricePerSqm}
                  onChange={(e) => setPricePerSqm(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#0A0A0A] border-2 border-zinc-800 focus:border-[#FF5F1F] px-4 py-3 text-white outline-none"
                />
              </div>
              <div>
                <label className="block text-zinc-400 text-sm uppercase tracking-wider mb-2">Базовая стоимость</label>
                <div className="bg-[#0A0A0A] border-2 border-zinc-800 px-4 py-3 text-white font-bold">
                  {baseCost.toLocaleString('ru-RU')} ₽
                </div>
              </div>
            </div>
          </div>

          {/* Additional Works */}
          <div className="bg-[#1C1C1C] p-6 border-2 border-zinc-800 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-heading text-xl font-bold uppercase">Дополнительные работы</h2>
              <button
                type="button"
                onClick={addWork}
                className="bg-zinc-800 text-white hover:bg-zinc-700 px-4 py-2 text-sm font-bold uppercase flex items-center gap-2"
              >
                <Plus size={16} />
                Добавить
              </button>
            </div>
            
            {additionalWorks.length === 0 ? (
              <p className="text-zinc-500">Нет дополнительных работ</p>
            ) : (
              <div className="space-y-3">
                {additionalWorks.map((work, i) => (
                  <div key={i} className="flex gap-4 items-center">
                    <input
                      type="text"
                      value={work.name}
                      onChange={(e) => updateWork(i, 'name', e.target.value)}
                      className="flex-1 bg-[#0A0A0A] border border-zinc-700 focus:border-[#FF5F1F] px-3 py-2 text-white outline-none"
                      placeholder="Название работы"
                    />
                    <input
                      type="number"
                      value={work.cost || ''}
                      onChange={(e) => updateWork(i, 'cost', e.target.value)}
                      className="w-32 bg-[#0A0A0A] border border-zinc-700 focus:border-[#FF5F1F] px-3 py-2 text-white outline-none"
                      placeholder="Стоимость"
                    />
                    <button
                      type="button"
                      onClick={() => removeWork(i)}
                      className="text-zinc-500 hover:text-red-500"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Discount */}
          <div className="bg-[#1C1C1C] p-6 border-2 border-zinc-800 mb-6">
            <h2 className="font-heading text-xl font-bold uppercase mb-4">Скидка</h2>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="30"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(parseFloat(e.target.value))}
                className="flex-1"
              />
              <div className="w-20 text-center">
                <span className="font-heading text-2xl font-bold text-[#FF5F1F]">{discountPercent}%</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-[#1C1C1C] p-6 border-2 border-zinc-800 mb-6">
            <label className="block text-zinc-400 text-sm uppercase tracking-wider mb-2">Примечания</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#0A0A0A] border-2 border-zinc-800 focus:border-[#FF5F1F] px-4 py-3 text-white outline-none h-24 resize-none"
              placeholder="Условия, сроки, гарантии..."
            />
          </div>

          {/* Summary */}
          <div className="bg-[#FF5F1F]/10 border-2 border-[#FF5F1F] p-6 mb-6">
            <h2 className="font-heading text-xl font-bold uppercase mb-4">Итого</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-zinc-400">Штукатурные работы ({measurement.net_area.toFixed(2)} м² × {pricePerSqm} ₽)</span>
                <span className="text-white">{baseCost.toLocaleString('ru-RU')} ₽</span>
              </div>
              {additionalCost > 0 && (
                <div className="flex justify-between">
                  <span className="text-zinc-400">Дополнительные работы</span>
                  <span className="text-white">{additionalCost.toLocaleString('ru-RU')} ₽</span>
                </div>
              )}
              {discountPercent > 0 && (
                <div className="flex justify-between">
                  <span className="text-zinc-400">Скидка {discountPercent}%</span>
                  <span className="text-green-400">-{discountAmount.toLocaleString('ru-RU')} ₽</span>
                </div>
              )}
              <div className="border-t border-[#FF5F1F] pt-2 mt-2 flex justify-between">
                <span className="font-bold text-white">ИТОГО</span>
                <span className="font-heading text-3xl font-bold text-[#FF5F1F]">{totalCost.toLocaleString('ru-RU')} ₽</span>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex-1 bg-zinc-800 text-white hover:bg-zinc-700 py-4 font-bold uppercase tracking-wider"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-[#FF5F1F] text-white hover:bg-[#E04F16] py-4 font-bold uppercase tracking-wider disabled:opacity-50"
            >
              {saving ? 'Сохранение...' : 'Создать КП'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
