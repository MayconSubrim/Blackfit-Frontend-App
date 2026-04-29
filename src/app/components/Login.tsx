import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { ApiError } from '../../services/api';
import { getDefaultRouteByRole, login } from '../../services/auth';
import logoImage from 'figma:asset/63b7da44e4c6dd410d42a5c31d62c189569f14bd.png';

export function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      // autentica no backend e salva token no localStorage
      const response = await login({ email, password });

      // redireciona conforme perfil retornado pela API
      navigate(getDefaultRouteByRole(response.user.role));
    } catch (error) {
      // exibe mensagem enviada pela API quando existir
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Nao foi possivel entrar. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInstructorLogin = () => {
    setErrorMessage('Use as credenciais de instrutor para acessar o painel.');
  };

  return (
    <div className="min-h-screen bg-black flex">
      {/* Left side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-16 h-16 flex items-center justify-center">
              <img src={logoImage} alt="BlackFit" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">BlackFit</h1>
              <p className="text-sm text-[#FFD700]">Treinar. Acompanhar. Transformar.</p>
            </div>
          </div>

          {/* Welcome Text */}
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-white mb-2">Bem-vindo de Volta</h2>
            <p className="text-gray-400">Entre para continuar sua jornada fitness</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {errorMessage && (
              <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {errorMessage}
              </div>
            )}

            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-sm text-gray-300">Endereço de E-mail</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  type="email"
                  placeholder="Digite seu e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 h-14 bg-[#1A1A1A] border-[#333333] text-white placeholder:text-gray-500 focus:border-[#FFD700] focus:ring-[#FFD700]/20"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-sm text-gray-300">Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 pr-12 h-14 bg-[#1A1A1A] border-[#333333] text-white placeholder:text-gray-500 focus:border-[#FFD700] focus:ring-[#FFD700]/20"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#FFD700] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  className="border-[#333333] data-[state=checked]:bg-[#FFD700] data-[state=checked]:border-[#FFD700]"
                />
                <label htmlFor="remember" className="text-sm text-gray-400 cursor-pointer">
                  Lembrar de mim
                </label>
              </div>
              <button type="button" className="text-sm text-[#FFD700] hover:underline">
                Esqueceu a senha?
              </button>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-[#FFD700] hover:bg-[#FFC700] text-black font-semibold text-lg"
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>

            {/* Instructor Login */}
            <Button
              type="button"
              onClick={handleInstructorLogin}
              disabled={isLoading}
              variant="outline"
              className="w-full h-14 border-[#333333] text-[#FFD700] hover:bg-[#1A1A1A] hover:text-[#FFD700] font-semibold"
            >
              Entrar como Instrutor
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              Não tem uma conta?{' '}
              <button className="text-[#FFD700] hover:underline font-semibold">
                Cadastre-se
              </button>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Right side - Image & Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black/50 to-transparent z-10" />
        <img
          src="https://images.unsplash.com/photo-1765728617805-b9f22d64e5b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxneW0lMjBmaXRuZXNzJTIwd2VpZ2h0cyUyMHRyYWluaW5nfGVufDF8fHx8MTc3NDI3ODE5Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Academia"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center p-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center justify-center w-32 h-32 mb-4">
              <img src={logoImage} alt="BlackFit" className="w-full h-full object-contain" />
            </div>
            <h2 className="text-5xl font-bold text-white leading-tight">
              Ultrapasse Seus Limites.<br />
              <span className="text-[#FFD700]">Acompanhe Seu Progresso.</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-md">
              Junte-se a milhares de membros transformando suas vidas através do fitness
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
