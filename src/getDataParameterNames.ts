import { notEmpty } from "from-anywhere";
import { AugmentedAnyModelType } from "from-anywhere/types";
import { getReferenceParameterInfo } from "./getReferenceParameterInfo.js";
/**
 * Finds all the data parameter names that might be there on an item, based on the item object keys and the convention
 */
export const getDataParameterNames = (
  item: AugmentedAnyModelType,
): string[] => {
  const dataParameterNames = Object.keys(item)
    .map((key) => {
      const { dataParameterName } = getReferenceParameterInfo(key);

      return dataParameterName;
    })
    .filter(notEmpty);

  return dataParameterNames;
};
