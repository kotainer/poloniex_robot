import { expect } from 'chai';
import * as testData from '../test-data/strings';

import * as validate from '../../services/validateToken';

describe('Validate token', async () => {

  it('invalid token', async () => {
    const result = await validate.validateToken(testData.values.invalidToken);
    expect(result).to.equal(false);
  });

});
