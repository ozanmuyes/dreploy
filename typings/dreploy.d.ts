export class ProjectInfo {
  /** Project root path */
  root: string;
  /** The language that the project has been writing in (e.g. 'nodejs', 'python') */
  lang: string;
}


export class Config {
  logLevel: number;
  //
}


export class Logger {
  fatal(message: string): void;
  error(message: string): void;
  warn(message: string): void;
  info(message: string): void;
  log(message: string): void;
  debug(message: string): void;
}

global {
  declare var logger: Logger;
  // declare type ProjectInfo = ProjectInfo;
}


//
