import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../../contexts/AuthContext'
import { Eye, EyeSlash } from 'phosphor-react'

export default function Login() {
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login, register } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (location.pathname === '/register') {
      setTab('register')
    }
  }, [location.pathname])

  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'volunteer',
  })

async function handleLogin(e: React.FormEvent) {
  e.preventDefault()
  setLoading(true)

  try {
    await login(loginForm.email, loginForm.password)
    navigate('/home')
  } catch (error: any) {
    console.log(error)

    if (error.response) {
      //  backend respondeu (status HTTP)
      const status = error.response.status

      if (status === 401) {
        toast.error('Email ou senha inválidos')
      } else if (status === 500) {
        toast.error('Erro no servidor. Tente novamente mais tarde.')
      } else {
        toast.error('Erro inesperado')
      }

    } else if (error.request) {
      // não teve resposta (sem internet / API fora)
      toast.error('Sem conexão com o servidor')

    } else {
      // erro interno do código
      toast.error('Erro ao realizar login')
    }

  } finally {
    setLoading(false)
  }
}

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await register(registerForm)
      navigate('/home')
    } catch {
      toast.error('Erro ao criar conta. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Lado esquerdo */}
      <div className="w-105 bg-[#1a2744] text-white p-10  flex-col justify-between hidden md:flex">
        <div className="mt-9 space-y-8">
          <div className="flex items-center gap-3 cursor-pointer">
            <img src="/Logo.png" alt="SOS Connect" className="w-80" />
          </div>
          <p className="text-sm text-gray-300 max-w-57.5">
            Faça login ou crie uma nova conta para participar.
          </p>
        </div>

        <div className="space-y-6 cursor-pointer">
          {[
            {
              img: '/icons/shield.png',
              title: 'Seguro e confiável',
              desc: 'Seus dados estão protegidos com criptografia e boas práticas de segurança.',
            },
            {
              img: '/icons/hands.png',
              title: 'Conecte-se para ajudar',
              desc: 'Tenha acesso às unidades de apoio e veja como pode contribuir na plataforma!',
            },
            {
              img: '/icons/users.png',
              title: 'Todos por um objetivo',
              desc: 'Aqui na SOS Connect, todos se ajudam com o mesmo propósito e missão.',
            },
          ].map((item) => (
            <div key={item.title} className="flex gap-4 items-start">
              
              <div className="w-20 h-20 rounded-lg flex items-center justify-center shrink-0 -mt-3">
                <img src={item.img} alt={item.title} className="w-18 h-18 object-contain" />
              </div>

              <div>
                <p className="font-medium text-sm">{item.title}</p>
                <p className="text-xs text-gray-400 mt-1">{item.desc}</p>
              </div>

            </div>
          ))}
        </div>

      <div />
    </div>

    {/* Lado direito */}
    <div className="flex-1 flex items-center justify-center p-8 bg-[#ffffff]">
      <div className="w-full max-w-md">
        {/* Abas */}
        <div className="flex border-b border-gray-200 mb-8">
          {(['login', 'register'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1  cursor-pointer pb-3 text-sm font-medium transition-colors ${
                tab === t
                  ? 'border-b-2 border-red-500 text-gray-900'
                  : 'text-gray-400'
              }`}
            >
              {t === 'login' ? 'Entrar' : 'Criar conta'}
            </button>
          ))}
        </div>

        {tab === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <h2 className="text-2xl text-[#000000] font-semibold">Bem-vindo(a) de volta!</h2>
              <p className="text-[#000000] text-sm mt-1">Faça login para acessar sua conta.</p>
            </div>

            <div className="space-y-1">
              <label className="text-sm text-[#000000] font-medium">E-mail</label>
              <input
                type="email"
                placeholder="email@gmail.com"
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                className="w-full bg-[#F9F9F9] border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:[#bebebe]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm text-[#000000] font-medium">Senha</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  className="w-full border bg-[#F9F9F9] border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:[#bebebe]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#fd1515] hover:bg-red-600 cursor-pointer text-white py-3 rounded-[5px] font-medium transition-colors disabled:opacity-50"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>

            <p className="text-center text-sm text-[#000000]">
              Ainda não tem uma conta?{' '}
              <button type="button" onClick={() => setTab('register')} className="text-[#000000] font-medium underline cursor-pointer">
                Criar conta
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <h2 className="text-2xl font-semibold text-[#000000]">Crie sua conta na SOS Connect!</h2>
              <p className="text-[#000000] text-sm mt-1">Preencha seus dados abaixo.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm text-[#000000] font-medium">Nome</label>
                <input
                  type="text"
                  placeholder="Digite seu nome"
                  value={registerForm.name}
                  onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                  className="w-full border bg-[#F9F9F9] border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:[#bebebe]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm text-[#000000] font-medium">E-mail</label>
                <input
                  type="email"
                  placeholder="email@gmail.com"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                  className="w-full border bg-[#F9F9F9] border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:[#bebebe]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm text-[#000000] font-medium">Senha</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                  className="w-full border bg-[#F9F9F9] border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:[#bebebe]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeSlash size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm text-[#000000] font-medium">Escolha seu tipo de conta</label>
              <select
                value={registerForm.role}
                onChange={(e) => setRegisterForm({ ...registerForm, role: e.target.value })}
                className="w-full border bg-[#F9F9F9] border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23c0c0c0' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 14px center',
                }}
                >
                <option value="victim">Usuário Comum</option>
                <option value="volunteer">Voluntário</option>
                <option value="support_unit">Instituição</option>
              </select>
            </div>
           
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#fd1515] hover:bg-red-600 cursor-pointer text-white py-3 rounded-[5px] font-medium transition-colors disabled:opacity-50"
            >
              {loading ? 'Criando conta...' : 'Criar conta'}
            </button>

            <p className="text-center text-sm text-[#000000]">
              Já tem uma conta?{' '}
              <button type="button" onClick={() => setTab('login')} className="text-[#000000] font-medium underline cursor-pointer">
                Entrar
              </button>
            </p>
          </form>
        )}
      </div>
      </div>
    </div>
  )
}