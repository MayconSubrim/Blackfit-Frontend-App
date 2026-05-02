import { ApiError, api } from './api';

export type WorkoutExercise = {
  id: string;
  name: string;
  sets: number;
  reps: number;
  rest: string;
  description?: string | null;
  videoUrl?: string | null;
  order: number;
};

export type WorkoutSession = {
  id: string;
  workoutId: string;
  userId: string;
  actualCalories?: number;
  actualDuration?: number;
  startedAt?: string;
  completedAt?: string | null;
};

export type ApiWorkout = {
  id: string;
  title: string;
  description?: string | null;
  estimatedCalories: number;
  estimatedDuration: number;
  difficulty?: string | null;
  dayOfWeek?: string | null;
  exercises: WorkoutExercise[];
  sessions?: WorkoutSession[];
};

export type StudentWorkout = {
  id: string;
  name: string;
  exercises: number;
  duration: string;
  difficulty: string;
  completed: boolean;
  dayOfWeek: string;
  estimatedCalories: number;
  estimatedDuration: number;
};

export type WorkoutDetailData = {
  id: string;
  name: string;
  description: string;
  duration: string;
  difficulty: string;
  dayOfWeek: string;
  estimatedCalories: number;
  estimatedDuration: number;
  exercises: WorkoutExercise[];
  activeSession?: WorkoutSession | null;
  lastCompletedAt?: string | null;
  completed: boolean;
};

export function getWorkoutErrorMessage(error: unknown, fallback: string) {
  // usa a mensagem padronizada da API quando o backend retornar erro
  if (error instanceof ApiError) {
    return error.message;
  }

  return fallback;
}

function mapStudentWorkout(workout: ApiWorkout): StudentWorkout {
  return {
    id: workout.id,
    name: workout.title,
    exercises: workout.exercises.length,
    duration: `${workout.estimatedDuration} min`,
    difficulty: workout.difficulty || 'Nao informado',
    completed: Boolean(workout.sessions?.some((session) => session.completedAt)),
    dayOfWeek: workout.dayOfWeek || 'Sem dia definido',
    estimatedCalories: workout.estimatedCalories,
    estimatedDuration: workout.estimatedDuration,
  };
}

function mapWorkoutDetail(workout: ApiWorkout): WorkoutDetailData {
  const activeSession = workout.sessions?.find((session) => !session.completedAt) ?? null;
  const lastCompletedSession = workout.sessions?.find((session) => session.completedAt) ?? null;

  return {
    id: workout.id,
    name: workout.title,
    description: workout.description || 'Treino personalizado criado pelo instrutor.',
    duration: `${workout.estimatedDuration} min`,
    difficulty: workout.difficulty || 'Nao informado',
    dayOfWeek: workout.dayOfWeek || 'Sem dia definido',
    estimatedCalories: workout.estimatedCalories,
    estimatedDuration: workout.estimatedDuration,
    exercises: workout.exercises,
    activeSession,
    lastCompletedAt: lastCompletedSession?.completedAt ?? null,
    completed: Boolean(workout.sessions?.some((session) => session.completedAt)),
  };
}

export function getWorkoutCooldownInfo(lastCompletedAt?: string | null) {
  if (!lastCompletedAt) {
    return {
      blocked: false,
      remainingText: '',
    };
  }

  const cooldownEndsAt = new Date(lastCompletedAt).getTime() + 24 * 60 * 60 * 1000;
  const remainingMs = cooldownEndsAt - Date.now();

  if (remainingMs <= 0) {
    return {
      blocked: false,
      remainingText: '',
    };
  }

  const remainingHours = Math.ceil(remainingMs / (60 * 60 * 1000));

  return {
    blocked: true,
    remainingText: `${remainingHours}h`,
  };
}

export async function getStudentWorkouts() {
  // para aluno, o backend retorna somente treinos atribuidos a ele
  const workouts = await api.get<ApiWorkout[]>('/workouts/getWorkouts');

  return workouts.map(mapStudentWorkout);
}

export async function getWorkoutDetail(id: string) {
  // detalhe real do treino atribuido ao aluno logado
  const workout = await api.get<ApiWorkout>(`/workouts/${id}`);

  return mapWorkoutDetail(workout);
}

export function startWorkoutSession(workoutId: string) {
  // cria ou recupera uma sessao aberta para o treino
  return api.post<WorkoutSession>(`/workouts/${workoutId}/sessions/start`);
}

export function finishWorkoutSession(sessionId: string, payload?: {
  actualCalories?: number;
  actualDuration?: number;
}) {
  // finaliza a sessao do aluno logado
  return api.patch<WorkoutSession>(`/workouts/sessions/${sessionId}/finish`, payload);
}
