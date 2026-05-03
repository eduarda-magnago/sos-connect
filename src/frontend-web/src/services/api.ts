import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@sos-connect:token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api

/** 
 * Cliente HTTP central da aplicação (axios)
 * 
 * Responsabilidades: 
 * - Definir a URL base da API
 * - Enviar automaticamente o token JWT em todas as requisições autenticadas
 * - Evitar repetição de configuração em cada chamada HTTP 
 * 
 * Importante: 
 * - Toda comunicação com a API deve usar este arquivo 
 * - O interceptor injeta o Autorization (Bearer token) 
 * Se o Token não existir ou estiver inválido , rotas protegidas irão falhar (401) 
 * 
 * Dica: 
 * - Para trocar entre ambientes local e produção, usar variávl de ambiente ( VITE_API_URL )
 * 
 * */ 