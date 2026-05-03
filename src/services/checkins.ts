import { ApiError, api } from './api';

export type Checkin = {
  id: string;
  userId: string;
  createdAt: string;
};

export type CheckinResponse = {
  alreadyCheckedIn: boolean;
  checkin: Checkin;
};

export type CheckinStats = {
  caloriesToday: number;
  checkins: number;
  metaAtual: number;
  streakDays: number;
};

export type RankingUser = {
  id: string;
  name: string;
  role: string;
};

export type RankingItem = {
  rank: number;
  userId: string;
  totalCheckins: number;
  streakDays: number;
  user: RankingUser | null;
};

export type LeaderboardUser = {
  rank: number;
  userId: string;
  name: string;
  checkIns: number;
  avatar: string;
  streak: number;
};

export function getCheckinErrorMessage(error: unknown, fallback: string) {
  // usa a mensagem padronizada pela camada HTTP quando a API retorna erro
  if (error instanceof ApiError) {
    return error.message;
  }

  return fallback;
}

export function getTodayKey(userId?: string) {
  // chave local apenas para lembrar que a tela ja confirmou o check-in do dia
  const today = new Date().toISOString().slice(0, 10);
  return `blackfit:checkin:${userId || 'anonymous'}:${today}`;
}

export function hasLocalCheckinToday(userId?: string) {
  return localStorage.getItem(getTodayKey(userId)) === 'done';
}

export function markLocalCheckinToday(userId?: string) {
  localStorage.setItem(getTodayKey(userId), 'done');
}

export function createDailyCheckin() {
  // backend garante que so exista um check-in por usuario no dia
  return api.post<CheckinResponse>('/checkins');
}

export function getCheckinStats() {
  // resumo real do usuario logado
  return api.get<CheckinStats>('/checkins/stats');
}

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

export async function getCheckinRanking() {
  // ranking real baseado nos check-ins registrados no backend
  const ranking = await api.get<RankingItem[]>('/checkins/ranking');

  return ranking.map((item) => {
    const name = item.user?.name || 'Usuario';

    return {
      rank: item.rank,
      userId: item.userId,
      name,
      checkIns: item.totalCheckins,
      avatar: getInitials(name),
      streak: item.streakDays,
    };
  });
}
