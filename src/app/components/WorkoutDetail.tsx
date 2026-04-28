import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Clock,
  Target,
  CheckCircle2,
  PlayCircle,
  Printer,
  Share2,
  User,
  LogOut,
  Star,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import logoImage from 'figma:asset/63b7da44e4c6dd410d42a5c31d62c189569f14bd.png';

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  rest: string;
  description: string;
  videoUrl: string;
  tips: string[];
}

// Mock workout data with videos
const workoutData: { [key: string]: any } = {
  '1': {
    id: 1,
    name: 'Força de Membros Superiores',
    duration: '45 min',
    difficulty: 'Intermediário',
    dayOfWeek: 'Segunda',
    description: 'Treino focado no desenvolvimento de força e hipertrofia dos membros superiores, incluindo peito, costas, ombros e braços.',
    objectives: ['Aumentar força muscular', 'Promover hipertrofia', 'Melhorar resistência'],
    exercises: [
      {
        id: '1',
        name: 'Supino Reto',
        sets: 4,
        reps: 10,
        rest: '90s',
        description: 'Exercício fundamental para o desenvolvimento do peitoral maior, deltoides anterior e tríceps.',
        videoUrl: 'https://www.youtube.com/embed/rT7DgCr-3pg',
        tips: [
          'Mantenha os pés firmes no chão',
          'Desça a barra até tocar o peito',
          'Controle a descida (2-3 segundos)',
        ],
      },
      {
        id: '2',
        name: 'Barra Fixa',
        sets: 3,
        reps: 12,
        rest: '60s',
        description: 'Exercício completo para dorsais, bíceps e antebraços.',
        videoUrl: 'https://www.youtube.com/embed/eGo4IYlbE5g',
        tips: [
          'Pegada na largura dos ombros',
          'Suba até o queixo passar a barra',
          'Evite balançar o corpo',
        ],
      },
      {
        id: '3',
        name: 'Desenvolvimento com Halteres',
        sets: 3,
        reps: 12,
        rest: '60s',
        description: 'Trabalha deltoides, trapézio e tríceps.',
        videoUrl: 'https://www.youtube.com/embed/qEwKCR5JCog',
        tips: [
          'Mantenha o core ativado',
          'Não arqueie as costas',
          'Controle total do movimento',
        ],
      },
      {
        id: '4',
        name: 'Rosca Direta',
        sets: 3,
        reps: 12,
        rest: '45s',
        description: 'Isolamento do bíceps braquial.',
        videoUrl: 'https://www.youtube.com/embed/ykJmrZ5v0Oo',
        tips: [
          'Cotovelos fixos ao lado do corpo',
          'Movimento controlado',
          'Não use impulso',
        ],
      },
    ],
    completed: false,
  },
  '2': {
    id: 2,
    name: 'Cardio & Core',
    duration: '30 min',
    difficulty: 'Iniciante',
    dayOfWeek: 'Terça',
    description: 'Treino cardiovascular combinado com exercícios para fortalecimento do core.',
    objectives: ['Queimar calorias', 'Fortalecer abdômen', 'Melhorar condicionamento'],
    exercises: [
      {
        id: '1',
        name: 'Burpees',
        sets: 4,
        reps: 15,
        rest: '60s',
        description: 'Exercício de corpo inteiro que combina força e cardio.',
        videoUrl: 'https://www.youtube.com/embed/JZQA08SlJnM',
        tips: [
          'Mantenha ritmo constante',
          'Aterrisse suavemente',
          'Respiração controlada',
        ],
      },
      {
        id: '2',
        name: 'Prancha',
        sets: 3,
        reps: 60,
        rest: '45s',
        description: 'Fortalece toda a musculatura do core.',
        videoUrl: 'https://www.youtube.com/embed/pSHjTRCQxIw',
        tips: [
          'Corpo em linha reta',
          'Core contraído',
          'Não deixe o quadril cair',
        ],
      },
      {
        id: '3',
        name: 'Mountain Climbers',
        sets: 3,
        reps: 20,
        rest: '45s',
        description: 'Cardio intenso que trabalha abdômen e ombros.',
        videoUrl: 'https://www.youtube.com/embed/nmwgirgXLYM',
        tips: [
          'Movimento rápido mas controlado',
          'Quadril baixo',
          'Joelhos ao peito',
        ],
      },
    ],
    completed: true,
  },
  '3': {
    id: 3,
    name: 'Treino de Pernas',
    duration: '60 min',
    difficulty: 'Avançado',
    dayOfWeek: 'Quarta',
    description: 'Treino intenso focado em quadríceps, posteriores, glúteos e panturrilhas.',
    objectives: ['Hipertrofia das pernas', 'Aumentar força', 'Definição muscular'],
    exercises: [
      {
        id: '1',
        name: 'Agachamento Livre',
        sets: 5,
        reps: 8,
        rest: '120s',
        description: 'Exercício fundamental para desenvolvimento das pernas.',
        videoUrl: 'https://www.youtube.com/embed/ultWZbUMPL8',
        tips: [
          'Desça até a paralela',
          'Joelhos alinhados com os pés',
          'Mantenha o peito elevado',
        ],
      },
      {
        id: '2',
        name: 'Leg Press 45°',
        sets: 4,
        reps: 12,
        rest: '90s',
        description: 'Trabalha quadríceps, glúteos e posteriores.',
        videoUrl: 'https://www.youtube.com/embed/IZxyjW7MPJQ',
        tips: [
          'Pés na largura dos ombros',
          'Não trave os joelhos',
          'Amplitude completa',
        ],
      },
      {
        id: '3',
        name: 'Stiff',
        sets: 4,
        reps: 10,
        rest: '90s',
        description: 'Foca em posteriores de coxa e glúteos.',
        videoUrl: 'https://www.youtube.com/embed/1uDiW5--rAE',
        tips: [
          'Joelhos levemente flexionados',
          'Desça até sentir alongamento',
          'Mantenha as costas retas',
        ],
      },
      {
        id: '4',
        name: 'Panturrilha em Pé',
        sets: 4,
        reps: 15,
        rest: '60s',
        description: 'Isolamento da panturrilha.',
        videoUrl: 'https://www.youtube.com/embed/JJ9SxnJRnHQ',
        tips: [
          'Amplitude completa do movimento',
          'Pausa no topo',
          'Controle na descida',
        ],
      },
    ],
    completed: false,
  },
  '4': {
    id: 4,
    name: 'Sessão HIIT',
    duration: '25 min',
    difficulty: 'Intermediário',
    dayOfWeek: 'Quinta',
    description: 'Treino intervalado de alta intensidade para queima de gordura e condicionamento.',
    objectives: ['Queima de gordura', 'Melhorar VO2 máx', 'Aumentar resistência'],
    exercises: [
      {
        id: '1',
        name: 'Jump Squat',
        sets: 4,
        reps: 20,
        rest: '30s',
        description: 'Agachamento explosivo com salto.',
        videoUrl: 'https://www.youtube.com/embed/A-cFYWvaHr0',
        tips: [
          'Aterrisse com os joelhos flexionados',
          'Use os braços para impulso',
          'Explosão máxima',
        ],
      },
      {
        id: '2',
        name: 'Box Jump',
        sets: 4,
        reps: 15,
        rest: '45s',
        description: 'Salto em caixa para potência de pernas.',
        videoUrl: 'https://www.youtube.com/embed/NBY9-kTuHEk',
        tips: [
          'Aterrisse suavemente',
          'Mantenha o core ativo',
          'Use os braços',
        ],
      },
      {
        id: '3',
        name: 'Battle Ropes',
        sets: 4,
        reps: 30,
        rest: '45s',
        description: 'Exercício de alta intensidade para membros superiores.',
        videoUrl: 'https://www.youtube.com/embed/w6v6eggfSpo',
        tips: [
          'Movimento rápido e coordenado',
          'Mantenha a postura',
          'Respire ritmicamente',
        ],
      },
    ],
    completed: false,
  },
  '5': {
    id: 5,
    name: 'Treino Full Body',
    duration: '50 min',
    difficulty: 'Avançado',
    dayOfWeek: 'Sexta',
    description: 'Treino completo trabalhando todos os grupos musculares em uma única sessão.',
    objectives: ['Treino completo', 'Força geral', 'Resistência muscular'],
    exercises: [
      {
        id: '1',
        name: 'Levantamento Terra',
        sets: 4,
        reps: 8,
        rest: '120s',
        description: 'Exercício composto que trabalha todo o corpo.',
        videoUrl: 'https://www.youtube.com/embed/ytGaGIn3SjE',
        tips: [
          'Costas retas durante todo o movimento',
          'Barra próxima ao corpo',
          'Ative o core',
        ],
      },
      {
        id: '2',
        name: 'Supino Inclinado',
        sets: 4,
        reps: 10,
        rest: '90s',
        description: 'Trabalha peitoral superior e ombros.',
        videoUrl: 'https://www.youtube.com/embed/SrqOu55lrYU',
        tips: [
          'Banco a 30-45 graus',
          'Controle total',
          'Não arqueie excessivamente',
        ],
      },
      {
        id: '3',
        name: 'Remada Curvada',
        sets: 4,
        reps: 10,
        rest: '90s',
        description: 'Desenvolve as costas e bíceps.',
        videoUrl: 'https://www.youtube.com/embed/kBWAon7ItDw',
        tips: [
          'Joelhos levemente flexionados',
          'Puxe em direção ao abdômen',
          'Cotovelos próximos ao corpo',
        ],
      },
      {
        id: '4',
        name: 'Afundo com Halteres',
        sets: 3,
        reps: 12,
        rest: '60s',
        description: 'Trabalha pernas e glúteos unilateralmente.',
        videoUrl: 'https://www.youtube.com/embed/QOVaHwm-Q6U',
        tips: [
          'Joelho da frente não passa da ponta do pé',
          'Desça até 90 graus',
          'Mantenha o equilíbrio',
        ],
      },
    ],
    completed: false,
  },
};

export function WorkoutDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);
  const [completedSets, setCompletedSets] = useState<{ [key: string]: number }>({});
  
  const workout = workoutData[id || '1'] || workoutData['1'];

  const handlePrint = () => {
    window.print();
  };

  const toggleExercise = (exerciseId: string) => {
    setExpandedExercise(expandedExercise === exerciseId ? null : exerciseId);
  };

  const markSetComplete = (exerciseId: string) => {
    const exercise = workout.exercises.find((ex: Exercise) => ex.id === exerciseId);
    if (!exercise) return;
    
    const current = completedSets[exerciseId] || 0;
    if (current < exercise.sets) {
      setCompletedSets({ ...completedSets, [exerciseId]: current + 1 });
    }
  };

  const totalSets = workout.exercises.reduce((acc: number, ex: Exercise) => acc + ex.sets, 0);
  const completedTotal = Object.values(completedSets).reduce((acc: number, val: number) => acc + val, 0);
  const progress = (completedTotal / totalSets) * 100;

  return (
    <div className="min-h-screen bg-black">
      {/* Print Styles */}
      <style>{`
        @media print {
          header, .no-print { display: none !important; }
          .print-only { display: block !important; }
          body { background: white !important; color: black !important; }
          * { color: black !important; background: white !important; }
        }
        .print-only { display: none; }
      `}</style>

      {/* Header */}
      <header className="bg-[#0A0A0A] border-b border-[#333333] sticky top-0 z-50 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Button
                onClick={() => navigate('/dashboard')}
                variant="ghost"
                size="icon"
                className="text-[#FFD700]"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="w-10 h-10 flex items-center justify-center">
                <img src={logoImage} alt="BlackFit" className="w-full h-full object-contain" />
              </div>
              <span className="text-xl font-bold text-white">BlackFit</span>
            </div>

            <nav className="hidden md:flex items-center gap-2">
              <Button
                onClick={() => navigate('/dashboard')}
                variant="ghost"
                className="text-white hover:text-[#FFD700] hover:bg-[#1A1A1A]"
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

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>

          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="md:hidden py-4 space-y-2"
            >
              <Button
                onClick={() => navigate('/dashboard')}
                variant="ghost"
                className="w-full justify-start text-white hover:text-[#FFD700]"
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
        {/* Workout Header */}
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
                  <span className="text-white">{workout.exercises.length} exercícios</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 no-print">
              <Button
                onClick={handlePrint}
                variant="outline"
                className="border-[#333333] text-white hover:bg-[#1A1A1A] hover:text-[#FFD700]"
              >
                <Printer className="w-4 h-4 mr-2" />
                Imprimir Ficha
              </Button>
              <Button
                variant="outline"
                className="border-[#333333] text-white hover:bg-[#1A1A1A] hover:text-[#FFD700]"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Compartilhar
              </Button>
            </div>
          </div>

          {/* Progress */}
          <Card className="bg-[#0A0A0A] border-[#333333] p-6 no-print">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-white">Progresso do Treino</h3>
              <span className="text-[#FFD700] font-bold">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3 bg-[#1A1A1A]" />
            <p className="text-sm text-gray-400 mt-2">
              {completedTotal} de {totalSets} séries completadas
            </p>
          </Card>
        </motion.div>

        {/* Print Header */}
        <div className="print-only mb-8">
          <h1 className="text-3xl font-bold mb-2">{workout.name}</h1>
          <p className="mb-4">{workout.description}</p>
          <p><strong>Duração:</strong> {workout.duration} | <strong>Dificuldade:</strong> {workout.difficulty}</p>
          <hr className="my-4" />
        </div>

        {/* Objectives */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="bg-[#0A0A0A] border-[#333333] p-6">
            <h2 className="text-xl font-bold text-white mb-4">Objetivos do Treino</h2>
            <ul className="space-y-2">
              {workout.objectives.map((objective: string, index: number) => (
                <li key={index} className="flex items-center gap-3 text-gray-300">
                  <div className="w-2 h-2 bg-[#FFD700] rounded-full" />
                  {objective}
                </li>
              ))}
            </ul>
          </Card>
        </motion.div>

        {/* Exercises */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white mb-4">Exercícios</h2>
          
          {workout.exercises.map((exercise: Exercise, index: number) => (
            <motion.div
              key={exercise.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Card className="bg-[#0A0A0A] border-[#333333] overflow-hidden">
                {/* Exercise Header */}
                <div
                  onClick={() => toggleExercise(exercise.id)}
                  className="p-6 cursor-pointer hover:bg-[#1A1A1A] transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl font-bold text-[#FFD700]">#{index + 1}</span>
                        <h3 className="text-xl font-bold text-white">{exercise.name}</h3>
                      </div>
                      <p className="text-sm text-gray-400 mb-3">{exercise.description}</p>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <span className="text-white">
                          <strong className="text-[#FFD700]">Séries:</strong> {exercise.sets}
                        </span>
                        <span className="text-white">
                          <strong className="text-[#FFD700]">Repetições:</strong> {exercise.reps}
                        </span>
                        <span className="text-white">
                          <strong className="text-[#FFD700]">Descanso:</strong> {exercise.rest}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 no-print">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
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

                {/* Exercise Details (Expanded) */}
                {expandedExercise === exercise.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-[#333333]"
                  >
                    <div className="p-6 space-y-6">
                      {/* Video Tutorial */}
                      <div>
                        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                          <PlayCircle className="w-5 h-5 text-[#FFD700]" />
                          Vídeo Tutorial
                        </h4>
                        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                          <iframe
                            width="100%"
                            height="100%"
                            src={exercise.videoUrl}
                            title={exercise.name}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="absolute inset-0"
                          ></iframe>
                        </div>
                      </div>

                      {/* Tips */}
                      <div>
                        <h4 className="font-semibold text-white mb-3">Dicas de Execução</h4>
                        <ul className="space-y-2">
                          {exercise.tips.map((tip: string, tipIndex: number) => (
                            <li key={tipIndex} className="flex items-start gap-3">
                              <CheckCircle2 className="w-5 h-5 text-[#FFD700] flex-shrink-0 mt-0.5" />
                              <span className="text-gray-300">{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Print Version */}
                <div className="print-only p-6">
                  <p className="mb-2"><strong>Descrição:</strong> {exercise.description}</p>
                  <p className="mb-2"><strong>Séries:</strong> {exercise.sets} | <strong>Repetições:</strong> {exercise.reps} | <strong>Descanso:</strong> {exercise.rest}</p>
                  <div className="mt-2">
                    <strong>Dicas:</strong>
                    <ul className="list-disc ml-6">
                      {exercise.tips.map((tip: string, tipIndex: number) => (
                        <li key={tipIndex}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex gap-4 no-print"
        >
          <Button
            onClick={() => navigate('/dashboard')}
            className="flex-1 h-14 bg-[#FFD700] hover:bg-[#FFC700] text-black font-semibold text-lg"
          >
            {workout.completed ? 'Refazer Treino' : 'Iniciar Treino'}
          </Button>
          <Button
            onClick={() => navigate('/dashboard')}
            variant="outline"
            className="h-14 border-[#333333] text-white hover:bg-[#1A1A1A]"
          >
            Voltar
          </Button>
        </motion.div>
      </main>
    </div>
  );
}