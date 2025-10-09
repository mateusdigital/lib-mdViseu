
// ----------------------------------------------------------------------------
export interface ILogger {
  error: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  info: (...args: any[]) => void;
  log: (...args: any[]) => void;
}



// -----------------------------------------------------------------------------
export const DefaultLogger = console as ILogger;