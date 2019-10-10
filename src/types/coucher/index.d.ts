import { ClusterConstructorOptions, Bucket } from 'couchbase';

declare type CouchConnectionOptions = {
  username: string;
  password: string;
} & ClusterConstructorOptions;

declare type CouchGetResponse<T=any> = {
  cas: Bucket.CAS,
  value: T,
  error?: any
}
