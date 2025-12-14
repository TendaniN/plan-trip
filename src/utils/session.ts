const SESSION_KEY = "session_start";

export const startSession = () => {
  localStorage.setItem(SESSION_KEY, Date.now().toString());
};

const THREE_HOURS_MS = 3 * 60 * 60 * 1000;

export const isSessionExpired = (): boolean => {
  const stored = localStorage.getItem(SESSION_KEY);
  if (!stored) return true;

  const sessionStart = Number(stored);
  const now = Date.now();

  return now - sessionStart > THREE_HOURS_MS;
};

export const clearSession = () => {
  localStorage.removeItem(SESSION_KEY);
};
