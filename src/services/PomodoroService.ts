import { v4 as uuidv4 } from "uuid";
import { PomodoroSession } from "../types/Pomodoro";
import { Reward } from "../types/Reward";
import { PomodoroRepository } from "../repositories/PomodoroRepository";
import { RewardRepository } from "../repositories/RewardRepository";

export class PomodoroService {
  private static instance: PomodoroService;
  private pomodoroRepository: PomodoroRepository;
  private rewardRepository: RewardRepository;

  private constructor() {
    this.pomodoroRepository = PomodoroRepository.getInstance();
    this.rewardRepository = RewardRepository.getInstance();
  }

  public static getInstance(): PomodoroService {
    if (!PomodoroService.instance) {
      PomodoroService.instance = new PomodoroService();
    }
    return PomodoroService.instance;
  }

  async startSession(
    type: "work" | "short-break" | "long-break",
    taskId?: string
  ): Promise<PomodoroSession> {
    const duration = this.getDurationForType(type);
    
    const session: PomodoroSession = {
      id: uuidv4(),
      taskId,
      startTime: new Date().toISOString(),
      duration,
      type,
      completed: false
    };
    
    await this.pomodoroRepository.saveSession(session);
    return session;
  }

  private getDurationForType(type: "work" | "short-break" | "long-break"): number {
    switch (type) {
      case "work":
        return 25; // 25 minutes for work
      case "short-break":
        return 5; // 5 minutes for short break
      case "long-break":
        return 15; // 15 minutes for long break
      default:
        return 25;
    }
  }

  async completeSession(id: string): Promise<PomodoroSession> {
    const sessions = await this.pomodoroRepository.getSessions();
    const session = sessions.find(s => s.id === id);
    
    if (!session) {
      throw new Error(`Session with id ${id} not found`);
    }
    
    session.completed = true;
    await this.pomodoroRepository.updateSession(session);
    
    // Check if any rewards should be unlocked
    await this.checkAndUnlockRewards();
    
    return session;
  }

  async getCompletedToday(): Promise<number> {
    const today = new Date();
    const todaySessions = await this.pomodoroRepository.getSessionsByDate(today);
    return todaySessions.filter(session => session.completed && session.type === "work").length;
  }

  async getTotalCompletedSessions(): Promise<number> {
    const sessions = await this.pomodoroRepository.getSessions();
    return sessions.filter(session => session.completed && session.type === "work").length;
  }

  async shouldUnlockRewards(): Promise<Reward[]> {
    const totalCompletedSessions = await this.getTotalCompletedSessions();
    const pendingRewards = await this.rewardRepository.getPendingRewards();
    
    return pendingRewards.filter(reward => 
      reward.requiredSessions <= totalCompletedSessions
    );
  }

  async checkAndUnlockRewards(): Promise<Reward[]> {
    const rewardsToUnlock = await this.shouldUnlockRewards();
    
    for (const reward of rewardsToUnlock) {
      await this.rewardRepository.unlockReward(reward.id);
    }
    
    return rewardsToUnlock;
  }

  async getAllSessions(): Promise<PomodoroSession[]> {
    return await this.pomodoroRepository.getSessions();
  }
} 