import { ApiError, api } from './api';

type WorkoutExercise = {
  id: string;
  name: string;
  sets: number;
  reps: number;
  rest: string;
  description?: string | null;
  videoUrl?: string | null;
  order: number;
};

type WorkoutSession = {
  id: string;
  workoutId: string;
  userId: string;
  completedAt?: string | null;
};

type ApiWorkout = {
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

export async function getStudentWorkouts() {
  // para aluno, o backend retorna somente treinos atribuidos a ele
  const workouts = await api.get<ApiWorkout[]>('/workouts/getWorkouts');

  return workouts.map(mapStudentWorkout);
}
