/**
 * @license
 * Copyright Websublime. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://www.websublime.com/license
 */

import * as t from 'io-ts'
import { isRight } from 'fp-ts/lib/Either';

export const TypeBoolean = (value: any) => {
  return isRight(t.boolean.decode(value));
};
