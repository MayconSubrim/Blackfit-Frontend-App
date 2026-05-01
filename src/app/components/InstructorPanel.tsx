import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRightLeft,
  Calendar,
  CheckCircle2,
  Clock,
  LoaderCircle,
  Plus,
  RefreshCw,
  Save,
  Star,
  Trash2,
  TrendingUp,
  Users,
} from 'lucide-react';
import { toast } from 'sonner';
import { AppHeader } from './AppHeader';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Toaster } from './ui/sonner';
import {
  assignWorkoutToStudent,
  createInstructorWorkout,
  deleteInstructorWorkout,
  getAssignedStudentNames,
  getInitials,
  getInstructorErrorMessage,
  getInstructorStudents,
  getInstructorWorkouts,
  InstructorStudent,
  InstructorWorkout,
  removeWorkoutFromStudent,
} from '../../services/instructor';
import logoImage from 'figma:asset/63b7da44e4c6dd410d42a5c31d62c189569f14bd.png';

type WorkoutExerciseForm = {
  id: string;
  name: string;
  sets: number;
  reps: number;
  rest: string;
  description: string;
  videoUrl: string;
};

const exerciseLibrary = [
  'Supino Reto',
  'Agachamento',
  'Levantamento Terra',
  'Barra Fixa',
  'Flexoes',
  'Afundo',
  'Prancha',
  'Burpees',
  'Rosca Biceps',
  'Mergulho',
  'Desenvolvimento',
  'Leg Press',
  'Puxada',
  'Remada Sentada',
  'Abdominal Russo',
];

const weekDays = ['Segunda', 'Terca', 'Quarta', 'Quinta', 'Sexta', 'Sabado', 'Domingo'];
const difficultyOptions = ['Iniciante', 'Intermediario', 'Avancado'];

const emptyWorkoutForm = {
  title: '',
  description: '',
  studentId: '',
  dayOfWeek: '',
  difficulty: 'Intermediario',
  estimatedDuration: '',
  estimatedCalories: '',
  exercises: [] as WorkoutExerciseForm[],
};

const emptyExerciseForm = {
  name: '',
  sets: 3,
  reps: 10,
  rest: '60s',
  description: '',
  videoUrl: '',
};

export function InstructorPanel() {
  const [students, setStudents] = useState<InstructorStudent[]>([]);
  const [workouts, setWorkouts] = useState<InstructorWorkout[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedWorkoutId, setSelectedWorkoutId] = useState('');
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [savingWorkout, setSavingWorkout] = useState(false);
  const [deletingWorkoutId, setDeletingWorkoutId] = useState<string | null>(null);
  const [workoutPendingDelete, setWorkoutPendingDelete] = useState<InstructorWorkout | null>(null);
  const [removingAssignmentKey, setRemovingAssignmentKey] = useState<string | null>(null);
  const [newWorkout, setNewWorkout] = useState(emptyWorkoutForm);
  const [newExercise, setNewExercise] = useState(emptyExerciseForm);

  async function loadInstructorData() {
    try {
      setLoading(true);
      const [studentsData, workoutsData] = await Promise.all([
        getInstructorStudents(),
        getInstructorWorkouts(),
      ]);

      setStudents(studentsData);
      setWorkouts(workoutsData);
    } catch (error) {
      toast.error(getInstructorErrorMessage(error, 'Erro ao carregar dados do instrutor'));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadInstructorData();
  }, []);

  const selectedWorkout = useMemo(
    () => workouts.find((workout) => workout.id === selectedWorkoutId),
    [workouts, selectedWorkoutId]
  );

  const selectedStudent = useMemo(
    () => students.find((student) => student.id === selectedStudentId),
    [students, selectedStudentId]
  );

  const resetWorkoutForm = () => {
    setNewWorkout(emptyWorkoutForm);
    setNewExercise(emptyExerciseForm);
  };

  const addExerciseToWorkout = () => {
    const exerciseName = newExercise.name.trim();

    if (!exerciseName) {
      toast.error('Informe o nome do exercicio');
      return;
    }

    if (newExercise.sets < 1 || newExercise.reps < 1) {
      toast.error('Series e repeticoes precisam ser maiores que zero');
      return;
    }

    setNewWorkout((current) => ({
      ...current,
      exercises: [
        ...current.exercises,
        {
          id: Date.now().toString(),
          name: exerciseName,
          sets: newExercise.sets,
          reps: newExercise.reps,
          rest: newExercise.rest.trim() || '60s',
          description: newExercise.description.trim(),
          videoUrl: newExercise.videoUrl.trim(),
        },
      ],
    }));
    setNewExercise(emptyExerciseForm);
    toast.success('Exercicio adicionado ao treino');
  };

  const removeExercise = (exerciseId: string) => {
    setNewWorkout((current) => ({
      ...current,
      exercises: current.exercises.filter((exercise) => exercise.id !== exerciseId),
    }));
  };

  const stats = [
    { icon: Users, label: 'Alunos Ativos', value: students.length, color: '#FFD700' },
    {
      icon: logoImage,
      label: 'Treinos Criados',
      value: workouts.length,
      color: '#FFD700',
      isImage: true,
    },
    {
      icon: Star,
      label: 'Atribuicoes',
      value: workouts.reduce((total, workout) => total + workout.assignments.length, 0),
      color: '#FFD700',
    },
    { icon: TrendingUp, label: 'Carteira', value: loading ? '...' : 'Ativa', color: '#FFD700' },
  ];

  const handleAssignWorkout = async () => {
    if (!selectedStudentId || !selectedWorkoutId) {
      toast.error('Selecione o aluno e o treino');
      return;
    }

    try {
      setAssigning(true);
      await assignWorkoutToStudent(selectedStudentId, selectedWorkoutId);
      setSelectedStudentId('');
      setSelectedWorkoutId('');
      await loadInstructorData();
      toast.success('Treino atribuido ao aluno com sucesso');
    } catch (error) {
      toast.error(getInstructorErrorMessage(error, 'Erro ao atribuir treino'));
    } finally {
      setAssigning(false);
    }
  };

  const handleCreateWorkout = async () => {
    const duration = Number(newWorkout.estimatedDuration);
    const calories = Number(newWorkout.estimatedCalories || 250);

    if (!newWorkout.title.trim()) {
      toast.error('Informe o nome do treino');
      return;
    }

    if (!Number.isInteger(duration) || duration < 1) {
      toast.error('Informe a duracao estimada em minutos');
      return;
    }

    if (!Number.isInteger(calories) || calories < 1) {
      toast.error('Informe as calorias estimadas');
      return;
    }

    if (newWorkout.exercises.length === 0) {
      toast.error('Adicione pelo menos um exercicio');
      return;
    }

    try {
      setSavingWorkout(true);
      const createdWorkout = await createInstructorWorkout({
        title: newWorkout.title.trim(),
        description: newWorkout.description.trim() || undefined,
        estimatedCalories: calories,
        estimatedDuration: duration,
        difficulty: newWorkout.difficulty,
        dayOfWeek: newWorkout.dayOfWeek || undefined,
        exercises: newWorkout.exercises.map((exercise, index) => ({
          name: exercise.name,
          sets: exercise.sets,
          reps: exercise.reps,
          rest: exercise.rest,
          description: exercise.description || undefined,
          videoUrl: exercise.videoUrl || undefined,
          order: index + 1,
        })),
      });

      if (newWorkout.studentId) {
        await assignWorkoutToStudent(newWorkout.studentId, createdWorkout.id);
      }

      await loadInstructorData();
      setIsCreating(false);
      resetWorkoutForm();
      toast.success(
        newWorkout.studentId
          ? 'Treino criado e atribuido com sucesso'
          : 'Treino criado com sucesso'
      );
    } catch (error) {
      toast.error(getInstructorErrorMessage(error, 'Erro ao criar treino'));
    } finally {
      setSavingWorkout(false);
    }
  };

  const handleRemoveAssignedStudent = async (workoutId: string, userId: string) => {
    const assignmentKey = `${workoutId}:${userId}`;

    try {
      setRemovingAssignmentKey(assignmentKey);
      await removeWorkoutFromStudent(workoutId, userId);
      await loadInstructorData();
      toast.success('Aluno removido deste treino');
    } catch (error) {
      toast.error(getInstructorErrorMessage(error, 'Erro ao remover aluno do treino'));
    } finally {
      setRemovingAssignmentKey(null);
    }
  };

  const handleDeleteWorkout = async (workout: InstructorWorkout) => {
    try {
      setDeletingWorkoutId(workout.id);
      await deleteInstructorWorkout(workout.id);
      await loadInstructorData();
      setWorkoutPendingDelete(null);
      toast.success('Treino excluido com sucesso');
    } catch (error) {
      toast.error(getInstructorErrorMessage(error, 'Erro ao excluir treino'));
    } finally {
      setDeletingWorkoutId(null);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Toaster position="top-center" theme="dark" />
      <AppHeader instructorMode />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Painel do <span className="text-[#FFD700]">Instrutor</span>
              </h1>
              <p className="text-gray-400">
                Gerencie sua carteira e atribua fichas para os alunos vinculados.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Dialog
                open={isCreating}
                onOpenChange={(open) => {
                  setIsCreating(open);
                  if (!open) resetWorkoutForm();
                }}
              >
                <DialogTrigger asChild>
                  <Button className="bg-[#FFD700] text-black hover:bg-[#FFC700]">
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Treino
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto border-[#333333] bg-[#0A0A0A] text-white">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-white">
                      Criar Novo Treino
                    </DialogTitle>
                  </DialogHeader>

                  <div className="mt-4 space-y-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm text-gray-300">Nome do treino</label>
                        <Input
                          value={newWorkout.title}
                          onChange={(event) =>
                            setNewWorkout({ ...newWorkout, title: event.target.value })
                          }
                          placeholder="Ex: Forca de membros superiores"
                          className="border-[#333333] bg-[#1A1A1A] text-white"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm text-gray-300">
                          Atribuir para aluno
                        </label>
                        <Select
                          value={newWorkout.studentId}
                          onValueChange={(value) =>
                            setNewWorkout({ ...newWorkout, studentId: value })
                          }
                        >
                          <SelectTrigger className="border-[#333333] bg-[#1A1A1A] text-white">
                            <SelectValue placeholder="Opcional" />
                          </SelectTrigger>
                          <SelectContent className="border-[#333333] bg-[#1A1A1A] text-white">
                            {students.map((student) => (
                              <SelectItem key={student.id} value={student.id}>
                                {student.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm text-gray-300">Dia da semana</label>
                        <Select
                          value={newWorkout.dayOfWeek}
                          onValueChange={(value) =>
                            setNewWorkout({ ...newWorkout, dayOfWeek: value })
                          }
                        >
                          <SelectTrigger className="border-[#333333] bg-[#1A1A1A] text-white">
                            <SelectValue placeholder="Selecione o dia" />
                          </SelectTrigger>
                          <SelectContent className="border-[#333333] bg-[#1A1A1A] text-white">
                            {weekDays.map((day) => (
                              <SelectItem key={day} value={day}>
                                {day}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm text-gray-300">Dificuldade</label>
                        <Select
                          value={newWorkout.difficulty}
                          onValueChange={(value) =>
                            setNewWorkout({ ...newWorkout, difficulty: value })
                          }
                        >
                          <SelectTrigger className="border-[#333333] bg-[#1A1A1A] text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="border-[#333333] bg-[#1A1A1A] text-white">
                            {difficultyOptions.map((difficulty) => (
                              <SelectItem key={difficulty} value={difficulty}>
                                {difficulty}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm text-gray-300">
                          Duracao estimada
                        </label>
                        <Input
                          type="number"
                          min={1}
                          value={newWorkout.estimatedDuration}
                          onChange={(event) =>
                            setNewWorkout({
                              ...newWorkout,
                              estimatedDuration: event.target.value,
                            })
                          }
                          placeholder="Ex: 45"
                          className="border-[#333333] bg-[#1A1A1A] text-white"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm text-gray-300">
                          Calorias estimadas
                        </label>
                        <Input
                          type="number"
                          min={1}
                          value={newWorkout.estimatedCalories}
                          onChange={(event) =>
                            setNewWorkout({
                              ...newWorkout,
                              estimatedCalories: event.target.value,
                            })
                          }
                          placeholder="Ex: 350"
                          className="border-[#333333] bg-[#1A1A1A] text-white"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="mb-2 block text-sm text-gray-300">Descricao</label>
                        <Input
                          value={newWorkout.description}
                          onChange={(event) =>
                            setNewWorkout({ ...newWorkout, description: event.target.value })
                          }
                          placeholder="Objetivo ou observacao do treino"
                          className="border-[#333333] bg-[#1A1A1A] text-white"
                        />
                      </div>
                    </div>

                    <div className="border-t border-[#333333] pt-6">
                      <div className="mb-4 flex items-center justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-bold text-white">Adicionar Exercicios</h3>
                          <p className="mt-1 text-sm text-gray-400">
                            Inclua series, repeticoes, descanso e o link do video.
                          </p>
                        </div>
                        <span className="rounded-full border border-[#FFD700]/20 bg-[#FFD700]/10 px-3 py-1 text-xs uppercase tracking-[0.14em] text-[#FFD700]">
                          {newWorkout.exercises.length} adicionados
                        </span>
                      </div>

                      <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                        <div>
                          <label className="mb-2 block text-sm text-gray-300">
                            Exercicio da biblioteca
                          </label>
                          <Select
                            value={exerciseLibrary.includes(newExercise.name) ? newExercise.name : ''}
                            onValueChange={(value) =>
                              setNewExercise({ ...newExercise, name: value })
                            }
                          >
                            <SelectTrigger className="border-[#333333] bg-[#1A1A1A] text-white">
                              <SelectValue placeholder="Selecione ou digite ao lado" />
                            </SelectTrigger>
                            <SelectContent className="border-[#333333] bg-[#1A1A1A] text-white">
                              {exerciseLibrary.map((exercise) => (
                                <SelectItem key={exercise} value={exercise}>
                                  {exercise}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="mb-2 block text-sm text-gray-300">
                            Nome do exercicio
                          </label>
                          <Input
                            value={newExercise.name}
                            onChange={(event) =>
                              setNewExercise({ ...newExercise, name: event.target.value })
                            }
                            placeholder="Ex: Elevacao lateral com halteres"
                            className="border-[#333333] bg-[#1A1A1A] text-white"
                          />
                        </div>
                      </div>

                      <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-3">
                        <Input
                          type="number"
                          min={1}
                          value={newExercise.sets}
                          onChange={(event) =>
                            setNewExercise({
                              ...newExercise,
                              sets: Number(event.target.value || 0),
                            })
                          }
                          placeholder="Series"
                          className="border-[#333333] bg-[#1A1A1A] text-white"
                        />
                        <Input
                          type="number"
                          min={1}
                          value={newExercise.reps}
                          onChange={(event) =>
                            setNewExercise({
                              ...newExercise,
                              reps: Number(event.target.value || 0),
                            })
                          }
                          placeholder="Reps"
                          className="border-[#333333] bg-[#1A1A1A] text-white"
                        />
                        <Input
                          value={newExercise.rest}
                          onChange={(event) =>
                            setNewExercise({ ...newExercise, rest: event.target.value })
                          }
                          placeholder="Descanso ex: 60s"
                          className="border-[#333333] bg-[#1A1A1A] text-white"
                        />
                      </div>

                      <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                        <Input
                          value={newExercise.videoUrl}
                          onChange={(event) =>
                            setNewExercise({ ...newExercise, videoUrl: event.target.value })
                          }
                          placeholder="Link do video"
                          className="border-[#333333] bg-[#1A1A1A] text-white"
                        />
                        <Input
                          value={newExercise.description}
                          onChange={(event) =>
                            setNewExercise({ ...newExercise, description: event.target.value })
                          }
                          placeholder="Descricao opcional do exercicio"
                          className="border-[#333333] bg-[#1A1A1A] text-white"
                        />
                      </div>

                      <Button
                        type="button"
                        onClick={addExerciseToWorkout}
                        className="w-full border border-[#333333] bg-[#1A1A1A] text-[#FFD700] hover:bg-[#262626]"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar Exercicio
                      </Button>

                      {newWorkout.exercises.length > 0 ? (
                        <div className="mt-4 space-y-2">
                          {newWorkout.exercises.map((exercise) => (
                            <div
                              key={exercise.id}
                              className="flex items-center justify-between rounded-lg bg-[#1A1A1A] p-3"
                            >
                              <div>
                                <p className="font-semibold text-white">{exercise.name}</p>
                                <p className="text-sm text-gray-400">
                                  {exercise.sets} series x {exercise.reps} reps - descanso{' '}
                                  {exercise.rest}
                                </p>
                                {exercise.videoUrl && (
                                  <p className="mt-1 text-xs text-[#FFD700]">
                                    Video vinculado
                                  </p>
                                )}
                              </div>
                              <Button
                                type="button"
                                onClick={() => removeExercise(exercise.id)}
                                variant="ghost"
                                size="icon"
                                className="text-red-400 hover:text-red-300"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="mt-4 rounded-lg border border-dashed border-[#333333] p-4 text-sm text-gray-400">
                          Nenhum exercicio adicionado ainda.
                        </div>
                      )}
                    </div>

                    <Button
                      onClick={handleCreateWorkout}
                      disabled={savingWorkout}
                      className="h-12 w-full bg-[#FFD700] font-semibold text-black hover:bg-[#FFC700]"
                    >
                      {savingWorkout ? (
                        <>
                          <LoaderCircle className="w-5 h-5 mr-2 animate-spin" />
                          Salvando
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5 mr-2" />
                          Salvar Treino
                        </>
                      )}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Button
                onClick={loadInstructorData}
                disabled={loading}
                variant="outline"
                className="border-[#333333] text-[#FFD700] hover:bg-[#1A1A1A]"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Atualizar
              </Button>
            </div>
          </div>
        </motion.div>

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
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                </div>
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}20` }}
                >
                  {stat.isImage ? (
                    <img src={stat.icon as string} alt="" className="w-6 h-6 object-contain opacity-70" />
                  ) : (
                    <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
                  )}
                </div>
              </div>
            </Card>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Meus Alunos</h2>
              <Users className="w-5 h-5 text-[#FFD700]" />
            </div>

            <div className="space-y-3">
              {loading && (
                <Card className="bg-[#0A0A0A] border-[#333333] p-4">
                  <p className="text-[#FFD700]">Carregando alunos...</p>
                </Card>
              )}

              {!loading && students.length === 0 && (
                <Card className="bg-[#0A0A0A] border-[#333333] p-4">
                  <p className="text-sm text-gray-400">Nenhum aluno vinculado ainda.</p>
                </Card>
              )}

              {students.map((student) => (
                <Card
                  key={student.id}
                  className="bg-[#0A0A0A] border-[#333333] p-4 hover:border-[#FFD700] transition-colors"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-[#FFD700] rounded-full flex items-center justify-center font-bold text-black text-sm">
                      {getInitials(student.name)}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-white">{student.name}</p>
                      <p className="text-xs text-gray-400">{student.email}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400">{student.workouts} treinos atribuidos</p>
                </Card>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Atribuir Treino</h2>
              <ArrowRightLeft className="w-5 h-5 text-[#FFD700]" />
            </div>

            <Card className="bg-[#0A0A0A] border-[#333333] p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4">
                <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                  <SelectTrigger className="h-12 bg-[#1A1A1A] border-[#333333] text-white">
                    <SelectValue placeholder="Selecione o aluno" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A1A1A] border-[#333333] text-white">
                    {students.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedWorkoutId} onValueChange={setSelectedWorkoutId}>
                  <SelectTrigger className="h-12 bg-[#1A1A1A] border-[#333333] text-white">
                    <SelectValue placeholder="Selecione o treino" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1A1A1A] border-[#333333] text-white">
                    {workouts.map((workout) => (
                      <SelectItem key={workout.id} value={workout.id}>
                        {workout.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  onClick={handleAssignWorkout}
                  disabled={assigning || loading}
                  className="h-12 bg-[#FFD700] hover:bg-[#FFC700] text-black"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {assigning ? 'Atribuindo...' : 'Atribuir'}
                </Button>
              </div>

              {(selectedStudent || selectedWorkout) && (
                <div className="mt-5 rounded-lg border border-[#333333] bg-[#1A1A1A] p-4">
                  <p className="text-sm text-gray-400">
                    Aluno:{' '}
                    <span className="font-semibold text-white">
                      {selectedStudent?.name || 'Nao selecionado'}
                    </span>
                  </p>
                  <p className="mt-2 text-sm text-gray-400">
                    Treino:{' '}
                    <span className="font-semibold text-white">
                      {selectedWorkout?.title || 'Nao selecionado'}
                    </span>
                  </p>
                </div>
              )}
            </Card>

            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Programas de Treino</h2>
              <Calendar className="w-5 h-5 text-[#FFD700]" />
            </div>

            <div className="space-y-4">
              {loading && (
                <Card className="bg-[#0A0A0A] border-[#333333] p-6">
                  <p className="text-[#FFD700]">Carregando treinos...</p>
                </Card>
              )}

              {!loading && workouts.length === 0 && (
                <Card className="bg-[#0A0A0A] border-[#333333] p-12">
                  <div className="text-center">
                    <img src={logoImage} alt="" className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-gray-400">Nenhum treino criado ainda</p>
                  </div>
                </Card>
              )}

              {workouts.map((workout) => (
                <Card
                  key={workout.id}
                  className="bg-[#0A0A0A] border-[#333333] p-6 hover:border-[#FFD700] transition-colors"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-bold text-white">{workout.title}</h3>
                        {workout.assignments.length > 0 && (
                          <CheckCircle2 className="w-5 h-5 text-[#FFD700]" />
                        )}
                      </div>
                      <p className="text-sm text-gray-400 mb-3">
                        Atribuido a:{' '}
                        <span className="text-[#FFD700]">
                          {getAssignedStudentNames(workout)}
                        </span>
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {workout.estimatedDuration} min
                        </span>
                        <span className="px-2 py-1 bg-[#FFD700]/20 text-[#FFD700] rounded text-xs font-semibold">
                          {workout.difficulty || 'Nao informado'}
                        </span>
                        <span>{workout.exercises.length} exercicios</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full border border-[#333333] px-3 py-1 text-xs text-gray-400">
                        {workout.assignments.length} alunos
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setWorkoutPendingDelete(workout)}
                        disabled={deletingWorkoutId === workout.id}
                        className="text-gray-400 hover:text-red-400"
                      >
                        {deletingWorkoutId === workout.id ? (
                          <LoaderCircle className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {workout.assignments.length > 0 ? (
                      workout.assignments.map((assignment) => {
                        const assignmentUserId = assignment.user?.id || assignment.userId;
                        const assignmentUserName = assignment.user?.name || 'Aluno';
                        const assignmentKey = `${workout.id}:${assignmentUserId}`;

                        return (
                          <button
                            key={assignmentKey}
                            type="button"
                            onClick={() =>
                              assignmentUserId &&
                              handleRemoveAssignedStudent(workout.id, assignmentUserId)
                            }
                            disabled={
                              !assignmentUserId || removingAssignmentKey === assignmentKey
                            }
                            className="rounded-full border border-[#FFD700]/20 bg-[#FFD700]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#FFD700] transition-colors hover:border-red-400/30 hover:bg-red-500/10 hover:text-red-300 disabled:opacity-60"
                            title="Remover este aluno do treino"
                          >
                            {removingAssignmentKey === assignmentKey
                              ? 'Removendo...'
                              : `${assignmentUserName} x`}
                          </button>
                        );
                      })
                    ) : (
                      <span className="rounded-full border border-[#333333] px-3 py-1 text-xs uppercase tracking-[0.12em] text-gray-500">
                        Sem atribuicao
                      </span>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      <AlertDialog
        open={Boolean(workoutPendingDelete)}
        onOpenChange={(open) => {
          if (!open) setWorkoutPendingDelete(null);
        }}
      >
        <AlertDialogContent className="border-[#333333] bg-[#0A0A0A] text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold text-white">
              Excluir treino?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Esta acao remove a ficha{' '}
              <span className="font-semibold text-white">
                {workoutPendingDelete?.title || 'selecionada'}
              </span>
              , seus exercicios e todas as atribuicoes feitas aos alunos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[#333333] bg-transparent text-white hover:bg-[#1A1A1A]">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => workoutPendingDelete && handleDeleteWorkout(workoutPendingDelete)}
              disabled={Boolean(deletingWorkoutId)}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              {deletingWorkoutId ? 'Excluindo...' : 'Excluir treino'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
