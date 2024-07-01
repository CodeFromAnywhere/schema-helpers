import { notEmpty, takeFirst } from "from-anywhere";
import { JSONSchema7 } from "json-schema";

export const getDotnotationVariablesRecursive = (
  schema: JSONSchema7,
): string[] | undefined => {
  if (!schema.properties) {
    return;
  }

  const items: string[] = Object.keys(schema.properties)
    .map((property) => {
      const propertySchema = schema.properties![property] as JSONSchema7;

      if (
        propertySchema.type === "boolean" ||
        propertySchema.type === "integer" ||
        propertySchema.type === "null" ||
        propertySchema.type === "number" ||
        propertySchema.type === "string"
      ) {
        return [property];
      }

      if (propertySchema.type === "object") {
        return getDotnotationVariablesRecursive(propertySchema)?.map(
          (item) => `${property}.${item}`,
        );
      }

      if (propertySchema.type === "array") {
        const itemsSchema = takeFirst(propertySchema.items) as JSONSchema7;
        return getDotnotationVariablesRecursive(itemsSchema)?.map(
          (item) => `${property}[0].${item}`,
        );
      }
      return undefined;
    })
    .filter(notEmpty)
    .flat();

  return items;
};
