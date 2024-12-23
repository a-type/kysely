import { expect, it } from 'vitest';
import { hashPassword } from './utils.js';

it('hashes passwords', async () => {
	await expect(hashPassword('password')).resolves.toBeTypeOf('string');
});
