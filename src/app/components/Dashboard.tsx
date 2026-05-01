import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Flame,
  Printer,
  RefreshCw,
  Target,
  TrendingUp,
  Trophy,
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { useAuth } from '../auth/AuthContext';
import { AppHeader } from './AppHeader';
import {
  DashboardData,
  formatNumber,
  getDashboardErrorMessage,
  getDifficultyClasses,
  getStudentDashboard,
} from '../../services/dashboard';
import logoImage from 'figma:asset/63b7da44e4c6dd410d42a5c31d62c189569f14bd.png';

export function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const userName = user?.name || 'Usuario';
  const firstName = userName.split(' ')[0];

  async function loadDashboard() {
    try {
      setLoading(true);
      setErrorMessage('');
      const data = await getStudentDashboard();
      setDashboard(data);
    } catch (error) {
      setErrorMessage(getDashboardErrorMessage(error, 'Erro ao carregar dashboard'));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  const stats = useMemo(() => {
    const currentStats = dashboard?.stats;

    // monta os cards a partir dos dados reais retornados pelo backend
    return [
      {
        icon: Flame,
        label: 'Calorias Queimadas',
        value: formatNumber(currentStats?.caloriesBurned ?? 0),
        unit: 'kcal',
        color: '#FFD700',
      },
      {
        icon: Clock,
        label: 'Treinos Disponiveis',
        value: formatNumber(currentStats?.assignedWorkoutCount ?? 0),
        unit: 'fichas',
        color: '#FFD700',
      },
      {
        icon: Target,
        label: 'Metas Atingidas',
        value: formatNumber(currentStats?.goalsCompleted ?? 0),
        unit: `/ ${formatNumber(currentStats?.goalsTarget ?? 10)}`,
        color: '#FFD700',
      },
      {
        icon: Trophy,
        label: 'Sequencia',
        value: formatNumber(currentStats?.streakDays ?? 0),
        unit: 'dias',
        color: '#FFD700',
      },
    ];
  }, [dashboard]);

  const weeklyProgress = dashboard?.weeklyProgress ?? {
    completed: 0,
    total: 1,
    percentage: 0,
  };
  const workouts = dashboard?.workouts ?? [];

  return (
    <div className="min-h-screen bg-black">
      <AppHeader activePage="workouts" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            Bem-vindo de volta, <span className="text-[#FFD700]">{firstName}!</span>
          </h1>
          <p className="text-gray-400">Pronto para arrasar no treino hoje?</p>
        </motion.div>

        {errorMessage && (
          <Card className="bg-red-500/10 border-red-500/30 p-4 mb-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-red-200">{errorMessage}</p>
              <Button
                onClick={loadDashboard}
                variant="outline"
                className="border-red-500/40 text-red-100 hover:bg-red-500/10"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Tentar novamente
              </Button>
            </div>
          </Card>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {stats.map((stat) => (
            <Card
              key={stat.label}
              className="bg-[#0A0A0A] border-[#333333] p-6 hover:border-[#FFD700] transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-2">{stat.label}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-white">
                      {loading ? '...' : stat.value}
                    </span>
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
                <p className="text-2xl font-bold text-[#FFD700]">
                  {loading ? '...' : `${weeklyProgress.percentage}%`}
                </p>
                <p className="text-sm text-gray-400">
                  {weeklyProgress.completed} de {weeklyProgress.total} treinos
                </p>
              </div>
            </div>
            <Progress value={weeklyProgress.percentage} className="h-3 bg-[#1A1A1A]" />
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Seus Treinos</h2>
            <Button
              onClick={loadDashboard}
              disabled={loading}
              className="bg-[#FFD700] hover:bg-[#FFC700] text-black"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Atualizar
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {loading && (
              <Card className="bg-[#0A0A0A] border-[#333333] p-6 lg:col-span-2">
                <p className="text-[#FFD700]">Carregando treinos...</p>
              </Card>
            )}

            {!loading && workouts.length === 0 && (
              <Card className="bg-[#0A0A0A] border-[#333333] p-6 lg:col-span-2">
                <p className="text-white font-semibold">Nenhum treino atribuido ainda.</p>
                <p className="text-sm text-gray-400 mt-2">
                  Quando seu instrutor atribuir uma ficha, ela aparece aqui automaticamente.
                </p>
              </Card>
            )}

            {workouts.map((workout, index) => (
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
                          {workout.exercises} exercicios
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {workout.duration}
                        </span>
                      </div>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getDifficultyClasses(
                        workout.difficulty
                      )}`}
                    >
                      {workout.difficulty}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Button
                      onClick={(event) => {
                        event.stopPropagation();
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
                      onClick={(event) => {
                        event.stopPropagation();
                        navigate(`/workout/${workout.id}`);
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
