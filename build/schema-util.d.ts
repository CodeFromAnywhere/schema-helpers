import { JSONSchema7Definition } from "json-schema";
import { JSONSchema7 } from "json-schema";
export type SchemaProperty = {
    name: string;
    schema: JSONSchema7;
    required: boolean;
};
/**
 * Since `JSONSchema7`'s property `items` is fairly hard to use, this function gets that property in an easier to use way.
 */
export declare const getSchemaItems: (schema: JSONSchema7 | undefined) => JSONSchema7[];
/**
 * parses a JSONSchema7Definition to JSONSchema7|undefined so we can use it
 */
export declare const getSchema: (maybeSchema: JSONSchema7Definition | undefined) => JSONSchema7 | undefined;
/**
 * Gets all the properties of a schema
 */
export declare const getProperties: (schema: JSONSchema7 | undefined) => SchemaProperty[];
//# sourceMappingURL=schema-util.d.ts.map