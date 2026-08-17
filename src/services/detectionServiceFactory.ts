import type { IDetectionService } from './IDetectionService';
import { MockDetectionService } from './MockDetectionService';
import { ApiDetectionService } from './ApiDetectionService';

export type EngineMode = 'mock' | 'api';

const ENGINE_MODE_KEY = 'smart_road_damage_engine_mode_v1';
const API_URL_KEY = 'smart_road_damage_api_url_v1';
const API_KEY_KEY = 'smart_road_damage_api_key_v1';

export function getStoredEngineMode(): EngineMode {
  const stored = localStorage.getItem(ENGINE_MODE_KEY);
  if (stored === 'api' || stored === 'mock') return stored;
  const envType = import.meta.env.VITE_AI_SERVICE_TYPE;
  return envType === 'api' ? 'api' : 'mock';
}

export function setStoredEngineMode(mode: EngineMode): void {
  localStorage.setItem(ENGINE_MODE_KEY, mode);
}

export function getStoredApiUrl(): string {
  return localStorage.getItem(API_URL_KEY) || import.meta.env.VITE_AI_API_URL || 'http://localhost:8000/api/v1/detect';
}

export function setStoredApiUrl(url: string): void {
  localStorage.setItem(API_URL_KEY, url);
}

export function getStoredApiKey(): string {
  return localStorage.getItem(API_KEY_KEY) || import.meta.env.VITE_AI_API_KEY || '';
}

export function setStoredApiKey(key: string): void {
  localStorage.setItem(API_KEY_KEY, key);
}

export function getActiveDetectionService(): IDetectionService {
  const mode = getStoredEngineMode();
  if (mode === 'api') {
    return new ApiDetectionService(getStoredApiUrl(), getStoredApiKey());
  }
  return new MockDetectionService();
}
