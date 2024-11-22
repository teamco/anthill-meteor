type TConsole = Partial<Console>;

/**
 * Replace window.console with a custom implementation that uses the logger function.
 * The logger function adds an emoji to the beginning of each log message.
 * @returns {void}
 */
export const initLogger = (): void => {

  const _console: TConsole = ((oldCons: TConsole): TConsole => ({

    /**
     * Writes a message to the console, including a stack trace from the current position.
     * @param {...any[]} args - The arguments to be passed to the console.log function.
     * @returns {void}
     */
    debug(...args: any[]): void {
      oldCons.log(args);
    },

    /**
     * Outputs a stack trace to the console from the current position.
     * 
     * @param {...any[]} args - The arguments to be passed to the console.trace function.
     * @returns {void}
     */
    trace(...args: any[]): void {
      oldCons.trace(args);
    },

    /**
     * Writes a message to the console.
     * @param {...any[]} args - The arguments to be passed to the console.log function.
     * @returns {void}
     */
    log(...args: any[]): void {
      logger({ type: 'log', args, echo: oldCons });
    },

    /**
     * Logs an informational message to the console.
     * 
     * @param {...any[]} args - The arguments to be logged as an informational message.
     * @returns {void}
     */
    info(...args: any[]): void {
      logger({ type: 'info', args, echo: oldCons });
    },

    /**
     * Logs a warning message to the console.
     * 
     * @param {...any[]} args - The arguments to be logged as a warning message.
     * @returns {void}
     */
    warn(...args: any[]): void {
      logger({ type: 'warn', args, echo: oldCons });
    },

    /**
     * Logs an error message to the console.
     * 
     * @param {...any[]} args - The arguments to be logged as an error message.
     * @returns {void}
     */
    error(...args: any[]): void {
      logger({ type: 'error', args, echo: oldCons });
    },
  }))(window.console);

  window.console = _console as unknown as Console;
}

type TLogger = {
  type?: string,
  echo?: TConsole,
  [key: string]: any
}

type TIcons = {
  log: number;
  info: number;
  error: number;
  warn: number;
};

  /**
   * Logs a message to the console with a colored icon.
   * 
   * @param {TLogger} props - The logger properties.
   * @param {string} [props.type=info] - The type of the message.
   * @param {TConsole} [props.echo=window.console] - The console to which the message is logged.
   * @param {...any[]} props.args - The arguments to be logged.
   * @returns {void}
   */
export const logger = (props: TLogger): void => {
  const {
    type = 'info',
    echo = window?.console,
    ...args
  } = props;

  const ICONS: TIcons = {
    log: 0x1F7E2,
    info: 0x1F535,
    error: 0x1F534,
    warn: 0x1F7E1
  };

  const icon = String.fromCodePoint(ICONS[type]);
  echo[type] && echo[type](icon, args);
};
