<div align="center" style="text-align: center;">
  <h1 style="border-bottom: none;">trentity</h1>

  <p>Train your Dialogflow with better entities in simple way </p>
</div>

<hr />

[![NPM][nodei-badge]][nodei-url]

[![Build Status][travis-badge]][travis-url]
[![Version][version-badge]][version-url]
[![Downloads][downloads-badge]][downloads-url]
[![MIT License][mit-license-badge]][mit-license-url]
[![Dependency Status][daviddm-badge]][daviddm-url]
[![NSP Status][nsp-badge]][nsp-url]

[![Code of Conduct][coc-badge]][coc-url]
[![Codecov][codecov-badge]][codecov-url]
[![Coverage Status][coveralls-badge]][coveralls-url]

[![codebeat-badge]][codebeat-url]
[![codacy-badge]][codacy-url]
[![inch-badge]][inch-url]

> One of the challenging tasks in [Dialogflow][dialogflow-url] is training your comprehensive list of entities that contains all the synonyms for each reference value. It is kind of tedious to input every possible synonym manually. This package can help generating entities in [Dialogflow][dialogflow-url] much easier by combining a list of reference values and their own synonyms plus an optional list of replacers which replace a word or even a phrase within each synonyms.

## Table of contents

- [Pre-requisites](#pre-requisites)
- [Setup](#setup)
  - [Install](#install)
  - [Usage](#usage)
    - [Node.js](#nodejs)
    - [Native ES modules or TypeScript](#native-es-modules-or-typescript)
- [API Reference](#api-reference)
  - [generateEntity(list[, replacer])](#generateentitylist-replacer)
  - [generateEntitySync(list[, replacer])](#generateentitysynclist-replacer)
  - [revertEntity(entityList)](#revertentityentitylist)
  - [revertEntity(entityList)](#revertentityentitylist)
- [License](#license)

## Pre-requisites

- [Node.js][node-js-url] >= 8.9.0
- [NPM][npm-url] >= 5.5.1 ([NPM][npm-url] comes with [Node.js][node-js-url] so there is no need to install separately.)

## Setup

### Install

```sh
# Install via NPM
$ npm install --save trentity
```

### Usage

#### Node.js

```js
// No default import
const {
  generateEntitySync,
  generateEntity,

  revertEntitySync,
  revertEntity,
} = require('trentity');
/**
 * OR
 * const { generateEntitySync, generateEntity } = require('trentity/generate-entity');
 * const { revertEntitySync, revertEntity } = require('trentity/revert-entity');
 * 
 */

/** To generate entity list with replacers */
void async () => {
  const d = await generateEntity([
    [
      'Accessories for car',
      [
        'accessories for car',
        'car accessory',
      ]
    ]
  ], {
    accessories: [
      'accessory',
      'access',
      'accesory',
      'acessory',
    ],
    car: [
      'cars',
      'vehicle',
      'vehicles',
    ],
  });

  assert(d, "Accessories for car","accessories for car","accessory for car","access for car","accesory for car","acessory for car","car accessory","accessories for cars","accessories for vehicle","accessories for vehicles","cars accessory","vehicle accessory","vehicles accessory"); // OK
}();

/** To revert generated entity list */
void async () => {
  const d = await revertEntity('"Accessories for car","accessories for car","accessory for car","access for car","accesory for car","acessory for car","car accessory","accessories for cars","accessories for vehicle","accessories for vehicles","cars accessory","vehicle accessory","vehicles accessory"');

  assert(d, [
    [
      "Accessories for car",
      [
        "accessories for car",
        "accessory for car",
        "access for car",
        "accesory for car",
        "acessory for car",
        "car accessory",
        "accessories for cars",
        "accessories for vehicle",
        "accessories for vehicles",
        "cars accessory",
        "vehicle accessory",
        "vehicles accessory"
      ]
    ]
  ]); // OK
}();
```

#### Native ES modules or TypeScript

```ts
// No default import
import {
  generateEntitySync,
  generateEntity,

  revertEntitySync,
  revertEntity,
} from 'trentity';
/**
 * OR
 * import { generateEntitySync, generateEntity } from 'trentity/generate-entity';
 * import { revertEntitySync, revertEntity } from 'trentity/revert-entity';
 * 
 */

/** To generate entity list with replacers */
void async () => {
  const d = await generateEntity([
    [
      'Accessories for car',
      [
        'accessories for car',
        'car accessory',
      ]
    ]
  ], {
    accessories: [
      'accessory',
      'access',
      'accesory',
      'acessory',
    ],
    car: [
      'cars',
      'vehicle',
      'vehicles',
    ],
  });

  assert(d, "Accessories for car","accessories for car","accessory for car","access for car","accesory for car","acessory for car","car accessory","accessories for cars","accessories for vehicle","accessories for vehicles","cars accessory","vehicle accessory","vehicles accessory"); // OK
}();

/** To revert generated entity list */
void async () => {
  const d = await revertEntity('"Accessories for car","accessories for car","accessory for car","access for car","accesory for car","acessory for car","car accessory","accessories for cars","accessories for vehicle","accessories for vehicles","cars accessory","vehicle accessory","vehicles accessory"');

  assert(d, [
    [
      "Accessories for car",
      [
        "accessories for car",
        "accessory for car",
        "access for car",
        "accesory for car",
        "acessory for car",
        "car accessory",
        "accessories for cars",
        "accessories for vehicle",
        "accessories for vehicles",
        "cars accessory",
        "vehicle accessory",
        "vehicles accessory"
      ]
    ]
  ]); // OK
}();

```

## API Reference

### generateEntity(list[, replacer])

  - list <[Array][array-mdn-url]<[[string][string-mdn-url], [string][string-mdn-url][]]>> A list of reference values and synonyms.
  - replacer <[Object][object-mdn-url]> Optional list of replacers to replace words or phrases in each synonyms.
  - returns: <[Promise][promise-mdn-url]<[string][string-mdn-url]>> Promise which resolves with a combination of `list` and `replacer`.

### generateEntitySync(list[, replacer])

This methods works the same as `generateEntity(list[, replacer])` except that this is the synchronous version.

### revertEntity(entityList)

  - entityList <[string][string-mdn-url]> A string consists of reference values and synonyms.
  - returns: <[Promise][promise-mdn-url]<<[Array][array-mdn-url]<[[string][string-mdn-url], [string][string-mdn-url][]]>>> Promise which resolves with a list of reference values and synonyms.

### revertEntity(entityList)

This methods works the same as `revertEntity(entityList)` except that this is the synchronous version.

## License

[MIT License](https://motss.mit-license.org/) © Rong Sen Ng



[typescript-url]: https://github.com/Microsoft/TypeScript
[node-js-url]: https://nodejs.org
[npm-url]: https://www.npmjs.com
[node-releases-url]: https://nodejs.org/en/download/releases
[dialogflow-url]: https://dialogflow.com
[array-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
[string-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String
[object-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object
[promise-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise



[nodei-badge]: https://nodei.co/npm/@messageflow/trentity.png?downloads=true&downloadRank=true&stars=true

[travis-badge]: https://img.shields.io/travis/Messageflow/trentity.svg?style=flat-square

[version-badge]: https://img.shields.io/npm/v/trentity.svg?style=flat-square
[downloads-badge]: https://img.shields.io/npm/dm/trentity.svg?style=flat-square
[mit-license-badge]: https://img.shields.io/github/license/mashape/apistatus.svg?style=flat-square
[nsp-badge]: 
https://nodesecurity.io/orgs/messageflow/projects/70b453df-3cdb-4163-ae09-4e918ef5784d/badge
[daviddm-badge]: https://img.shields.io/david/expressjs/express.svg?style=flat-square

[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[codecov-badge]: https://codecov.io/gh/motss/fetch-as/branch/master/graph/badge.svg
[coveralls-badge]: https://coveralls.io/repos/github/motss/fetch-as/badge.svg?branch=master

[codebeat-badge]: https://codebeat.co/badges/57bcdfd9-8f4f-4fef-9267-d379f2b8f9f6
[codacy-badge]: https://api.codacy.com/project/badge/Grade/749bb842d01b4e209739ca1c2c1ebefd
[inch-badge]: http://inch-ci.org/github/Messageflow/trentity.svg?branch=master



[nodei-url]: https://nodei.co/npm/@messageflow/trentity

[travis-url]: https://travis-ci.org/Messageflow/trentity
[version-url]: https://www.npmjs.com/package/@messageflow/trentity
[downloads-url]: http://www.npmtrends.com/trentity
[mit-license-url]: https://github.com/Messageflow/trentity/blob/master/LICENSE
[nsp-url]: https://nodesecurity.io/orgs/messageflow/projects/70b453df-3cdb-4163-ae09-4e918ef5784d
[daviddm-url]: https://david-dm.org/Messageflow/trentity

[coc-url]: https://github.com/Messageflow/trentity/blob/master/CODE_OF_CONDUCT.md
[codecov-url]: https://codecov.io/gh/Messageflow/trentity
[coveralls-url]: https://coveralls.io/github/Messageflow/trentity?branch=master

[codebeat-url]: https://codebeat.co/projects/github-com-messageflow-trentity-master
[codacy-url]: https://www.codacy.com/app/motss/trentity?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=Messageflow/trentity&amp;utm_campaign=Badge_Grade
[inch-url]: http://inch-ci.org/github/Messageflow/trentity
