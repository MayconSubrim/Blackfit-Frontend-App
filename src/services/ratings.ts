import { ApiError, api } from './api';

export type RatingInstructor = {
  id: string;
  name: string;
  totalReviews: number;
  averageRating: number;
  myRating?: number | null;
};

export type CreateRatingPayload = {
  instructorId: string;
  rating: number;
  comment?: string;
};

export function getRatingErrorMessage(error: unknown, fallback: string) {
  // usa a mensagem tratada pela camada HTTP quando o backend retorna erro
  if (error instanceof ApiError) {
    return error.message;
  }

  return fallback;
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

export function getRatingInstructors() {
  // lista instrutores disponiveis para avaliacao do aluno logado
  return api.get<RatingInstructor[]>('/ratings/instructors');
}

export function createInstructorRating(payload: CreateRatingPayload) {
  // cria ou atualiza a avaliacao do aluno para o instrutor
  return api.post('/ratings', payload);
}
