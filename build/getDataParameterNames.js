import { notEmpty } from "edge-util";
import { getReferenceParameterInfo } from "./getReferenceParameterInfo.js";
/**
 * Finds all the data parameter names that might be there on an item, based on the item object keys and the convention
 */
export const getDataParameterNames = (item) => {
    const dataParameterNames = Object.keys(item)
        .map((key) => {
        const { dataParameterName } = getReferenceParameterInfo(key);
        return dataParameterName;
    })
        .filter(notEmpty);
    return dataParameterNames;
};
//# sourceMappingURL=getDataParameterNames.js.map