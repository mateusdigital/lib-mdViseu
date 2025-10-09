
//
// Imports
//

// -----------------------------------------------------------------------------
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
// -----------------------------------------------------------------------------
import { DateUtils } from './DateUtils';
import { ILogger } from './LogUtils';
import { dir } from 'console';




//
// Public Types
//

// -----------------------------------------------------------------------------
export interface GitUserInfo {
  name: string;
  email: string;
}



// -----------------------------------------------------------------------------
export class GitUtils {

  // ---------------------------------------------------------------------------
  static GetUserInfo(gitPath: string): GitUserInfo {
    const name = GitCmd(gitPath, `config user.name`) ?? "";
    const email = GitCmd(gitPath, `config user.email`) ?? "";
    return { name, email };
  }

  // ---------------------------------------------------------------------------
  static GetInitialFileDate(filename: string): Date | null {
    const gitPath = path.dirname(filename);
    const gitCmd = `log --format=%ad --date=iso --reverse -- "${filename}"`;

    const output = GitCmd(gitPath, gitCmd);
    if (!output) return null;

    try {
      const date_str = output.split(/\s+/)[0];
      return DateUtils.From_YYYY_MM_DD(date_str);
    } catch (err) {
      console.error(`[GitUtils] Failed to parse date for ${filename}:`, err);
      return null;
    }
  }

  // ---------------------------------------------------------------------------
  static GetRoot(filename: string): string | null {
    const gitPath = path.dirname(filename);
    const gitCmd = `rev-parse --show-toplevel`; // more reliable than --git-dir

    const output = GitCmd(gitPath, gitCmd);
    return output || null;
  }
}


// -------------------------------------------------------------------------- //
//                                                                            //
//                                                                            //
//  PRIVATE HELPERS                                                           //
//                                                                            //
//                                                                            //
// -------------------------------------------------------------------------- //

// -----------------------------------------------------------------------------
function SafeExecSync(cmd: string, logger: ILogger = console): string | null {
  try {
    const stdout = execSync(cmd, { stdio: ["ignore", "pipe", "pipe"] });
    return stdout.toString().trim();
  } catch (err: any) {
    logger.error(`[SafeExecSync] Command failed: ${cmd}`);
    logger.error(err.message);
    return null;
  }
}


// -----------------------------------------------------------------------------
function GitCmd(gitPath: string, gitCmd: string): string | null {
  const full_cmd = `git -C "${gitPath}" ${gitCmd}`;
  return SafeExecSync(full_cmd);
}