import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../../contexts/AuthContext'
import { Eye, EyeSlash } from 'phosphor-react'

export default function Login() {
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login, register } = useAuth()
  const navigate = useNavigate()

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
    <div className="min-h-screen flex ">
      {/* Lado esquerdo */}
      <div className="w-[420px] bg-[#1a2744] text-white p-10  flex-col justify-between hidden md:flex">
        <div className="flex items-center gap-3">
          <img src="/Logo.png" alt="SOS Connect" className="w-80" />

        </div>

        <div className="space-y-8">
          <p className="text-sm text-gray-300">
            Faça login ou crie uma nova conta para participar.
          </p>

<div className="space-y-6">
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
        </div>

        <div />
      </div>

      {/* Lado direito */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Abas */}
          <div className="flex border-b border-gray-200 mb-8">
            {(['login', 'register'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 pb-3 text-sm font-medium transition-colors ${
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
                <h2 className="text-2xl font-semibold text-gray-900">Bem-vindo(a) de volta!</h2>
                <p className="text-gray-500 text-sm mt-1">Faça login para acessar sua conta.</p>
              </div>

              <div className="space-y-1">
                <label className="text-sm text-gray-700">E-mail</label>
                <input
                  type="email"
                  placeholder="email@gmail.com"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm text-gray-700">Senha</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••••••"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
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
                className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </button>

              <p className="text-center text-sm text-gray-500">
                Ainda não tem uma conta?{' '}
                <button type="button" onClick={() => setTab('register')} className="text-red-500 font-medium">
                  Criar conta
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-5">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Crie sua conta na SOS Connect!</h2>
                <p className="text-gray-500 text-sm mt-1">Preencha seus dados abaixo.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm text-gray-700">Nome</label>
                  <input
                    type="text"
                    placeholder="Digite seu nome"
                    value={registerForm.name}
                    onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-gray-700">E-mail</label>
                  <input
                    type="email"
                    placeholder="email@gmail.com"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm text-gray-700">Senha</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••••••"
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
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
                <label className="text-sm text-gray-700">Escolha seu tipo de conta</label>
                <select
                  value={registerForm.role}
                  onChange={(e) => setRegisterForm({ ...registerForm, role: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 bg-white"
                >
                  <option value="victim">Usuário Comum</option>
                  <option value="volunteer">Voluntário</option>
                  <option value="support_unit">Instituição</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {loading ? 'Criando conta...' : 'Criar conta'}
              </button>

              <p className="text-center text-sm text-gray-500">
                Já tem uma conta?{' '}
                <button type="button" onClick={() => setTab('login')} className="text-red-500 font-medium">
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