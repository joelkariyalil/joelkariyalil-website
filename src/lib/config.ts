import fs from 'fs';
import path from 'path';
import yaml from 'yaml';
import type { SiteConfig } from '../types/config';

let configCache: SiteConfig | null = null;

export function getConfig(): SiteConfig {
  if (configCache) {
    return configCache;
  }

  const configPath = path.join(process.cwd(), 'config.yaml');
  const configFile = fs.readFileSync(configPath, 'utf8');
  const config = yaml.parse(configFile) as SiteConfig;
  
  configCache = config;
  return config;
}

// Helper functions to get specific sections
export function getSiteConfig() {
  return getConfig().site;
}

export function getPersonalInfo() {
  return getConfig().personal;
}

export function getExperience() {
  return getConfig().experience;
}

export function getSkills() {
  return getConfig().skills;
}

export function getLanguages() {
  return getConfig().languages;
}

export function getInterests() {
  return getConfig().interests;
} 