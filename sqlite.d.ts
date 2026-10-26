// Declaration stub for the `sqlite` package used with TypeScript.
// The real runtime ships with its own typings, but Vercel’s build
// can’t locate them without this shim.

declare module "sqlite" {
  import { Database } from "sqlite3";

  export interface OpenOptions {
    filename: string;
    driver: typeof Database;
  }

  export function open(options: OpenOptions): Promise<Database>;
}
