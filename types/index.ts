// Define common types used throughout the application

export interface User {
  id?: string;
  email?: string;
  role?: string;
  [key: string]: any; // Allow for additional properties
}