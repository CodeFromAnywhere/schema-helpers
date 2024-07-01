import { OpenapiReferenceObject } from "from-anywhere/types";
import { OpenapiSchemaObject } from "from-anywhere/types";
/**
 * NB: the type interfaces should be very similar if not identical to JSON-Schema, and therefore, this should also work with any JSON Schemas, not just openapi
 */
export declare const getRefSchemaOrSchema: (schemaOrRef: OpenapiSchemaObject | OpenapiReferenceObject, refSchemas: Record<string, OpenapiSchemaObject> | undefined) => OpenapiSchemaObject | undefined;
//# sourceMappingURL=getRefSchemaOrSchema.d.ts.map