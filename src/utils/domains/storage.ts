import { Domain } from "@/types/domain";
import { StoredDomains } from "./types";

const STORAGE_KEY = 'quickbid_domains';
const STALE_THRESHOLD = 5000; // 5 seconds

export const isDataStale = (timestamp: number): boolean => {
  return Date.now() - timestamp > STALE_THRESHOLD;
};

export const updateLocalStorage = (domains: Domain[], timestamp: number) => {
  const data: StoredDomains = { domains, timestamp };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const getStoredDomains = (): StoredDomains | null => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;

  try {
    const data = JSON.parse(stored) as StoredDomains;
    return isDataStale(data.timestamp) ? null : data;
  } catch (error) {
    console.error('Error parsing stored domains:', error);
    return null;
  }
};

export const updateDomains = (domains: Domain[]) => {
  const timestamp = Date.now();
  updateLocalStorage(domains, timestamp);
  return { domains, timestamp };
};