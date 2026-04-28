import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  Calendar,
  Trophy,
  TrendingUp,
  User,
  LogOut,
  CheckCircle2,
  Clock,
  Flame,
  Target,
  Star,
  Menu,
  X,
  Printer,
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import logoImage from 'figma:asset/63b7da44e4c6dd410d42a5c31d62c189569f14bd.png';

interface Workout {
  id: number;
  name: string;
  exercises: number;
  duration: string;
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado';
  completed: boolean;
  dayOfWeek: string;
}

const mockWorkouts: Workout[] = [
  { id: 1, name: 'Força de Membros Superiores', exercises: 8, duration: '45 min', difficulty: 'Intermediário', completed: true, dayOfWeek: 'Segunda' },
  { id: 2, name: 'Cardio & Core', exercises: 6, duration: '30 min', difficulty: 'Iniciante', completed: true, dayOfWeek: 'Terça' },
  { id: 3, name: 'Treino de Pernas', exercises: 10, duration: '60 min', difficulty: 'Avançado', completed: false, dayOfWeek: 'Quarta' },
  { id: 4, name: 'Sessão HIIT', exercises: 5, duration: '25 min', difficulty: 'Intermediário', completed: false, dayOfWeek: 'Quinta' },
  { id: 5, name: 'Treino Full Body', exercises: 12, duration: '50 min', difficulty: 'Avançado', completed: false, dayOfWeek: 'Sexta' },
];

export function Dashboard() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const stats = [
    { icon: Flame, label: 'Calorias Queimadas', value: '2.847', unit: 'kcal', color: '#FFD700' },
    { icon: Clock, label: 'Tempo de Treino', value: '12,5', unit: 'horas', color: '#FFD700' },
    { icon: Target, label: 'Metas Atingidas', value: '8', unit: '/ 10', color: '#FFD700' },
    { icon: Trophy, label: 'Sequência', value: '14', unit: 'dias', color: '#FFD700' },
  ];

  const weeklyProgress = {
    completed: 2,
    total: 5,
    percentage: 40,
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-[#0A0A0A] border-b border-[#333333] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center">
                <img src={logoImage} alt="BlackFit" className="w-full h-full object-contain" />
              </div>
              <span className="text-xl font-bold text-white">BlackFit</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              <Button
                onClick={() => navigate('/dashboard')}
                variant="ghost"
                className="text-[#FFD700] bg-[#FFD700]/10"
              >
                <img src={logoImage} alt="" className="w-4 h-4 mr-2 opacity-70" />
                Treinos
              </Button>
              <Button
                onClick={() => navigate('/check-in')}
                variant="ghost"
                className="text-white hover:text-[#FFD700] hover:bg-[#1A1A1A]"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Check-in
              </Button>
              <Button
                onClick={() => navigate('/rate-instructor')}
                variant="ghost"
                className="text-white hover:text-[#FFD700] hover:bg-[#1A1A1A]"
              >
                <Star className="w-4 h-4 mr-2" />
                Avaliar Instrutor
              </Button>
            </nav>

            {/* User Menu */}
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#FFD700] rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-black" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">João Silva</p>
                  <p className="text-xs text-gray-400">Membro</p>
                </div>
              </div>
              <Button
                onClick={() => navigate('/')}
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-[#FFD700]"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>

          {/* Mobile Menu */}
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="md:hidden py-4 space-y-2"
            >
              <Button
                onClick={() => navigate('/dashboard')}
                variant="ghost"
                className="w-full justify-start text-[#FFD700]"
              >
                <img src={logoImage} alt="" className="w-4 h-4 mr-2 opacity-70" />
                Treinos
              </Button>
              <Button
                onClick={() => navigate('/check-in')}
                variant="ghost"
                className="w-full justify-start text-white hover:text-[#FFD700]"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Check-in
              </Button>
              <Button
                onClick={() => navigate('/rate-instructor')}
                variant="ghost"
                className="w-full justify-start text-white hover:text-[#FFD700]"
              >
                <Star className="w-4 h-4 mr-2" />
                Avaliar Instrutor
              </Button>
              <Button
                onClick={() => navigate('/')}
                variant="ghost"
                className="w-full justify-start text-gray-400 hover:text-[#FFD700]"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </motion.div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            Bem-vindo de volta, <span className="text-[#FFD700]">João!</span>
          </h1>
          <p className="text-gray-400">Pronto para arrasar no treino hoje?</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="bg-[#0A0A0A] border-[#333333] p-6 hover:border-[#FFD700] transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-2">{stat.label}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-white">{stat.value}</span>
                    <span className="text-sm text-gray-400">{stat.unit}</span>
                  </div>
                </div>
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}20` }}
                >
                  <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
                </div>
              </div>
            </Card>
          ))}
        </motion.div>

        {/* Weekly Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="bg-[#0A0A0A] border-[#333333] p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-6 h-6 text-[#FFD700]" />
                <h2 className="text-xl font-bold text-white">Progresso da Semana</h2>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-[#FFD700]">{weeklyProgress.percentage}%</p>
                <p className="text-sm text-gray-400">
                  {weeklyProgress.completed} de {weeklyProgress.total} treinos
                </p>
              </div>
            </div>
            <Progress value={weeklyProgress.percentage} className="h-3 bg-[#1A1A1A]" />
          </Card>
        </motion.div>

        {/* Workouts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Seus Treinos</h2>
            <Button className="bg-[#FFD700] hover:bg-[#FFC700] text-black">
              <TrendingUp className="w-4 h-4 mr-2" />
              Ver Todos
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {mockWorkouts.map((workout, index) => (
              <motion.div
                key={workout.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <Card
                  onClick={() => navigate(`/workout/${workout.id}`)}
                  className={`bg-[#0A0A0A] border-[#333333] p-6 hover:border-[#FFD700] transition-all cursor-pointer ${
                    workout.completed ? 'opacity-75' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-bold text-white">{workout.name}</h3>
                        {workout.completed && (
                          <CheckCircle2 className="w-5 h-5 text-[#FFD700]" />
                        )}
                      </div>
                      <p className="text-sm text-gray-400 mb-3">{workout.dayOfWeek}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <img src={logoImage} alt="" className="w-4 h-4 opacity-70" />
                          {workout.exercises} exercícios
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {workout.duration}
                        </span>
                      </div>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        workout.difficulty === 'Iniciante'
                          ? 'bg-green-500/20 text-green-400'
                          : workout.difficulty === 'Intermediário'
                          ? 'bg-[#FFD700]/20 text-[#FFD700]'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {workout.difficulty}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/workout/${workout.id}`);
                      }}
                      className={`w-full ${
                        workout.completed
                          ? 'bg-[#1A1A1A] text-white hover:bg-[#262626]'
                          : 'bg-[#FFD700] hover:bg-[#FFC700] text-black'
                      }`}
                    >
                      {workout.completed ? 'Ver Treino' : 'Iniciar Treino'}
                    </Button>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/workout/${workout.id}`);
                        // Trigger print after navigation
                        setTimeout(() => window.print(), 500);
                      }}
                      variant="outline"
                      className="w-full border-[#333333] text-[#FFD700] hover:bg-[#1A1A1A]"
                    >
                      <Printer className="w-4 h-4 mr-2" />
                      Imprimir Ficha
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}