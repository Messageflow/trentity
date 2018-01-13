// @ts-check

/** Import other modules */
import generateEntity from '../generate-entity';

describe('generate-entity', () => {
  test('list is not an array', async () => {
    try {
      await generateEntity(null, null);
    } catch (e) {
      expect(e instanceof TypeError);
      expect(e.message).toEqual('list is not an array');
    }
  });

  test('list[*] is not an array', async () => {
    try {
      await generateEntity([
        null,
      ], null);
    } catch (e) {
      expect(e instanceof TypeError);
      expect(e.message).toEqual('list[*] is not an array');
    }
  });

  test('list[*][0] is not a string', async () => {
    try {
      await generateEntity([
        [null, null],
      ], null);
    } catch (e) {
      expect(e instanceof TypeError);
      expect(e.message).toEqual('list[*][0] is not a string');
    }
  });

  test('list[*][1] is not an array', async () => {
    try {
      await generateEntity([
        ['', null],
      ], null);
    } catch (e) {
      expect(e instanceof TypeError);
      expect(e.message).toEqual('list[*][1] is not an array');
    }
  });

  test('list[*][1][*] is not a string', async () => {
    try {
      await generateEntity([
        [
          '',
          [null],
        ],
      ], null);
    } catch (e) {
      expect(e instanceof TypeError);
      expect(e.message).toEqual('list[*][1][*] is not a string');
    }
  });

  test('replacer is not either a function or an object', async () => {
    try {
      await generateEntity([
        [
          '',
          [''],
        ],
      ], null);
    } catch (e) {
      expect(e instanceof TypeError);
      expect(e.message).toEqual('replacer is not either a function or an object');
    }
  });

  test('it works', async () => {
    try {
      const d = await generateEntity([
        [
          'Ezyroller accessories',
          [
            'ezyroller accessories',
            'accessories for ezyroller',
          ],
        ],
      ], {
        ezyroller: [
          'easy roller',
          'eazy roller',
          'easyroller',
          'eazyroller',
          'roller',
          'roler',
        ],
        accessories: [
          'accesory',
          'accessory',
          'access',
          'acessory',
        ],
      });

      // tslint:disable-next-line:max-line-length
      expect(d).toEqual('"Ezyroller accessories","ezyroller accessories","easy roller accessories","eazy roller accessories","easyroller accessories","eazyroller accessories","roller accessories","roler accessories","accessories for ezyroller","accessories for easy roller","accessories for eazy roller","accessories for easyroller","accessories for eazyroller","accessories for roller","accessories for roler","ezyroller accesory","ezyroller accessory","ezyroller access","ezyroller acessory","accesory for ezyroller","accessory for ezyroller","access for ezyroller","acessory for ezyroller"');
    } catch (e) {
      throw e;
    }
  });

  test('it works with each replacer contains only 1 string', async () => {
    try {
      const d = await generateEntity([
        [
          'Ezyroller accessories',
          [
            'ezyroller accessories',
            'accessories for ezyroller',
          ],
        ],
      ], {
        accessories: 'accessory',
      });

      // tslint:disable-next-line:max-line-length
      expect(d).toEqual('"Ezyroller accessories","ezyroller accessories","ezyroller accessory","accessories for ezyroller","accessory for ezyroller"');
    } catch (e) {
      throw e;
    }
  });

  test('it works with empty replacer object', async () => {
    try {
      const d = await generateEntity([
        [
          'Ezyroller accessories',
          [
            'ezyroller accessories',
            'accessories for ezyroller',
          ],
        ],
      ], {});

      // tslint:disable-next-line:max-line-length
      expect(d).toEqual('"Ezyroller accessories","ezyroller accessories","accessories for ezyroller"');
    } catch (e) {
      throw e;
    }
  });

  test('it works with replacer function', async () => {
    try {
      const d = await generateEntity([
        [
          'Ezyroller accessories',
          [
            'ezyroller accessories',
            'accessories for ezyroller',
          ],
        ],
      ], sn => new Set(sn));

      // tslint:disable-next-line:max-line-length
      expect(d).toEqual('"Ezyroller accessories","ezyroller accessories","accessories for ezyroller"');
    } catch (e) {
      throw e;
    }
  });

});
