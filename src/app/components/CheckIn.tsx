import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  Award,
  Calendar,
  CheckCircle2,
  Medal,
  TrendingUp,
  Trophy,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AppHeader } from './AppHeader';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { useAuth } from '../auth/AuthContext';
import {
  CheckinStats,
  LeaderboardUser,
  createDailyCheckin,
  getCheckinErrorMessage,
  getCheckinRanking,
  getCheckinStats,
  hasLocalCheckinToday,
  markLocalCheckinToday,
} from '../../services/checkins';

export function CheckIn() {
  const { user: authUser } = useAuth();
  const [checkedIn, setCheckedIn] = useState(() => hasLocalCheckinToday(authUser?.id));
  const [stats, setStats] = useState<CheckinStats | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const userName = authUser?.name || 'Usuario';

  async function loadCheckinStats() {
    try {
      setLoading(true);
      setErrorMessage('');
      const [data, rankingData] = await Promise.all([
        getCheckinStats(),
        getCheckinRanking(),
      ]);
      setStats(data);
      setLeaderboard(rankingData);
      setCheckedIn(hasLocalCheckinToday(authUser?.id));
    } catch (error) {
      setErrorMessage(getCheckinErrorMessage(error, 'Erro ao carregar check-in'));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCheckinStats();
  }, [authUser?.id]);

  const handleCheckIn = async () => {
    try {
      setSaving(true);
      setErrorMessage('');
      const response = await createDailyCheckin();
      setCheckedIn(true);
      markLocalCheckinToday(authUser?.id);
      await loadCheckinStats();

      if (response.alreadyCheckedIn) {
        return;
      }

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#FFA500', '#FFFF00'],
      });
    } catch (error) {
      setErrorMessage(getCheckinErrorMessage(error, 'Erro ao fazer check-in'));
    } finally {
      setSaving(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-[#FFD700]" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-300" />;
      case 3:
        return <Award className="w-6 h-6 text-[#CD7F32]" />;
      default:
        return <span className="text-lg font-bold text-gray-400">#{rank}</span>;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-br from-[#FFD700] to-[#FFA500]';
      case 2:
        return 'bg-gradient-to-br from-gray-300 to-gray-400';
      case 3:
        return 'bg-gradient-to-br from-[#CD7F32] to-[#A0522D]';
      default:
        return 'bg-[#1A1A1A]';
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <AppHeader activePage="check-in" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl font-bold text-white mb-2">
              <span className="text-[#FFD700]">Check-in</span> Diario
            </h1>
            <p className="text-gray-400 mb-8">Marque sua presenca e construa sua sequencia!</p>

            {errorMessage && (
              <Card className="mb-6 border-red-500/30 bg-red-500/10 p-4">
                <p className="text-sm text-red-200">{errorMessage}</p>
              </Card>
            )}

            <Card className="bg-gradient-to-br from-[#0A0A0A] to-[#1A1A1A] border-[#333333] p-8 mb-6">
              <div className="text-center">
                <motion.div
                  animate={checkedIn ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.5 }}
                  className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-[#FFD700] to-[#FFA500] rounded-full mb-6"
                >
                  {checkedIn ? (
                    <CheckCircle2 className="w-16 h-16 text-black" />
                  ) : (
                    <Calendar className="w-16 h-16 text-black" />
                  )}
                </motion.div>

                <h2 className="text-3xl font-bold text-white mb-2">
                  {checkedIn ? 'Check-in Realizado!' : 'Pronto para Treinar?'}
                </h2>
                <p className="text-gray-400 mb-6">
                  {checkedIn
                    ? 'Otimo trabalho! Voce esta construindo consistencia.'
                    : 'Faca check-in agora para marcar a presenca de hoje'}
                </p>

                <Button
                  onClick={handleCheckIn}
                  disabled={checkedIn || saving || loading}
                  className={`w-full h-14 text-lg font-semibold ${
                    checkedIn
                      ? 'bg-[#1A1A1A] text-gray-400 cursor-not-allowed'
                      : 'bg-[#FFD700] hover:bg-[#FFC700] text-black'
                  }`}
                >
                  {saving
                    ? 'Registrando...'
                    : checkedIn
                    ? 'Check-in Ja Realizado Hoje'
                    : 'Fazer Check-in Agora'}
                </Button>
              </div>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-[#0A0A0A] border-[#333333] p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-[#FFD700]/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-[#FFD700]" />
                  </div>
                  <p className="text-sm text-gray-400">Sequencia Atual</p>
                </div>
                <p className="text-3xl font-bold text-white">
                  {loading ? '...' : stats?.streakDays ?? 0}
                </p>
                <p className="text-sm text-gray-400">dias</p>
              </Card>

              <Card className="bg-[#0A0A0A] border-[#333333] p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-[#FFD700]/20 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-[#FFD700]" />
                  </div>
                  <p className="text-sm text-gray-400">Total</p>
                </div>
                <p className="text-3xl font-bold text-white">
                  {loading ? '...' : stats?.checkins ?? 0}
                </p>
                <p className="text-sm text-gray-400">check-ins</p>
              </Card>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-4xl font-bold text-white mb-2">
                  Ranking <span className="text-[#FFD700]">Mensal</span>
                </h2>
                <p className="text-gray-400">Melhores desempenhos do mes</p>
              </div>
              <Trophy className="w-12 h-12 text-[#FFD700]" />
            </div>

            <Card className="bg-[#0A0A0A] border-[#333333] p-6">
              <div className="space-y-4">
                {loading && (
                  <div className="rounded-lg bg-[#1A1A1A] p-4 text-sm text-[#FFD700]">
                    Carregando ranking...
                  </div>
                )}

                {!loading && leaderboard.length === 0 && (
                  <div className="rounded-lg border border-dashed border-[#333333] p-4 text-sm text-gray-400">
                    Nenhum check-in registrado ainda.
                  </div>
                )}

                {!loading && leaderboard.map((user, index) => (
                  <motion.div
                    key={user.userId}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                      user.userId === authUser?.id || user.name === userName
                        ? 'bg-[#FFD700]/10 border-2 border-[#FFD700]'
                        : 'bg-[#1A1A1A] hover:bg-[#262626]'
                    }`}
                  >
                    <div
                      className={`w-12 h-12 ${getRankBadgeColor(
                        user.rank
                      )} rounded-lg flex items-center justify-center flex-shrink-0`}
                    >
                      {getRankIcon(user.rank)}
                    </div>

                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-black flex-shrink-0 ${
                        user.rank <= 3 ? 'bg-[#FFD700]' : 'bg-gray-400'
                      }`}
                    >
                      {user.avatar}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white truncate">{user.name}</p>
                      <p className="text-sm text-gray-400">
                        Sequencia de {user.streak} dias
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-bold text-[#FFD700]">{user.checkIns}</p>
                      <p className="text-xs text-gray-400">check-ins</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-[#FFD700]/10 border border-[#FFD700] rounded-lg">
                <p className="text-center text-sm text-[#FFD700] font-semibold">
                  Continue assim! Cada check-in aproxima voce do topo.
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
