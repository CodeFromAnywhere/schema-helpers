import { notEmpty, takeFirst } from "from-anywhere";
export const getDotnotationVariablesRecursive = (schema) => {
    if (!schema.properties) {
        return;
    }
    const items = Object.keys(schema.properties)
        .map((property) => {
        const propertySchema = schema.properties[property];
        if (propertySchema.type === "boolean" ||
            propertySchema.type === "integer" ||
            propertySchema.type === "null" ||
            propertySchema.type === "number" ||
            propertySchema.type === "string") {
            return [property];
        }
        if (propertySchema.type === "object") {
            return getDotnotationVariablesRecursive(propertySchema)?.map((item) => `${property}.${item}`);
        }
        if (propertySchema.type === "array") {
            const itemsSchema = takeFirst(propertySchema.items);
            return getDotnotationVariablesRecursive(itemsSchema)?.map((item) => `${property}[0].${item}`);
        }
        return undefined;
    })
        .filter(notEmpty)
        .flat();
    return items;
};
//# sourceMappingURL=getDotnotationVariables.js.map