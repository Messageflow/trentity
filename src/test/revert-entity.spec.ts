// @ts-check

/** Import other modules */
import revertEntity from '../revert-entity';

describe('revert-entity', () => {
  test('invalid entityList', async () => {
    try {
      await revertEntity(null);
    } catch (e) {
      expect(e instanceof TypeError);
      expect(e.message).toEqual('entityList is invalid');
    }
  });

  test('it works', async () => {
    try {
      // tslint:disable-next-line:max-line-length
      const d = await revertEntity('"Ezyroller accessories","ezyroller accessories","easy roller accessories","eazy roller accessories","easyroller accessories","eazyroller accessories","roller accessories","roler accessories","accessories for ezyroller","accessories for easy roller","accessories for eazy roller","accessories for easyroller","accessories for eazyroller","accessories for roller","accessories for roler","ezyroller accesory","ezyroller accessory","ezyroller access","ezyroller acessory","accesory for ezyroller","accessory for ezyroller","access for ezyroller","acessory for ezyroller"');

      expect(d).toEqual([
        [
          'Ezyroller accessories',
          [
            'ezyroller accessories',
            'easy roller accessories',
            'eazy roller accessories',
            'easyroller accessories',
            'eazyroller accessories',
            'roller accessories',
            'roler accessories',
            'accessories for ezyroller',
            'accessories for easy roller',
            'accessories for eazy roller',
            'accessories for easyroller',
            'accessories for eazyroller',
            'accessories for roller',
            'accessories for roler',
            'ezyroller accesory',
            'ezyroller accessory',
            'ezyroller access',
            'ezyroller acessory',
            'accesory for ezyroller',
            'accessory for ezyroller',
            'access for ezyroller',
            'acessory for ezyroller',
          ],
        ],
      ]);
    } catch (e) {
      throw e;
    }
  });

  test('it works with odd entity list', async () => {
    const d = await revertEntity('"",""');

    expect(d).toEqual([
      [
        '',
        [
          '',
        ],
      ],
    ]);
  });

});
