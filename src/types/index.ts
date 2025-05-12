export interface Team {
  id: number;
  name: string;
}

export interface Parameter {
  id: number;
  name: string;
  description: string;
}

export interface Judge {
  id: number;
  name: string;
}

export interface Score {
  judgeId: number;
  teamId: number;
  parameterId: number;
  value: number | null;
}

// Record<judgeId, Record<teamId, Record<parameterId, score>>>
export type Scores = Record<string, Record<string, Record<string, number | null>>>;

export interface AggregateScore {
  teamName: string;
  judgeName: string;
  scores: Record<string, number | null>; // parameter name to score mapping
}