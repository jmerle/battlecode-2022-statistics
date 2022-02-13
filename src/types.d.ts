/* eslint-disable @typescript-eslint/naming-convention */

interface HistoryItem {
  won: boolean;
  date: string;
  mu: number;
}

interface Team {
  url: string;
  id: number;
  league: string;
  name: string;
  avatar: string;
  users: string[];
  verified_users: string[];
  wins: number;
  losses: number;
  draws: number;
  bio: string;
  divisions: any[];
  auto_accept_ranked: boolean;
  auto_accept_unranked: boolean;
  mu: number;
  sigma: number;
  score: number;
  student: boolean;
  mit: boolean;
  high_school: boolean;
  international: boolean;
  history: HistoryItem[];
}

interface TeamsContainer {
  [id: string]: Team;
}

interface TeamsData {
  timestamp: string;
  teams: TeamsContainer;
}
