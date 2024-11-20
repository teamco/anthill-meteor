type TIcons = {
  log: number;
  info: number;
  error: number;
  warn: number;
};

type TConsole = Partial<Console>;

export const initLogger = () => {
  const _console: TConsole = ((oldCons: TConsole) => ({
    debug(...args: any[]) {
      oldCons.log(args);
    },
    trace(...args: any[]) {
      oldCons.trace(args);
    },
    log(...args: any[]) {
      logger({ type: 'log', args, echo: oldCons });
    },
    info(...args: any[]) {
      logger({ type: 'info', args, echo: oldCons });
    },
    warn(...args: any[]) {
      logger({ type: 'warn', args, echo: oldCons });
    },
    error(...args: any[]) {
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
