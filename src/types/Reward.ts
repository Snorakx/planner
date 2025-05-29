export interface Reward {
  id: string;
  name: string;
  description?: string;
  unlocked: boolean;
  requiredSessions: number;
} 