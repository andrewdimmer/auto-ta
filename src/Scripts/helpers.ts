export function logErrReturn<T>(returnValue: T) {
  return (err: any) => {
    console.log(err);
    return returnValue;
  };
}
