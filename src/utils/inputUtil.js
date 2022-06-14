export function isAllInputNotNull(objectInput) {
  for (let key of Object.keys(objectInput)) {
    if (objectInput[key] == null || objectInput[key] === "") {
      console.log("null input debug: ", key, objectInput[key]);
      return false;
    }
  }
  return true;
}
