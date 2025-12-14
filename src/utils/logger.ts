type LogArgs = unknown[];

interface Logger {
  log: (...args: LogArgs) => void;
  info: (...args: LogArgs) => void;
  warn: (...args: LogArgs) => void;
  error: (...args: LogArgs) => void;
}

const logger: Logger = {
  log: (...args: LogArgs) => {
    console.log("[LOG]:", ...args);
  },
  info: (...args: LogArgs) => {
    console.info("[INFO]:", ...args);
  },
  warn: (...args: LogArgs) => {
    console.warn("[WARN]:", ...args);
  },
  error: (...args: LogArgs) => {
    console.error("[ERROR]:", ...args); // always show errors
  },
};

export default logger;
