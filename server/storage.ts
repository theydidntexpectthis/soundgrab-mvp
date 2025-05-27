import { type User, type InsertUser, SearchResult, Track } from "../shared/schema";

// Interface for download records
export interface Download {
  id: string;
  videoId: string;
  title: string;
  artist: string;
  format: string;
  filePath: string;
  downloadDate: Date;
}

// Interface for search history items
export interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: Date;
  results: Track[];
}

// Storage interface with CRUD methods
export interface IStorage {
  // User-related methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Search and download related methods
  saveSearchQuery(query: string, results: SearchResult): Promise<SearchHistoryItem>;
  getSearchHistory(): Promise<SearchHistoryItem[]>; 
  saveDownload(download: Omit<Download, 'id'>): Promise<Download>;
  getDownloads(): Promise<Download[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private downloads: Map<string, Download>;
  private searchHistory: SearchHistoryItem[];
  currentId: number;
  currentDownloadId: number;

  constructor() {
    this.users = new Map();
    this.currentId = 1;
    this.downloads = new Map();
    this.searchHistory = [];
    this.currentDownloadId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  /**
   * Save a search query to history
   * @param query Search query
   * @param results Search results
   * @returns Saved search history item
   */
  async saveSearchQuery(query: string, results: SearchResult): Promise<SearchHistoryItem> {
    // Limit search history to 20 items
    if (this.searchHistory.length >= 20) {
      this.searchHistory.pop(); // Remove oldest
    }
    
    // Create new search history item
    const searchItem: SearchHistoryItem = {
      id: Date.now().toString(),
      query,
      timestamp: new Date(),
      results: [results.mainResult, ...results.otherResults.slice(0, 2)] // Store main result and top 2 other results
    };
    
    // Add to history
    this.searchHistory.unshift(searchItem);
    
    return searchItem;
  }
  
  /**
   * Get search history
   * @returns Array of search history items
   */
  async getSearchHistory(): Promise<SearchHistoryItem[]> {
    return this.searchHistory;
  }
  
  /**
   * Save a download record
   * @param download Download data
   * @returns Saved download with ID
   */
  async saveDownload(download: Omit<Download, 'id'>): Promise<Download> {
    const id = `dl_${this.currentDownloadId++}`;
    const newDownload: Download = { ...download, id };
    
    this.downloads.set(id, newDownload);
    return newDownload;
  }
  
  /**
   * Get all downloads
   * @returns Array of downloads
   */
  async getDownloads(): Promise<Download[]> {
    return Array.from(this.downloads.values());
  }
}

export const storage = new MemStorage();
