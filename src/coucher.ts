import { Cluster, N1qlQuery, ClusterConstructorOptions, Bucket } from 'couchbase';
import { useBucketConnectionError } from './utils';

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

  protected bucket: Bucket;

  constructor () {
    this.consistency = {
      NOT_BOUND: consistencies.NOT_BOUND,
      REQUEST_PLUS: consistencies.REQUEST_PLUS,
      STATEMENT_PLUS: consistencies.STATEMENT_PLUS
    };
  }

  public async connect(url: string, bucketName: string, options?: ClusterConstructorOptions): Promise<Bucket> {
    return new Promise((resolve, reject) => {
      const cluster = new Cluster(url, options);
      const bucket = cluster.openBucket(bucketName);

      bucket.on('connect', () => {
        this.useBucket(bucket);
        resolve(bucket);
      });

      bucket.on('error', () => {
        return reject(
          useBucketConnectionError('Could not establish connection with Couchbase cluster')
        );
      });
    });
  }

  public useBucket(bucket: Bucket) {
    this.bucket = bucket;
  }
}
