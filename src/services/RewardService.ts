import { v4 as uuidv4 } from "uuid";
import { Reward } from "../types/Reward";
import { RewardRepository } from "../repositories/RewardRepository";

export class RewardService {
  private static instance: RewardService;
  private repository: RewardRepository;

  private constructor() {
    this.repository = RewardRepository.getInstance();
  }

  public static getInstance(): RewardService {
    if (!RewardService.instance) {
      RewardService.instance = new RewardService();
    }
    return RewardService.instance;
  }

  async createReward(name: string, requiredSessions: number, description?: string): Promise<Reward> {
    if (!name.trim()) {
      throw new Error("Reward name cannot be empty");
    }
    
    if (requiredSessions <= 0) {
      throw new Error("Required sessions must be greater than 0");
    }
    
    const reward: Reward = {
      id: uuidv4(),
      name,
      description,
      unlocked: false,
      requiredSessions
    };
    
    await this.repository.saveReward(reward);
    return reward;
  }

  async getUnlockedRewards(): Promise<Reward[]> {
    return this.repository.getUnlockedRewards();
  }

  async getPendingRewards(): Promise<Reward[]> {
    return this.repository.getPendingRewards();
  }

  async getAllRewards(): Promise<Reward[]> {
    return this.repository.getRewards();
  }

  async unlockReward(id: string): Promise<void> {
    await this.repository.unlockReward(id);
  }

  async getRewardProgress(reward: Reward, completedSessions: number): Promise<number> {
    if (reward.unlocked) return 100;
    
    const progress = Math.min(
      (completedSessions / reward.requiredSessions) * 100,
      100
    );
    
    return Math.floor(progress);
  }
} 