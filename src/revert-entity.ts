// @ts-check

/** Import typings */
import { EntityList } from './generate-entity';

function quotesCleaner(entity: string) {
  return entity.trim().replace(/"/gi, '');
}

export function revertEntitySync(
  entityList: string
) {
  try {
    if (typeof entityList !== 'string' || !entityList.length) {
      throw new TypeError('entityList is invalid');
    }

    return entityList
      .trim()
      .split(/\r?\n/i)
      .map<EntityList>((n) => {
        const [refVal, ...synonyms] = n.split(',');

        return [
          quotesCleaner(refVal),
          synonyms.map(quotesCleaner),
        ];
      });
  } catch (e) {
    throw e;
  }
}

export async function revertEntity(entityList: string) {
  return revertEntitySync(entityList);
}

export default revertEntity;
