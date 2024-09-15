const referenceParameterNames = ["slug", "id"];
// NB: misspelling on purpose to keep simple parsing from singular to plural
const referencePluralParameterNames = ["slugs", "ids"];
import { lowerCaseArray } from "edge-util";
import { pascalCase } from "edge-util";
import { capitaliseFirstLetter } from "edge-util";
import { isPlural } from "edge-util";
import { singularize } from "edge-util";
import { replaceLastOccurence } from "edge-util";
/**
 Takes a parameterName and returns information about it according to the convention `{descriptorName}_{modelName}{referenceKey}` where:
 
 - descriptorName with the suffixing underscore is optional
 - referenceKey can be slug, index, or id (or there plural variants)
 - modelName should refer to a database model

 */
export const getReferenceParameterInfo = (parameterName) => {
    const descriptorModelSplit = parameterName.split("_");
    const descriptor = parameterName.includes("_")
        ? descriptorModelSplit[0]
        : undefined;
    const rest = parameterName.includes("_")
        ? descriptorModelSplit[1]
        : parameterName;
    const wordArray = lowerCaseArray(rest);
    const singleWord = wordArray.length === 1;
    const parameterLastWord = wordArray.pop();
    const isReferenceSingleParameter = !singleWord && referenceParameterNames.includes(parameterLastWord);
    const isReferenceMultipleParameter = !singleWord && referencePluralParameterNames.includes(parameterLastWord);
    const isReferenceParameter = isReferenceSingleParameter || isReferenceMultipleParameter;
    // NB: the last item has been removed now
    const interfaceName = isReferenceParameter
        ? pascalCase(wordArray.join("-"))
        : undefined;
    // 'slug' or 'id'
    const keyInModel = isReferenceParameter
        ? singularize(parameterLastWord)
        : undefined;
    /**
     * the reference keyword should be removed from the parameterName to receive the dataParameterName
     *
     * e.g. `weirdSluggyModelSlugs` becomes `weirdSluggyModels`
     */
    const dataParameterName = isReferenceParameter && keyInModel
        ? replaceLastOccurence(parameterName, capitaliseFirstLetter(keyInModel), "")
        : undefined;
    const referenceParameterInfo = {
        descriptor,
        keyInModel,
        interfaceName,
        isReferenceMultipleParameter,
        isReferenceSingleParameter,
        isReferenceParameter,
        dataParameterName,
        parameterName,
    };
    return referenceParameterInfo;
};
/**
returns the reference parameterNames...
 

e.g.:
```
todos -> todoSlugs + todoIds
todo -> todoSlug + todoId
```

 */
export const getPossibleReferenceParameterNames = (parameterName) => {
    const possibleReferenceParameterNames = isPlural(parameterName)
        ? referencePluralParameterNames
            .map(capitaliseFirstLetter)
            .map((ref) => `${singularize(parameterName)}${ref}`)
        : referenceParameterNames
            .map(capitaliseFirstLetter)
            .map((ref) => `${parameterName}${ref}`);
    return possibleReferenceParameterNames;
};
//# sourceMappingURL=getReferenceParameterInfo.js.map