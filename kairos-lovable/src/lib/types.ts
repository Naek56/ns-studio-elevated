export type KairosClient = {
  id: string;
  client_id: string;
  nom: string;
  url: string;
  objectif: string | null;
  secteur: string | null;
  email: string | null;
  actif: boolean;
  concurrents: string[];
  created_at: string;
};

export type KairosClientWithStatus = KairosClient & { active: boolean };

export type KairosRapport = {
  id: string;
  client_id: string;
  observation: string | null;
  analyse: string | null;
  rapport: string | null;
  score: number | null;
  created_at: string;
};

export type KairosConcurrent = {
  id: string;
  client_id: string;
  urls: string[];
  resultat: string | null;
  created_at: string;
};

export type KairosMessage = {
  id: string;
  client_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
};

export type LiveEvent = {
  session_id: string | null;
  type: string;
  page: string | null;
  created_at: string;
};
