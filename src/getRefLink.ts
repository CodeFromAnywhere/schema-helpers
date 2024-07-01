/**
 * gets the $ref from a schema and parses the interface name from it
 */
export const getRefLink = (ref?: string) => {
  const refLink = ref
    ?.split("/")
    .pop()
    ?.replaceAll("%3C", "<")
    .replaceAll("%3E", ">");

  return refLink;
};
