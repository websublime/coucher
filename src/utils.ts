const BucketConnectionErrorMessageSymbol = Symbol('BucketConnectionErrorMessageSymbol');
const BucketConnectionErrorTypeSymbol = Symbol('BucketConnectionErrorTypeSymbol');
export const useBucketConnectionError = (message: string) => {
  const error = Error(message);

  Object.defineProperties(error, {
    [BucketConnectionErrorMessageSymbol]: {
      get() { return message; }
    },
    [BucketConnectionErrorTypeSymbol]: {
      get() { return 'EBUCKETCONNECTION'; }
    }
  });

  if (Error.captureStackTrace) {
    Error.captureStackTrace(error, useBucketConnectionError);
  }

  return error;
};
