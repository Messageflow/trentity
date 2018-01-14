// @ts-check

/** Import other modules */
import main, {
  generateEntity,
  generateEntitySync,
  revertEntity,
  revertEntitySync,
} from '../index';
import * as main2 from '../index';

describe('index', () => {
  test('no default import', async () => {
    try {
      expect(main).toBeUndefined();
    } catch (e) {
      throw e;
    }
  });

  test('generate-entity works', async () => {
    expect(generateEntitySync instanceof Function).toEqual(true);
    expect(generateEntity instanceof Function).toEqual(true);

    expect(main2.generateEntitySync instanceof Function).toEqual(true);
    expect(main2.generateEntity instanceof Function).toEqual(true);
  });

  test('revert-entity works', async () => {
    try {
      expect(revertEntitySync instanceof Function).toEqual(true);
      expect(revertEntity instanceof Function).toEqual(true);

      expect(main2.revertEntitySync instanceof Function).toEqual(true);
      expect(main2.revertEntity instanceof Function).toEqual(true);
    } catch (e) {
      throw e;
    }
  });

});
