declare module 'node:sqlite' {
  export class DatabaseSync {
    constructor(location: string, options?: unknown);
    close(): void;
    exec(sql: string): void;
    prepare(sql: string): {
      all(...params: unknown[]): unknown[];
      get(...params: unknown[]): unknown;
      run(...params: unknown[]): { changes: number; lastInsertRowid: number | bigint };
    };
  }
}

declare global {
  var __dirname: string;
  var __filename: string;
}

export {};
