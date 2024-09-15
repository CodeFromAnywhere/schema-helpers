import { makeArray } from "edge-util";
import { notEmpty } from "edge-util";
//==========
/**
 * Since `JSONSchema7`'s property `items` is fairly hard to use, this function gets that property in an easier to use way.
 */
export const getSchemaItems = (schema) => {
    const schemas = makeArray(schema?.items).map(getSchema).filter(notEmpty);
    return schemas;
};
/**
 * parses a JSONSchema7Definition to JSONSchema7|undefined so we can use it
 */
export const getSchema = (maybeSchema) => typeof maybeSchema !== "object" ? undefined : maybeSchema;
/**
 * Gets all the properties of a schema
 */
export const getProperties = (schema) => {
    if (!schema)
        return [];
    const propertyKeys = schema.properties ? Object.keys(schema.properties) : [];
    const properties = propertyKeys
        .map((key) => {
        const propertySchema = getSchema(schema.properties?.[key]);
        return propertySchema
            ? {
                name: key,
                schema: propertySchema,
                required: schema.required?.includes(key) || false,
            }
            : null;
    })
        .filter(notEmpty);
    return properties;
};
//# sourceMappingURL=schema-util.js.map