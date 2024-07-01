import { notEmpty } from "from-anywhere";
import { findFirstCommentTypes } from "./findFirstCommentTypes.js";
import { getRefLink } from "./getRefLink.js";
import { getPossibleReferenceParameterNames } from "./getReferenceParameterInfo.js";
import { getProperties, getSchemaItems } from "./schema-util.js";
/**
 Return a SimplifiedSchema by giving the JSONSchema7 schema, its name and a list of possible references in the JSONSchema.
 
 A SimplifiedSchema is a data structure that allows you to easily define type interfaces that need to build out forms.

 # Todo
 
Dual types aren't done right yet. I probably don't look at `anyOf` yet, which makes it result in an empty object.

For example, this one is problematic:

INPUT:

```json
{
"schema": {
    "anyOf": [
      {"type": "string"},
      {"type": "array","items": {"type": "string"}}
    ]
  },
```

Output:
```json
{
"simplifiedSchema": {
  "properties": [],
  "type": "object"
},
}
      ```

      To test this one, test `npx rebuildOperation filename-conventions`
 */
export const simplifySchema = (
/** The name of the type interface, (this could be used as $ref). */
name, 
/** The schema that needs to be simplified */
schema, 
/** The array of other schemas found when crawling file this schema was found in. this also includes all refs to other type interfaces in all schemas in that file */
possibleRefs, 
/**
 * This function is recursive. If we find any reference to another schema, we will add the name of the current schema to the rootStack and explore that schema.
 */
rootStack) => {
    if (Array.isArray(schema.type)) {
        // let's do this one later
        console.log(`I don't support this usecase (type is an array of multiple types)... ${schema.type.join(",")}`, {
            type: "debug",
        });
    }
    const type = Array.isArray(schema.type) ? schema.type[0] : schema.type;
    const newRootStack = name ? rootStack.concat(name) : rootStack;
    const refName = getRefLink(schema.$ref);
    // NB: we already encountered this ref before, let's avoid infinite recursion here.
    const isCircularRef = !!refName && rootStack.includes(refName);
    if (refName && !isCircularRef) {
        const refSchema = possibleRefs.find((r) => r.name === refName);
        if (!refSchema) {
            // log(
            //   `ref not present: ${refName} (type: ${name}, ${rootStack.join(
            //     ","
            //   )}, ${possibleRefs.map((x) => x.name).join(",")})`,
            //   { type: "warning" }
            // );
            // log("Strange, ref was not present in the possible refs", {
            //   type: "debug",
            // });
            // console.log({
            //   possibleRefNames: possibleRefs.map((x) => x.name),
            //   refName,
            // });
        }
        const thisDescription = schema.description
            ? `${schema.description}\n\n`
            : "";
        const mergedSchema = refSchema?.schema
            ? {
                ...refSchema.schema,
                description: `${thisDescription}${refSchema.schema.description || ""}`,
            }
            : undefined;
        return mergedSchema
            ? simplifySchema(refName, mergedSchema, possibleRefs, newRootStack)
            : undefined;
    }
    const fullComment = schema.description;
    const commentTypeObject = findFirstCommentTypes(fullComment);
    // TODO: Add all other `CommentType`s as properties
    const simplifiedPrimitive = {
        enum: schema.enum,
        circularRefName: refName,
        fullComment,
        ...commentTypeObject,
    };
    if (type === "boolean") {
        return { ...simplifiedPrimitive, type: "boolean" };
    }
    if (type === "integer" || type === "number") {
        // NB: integers are also numbers
        return { ...simplifiedPrimitive, type: "number" };
    }
    if (type === "null") {
        return { ...simplifiedPrimitive, type: "null" };
    }
    if (type === "string") {
        return { ...simplifiedPrimitive, type: "string" };
    }
    if (type === "array") {
        const items = getSchemaItems(schema);
        const simplifiedItems = items
            .map((item) => {
            const itemName = getRefLink(item.$ref) || null;
            const schema = simplifySchema(itemName, item, possibleRefs, name ? rootStack.concat(name) : rootStack);
            if (!schema)
                return;
            return {
                schema,
                name: itemName,
            };
        })
            .filter(notEmpty);
        return {
            ...simplifiedPrimitive,
            items: simplifiedItems,
            type: "array",
        };
    }
    // NB: type must be an object here, it's the only possibility left...
    // in case of objects
    const properties = getProperties(schema);
    const simplifiedProperties = properties
        .map((property) => {
        const schema = simplifySchema(property.name, property.schema, possibleRefs, newRootStack);
        if (!schema)
            return;
        const possibleReferenceParameterNames = getPossibleReferenceParameterNames(property.name);
        const hasReferenceParameter = !!properties.find((x) => possibleReferenceParameterNames.includes(x.name));
        // NB: if the property has a model reference, we just need the model reference, not the whole model. This is only for retreiving, it's not present in the database.
        if (hasReferenceParameter)
            return;
        return {
            name: property.name,
            required: property.required,
            schema,
        };
    })
        .filter(notEmpty);
    return {
        ...simplifiedPrimitive,
        properties: simplifiedProperties,
        type: "object",
    };
};
//# sourceMappingURL=simplifySchema.js.map