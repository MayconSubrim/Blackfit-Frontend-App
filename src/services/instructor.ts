import { ApiError, api } from './api';

export type InstructorStudent = {
  id: string;
  name: string;
  email: string;
  role: 'ALUNO';
  instructorId?: string | null;
  workouts: number;
};

export type InstructorWorkoutExercise = {
  id: string;
  name: string;
  sets: number;
  reps: number;
  rest: string;
  description?: string | null;
  videoUrl?: string | null;
  order: number;
};

export type InstructorWorkoutAssignment = {
  id: string;
  userId: string;
  workoutId: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
};

export type InstructorWorkout = {
  id: string;
  title: string;
  description?: string | null;
  estimatedCalories: number;
  estimatedDuration: number;
  difficulty?: string | null;
  dayOfWeek?: string | null;
  exercises: InstructorWorkoutExercise[];
  assignments: InstructorWorkoutAssignment[];
};

export type CreateWorkoutExercisePayload = {
  name: string;
  sets: number;
  reps: number;
  rest: string;
  description?: string;
  videoUrl?: string;
  order?: number;
};

export type CreateWorkoutPayload = {
  title: string;
  description?: string;
  estimatedCalories: number;
  estimatedDuration: number;
  difficulty?: string;
  dayOfWeek?: string;
  exercises: CreateWorkoutExercisePayload[];
};

export function getInstructorErrorMessage(error: unknown, fallback: string) {
  // reaproveita a mensagem enviada pela API quando houver erro tratado
  if (error instanceof ApiError) {
    return error.message;
  }

  return fallback;
}

export function getInstructorStudents() {
  // lista somente alunos vinculados ao instrutor logado
  return api.get<InstructorStudent[]>('/users/my-students');
}

export function getInstructorWorkouts() {
  // para instrutor, a rota retorna apenas treinos criados por ele
  return api.get<InstructorWorkout[]>('/workouts/getWorkouts');
}

export function createInstructorWorkout(payload: CreateWorkoutPayload) {
  // cria uma nova ficha de treino para o instrutor logado
  return api.post<InstructorWorkout>('/workouts', payload);
}

export function assignWorkoutToStudent(userId: string, workoutId: string) {
  // atribui uma ficha existente para um aluno da carteira do instrutor
  return api.post<InstructorWorkoutAssignment>('/workouts/assign', { userId, workoutId });
}

export function removeWorkoutFromStudent(workoutId: string, userId: string) {
  // remove apenas o vinculo do aluno com a ficha, sem apagar o treino
  return api.delete<void>(`/workouts/${workoutId}/assignments/${userId}`);
}

export function deleteInstructorWorkout(workoutId: string) {
  // exclui a ficha inteira criada pelo instrutor logado
  return api.delete<void>(`/workouts/${workoutId}`);
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

export function getAssignedStudentNames(workout: InstructorWorkout) {
  const names = workout.assignments
    .map((assignment) => assignment.user?.name)
    .filter(Boolean);

  return names.length ? names.join(', ') : 'Nenhum aluno atribuido';
}
