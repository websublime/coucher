import { Bucket } from "couchbase";
import { useBucketStorageError } from "./utils";

export class Storage {

  protected bucket: Bucket;

  constructor(bucket: Bucket) {
    this.bucket = bucket;
  }

  public getBucketManager() {
    return this.bucket.manager();
  }

  public getBucketName() {
    String(this.bucket);
  }

  public disconnect() {
    this.bucket.disconnect();
  }

  public async get(key: string, options = {}) {
    return new Promise((resolve, reject) => {
      this.bucket.get(key, options, (err, result) => {
        return err ? reject(useBucketStorageError(err.message)) : resolve(result);
      });
    });
  }

  public async getMulti(keys: string[]) {
    return new Promise((resolve, reject) => {
      this.bucket.getMulti(keys, (err, result) => {
        return err ? reject(useBucketStorageError(err.toString())) : resolve(result);
      })
    });
  }

  public async getAndTouch(key: string, expiry: number, options = {}) {
    return new Promise((resolve, reject) => {
      this.bucket.getAndTouch(key, expiry, options, (err, result) => {
        return err ? reject(useBucketStorageError(err.message)) : resolve(result);
      });
    });
  }
}
