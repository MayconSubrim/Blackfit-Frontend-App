import { ApiError, api } from './api';

export type DashboardWorkout = {
  id: string;
  name: string;
  exercises: number;
  duration: string;
  difficulty: string;
  completed: boolean;
  dayOfWeek: string;
  estimatedCalories: number;
  estimatedDuration: number;
  assignedAt?: string | null;
};

export type DashboardStats = {
  caloriesBurned: number;
  assignedWorkoutCount: number;
  goalsCompleted: number;
  goalsTarget: number;
  streakDays: number;
};

export type WeeklyProgress = {
  completed: number;
  total: number;
  percentage: number;
};

export type DashboardData = {
  stats: DashboardStats;
  weeklyProgress: WeeklyProgress;
  workouts: DashboardWorkout[];
};

export function getDashboardErrorMessage(error: unknown, fallback: string) {
  // reaproveita o erro padronizado pela camada HTTP
  if (error instanceof ApiError) {
    return error.message;
  }

  return fallback;
}

export function formatNumber(value: number) {
  return value.toLocaleString('pt-BR');
}

export function getDifficultyClasses(difficulty: string) {
  const normalizedDifficulty = difficulty.toLowerCase();

  if (normalizedDifficulty.includes('iniciante')) {
    return 'bg-green-500/20 text-green-400';
  }

  if (normalizedDifficulty.includes('intermedi')) {
    return 'bg-[#FFD700]/20 text-[#FFD700]';
  }

  if (normalizedDifficulty.includes('avanc') || normalizedDifficulty.includes('avan')) {
    return 'bg-red-500/20 text-red-400';
  }

  return 'bg-gray-500/20 text-gray-300';
}

export function getStudentDashboard() {
  // rota agregada com dados reais do painel do aluno logado
  return api.get<DashboardData>('/dashboard');
}
