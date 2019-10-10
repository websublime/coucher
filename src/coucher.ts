import { Cluster, N1qlQuery, Bucket } from 'couchbase';
import { useBucketConnectionError } from './utils';
import { Storage } from './storage';
import { CouchConnectionOptions } from './types/coucher';

const consistencies = N1qlQuery.Consistency;

export class Coucher {
  /**
   * Available consistencies for Couchbase storage actions.
   */
  public consistency: {
    NOT_BOUND: number,
    REQUEST_PLUS: number,
    STATEMENT_PLUS: number
  };

  protected storage: Storage;

  constructor () {
    this.consistency = {
      NOT_BOUND: consistencies.NOT_BOUND,
      REQUEST_PLUS: consistencies.REQUEST_PLUS,
      STATEMENT_PLUS: consistencies.STATEMENT_PLUS
    };
  }

  public async connect(url: string, bucketName: string, options?: CouchConnectionOptions): Promise<Bucket> {
    return new Promise((resolve, reject) => {
      const cluster = new Cluster(url, options);
      const { username, password} = options || {};

      if (username && password) {
        cluster.authenticate(username, password);
      }

      const bucket = cluster.openBucket(bucketName);

      bucket.on('connect', () => {
        this.useBucket(bucket, bucketName);
        resolve(bucket);
      });

      bucket.on('error', (error) => {
        return reject(
          useBucketConnectionError(error.message)
        );
      });
    });
  }

  public useBucket(bucket: Bucket, name: string = 'default') {
    this.storage = new Storage(bucket, name);
  }
}
