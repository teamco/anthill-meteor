type TConsole = {
  debug: (...args: unknown[]) => void;
  trace: (...args: unknown[]) => void;
} & Partial<Console>;

/**
 * Replace window.console with a custom implementation that uses the logger function.
 * The logger function adds an emoji to the beginning of each log message.
 * @returns {void}
 */
export const initLogger = (): void => {
  const _console: TConsole = ((oldCons: TConsole): TConsole => ({
    /**
     * Writes a message to the console, including a stack trace from the current position.
     * @param {...unknown[]} args - The arguments to be passed to the console.log function.
     * @returns {void}
     */
    debug(...args: unknown[]): void {
      if (typeof oldCons.log === 'function') oldCons.log(args);
    },

    /**
     * Outputs a stack trace to the console from the current position.
     *
     * @param {...unknown[]} args - The arguments to be passed to the console.trace function.
     * @returns {void}
     */
    trace(...args: unknown[]): void {
      if (typeof oldCons.trace === 'function') oldCons.trace(args);
    },

    /**
     * Writes a message to the console.
     * @param {...unknown[]} args - The arguments to be passed to the console.log function.
     * @returns {void}
     */
    log(...args: unknown[]): void {
      logger({ type: TConsoleType.log, args, echo: oldCons });
    },

    /**
     * Logs an informational message to the console.
     *
     * @param {...unknown[]} args - The arguments to be logged as an informational message.
     * @returns {void}
     */
    info(...args: unknown[]): void {
      logger({ type: TConsoleType.info, args, echo: oldCons });
    },

    /**
     * Logs a warning message to the console.
     *
     * @param {...unknown[]} args - The arguments to be logged as a warning message.
     * @returns {void}
     */
    warn(...args: unknown[]): void {
      logger({ type: TConsoleType.warn, args, echo: oldCons });
    },

    /**
     * Logs an error message to the console.
     *
     * @param {...unknown[]} args - The arguments to be logged as an error message.
     * @returns {void}
     */
    error(...args: unknown[]): void {
      logger({ type: TConsoleType.error, args, echo: oldCons });
    },
  }))(window.console);

  window.console = _console as unknown as Console;
};

type TLogger = {
  type?: keyof TIcons;
  echo?: TConsole;
  [key: string]: unknown;
};

enum TConsoleType {
  log = 'log',
  info = 'info',
  error = 'error',
  warn = 'warn',
}

type TIcons = {
  [TConsoleType.log]: number;
  [TConsoleType.info]: number;
  [TConsoleType.error]: number;
  [TConsoleType.warn]: number;
};

/**
 * Logs a message to the console with a colored icon.
 *
 * @param {TLogger} props - The logger properties.
 * @param {string} [props.type=info] - The type of the message.
 * @param {TConsole} [props.echo=window.console] - The console to which the message is logged.
 * @param {...unknown[]} props.args - The arguments to be logged.
 * @returns {void}
 */
export const logger = (props: TLogger): void => {
  const { type = TConsoleType.info, echo = window?.console, ...args } = props;

  const ICONS: TIcons = {
    log: 0x1f7e2,
    info: 0x1f535,
    error: 0x1f534,
    warn: 0x1f7e1,
  };

  const icon = String.fromCodePoint(ICONS[type]);
  if (typeof echo[type] === 'function') {
    echo[type](icon, args);
  }
};
