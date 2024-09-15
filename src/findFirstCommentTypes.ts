import { CommentTypeObject } from "./TsComment.js";
import { commentTypes } from "./TsComment.js";
import { mergeObjectsArray } from "edge-util";
import { notEmpty } from "edge-util";
/**
 * Tries to find tie first appearing special comment line and parses it and returns it as part of the `CommentTypeObject`
 */
export const findFirstCommentTypes = (
  strippedFullComment?: string,
): CommentTypeObject => {
  if (strippedFullComment === undefined) return {};
  const lines = strippedFullComment.split("\n");

  const specialCommentTypesObject = commentTypes
    .map((commentType) => {
      const matchingPart = `${commentType.toUpperCase()}:`;
      const matchingLine = lines.find((line) => {
        const trimmedLine = line.trimStart();
        const isMatch = trimmedLine.startsWith(matchingPart);
        return isMatch;
      });

      if (!matchingLine) return;

      const strippedMatchingLine = matchingLine.trimStart();
      const specialCommentWithoutPrefix = strippedMatchingLine
        .slice(matchingPart.length)
        .trim();

      return {
        [commentType]: specialCommentWithoutPrefix,
      };
    })
    .filter(notEmpty);

  const fullObject = mergeObjectsArray(
    specialCommentTypesObject,
  ) as CommentTypeObject;

  return fullObject;
};
