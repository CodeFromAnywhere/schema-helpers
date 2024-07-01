import { makeArray } from "from-anywhere";
import { notEmpty } from "from-anywhere";
import { TsInterface } from "from-anywhere/types";
import { JSONSchema7Definition } from "json-schema";
import { JSONSchema7 } from "json-schema";
import { Schema } from "from-anywhere/types";
export type SchemaProperty = {
  name: string;
  schema: JSONSchema7;
  required: boolean;
};

//==========

/**
 * Since `JSONSchema7`'s property `items` is fairly hard to use, this function gets that property in an easier to use way.
 */
export const getSchemaItems = (schema: Schema | undefined) => {
  const schemas = makeArray(schema?.items).map(getSchema).filter(notEmpty);
  return schemas;
};

/**
 * parses a JSONSchema7Definition to JSONSchema7|undefined so we can use it
 */
export const getSchema = (
  maybeSchema: JSONSchema7Definition | undefined,
): Schema | undefined =>
  typeof maybeSchema !== "object" ? undefined : maybeSchema;

/**
 * Gets all the properties of a schema
 */
export const getProperties = (schema: Schema | undefined): SchemaProperty[] => {
  if (!schema) return [];
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
