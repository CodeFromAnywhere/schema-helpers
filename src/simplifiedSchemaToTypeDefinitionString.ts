import { SimplifiedSchema } from "edge-util";
/**
 * Converts a simplifiedSchema definition back into a type interface string
 *
 * With this, types can be generated in different ways
 *
 * NB: https://github.com/bcherny/json-schema-to-typescript <--- this is probably much better and can be used straight from JSON schema
 */
export const simplifiedSchemaToTypeDefinitionString = (
  simplifiedSchema?: SimplifiedSchema,
) => {
  if (!simplifiedSchema) return "";

  if (simplifiedSchema.enum && simplifiedSchema.enum.length > 0) {
    // NB: TODO: This is probably not satisfactory for all enums! Needs testing
    const enumString = simplifiedSchema.enum.map((x) => String(x)).join(" | ");

    return enumString;
  }

  if (simplifiedSchema.type === "boolean") return "boolean";
  if (simplifiedSchema.type === "null") return "null";
  if (simplifiedSchema.type === "number") return "number";
  if (simplifiedSchema.type === "string") return "string";
  if (
    simplifiedSchema.type === "array" &&
    simplifiedSchema.items &&
    simplifiedSchema.items.length >= 1
  ) {
    const parts: string = simplifiedSchema.items
      .map((x) => simplifiedSchemaToTypeDefinitionString(x.schema))
      .join(" | ");

    const partsString: string =
      simplifiedSchema.items && simplifiedSchema.items.length >= 2
        ? `(${parts})[]`
        : `${parts}[]`;

    return partsString;
  }

  if (simplifiedSchema.type === "object" && simplifiedSchema.properties) {
    const objectParts = simplifiedSchema.properties.map((prop) => {
      const descriptionString = prop.schema.description
        ? `/** ${prop.schema.description} */\n`
        : "";
      const punctuationString = `${prop.required ? "" : "?"}: `;
      const propertyString: string = `${descriptionString}${
        prop.name
      }${punctuationString}${simplifiedSchemaToTypeDefinitionString(
        prop.schema,
      )};`;

      return propertyString;
    });

    const objectString = `{\n${objectParts.join("\n")}\n};\n`;

    return objectString;
  }

  // NB: Should never be the case, we have handled all types
  return "";
};
