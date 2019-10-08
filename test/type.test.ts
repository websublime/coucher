import { TypeBoolean } from '../src/entities/type';


import * as t from 'io-ts'
import { isRight } from 'fp-ts/lib/Either';
import { isLeft } from 'fp-ts/lib/These';

describe('> Test types', () => {
  it('...', () => {
    expect(TypeBoolean(true)).toBeTruthy();
    expect(TypeBoolean(false)).toBeTruthy();
    expect(TypeBoolean(null)).toBeFalsy();
    expect(TypeBoolean(undefined)).toBeFalsy();
  });

  it('...', () => {
    const User = t.type({
      name: t.string,
      age: t.number
    });

    expect(isRight(User.decode({ name: 'a', age: 1 }))).toBeTruthy();
    expect(isLeft(User.decode({ email: 'a', age: 1 }))).toBeTruthy();
  });
});
