const BucketConnectionErrorMessageSymbol = Symbol('BucketConnectionErrorMessageSymbol');
const BucketStorageErrorMessageSymbol = Symbol('BucketConnectionErrorMessageSymbol');
const BucketConnectionErrorTypeSymbol = Symbol('BucketConnectionErrorTypeSymbol');
const BucketStorageErrorTypeSymbol = Symbol('BucketConnectionErrorTypeSymbol');
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

export const useBucketStorageError = (message: string) => {
  const error = Error(message);

  Object.defineProperties(error, {
    [BucketStorageErrorMessageSymbol]: {
      get() { return message; }
    },
    [BucketStorageErrorTypeSymbol]: {
      get() { return 'EBUCKETSTORAGE'; }
    }
  });

  if (Error.captureStackTrace) {
    Error.captureStackTrace(error, useBucketStorageError);
  }

  return error;
};
