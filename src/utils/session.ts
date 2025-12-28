const SESSION_KEY = "session_start";
const THREE_HOURS_MS = 3 * 60 * 60 * 1000;

export const startSession = () => {
  localStorage.setItem(SESSION_KEY, Date.now().toString());
};

export const clearSession = () => {
  localStorage.removeItem(SESSION_KEY);
};

export const getSessionStart = (): number | null => {
  const stored = localStorage.getItem(SESSION_KEY);
  return stored ? Number(stored) : null;
};

export const isSessionExpired = (): boolean => {
  const sessionStart = getSessionStart();
  if (!sessionStart) return true;

  return Date.now() - sessionStart > THREE_HOURS_MS;
};

export const getSessionRemainingMs = (): number => {
  const sessionStart = getSessionStart();
  if (!sessionStart) return 0;

  const elapsed = Date.now() - sessionStart;
  return Math.max(THREE_HOURS_MS - elapsed, 0);
};
