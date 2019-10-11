import { Cluster, Bucket, N1qlQuery } from 'couchbase';
import { useBucketConnectionError } from '../src/utils';
import { Storage } from '../src/storage';
import { config } from 'dotenv';
import { v4 } from 'uuid';

config();

jest.setTimeout(30000);

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

  beforeAll(
    async () =>
      connect().then(bucket => {
        return (storage = new Storage(bucket, 'travel-sample'));
      }),
    10000,
  );

  afterAll(() => storage.disconnect());

  it('# Should have bucket name', () => {
    expect(storage.getBucketName()).toEqual('travel-sample');
  });

  it('# Should get document from template', async () => {
    expect.assertions(1);

    const result = await storage.get('airline_10123', {
      consistency: N1qlQuery.Consistency.REQUEST_PLUS,
    });

    expect(Object.keys(result).includes('cas')).toBeTruthy();
  });

  it('# Should get multi documents from template', async () => {
    expect.assertions(2);

    const results = await storage.getMulti(['airline_10123', 'airline_109']);

    expect(Object.keys(results).includes('airline_10123')).toBeTruthy();
    expect(Object.keys(results).includes('airline_109')).toBeTruthy();
  });

  it('# Should get touch document', async () => {
    const result = await storage.getAndTouch('airline_112', 0);

    expect(Object.keys(result).includes('cas')).toBeTruthy();
  });

  it('# Should get and lock document', async () => {
    const result = await storage.getAndLock('airline_1191', { lockTime: 5 });

    expect(Object.keys(result).includes('cas')).toBeTruthy();
  });

  xit('# Should insert a new document', async () => {
    const result = await storage.insert(
      'airline_116',
      {
        callsign: 'ACE AIR',
        country: 'United States',
        iata: 'KA',
        icao: 'AKE',
        id: 117,
        name: 'Kansas Express',
        type: 'airline',
      },
      { expiry: 0 },
    );

    expect(Object.keys(result).includes('cas')).toBeTruthy();
  });

  xit('# Should append to an exist document', async () => {
    const _ = await storage.insert('airline_118', 'string');
    const result = await storage.append('airline_118', 'one_new_value');

    expect(Object.keys(result).includes('cas')).toBeTruthy();
  });

  xit('# Should prepend to an exist document', async () => {
    const _ = await storage.insert('airline_117', 'string');
    const result = await storage.prepend('airline_117', 'one_new_value');

    expect(Object.keys(result).includes('cas')).toBeTruthy();
  });

  it('# Should create a counter', async () => {
    const _ = await storage.insert('counter', 100);
    const result = await storage.counter('counter', 1, { initial: 100 });

    expect(Object.keys(result).includes('cas')).toBeTruthy();
  });

  it('# Should execute query', async () => {
    const query = N1qlQuery.fromString('SELECT type FROM `travel-sample` LIMIT 4');
    const queryPar = N1qlQuery.fromString('SELECT name FROM `travel-sample` WHERE name=$1');

    const result: { type: string }[] = await storage.query(query);
    const resultQuery: { name: string }[] = await storage.query(queryPar, ['Texas Wings']);

    expect(result.length > 0).toBeTruthy();
    expect(resultQuery.length > 0).toBeTruthy();
  });

  it('# Should execute raw query', async () => {
    const result: { type: string }[] = await storage.executeQuery(
      'SELECT name FROM `travel-sample` WHERE name=$1',
      ['Texas Wings'],
      { consistency: N1qlQuery.Consistency.REQUEST_PLUS },
    );

    expect(result.length > 0).toBeTruthy();
  });

  it('# Should remove a document', async () => {
    const result = await storage.remove('counter');

    expect(Object.keys(result).includes('cas')).toBeTruthy();
  });

  it('# Should replace a document', async () => {
    const result = await storage.replace(
      'airline_116',
      {
        callsign: 'ACE AIR',
        country: 'United States',
        iata: 'KA',
        icao: 'AKE',
        id: 117,
        name: 'Texas Express',
        type: 'airline',
      },
      { expiry: 0 },
    );

    expect(Object.keys(result).includes('cas')).toBeTruthy();
  });

  it('# Should update or insert a document', async () => {
    const result = await storage.upsert(
      'airline_116',
      {
        callsign: 'ACE AIR',
        country: 'United States',
        iata: 'KA',
        icao: 'AKE',
        id: 117,
        name: 'California Express',
        type: 'airline',
      },
      { expiry: 0 },
    );

    expect(Object.keys(result).includes('cas')).toBeTruthy();
  });

  it('# Should check document exist', async () => {
    const result = await storage.exists('airline_116');

    expect(result).toBeTruthy();
  });
});
