import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Plus,
  Users,
  Calendar,
  Edit,
  Trash2,
  Save,
  Star,
  TrendingUp,
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { toast } from 'sonner';
import { Toaster } from './ui/sonner';
import { AppHeader } from './AppHeader';
import logoImage from 'figma:asset/63b7da44e4c6dd410d42a5c31d62c189569f14bd.png';

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  rest: string;
}

interface Workout {
  id: number;
  name: string;
  student: string;
  dayOfWeek: string;
  exercises: Exercise[];
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado';
  duration: string;
}

const mockStudents = [
  { id: 1, name: 'João Silva', level: 'Intermediário', workouts: 3 },
  { id: 2, name: 'Maria Santos', level: 'Avançado', workouts: 5 },
  { id: 3, name: 'Pedro Costa', level: 'Iniciante', workouts: 2 },
  { id: 4, name: 'Ana Paula', level: 'Intermediário', workouts: 4 },
];

const exerciseLibrary = [
  'Supino Reto',
  'Agachamento',
  'Levantamento Terra',
  'Barra Fixa',
  'Flexões',
  'Afundo',
  'Prancha',
  'Burpees',
  'Rosca Bíceps',
  'Mergulho',
  'Desenvolvimento',
  'Leg Press',
  'Puxada',
  'Remada Sentada',
  'Abdominal Russo',
];

export function InstructorPanel() {
  const [workouts, setWorkouts] = useState<Workout[]>([
    {
      id: 1,
      name: 'Força de Membros Superiores',
      student: 'João Silva',
      dayOfWeek: 'Segunda',
      exercises: [
        { id: '1', name: 'Supino Reto', sets: 4, reps: 10, rest: '90s' },
        { id: '2', name: 'Barra Fixa', sets: 3, reps: 12, rest: '60s' },
      ],
      difficulty: 'Intermediário',
      duration: '45 min',
    },
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
  const [newWorkout, setNewWorkout] = useState({
    name: '',
    student: '',
    dayOfWeek: '',
    difficulty: 'Intermediário' as const,
    duration: '',
    exercises: [] as Exercise[],
  });

  const [newExercise, setNewExercise] = useState({
    name: '',
    sets: 3,
    reps: 10,
    rest: '60s',
  });

  const addExerciseToWorkout = () => {
    if (!newExercise.name) return;

    const exercise: Exercise = {
      id: Date.now().toString(),
      ...newExercise,
    };

    setNewWorkout({
      ...newWorkout,
      exercises: [...newWorkout.exercises, exercise],
    });

    setNewExercise({ name: '', sets: 3, reps: 10, rest: '60s' });
  };

  const removeExercise = (exerciseId: string) => {
    setNewWorkout({
      ...newWorkout,
      exercises: newWorkout.exercises.filter((ex) => ex.id !== exerciseId),
    });
  };

  const saveWorkout = () => {
    if (!newWorkout.name || !newWorkout.student || newWorkout.exercises.length === 0) {
      toast.error('Preencha todos os campos obrigatórios e adicione pelo menos um exercício');
      return;
    }

    const workout: Workout = {
      id: Date.now(),
      ...newWorkout,
    };

    setWorkouts([...workouts, workout]);
    setIsCreating(false);
    setNewWorkout({
      name: '',
      student: '',
      dayOfWeek: '',
      difficulty: 'Intermediário',
      duration: '',
      exercises: [],
    });
    toast.success('Treino criado com sucesso!');
  };

  const deleteWorkout = (id: number) => {
    setWorkouts(workouts.filter((w) => w.id !== id));
    toast.success('Treino excluído');
  };

  const stats = [
    { icon: Users, label: 'Alunos Ativos', value: mockStudents.length, color: '#FFD700' },
    { icon: logoImage, label: 'Treinos Criados', value: workouts.length, color: '#FFD700', isImage: true },
    { icon: Star, label: 'Avaliação Média', value: '4.8', color: '#FFD700' },
    { icon: TrendingUp, label: 'Este Mês', value: '+12%', color: '#FFD700' },
  ];

  return (
    <div className="min-h-screen bg-black">
      <Toaster position="top-center" theme="dark" />

      <AppHeader instructorMode />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            Painel do <span className="text-[#FFD700]">Instrutor</span>
          </h1>
          <p className="text-gray-400">Gerencie seus alunos e crie treinos personalizados</p>
        </motion.div>

        {/* Stats */}
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

        {/* Students & Workouts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Students List */}
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
              {mockStudents.map((student, index) => (
                <Card
                  key={student.id}
                  className="bg-[#0A0A0A] border-[#333333] p-4 hover:border-[#FFD700] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-[#FFD700] rounded-full flex items-center justify-center font-bold text-black text-sm">
                      {student.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-white">{student.name}</p>
                      <p className="text-xs text-gray-400">{student.level}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400">
                    {student.workouts} treinos ativos
                  </p>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* Workouts Management */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">Programas de Treino</h2>
              <Dialog open={isCreating} onOpenChange={setIsCreating}>
                <DialogTrigger asChild>
                  <Button className="bg-[#FFD700] hover:bg-[#FFC700] text-black">
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Treino
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#0A0A0A] border-[#333333] text-white max-w-3xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-white">
                      Criar Novo Treino
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6 mt-4">
                    {/* Basic Info */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-300 mb-2 block">Nome do Treino</label>
                        <Input
                          value={newWorkout.name}
                          onChange={(e) => setNewWorkout({ ...newWorkout, name: e.target.value })}
                          placeholder="Ex: Força de Membros Superiores"
                          className="bg-[#1A1A1A] border-[#333333] text-white"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-300 mb-2 block">Aluno</label>
                        <Select
                          value={newWorkout.student}
                          onValueChange={(value) => setNewWorkout({ ...newWorkout, student: value })}
                        >
                          <SelectTrigger className="bg-[#1A1A1A] border-[#333333] text-white">
                            <SelectValue placeholder="Selecione o aluno" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#1A1A1A] border-[#333333]">
                            {mockStudents.map((student) => (
                              <SelectItem key={student.id} value={student.name} className="text-white">
                                {student.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm text-gray-300 mb-2 block">Dia da Semana</label>
                        <Select
                          value={newWorkout.dayOfWeek}
                          onValueChange={(value) => setNewWorkout({ ...newWorkout, dayOfWeek: value })}
                        >
                          <SelectTrigger className="bg-[#1A1A1A] border-[#333333] text-white">
                            <SelectValue placeholder="Selecione o dia" />
                          </SelectTrigger>
                          <SelectContent className="bg-[#1A1A1A] border-[#333333]">
                            {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].map((day) => (
                              <SelectItem key={day} value={day} className="text-white">
                                {day}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm text-gray-300 mb-2 block">Dificuldade</label>
                        <Select
                          value={newWorkout.difficulty}
                          onValueChange={(value: any) => setNewWorkout({ ...newWorkout, difficulty: value })}
                        >
                          <SelectTrigger className="bg-[#1A1A1A] border-[#333333] text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-[#1A1A1A] border-[#333333]">
                            <SelectItem value="Iniciante" className="text-white">Iniciante</SelectItem>
                            <SelectItem value="Intermediário" className="text-white">Intermediário</SelectItem>
                            <SelectItem value="Avançado" className="text-white">Avançado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm text-gray-300 mb-2 block">Duração</label>
                        <Input
                          value={newWorkout.duration}
                          onChange={(e) => setNewWorkout({ ...newWorkout, duration: e.target.value })}
                          placeholder="Ex: 45 min"
                          className="bg-[#1A1A1A] border-[#333333] text-white"
                        />
                      </div>
                    </div>

                    {/* Add Exercises */}
                    <div className="border-t border-[#333333] pt-6">
                      <h3 className="text-lg font-bold text-white mb-4">Adicionar Exercícios</h3>
                      <div className="grid grid-cols-4 gap-3 mb-4">
                        <div className="col-span-2">
                          <Select value={newExercise.name} onValueChange={(value) => setNewExercise({ ...newExercise, name: value })}>
                            <SelectTrigger className="bg-[#1A1A1A] border-[#333333] text-white">
                              <SelectValue placeholder="Selecione exercício" />
                            </SelectTrigger>
                            <SelectContent className="bg-[#1A1A1A] border-[#333333]">
                              {exerciseLibrary.map((ex) => (
                                <SelectItem key={ex} value={ex} className="text-white">
                                  {ex}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <Input
                          type="number"
                          value={newExercise.sets}
                          onChange={(e) => setNewExercise({ ...newExercise, sets: parseInt(e.target.value) })}
                          placeholder="Séries"
                          className="bg-[#1A1A1A] border-[#333333] text-white"
                        />
                        <Input
                          type="number"
                          value={newExercise.reps}
                          onChange={(e) => setNewExercise({ ...newExercise, reps: parseInt(e.target.value) })}
                          placeholder="Reps"
                          className="bg-[#1A1A1A] border-[#333333] text-white"
                        />
                      </div>
                      <Button
                        type="button"
                        onClick={addExerciseToWorkout}
                        className="w-full bg-[#1A1A1A] hover:bg-[#262626] text-[#FFD700] border border-[#333333]"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar Exercício
                      </Button>

                      {/* Exercise List */}
                      {newWorkout.exercises.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {newWorkout.exercises.map((exercise) => (
                            <div
                              key={exercise.id}
                              className="flex items-center justify-between bg-[#1A1A1A] p-3 rounded-lg"
                            >
                              <div>
                                <p className="font-semibold text-white">{exercise.name}</p>
                                <p className="text-sm text-gray-400">
                                  {exercise.sets} séries × {exercise.reps} reps
                                </p>
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
                      )}
                    </div>

                    {/* Save Button */}
                    <Button
                      onClick={saveWorkout}
                      className="w-full h-12 bg-[#FFD700] hover:bg-[#FFC700] text-black font-semibold"
                    >
                      <Save className="w-5 h-5 mr-2" />
                      Salvar Treino
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Workouts List */}
            <div className="space-y-4">
              {workouts.length === 0 ? (
                <Card className="bg-[#0A0A0A] border-[#333333] p-12">
                  <div className="text-center">
                    <img src={logoImage} alt="" className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-gray-400">Nenhum treino criado ainda</p>
                    <p className="text-sm text-gray-500 mt-2">Clique em "Criar Treino" para começar</p>
                  </div>
                </Card>
              ) : (
                workouts.map((workout) => (
                  <Card
                    key={workout.id}
                    className="bg-[#0A0A0A] border-[#333333] p-6 hover:border-[#FFD700] transition-colors"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-1">{workout.name}</h3>
                        <p className="text-sm text-gray-400 mb-3">
                          Atribuído a: <span className="text-[#FFD700]">{workout.student}</span> • {workout.dayOfWeek}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {workout.duration}
                          </span>
                          <span className="px-2 py-1 bg-[#FFD700]/20 text-[#FFD700] rounded text-xs font-semibold">
                            {workout.difficulty}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-400 hover:text-[#FFD700]"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteWorkout(workout.id)}
                          className="text-gray-400 hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Exercises */}
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-gray-300 mb-2">Exercícios:</p>
                      {workout.exercises.map((exercise) => (
                        <div
                          key={exercise.id}
                          className="flex items-center justify-between bg-[#1A1A1A] p-3 rounded"
                        >
                          <span className="text-white">{exercise.name}</span>
                          <span className="text-sm text-gray-400">
                            {exercise.sets} × {exercise.reps}
                          </span>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
