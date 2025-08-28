//
// Imports
//

// -----------------------------------------------------------------------------
import * as fs from "fs";
import * as JSON5 from "json5";
import * as path from "path";
import * as vscode from "vscode";



export class ErrorUtils {

  public static ShowErrorToUser(message: string) {
    vscode.window.showErrorMessage(message);
  }
}
