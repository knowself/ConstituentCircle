
import Database from "@replit/database";

const db = new Database();

export class DatabaseService<T> {
  private prefix: string;

  constructor(prefix: string) {
    this.prefix = prefix;
  }

  private getKey(key: string): string {
    return `${this.prefix}:${key}`;
  }

  async set(key: string, value: T): Promise<void> {
    await db.set(this.getKey(key), value);
  }

  async get(key: string): Promise<T | null> {
    return await db.get(this.getKey(key)) as T;
  }

  async delete(key: string): Promise<void> {
    await db.delete(this.getKey(key));
  }

  async getAll(): Promise<T[]> {
    const keys = await db.list(this.prefix + ":");
    const values = await Promise.all(keys.map(key => db.get(key)));
    return values as T[];
  }

  async query<FilterType extends keyof T>(
    filters: Partial<Record<FilterType, T[FilterType]>>
  ): Promise<T[]> {
    const allItems = await this.getAll();
    return allItems.filter(item => {
      return Object.entries(filters).every(([key, value]) => 
        item[key as FilterType] === value
      );
    });
  }

  static async getUser(userId: string) {
    return await db.get(`users:${userId}`);
  }

  static async getUserByEmail(email: string) {
    const users = await db.list("users:");
    const allUsers = await Promise.all(users.map(key => db.get(key)));
    return allUsers.find(user => user.email === email);
  }
}

export default DatabaseService;
