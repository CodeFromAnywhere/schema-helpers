import { SimplifiedSchema } from "edge-util";
import { getReferenceParameterInfo } from "./getReferenceParameterInfo.js";
import { ReferenceParameterInfo } from "./getReferenceParameterInfo.js";
/**
 * based on the object properties in SimplifiedSchema, returns the model names that can be referenced
 */
export const getReferencableModels = (
  simplifiedSchema?: SimplifiedSchema,
): ReferenceParameterInfo[] | undefined => {
  if (simplifiedSchema?.type !== "object") return undefined;
  const parameterNames = simplifiedSchema.properties?.map((x) => x.name);

  const referenceParameterInfo = parameterNames
    ?.map((parameterName) => {
      const referenceParameterInfo = getReferenceParameterInfo(parameterName);

      return referenceParameterInfo;
    })
    .filter((x) => x.isReferenceParameter);

  return referenceParameterInfo;
};
