import { OpenapiReferenceObject } from "from-anywhere/types";
import { OpenapiSchemaObject } from "from-anywhere/types";
import { getRefLink } from "./getRefLink.js";
/**
 * NB: the type interfaces should be very similar if not identical to JSON-Schema, and therefore, this should also work with any JSON Schemas, not just openapi
 */
export const getRefSchemaOrSchema = (
  schemaOrRef: OpenapiSchemaObject | OpenapiReferenceObject,
  refSchemas: Record<string, OpenapiSchemaObject> | undefined,
): OpenapiSchemaObject | undefined => {
  if (!Object.keys(schemaOrRef).includes("$ref")) {
    return schemaOrRef as OpenapiSchemaObject;
  }

  const schemaName = getRefLink((schemaOrRef as OpenapiReferenceObject).$ref);

  if (!schemaName) {
    return;
  }

  const schema = refSchemas?.[schemaName];

  if (!schema) {
    return;
  }

  return schema;
};
