
//----------------------------------------------------------------------------//
//                               *       +                                    //
//                         '                  |                               //
//                     ()    .-.,="``"=.    - o -                             //
//                           '=/_       \     |                               //
//                        *   |  '=._    |                                    //
//                             \     `=./`,        '                          //
//                          .   '=.__.=' `='      *                           //
//                 +                         +                                //
//                      O      *        '       .                             //
//                                                                            //
//  File      : vscode-utils.ts                                               //
//  Project   : mdcomments                                                    //
//  Date      : 2024-04-29                                                    //
//  License   : See project's COPYING.TXT for full info.                      //
//  Author    : mateus.digital <hello@mateus.digital>                         //
//  Copyright : mateus.digital - 2024                                         //
//                                                                            //
//  Description :                                                             //
//   Functionality inspired and taken from:                                   //
//    - https://github.com/daniel-junior-dube/vscode_banner_comments.git      //
//      Thanks a lot :)                                                       //
//                                                                            //
//----------------------------------------------------------------------------//

//
// Imports
//

// -----------------------------------------------------------------------------
import * as fs from "fs";
import * as JSON5 from "json5";
import * as path from "path";
import * as vscode from "vscode";

//
//
//

// ---------------------------------------------------------------------------
export interface ICommentInfo {

  lineComment: any;
  blockComment: any;
}

//
//
//

// -----------------------------------------------------------------------------
export class VSCodeUtils {



  //
  // Active Editor Things
  //

  // ---------------------------------------------------------------------------
  static ActiveEditor(): vscode.TextEditor {
    return vscode.window.activeTextEditor!;
  }


  // ---------------------------------------------------------------------------
  static GetActiveTextEditorFilePath() {
    const curr_editor = vscode.window.activeTextEditor;
    if (!curr_editor) {
      return null;
    }

    const uri = curr_editor.document.uri;
    const filepath = uri.fsPath;

    return filepath
  }
}