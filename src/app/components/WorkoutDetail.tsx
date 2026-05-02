import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { motion } from 'motion/react';
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  LoaderCircle,
  PlayCircle,
  Printer,
  Target,
} from 'lucide-react';
import { toast } from 'sonner';
import { AppHeader } from './AppHeader';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { Toaster } from './ui/sonner';
import {
  finishWorkoutSession,
  getWorkoutCooldownInfo,
  getWorkoutDetail,
  getWorkoutErrorMessage,
  startWorkoutSession,
  WorkoutDetailData,
  WorkoutSession,
} from '../../services/workouts';
import logoImage from 'figma:asset/63b7da44e4c6dd410d42a5c31d62c189569f14bd.png';

function getVideoEmbedUrl(videoUrl?: string | null) {
  if (!videoUrl) return '';

  // transforma links comuns do YouTube em URL embed para tocar dentro da tela
  const watchMatch = videoUrl.match(/[?&]v=([^&]+)/);
  if (watchMatch?.[1]) return `https://www.youtube.com/embed/${watchMatch[1]}`;

  const shortMatch = videoUrl.match(/youtu\.be\/([^?]+)/);
  if (shortMatch?.[1]) return `https://www.youtube.com/embed/${shortMatch[1]}`;

  return videoUrl;
}

export function WorkoutDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState<WorkoutDetailData | null>(null);
  const [activeSession, setActiveSession] = useState<WorkoutSession | null>(null);
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);
  const [completedSets, setCompletedSets] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [savingSession, setSavingSession] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  async function loadWorkoutDetail() {
    if (!id) return;

    try {
      setLoading(true);
      setErrorMessage('');
      const data = await getWorkoutDetail(id);
      setWorkout(data);
      setActiveSession(data.activeSession ?? null);
    } catch (error) {
      setErrorMessage(getWorkoutErrorMessage(error, 'Erro ao carregar treino'));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadWorkoutDetail();
  }, [id]);

  const totalSets = useMemo(
    () => workout?.exercises.reduce((total, exercise) => total + exercise.sets, 0) ?? 0,
    [workout]
  );

  const completedTotal = useMemo(
    () => Object.values(completedSets).reduce((total, value) => total + value, 0),
    [completedSets]
  );

  const progress = totalSets > 0 ? Math.round((completedTotal / totalSets) * 100) : 0;
  const cooldown = getWorkoutCooldownInfo(workout?.lastCompletedAt);

  const handlePrint = () => {
    window.print();
  };

  const toggleExercise = (exerciseId: string) => {
    setExpandedExercise(expandedExercise === exerciseId ? null : exerciseId);
  };

  const markSetComplete = (exerciseId: string) => {
    if (!activeSession) {
      toast.error('Inicie o treino antes de marcar series');
      return;
    }

    const exercise = workout?.exercises.find((item) => item.id === exerciseId);
    if (!exercise) return;

    const current = completedSets[exerciseId] || 0;
    if (current < exercise.sets) {
      setCompletedSets({ ...completedSets, [exerciseId]: current + 1 });
    }
  };

  const handleStartWorkout = async () => {
    if (!workout) return;

    if (cooldown.blocked) {
      toast.error(`Esse treino fica bloqueado por 24h. Tente novamente em ${cooldown.remainingText}.`);
      return;
    }

    try {
      setSavingSession(true);
      const session = await startWorkoutSession(workout.id);
      setActiveSession(session);
      toast.success('Treino iniciado');
    } catch (error) {
      toast.error(getWorkoutErrorMessage(error, 'Erro ao iniciar treino'));
    } finally {
      setSavingSession(false);
    }
  };

  const handleFinishWorkout = async () => {
    if (!activeSession) {
      toast.error('Inicie o treino antes de finalizar');
      return;
    }

    try {
      setSavingSession(true);
      await finishWorkoutSession(activeSession.id, {
        actualCalories: workout?.estimatedCalories,
      });
      setActiveSession(null);
      await loadWorkoutDetail();
      toast.success('Treino finalizado com sucesso');
    } catch (error) {
      toast.error(getWorkoutErrorMessage(error, 'Erro ao finalizar treino'));
    } finally {
      setSavingSession(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Toaster position="top-center" theme="dark" />
      <style>{`
        @media print {
          header, .no-print { display: none !important; }
          .print-only { display: block !important; }
          body { background: white !important; color: black !important; }
          * { color: black !important; background: white !important; }
        }
        .print-only { display: none; }
      `}</style>

      <AppHeader activePage="workouts" showBackButton noPrint />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && (
          <Card className="bg-[#0A0A0A] border-[#333333] p-10">
            <p className="text-[#FFD700]">Carregando treino...</p>
          </Card>
        )}

        {!loading && errorMessage && (
          <Card className="bg-red-500/10 border-red-500/30 p-6">
            <p className="text-red-200">{errorMessage}</p>
            <Button
              onClick={() => navigate('/dashboard')}
              className="mt-4 bg-[#FFD700] text-black hover:bg-[#FFC700]"
            >
              Voltar ao dashboard
            </Button>
          </Card>
        )}

        {!loading && workout && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-white mb-3">{workout.name}</h1>
                  <p className="text-gray-400 mb-4">{workout.description}</p>

                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-[#0A0A0A] rounded-lg border border-[#333333]">
                      <Clock className="w-5 h-5 text-[#FFD700]" />
                      <span className="text-white">{workout.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-[#0A0A0A] rounded-lg border border-[#333333]">
                      <Target className="w-5 h-5 text-[#FFD700]" />
                      <span className="text-white">{workout.difficulty}</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-[#0A0A0A] rounded-lg border border-[#333333]">
                      <img src={logoImage} alt="" className="w-5 h-5 opacity-70" />
                      <span className="text-white">{workout.exercises.length} exercicios</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 no-print sm:flex-row">
                  <Button
                    onClick={handlePrint}
                    variant="outline"
                    className="border-[#333333] text-white hover:bg-[#1A1A1A] hover:text-[#FFD700]"
                  >
                    <Printer className="w-4 h-4 mr-2" />
                    Imprimir Ficha
                  </Button>
                  <Button
                    onClick={activeSession ? handleFinishWorkout : handleStartWorkout}
                    disabled={savingSession || (!activeSession && cooldown.blocked)}
                    className={
                      activeSession
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : 'bg-[#FFD700] text-black hover:bg-[#FFC700]'
                    }
                  >
                    {savingSession && <LoaderCircle className="w-4 h-4 mr-2 animate-spin" />}
                    {activeSession
                      ? 'Finalizar Treino'
                      : cooldown.blocked
                      ? `Disponivel em ${cooldown.remainingText}`
                      : 'Iniciar Treino'}
                  </Button>
                </div>
              </div>

              <Card className="bg-[#0A0A0A] border-[#333333] p-6 no-print">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-white">Progresso do Treino</h3>
                    <p className="text-sm text-gray-400">
                      {activeSession
                        ? 'Sessao em andamento'
                        : cooldown.blocked
                        ? 'Treino concluido recentemente. Nova execucao liberada apos 24h.'
                        : 'Inicie para registrar as series'}
                    </p>
                  </div>
                  <span className="text-[#FFD700] font-bold">{progress}%</span>
                </div>
                <Progress value={progress} className="h-3 bg-[#1A1A1A]" />
                <p className="text-sm text-gray-400 mt-2">
                  {completedTotal} de {totalSets} series completadas
                </p>
              </Card>
            </motion.div>

            <div className="print-only mb-8">
              <h1 className="text-3xl font-bold mb-2">{workout.name}</h1>
              <p className="mb-4">{workout.description}</p>
              <p>
                <strong>Duracao:</strong> {workout.duration} | <strong>Dificuldade:</strong>{' '}
                {workout.difficulty}
              </p>
              <hr className="my-4" />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <Card className="bg-[#0A0A0A] border-[#333333] p-6">
                <h2 className="text-xl font-bold text-white mb-4">Resumo do Treino</h2>
                <ul className="space-y-2">
                  <li className="flex items-center gap-3 text-gray-300">
                    <div className="w-2 h-2 bg-[#FFD700] rounded-full" />
                    Calorias estimadas: {workout.estimatedCalories} kcal
                  </li>
                  <li className="flex items-center gap-3 text-gray-300">
                    <div className="w-2 h-2 bg-[#FFD700] rounded-full" />
                    Dia sugerido: {workout.dayOfWeek}
                  </li>
                  <li className="flex items-center gap-3 text-gray-300">
                    <div className="w-2 h-2 bg-[#FFD700] rounded-full" />
                    Total de exercicios: {workout.exercises.length}
                  </li>
                </ul>
              </Card>
            </motion.div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white mb-4">Exercicios</h2>

              {workout.exercises.map((exercise, index) => {
                const embedUrl = getVideoEmbedUrl(exercise.videoUrl);

                return (
                  <motion.div
                    key={exercise.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    <Card className="bg-[#0A0A0A] border-[#333333] overflow-hidden">
                      <div
                        onClick={() => toggleExercise(exercise.id)}
                        className="p-6 cursor-pointer hover:bg-[#1A1A1A] transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-2xl font-bold text-[#FFD700]">
                                #{index + 1}
                              </span>
                              <h3 className="text-xl font-bold text-white">{exercise.name}</h3>
                            </div>
                            <p className="text-sm text-gray-400 mb-3">
                              {exercise.description || 'Sem descricao adicional.'}
                            </p>
                            <div className="flex flex-wrap gap-4 text-sm">
                              <span className="text-white">
                                <strong className="text-[#FFD700]">Series:</strong>{' '}
                                {exercise.sets}
                              </span>
                              <span className="text-white">
                                <strong className="text-[#FFD700]">Repeticoes:</strong>{' '}
                                {exercise.reps}
                              </span>
                              <span className="text-white">
                                <strong className="text-[#FFD700]">Descanso:</strong>{' '}
                                {exercise.rest}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 no-print">
                            <Button
                              onClick={(event) => {
                                event.stopPropagation();
                                markSetComplete(exercise.id);
                              }}
                              size="sm"
                              className="bg-[#FFD700] hover:bg-[#FFC700] text-black"
                            >
                              {completedSets[exercise.id] || 0}/{exercise.sets}
                            </Button>
                            {expandedExercise === exercise.id ? (
                              <ChevronUp className="w-5 h-5 text-[#FFD700]" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                        </div>
                      </div>

                      {expandedExercise === exercise.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          className="border-t border-[#333333]"
                        >
                          <div className="p-6 space-y-6">
                            <div>
                              <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                                <PlayCircle className="w-5 h-5 text-[#FFD700]" />
                                Video Tutorial
                              </h4>
                              {embedUrl ? (
                                <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                                  <iframe
                                    width="100%"
                                    height="100%"
                                    src={embedUrl}
                                    title={exercise.name}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="absolute inset-0"
                                  />
                                </div>
                              ) : (
                                <div className="rounded-lg border border-dashed border-[#333333] p-5 text-sm text-gray-400">
                                  Nenhum video foi vinculado a este exercicio.
                                </div>
                              )}
                            </div>

                            <div>
                              <h4 className="font-semibold text-white mb-3">Orientacao</h4>
                              <div className="flex items-start gap-3 text-gray-300">
                                <CheckCircle2 className="w-5 h-5 text-[#FFD700] flex-shrink-0 mt-0.5" />
                                <span>
                                  Execute com controle, respeitando a quantidade de series,
                                  repeticoes e descanso definidos pelo instrutor.
                                </span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      <div className="print-only p-6">
                        <p className="mb-2">
                          <strong>Descricao:</strong>{' '}
                          {exercise.description || 'Sem descricao adicional.'}
                        </p>
                        <p className="mb-2">
                          <strong>Series:</strong> {exercise.sets} |{' '}
                          <strong>Repeticoes:</strong> {exercise.reps} |{' '}
                          <strong>Descanso:</strong> {exercise.rest}
                        </p>
                        {exercise.videoUrl && (
                          <p>
                            <strong>Video:</strong> {exercise.videoUrl}
                          </p>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 flex gap-4 no-print"
            >
              <Button
                onClick={activeSession ? handleFinishWorkout : handleStartWorkout}
                disabled={savingSession || (!activeSession && cooldown.blocked)}
                className="flex-1 h-14 bg-[#FFD700] hover:bg-[#FFC700] text-black font-semibold text-lg"
              >
                {savingSession && <LoaderCircle className="w-5 h-5 mr-2 animate-spin" />}
                {activeSession
                  ? 'Finalizar Treino'
                  : cooldown.blocked
                  ? `Disponivel em ${cooldown.remainingText}`
                  : 'Iniciar Treino'}
              </Button>
              <Button
                onClick={() => navigate('/dashboard')}
                variant="outline"
                className="h-14 border-[#333333] text-white hover:bg-[#1A1A1A]"
              >
                Voltar
              </Button>
            </motion.div>
          </>
        )}
      </main>
    </div>
  );
}
