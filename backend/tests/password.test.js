const test = require('node:test');
const assert = require('node:assert/strict');
const { hashPassword, verifyPassword } = require('../src/utils/password');

test('password hashing and verification works', async () => {
  const hash = await hashPassword('Example123!');
  assert.notEqual(hash, 'Example123!');
  assert.equal(await verifyPassword('Example123!', hash), true);
  assert.equal(await verifyPassword('WrongPassword', hash), false);
});
