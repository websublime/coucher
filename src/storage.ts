import { Bucket } from "couchbase";
import { useBucketStorageError } from "./utils";
import { CouchGetResponse } from "./types/coucher";

export class Storage {

  protected bucket: Bucket;

  private bucketName: string;

  constructor(bucket: Bucket, name = 'default') {
    this.bucket = bucket;
    this.bucketName = name;
  }

  public getBucket() {
    return this.bucket;
  }

  public getBucketManager() {
    return this.bucket.manager();
  }

  public getBucketName() {
    return this.bucketName;
  }

  public disconnect() {
    this.bucket.disconnect();
  }

  public async get<T>(key: string, options = {}) {
    return new Promise<CouchGetResponse<T>>((resolve, reject) => {
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
