export function convertStringDateToInteger(strDate) {
  const tempDate = new Date(strDate);
  return tempDate.getTime();
}

export function convertIntegerDateToString(intDate) {
  const tempDate = new Date(intDate * 1000);
  const result = tempDate.toUTCString();
  return result;
}

export function convertSecondToMilliSecond(second) {
  let milliSecond = second * 1000;
  return milliSecond;
}

export function convertMilliSecondToSecond(milliSecond) {
  let second = milliSecond / 1000;
  return second;
}

export function convertDayToSecond(days) {
  let milliSecond = days * 24 * 60 * 60;
  return milliSecond;
}
