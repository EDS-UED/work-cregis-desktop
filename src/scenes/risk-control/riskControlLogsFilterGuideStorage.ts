import { ref } from 'vue';

const STORAGE_KEY = 'cregis-risk-control-logs-filter-guide-seen';

/** QA「重置日志筛选引导」递增后，日志页重新尝试 auto-open。 */
export const riskControlLogsFilterGuideReplayNonce = ref(0);

export function hasSeenRiskControlLogsFilterGuide(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

export function markRiskControlLogsFilterGuideSeen(): void {
  try {
    localStorage.setItem(STORAGE_KEY, '1');
  } catch {
    /* ignore quota / private mode */
  }
}

export function clearRiskControlLogsFilterGuideSeen(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export function requestRiskControlLogsFilterGuideReplay(): void {
  clearRiskControlLogsFilterGuideSeen();
  riskControlLogsFilterGuideReplayNonce.value += 1;
}
