import { getRefLink } from "./getRefLink.js";
/**
 * NB: the type interfaces should be very similar if not identical to JSON-Schema, and therefore, this should also work with any JSON Schemas, not just openapi
 */
export const getRefSchemaOrSchema = (schemaOrRef, refSchemas) => {
    if (!Object.keys(schemaOrRef).includes("$ref")) {
        return schemaOrRef;
    }
    const schemaName = getRefLink(schemaOrRef.$ref);
    if (!schemaName) {
        return;
    }
    const schema = refSchemas?.[schemaName];
    if (!schema) {
        return;
    }
    return schema;
};
//# sourceMappingURL=getRefSchemaOrSchema.js.map