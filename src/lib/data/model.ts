export interface Stat {
  base_stat: number;
  name: string;
}

export interface Skill {
  pp: number;
  name: string;
}

export interface Monster {
  id: number;
  origin_id: number;
  name: string;
  base_exp: number;
  height: number;
  weight: number;
  avatar: string;
  types: string[];
  rank?: number;
  point?: number;
  annulled: boolean;
  stats: Stat[];
  skills: Skill[];
}

export interface Rank {
  id: number;
  origin_id: number;
  name: string;
  avatar: string;
  types: string[];
  total_battles: number;
  win_battles: number;
  lose_battles: number;
  points: number;
}

export interface Player {
  id: number;
  name: string;
  avatar: string;
  battle_id: number;
  monster_id: number;
  eliminated_at: number;
  annulled_at: number;
  rank: number;
  point: number;
}

export interface Log {
  id: number;
  battle_id: number;
  description: string;
  created_at: number | null;
}

export interface Battle {
  id: number;
  started_at: number;
  ended_at: number;
  players: Player[];
  logs: Log[];
}