
// -----------------------------------------------------------------------------
import * as fs from "fs";
import * as JSON5 from "json5";
import * as path from "path";
import * as vscode from "vscode";
import { ErrorUtils } from "./ErrorUtils";

export class CommentInfo {
  public singleLineStart: string = "";
  public singleLineEnd: string = "";

  public multiLineStart: string = "";
  public multiLineMiddle: string = "";
  public multiLineEnd: string = "";

  public singleLineLength: number = 0;
  public multiLineLength: number = 0;
}

// -----------------------------------------------------------------------------
export class CommentUtils {

  // ---------------------------------------------------------------------------
  static SurroundWithComments(
    commentInfo: CommentInfo,
    contents: string,
    options: {
      maxColumns: number;
      fill: string;
      padLeft: boolean;
      padRight: boolean;
      preferSingleLineComments: boolean;
    }): string {

    const maxColumns = options.maxColumns || 80;
    const fill = options.fill || " ";

    //
    if (options.padLeft) {
      contents = contents.trimStart();
    }
    if (options.padRight) {
      contents = contents.trimEnd();
    }

    //
    let availableColumns = (maxColumns);

    availableColumns -= ((!options.preferSingleLineComments)
      ? commentInfo.singleLineLength
      : commentInfo.multiLineLength);

    if(options.padLeft && options.padRight) {
      availableColumns /= 2;
    }

    availableColumns -= contents.length;

    //
    let result = "";

    result += ((!options.preferSingleLineComments)
      ? commentInfo.singleLineStart
      : commentInfo.multiLineStart);

    if(options.padLeft) {
      result += fill.repeat(availableColumns);
    }

    result += contents;

    result += commentInfo.singleLineEnd;
    if(options.padRight) {
      result += fill.repeat(availableColumns);
    }

    result += ((!options.preferSingleLineComments)
      ? commentInfo.singleLineEnd
      : commentInfo.multiLineEnd);

    if(result.length != maxColumns) {
      debugger;
    }

    return result;
  }

  // ---------------------------------------------------------------------------
  public static CreateCommentInfo(editor: vscode.TextEditor): CommentInfo | null {
    const language_id = editor.document.languageId;
    const language_comment_info = CommentUtils._GetLanguageCommentInfo(language_id);

    let single_start = (language_comment_info.lineComment)
      ? language_comment_info.lineComment
      : language_comment_info.blockComment[0];

    let single_end = (language_comment_info.lineComment)
      ? ""
      : language_comment_info.blockComment[1];

    let multi_start = (language_comment_info.lineComment)
      ? language_comment_info.lineComment
      : language_comment_info.blockComment[0];

    let multi_end = (language_comment_info.lineComment)
      ? language_comment_info.lineComment
      : language_comment_info.blockComment[1];

    let multi_middle = (language_comment_info.lineComment)
      ? language_comment_info.lineComment
      : language_comment_info.blockComment[0][language_comment_info.blockComment[0].length - 1];

    if (single_start && single_start.length > 0 && single_start.length < 2) {
      single_start += single_start;
    }

    if (single_end && single_end.length > 0 && single_end.length < 2) {
      single_end += single_end;
    }

    if (multi_start && multi_start.length > 0 && multi_start.length < 2) {
      multi_start += multi_start;
    }

    // if (multi_middle && multi_middle.length > 0 && multi_middle.length < 2) {
    //   multi_middle += multi_middle;
    // }

    if (multi_end && multi_end.length > 0 && multi_end.length < 2) {
      multi_end += multi_end;
    }

    const obj = {
      singleLineStart: single_start,
      singleLineEnd: single_end,

      multiLineStart: multi_start,
      multiLineMiddle: multi_middle,
      multiLineEnd: multi_end,

      singleLineLength: single_start.length + single_end.length,
      multiLineLength: multi_start.length + multi_end.length,
    } as CommentInfo;

    return obj;
  }

  // ---------------------------------------------------------------------------
  private static _GetLanguageInfo(languageId: string) {
    let config_file_path: string | null = null;
    for (const ext of vscode.extensions.all) {
      const is_lang_config = ext.id.startsWith("vscode.") &&
        ext.packageJSON.contributes &&
        ext.packageJSON.contributes.languages

      if (!is_lang_config) {
        continue;
      }

      const language_packages: any[] = ext.packageJSON.contributes.languages;
      const language_package_data: any =
        language_packages.find(pack => pack.id === languageId);

      if (!!language_package_data && language_package_data.configuration) {
        config_file_path =
          path.join(ext.extensionPath, language_package_data.configuration);
        break;
      }
    }

    if (!config_file_path || !fs.existsSync(config_file_path)) {
      return null;
    }

    const config = JSON5.parse(fs.readFileSync(config_file_path, "utf8"));
    return config;
  }

  // ---------------------------------------------------------------------------
  private static _GetLanguageCommentInfo(languageId: string) {
    let config: any = CommentUtils._GetLanguageInfo(languageId);
    if (!config) {
      switch (languageId) {
        case "kotlin": { config = CommentUtils._GetLanguageInfo("java"); break }
        case "plaintext": { config = CommentUtils._GetLanguageInfo("markdown"); break }
        case "cmake": { config = CommentUtils._GetLanguageInfo("markdown"); break }

        default: {
          ErrorUtils.LogError("Can't find language configuration for: " + languageId);
        } break;
      }
    }

    return config.comments;
  }

  // -----------------------------------------------------------------------------
  public static CreateCommentLine(
    editor: vscode.TextEditor,
    selectionColumn: number,
    selectionText: string = ""
  ): string | null {
    //
    const info = CommentUtils.CreateCommentInfo(editor);
    if (!info) {
      return null;
    }

    selectionText = selectionText.trim();

    const comment_start = info.singleLineStart;
    const comment_end = info.singleLineEnd;

    const space_start = " ";
    const space_end = (info.singleLineEnd) ? " " : "";

    const first_spacer = "-".repeat(3);
    const second_spacer = "-".repeat(80);
    const text_margin = (selectionText.length != 0) ? " " : "";

    const first_half
      = comment_start
      + space_start
      + first_spacer
      + text_margin
      + selectionText
      + text_margin
      + second_spacer;

    const second_half
      = space_end
      + comment_end;

    const comment_line
      = first_half.substring(0, 80 - second_half.length)
      + second_half;

    console.log("comment_line", comment_line);
    return comment_line;
  }

  // -----------------------------------------------------------------------------
  public static _CreateCommentBlock(
    editor: vscode.TextEditor, spaceGap: string, selectedText: string
  ) {
    const comment_info = CommentUtils.CreateCommentInfo(editor);
    if (!comment_info) {
      return null;
    }
    selectedText = selectedText.trim();

    const start = comment_info.multiLineStart;
    const middle = comment_info.multiLineMiddle;
    const end = comment_info.multiLineEnd;

    let comment_header = start + "\n";
    comment_header += spaceGap + middle + " " + selectedText + "\n";
    comment_header += spaceGap + end + "\n";

    console.log("comment_header", comment_header);
    return comment_header;
  }
}
