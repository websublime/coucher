import {
  Bucket,
  GetAndLockOptions,
  InsertOptions,
  AppendOptions,
  PrependOptions,
  CounterOptions,
  N1qlQuery,
  ViewQuery,
  SpatialQuery,
  RemoveOptions,
  ReplaceOptions,
  UpsertOptions,
  TouchOptions,
  CreateIndexOptions,
  DropIndexOptions,
} from 'couchbase';
import { useBucketStorageError } from './utils';
import { CouchGetResponse } from './types/coucher';

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

  public async get<T = any>(key: string, options = {}) {
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
      });
    });
  }

  public async getAndTouch<T = any>(key: string, expiry: number, options = {}) {
    return new Promise<CouchGetResponse<T>>((resolve, reject) => {
      this.bucket.getAndTouch(key, expiry, options, (err, result) => {
        return err ? reject(useBucketStorageError(err.message)) : resolve(result);
      });
    });
  }

  public async getAndLock<T = any>(key: string, options: GetAndLockOptions = {}) {
    return new Promise<CouchGetResponse<T>>((resolve, reject) => {
      this.bucket.getAndLock(key, options, (err, result) => {
        return err ? reject(useBucketStorageError(err.message)) : resolve(result);
      });
    });
  }

  public async insert<T = any>(key: string, data: {}, options: InsertOptions = {}) {
    return new Promise<CouchGetResponse<T>>((resolve, reject) => {
      this.bucket.insert(key, data, options, (err, result) => {
        return err ? reject(useBucketStorageError(err.message)) : resolve(result);
      });
    });
  }

  public async append<T = any>(key: string, value: string, options: AppendOptions = {}) {
    return new Promise<CouchGetResponse<T>>((resolve, reject) => {
      this.bucket.append(key, value, options, (err, result) => {
        return err ? reject(useBucketStorageError(err.message)) : resolve(result);
      });
    });
  }

  public async prepend<T = any>(key: string, value: string, options: PrependOptions = {}) {
    return new Promise<CouchGetResponse<T>>((resolve, reject) => {
      this.bucket.prepend(key, value, options, (err, result) => {
        return err ? reject(useBucketStorageError(err.message)) : resolve(result);
      });
    });
  }

  public async counter<T = any>(key: string, delta: number = 1, options: CounterOptions = {}) {
    return new Promise<CouchGetResponse<T>>((resolve, reject) => {
      this.bucket.counter(key, delta, options, (err, result) => {
        return err ? reject(useBucketStorageError(err.message)) : resolve(result);
      });
    });
  }

  public async query(query: N1qlQuery, params = {}) {
    return new Promise<any[]>((resolve, reject) => {
      this.bucket.query(query, params, (err, result) => {
        return err ? reject(useBucketStorageError(err.message)) : resolve(result);
      });
    });
  }

  public async view(query: SpatialQuery | ViewQuery) {
    return new Promise((resolve, reject) => {
      this.bucket.query(query, (err, result) => {
        return err ? reject(useBucketStorageError(err.message)) : resolve(result);
      });
    });
  }

  public async executeQuery(
    query: string,
    params: {},
    options: { consistency?: N1qlQuery.Consistency } = {},
  ): Promise<any[]> {
    return new Promise<any[]>((resolve, reject) => {
      let n1ql = N1qlQuery.fromString(query);

      if (options.consistency) {
        n1ql.consistency(options.consistency);
      }

      this.query(n1ql, params)
        .then((results: any[]) => {
          resolve(
            results.map(result => {
              return result[this.getBucketName()] || result;
            }),
          );
        })
        .catch(err => reject(useBucketStorageError(err.message)));
    });
  }

  public async remove(key: string, options: RemoveOptions = {}) {
    return new Promise<{ cas: Bucket.CAS; token?: any }>((resolve, reject) => {
      this.bucket.remove(key, options, (err, result) => {
        return err ? reject(useBucketStorageError(err.message)) : resolve(result);
      });
    });
  }

  public async replace<T = any>(key: string, value: any, options: ReplaceOptions = {}) {
    return new Promise<CouchGetResponse<T>>((resolve, reject) => {
      this.bucket.replace(key, value, options, (err, result) => {
        return err ? reject(useBucketStorageError(err.message)) : resolve(result);
      });
    });
  }

  public async upsert<T = any>(key: string, value: any, options: UpsertOptions = {}) {
    return new Promise<CouchGetResponse<T>>((resolve, reject) => {
      this.bucket.upsert(key, value, options, (err, result) => {
        return err ? reject(useBucketStorageError(err.message)) : resolve(result);
      });
    });
  }

  public async touch<T = any>(key: string, expiry: number, options: TouchOptions = {}) {
    return new Promise<CouchGetResponse<T>>((resolve, reject) => {
      this.bucket.touch(key, expiry, options, (err, result) => {
        return err ? reject(useBucketStorageError(err.message)) : resolve(result);
      });
    });
  }

  public async unlock(key: string, cas: Bucket.CAS, options: any = {}): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.bucket.unlock(key, cas, options, (err, result) => {
        return err ? reject(useBucketStorageError(err.message)) : resolve(result);
      });
    });
  }

  public async exists(key: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.insert(key, true, { expiry: 1 })
        .then(() => resolve(false))
        .catch((err: Error) => {
          return err ? resolve(true) : reject(err);
        });
    });
  }

  public async createIndex(
    name: string,
    indexFields: string[],
    options: CreateIndexOptions = {},
  ): Promise<boolean> {
    return new Promise<boolean>((resolve, _reject) => {
      this.bucket.manager().createIndex(name, indexFields, options, err => {
        return err ? resolve(false) : resolve(true);
      });
    });
  }

  public async dropIndex(name: string, options: DropIndexOptions = {}): Promise<boolean> {
    return new Promise<boolean>((resolve, _reject) => {
      this.bucket.manager().dropIndex(name, options, err => {
        return err ? resolve(false) : resolve(true);
      });
    });
  }

  public async getIndexes(
    options: { consistency?: N1qlQuery.Consistency } = {},
  ): Promise<Array<{}>> {
    return new Promise<Array<{}>>((resolve, reject) => {
      const query = 'SELECT `indexes`.* FROM system:indexes';

      const n1ql = N1qlQuery.fromString(query);

      if (options.consistency) {
        n1ql.consistency(options.consistency);
      }

      this.query(n1ql, {})
        .then(results => resolve(results))
        .catch(err => reject(err));
    });
  }

  public async buildDeferredIndexes(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.getIndexes()
        .then(async (indexes: any) => {
          let deferredList = indexes.reduce((carry: any, index: any) => {
            if (['deferred', 'pending'].includes(index.state)) {
              carry.push('`' + index.name + '`');
            }

            return carry;
          }, []);

          if (deferredList.length === 0) {
            resolve(true);
          }

          const query =
            'BUILD INDEX ON ' +
            '`' +
            this.getBucketName() +
            '` ' +
            '(' +
            deferredList.join(', ') +
            ')';

          await this.executeQuery(query, {});

          resolve(true);
        })
        .catch(_err => resolve(false));
    });
  }
}
