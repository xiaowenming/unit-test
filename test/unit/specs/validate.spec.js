import {validateLessNumber} from '@/utils/validate';
describe('utils/validate.js', () => {
    it('test function validateLessNumber(2, 5) is true', () => {
        expect(validateLessNumber(2, 5)).toBe(true);
    })
});