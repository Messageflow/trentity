// @ts-check

export type EntityList = [string, string[]];
export interface EntityReplacer {
  [key: string]: string | string[];
}
export type EntityReplacerFunc = (synonyms: string[]) => Set<string>;

async function generateEntity(
  list: EntityList[],
  replacer?: EntityReplacerFunc | EntityReplacer
) {
  if (!Array.isArray(list) || !list.length) {
    throw new TypeError('list must be an array');
  } else if (typeof list[0][0] !== 'string') {
    throw new TypeError('list[0][0] must be a string');
  } else if (!Array.isArray(list[0][1])) {
    throw new TypeError('list[0][1] must be an array');
  }

  const toStringMapper = (n: Set<string>) => [...n].map(o => `"${o}"`).join(',');
  const replacerMapper = (rpl: EntityReplacer, rplKeys: string[]) => {
    return (synonyms: string[]): Set<string> => {
      /** NOTE: Return synonyms untouched */
      if (!rplKeys.length) {
        return new Set(synonyms);
      }

      /** NOTE: Iterate thru all replacers */
      return rplKeys.reduce((p, n) => {
        /** NOTE: Iterate thru all synonyms for each replacer */
        return synonyms.reduce((psn, sn) => {
          /** NOTE: First add original synonym */
          psn.add(sn);

          const rplVal = rpl[n];

          /** NOTE: Replace the synonyms with the replacer's value */
          if (Array.isArray(rplVal) && rplVal) {
            rplVal.map(rv => psn.add(sn.replace(n, rv)));
          } else if (typeof rplVal === 'string') {
            psn.add(sn.replace(n, rplVal));
          }

          return psn;
        }, p);
      }, new Set());
    };
  };
  const replacerFn = typeof replacer === 'function'
    ? replacer
    : replacerMapper(replacer, Object.keys(replacer || {}));
  const mapped = list.reduce((p, n) => {
    const refVal = n[0];
    const synonyms = n[1];

    return p.set(refVal, toStringMapper(replacerFn(synonyms)));
  }, new Map());
  const possibleCombi = [];

  /** NOTE: Iterate thru combi Map to concat everything */
  mapped.forEach((mv, mk) => {
    possibleCombi.push(`"${mk}",${mv}`);
  });

  return possibleCombi.join('\n');
}

export default generateEntity;
