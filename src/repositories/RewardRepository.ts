import { Reward } from "../types/Reward";

const STORAGE_KEY = "adhd_planner_rewards";

export class RewardRepository {
  private static instance: RewardRepository;

  private constructor() {}

  public static getInstance(): RewardRepository {
    if (!RewardRepository.instance) {
      RewardRepository.instance = new RewardRepository();
    }
    return RewardRepository.instance;
  }

  async getRewards(): Promise<Reward[]> {
    try {
      const rewardsJson = localStorage.getItem(STORAGE_KEY);
      if (!rewardsJson) return [];
      return JSON.parse(rewardsJson) as Reward[];
    } catch (error) {
      console.error("Error getting rewards from localStorage:", error);
      return [];
    }
  }

  async saveReward(reward: Reward): Promise<void> {
    try {
      const rewards = await this.getRewards();
      rewards.push(reward);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rewards));
    } catch (error) {
      console.error("Error saving reward to localStorage:", error);
      throw error;
    }
  }

  async unlockReward(id: string): Promise<void> {
    try {
      const rewards = await this.getRewards();
      const index = rewards.findIndex(r => r.id === id);
      
      if (index !== -1) {
        rewards[index].unlocked = true;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(rewards));
      } else {
        throw new Error(`Reward with id ${id} not found`);
      }
    } catch (error) {
      console.error("Error unlocking reward in localStorage:", error);
      throw error;
    }
  }

  async getUnlockedRewards(): Promise<Reward[]> {
    try {
      const rewards = await this.getRewards();
      return rewards.filter(reward => reward.unlocked);
    } catch (error) {
      console.error("Error getting unlocked rewards:", error);
      return [];
    }
  }

  async getPendingRewards(): Promise<Reward[]> {
    try {
      const rewards = await this.getRewards();
      return rewards.filter(reward => !reward.unlocked);
    } catch (error) {
      console.error("Error getting pending rewards:", error);
      return [];
    }
  }
} 