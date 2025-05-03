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

  async getAll(): Promise<T[]> {
    const keys = await db.list(this.prefix + ":");
    const values = await Promise.all(keys.map(key => db.get(key)));
    return values as T[];
  }

  async query<FilterType, ResultType>(
    filters: Partial<FilterType>
  ): Promise<ResultType[]> {
    const allItems = await this.getAll();
    return allItems.filter(item => {
      return Object.entries(filters).every(([key, value]) => 
        (item as any)[key] === value
      );
    }) as ResultType[];
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

export const getUser = DatabaseService.getUser;