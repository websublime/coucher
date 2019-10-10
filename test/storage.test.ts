import { Cluster, Bucket, N1qlQuery } from 'couchbase';
import { useBucketConnectionError } from '../src/utils';
import { Storage } from '../src/storage';
import { config } from 'dotenv';

config();

const connect = async (): Promise<Bucket> => {
  return new Promise((resolve, reject) => {
    const cluster = new Cluster(process.env.COUCH_URL);
    cluster.authenticate(process.env.COUCH_USER, process.env.COUCH_PASS);

    const bucket = cluster.openBucket('travel-sample');

    bucket.on('connect', () => {
      resolve(bucket);
    });

    bucket.on('error', () => {
      return reject(
        useBucketConnectionError('Could not establish connection with Couchbase cluster'),
      );
    });
  });
};

describe('> Storage', () => {
  let storage: Storage;

  beforeAll(async () => connect().then(bucket => {
    return storage = new Storage(bucket, 'travel-sample');
  }), 10000);

  afterAll(() => storage.disconnect());

  it('# Should have bucket name', () => {
    expect(storage.getBucketName()).toEqual('travel-sample');
  });

  it('# Should get document from template', async () => {
    expect.assertions(1);

    const result = await storage.get('airline_10', {
      consistency: N1qlQuery.Consistency.REQUEST_PLUS
    });

    expect(Object.keys(result).includes('cas')).toBeTruthy();
  });

  it('# Should get multi documents from template', async () => {
    expect.assertions(3);

    const results = await storage.getMulti(['airline_10', 'airline_10123', 'airline_109']);

    expect(Object.keys(results).includes('airline_10')).toBeTruthy();
    expect(Object.keys(results).includes('airline_10123')).toBeTruthy();
    expect(Object.keys(results).includes('airline_109')).toBeTruthy();
  });
});
