// @ts-check

export type EntityList = [string, string[]];
export interface EntityReplacer {
  [key: string]: string | string[];
}
export type EntityReplacerFunc = (synonyms: string[]) => Set<string>;

/** Setting up */
const toStringMapper = (n: Set<string>) => [...n].map(o => `"${o}"`).join(',');
const replacerMapper = (rpl: EntityReplacer) => {
  return (synonyms: string[]): Set<string> => {
    const rplKeys = Object.keys(rpl || {});

    /** NOTE: Return synonyms untouched if no replacers found */
    if (!rplKeys.length) {
      return new Set(synonyms);
    }

    /** NOTE: Iterate thru all replacers */
    return rplKeys.reduce((p, n) => {
      /** NOTE: Iterate thru all synonyms for each replacer */
      return synonyms.reduce((psn, sn) => {
        const rplVal = rpl[n];
        const snText = `${sn}`;

        /** NOTE: First add original synonym */
        psn.add(snText);

        /** NOTE: Replace the synonyms with the replacer's value */
        if (Array.isArray(rplVal) && rplVal) {
          rplVal.map(rv => psn.add(snText.replace(n, rv)));
        }

        if (typeof rplVal === 'string' && rplVal.length > 0) {
          psn.add(snText.replace(n, rplVal));
        }

        return psn;
      }, p);
    }, new Set());
  };
};

export async function generateEntity(
  list: EntityList[],
  replacer?: EntityReplacerFunc | EntityReplacer
) {
  try {
    if (!Array.isArray(list) || !list.length) {
      throw new TypeError('list is not an array');
    }

    if (!Array.isArray(list[0]) || !list[0].length) {
      throw new TypeError('list[*] is not an array');
    }

    if (typeof list[0][0] !== 'string') {
      throw new TypeError('list[*][0] is not a string');
    }

    if (!Array.isArray(list[0][1]) || !list[0][1].length) {
      throw new TypeError('list[*][1] is not an array');
    }

    if (typeof list[0][1][0] !== 'string') {
      throw new TypeError('list[*][1][*] is not a string');
    }

    /** NOTE: Fallback to use replacerMapper when replacer is not a function or an object */
    const replacerFn = typeof replacer !== 'undefined' && typeof replacer === 'function'
      ? replacer
      : replacerMapper(replacer as EntityReplacer);
    const possibleCombi = [];

    list
      .reduce((p, n) =>
        p.set(n[0], toStringMapper(replacerFn(n[1]))), new Map())
      .forEach((mv, mk) => {
        /** NOTE: Iterate thru combi Map to concat everything */
        possibleCombi.push(`"${mk}",${mv}`);
      });

    return possibleCombi.join('\n');
  } catch (e) {
    throw e;
  }
}

export default generateEntity;
