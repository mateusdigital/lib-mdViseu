//----------------------------------------------------------------------------//
//  File      : ErrorUtils.ts                                                 //
//  Project   : lib-mdViseu                                                   //
//  Date      : 2025-8-28                                                     //
//  Copyright : mateusdigital <hello@mateus.digital>                          //
//----------------------------------------------------------------------------//

// -----------------------------------------------------------------------------
import * as vscode from "vscode";
import { DefaultLogger } from "./LogUtils";




// -----------------------------------------------------------------------------
export class ErrorUtils {

  // ---------------------------------------------------------------------------
  static LogError(...args: any[]) {
    DefaultLogger.error(...args);
  }

  // ---------------------------------------------------------------------------
  public static ShowErrorToUser(message: string) {
    vscode.window.showErrorMessage(message);
    ErrorUtils.LogError(message);
  }
}
