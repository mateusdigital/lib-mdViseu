//
// Imports
//

// -----------------------------------------------------------------------------
import * as fs from "fs";
import * as JSON5 from "json5";
import * as path from "path";
import * as vscode from "vscode";



export class ErrorUtils {
  static LogError(...args: any[]) {
    console.error(...args);
  }

  public static ShowErrorToUser(message: string) {
    vscode.window.showErrorMessage(message);
  }
}
