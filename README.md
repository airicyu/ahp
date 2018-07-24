# ahp.js

[![npm version](https://img.shields.io/npm/v/ahp.svg)](https://www.npmjs.com/package/ahp)
[![node](https://img.shields.io/node/v/ahp.svg)](https://www.npmjs.com/package/ahp)
[![Build](https://travis-ci.org/airicyu/ahp.svg?branch=master)](https://travis-ci.org/airicyu/ahp)
[![Codecov branch](https://img.shields.io/codecov/c/github/airicyu/ahp/master.svg)](https://codecov.io/gh/airicyu/ahp)

[![GitHub issues](https://img.shields.io/github/issues/airicyu/ahp.svg)](https://github.com/airicyu/ahp/issues)
[![GitHub forks](https://img.shields.io/github/forks/airicyu/ahp.svg)](https://github.com/airicyu/ahp/network)
[![GitHub stars](https://img.shields.io/github/stars/airicyu/ahp.svg)](https://github.com/airicyu/ahp/stargazers)
[![GitHub License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://raw.githubusercontent.com/airicyu/ahp/master/LICENSE)
[![dependencies Status](https://david-dm.org/airicyu/ahp/status.svg)](https://david-dm.org/airicyu/ahp)
[![devDependencies Status](https://david-dm.org/airicyu/ahp/dev-status.svg)](https://david-dm.org/airicyu/ahp?type=dev)

This node.js module is a library for Analytic Hierarchy Process(AHP).

Wiki page for AHP: [https://en.wikipedia.org/wiki/Analytic_hierarchy_process](https://en.wikipedia.org/wiki/Analytic_hierarchy_process)


## Project page

- [Project Home](http://blog.airic-yu.com/1948/ahp-js-nodejs-module-analytic-hierarchy-process-ahp)
- [Github](https://github.com/airicyu/ahp)
- [NPM](https://www.npmjs.com/package/ahp)

------------------------

## Glossary
| Term                 | Description                                                    | Example                                          |
| -------------------- | -------------------------------------------------------------- | ------------------------------------------------ |
| Items                | The choices                                                    | Car A, Car B, Car C                              |
| Criteria             | The judging perspectives                                       | Price, Speed, Safety                             |
| Criteria Rank Matrix | The Criterion Rank Matrix                                      | Criterion Price is prefferred over Speed         |
| Criterion Item Rank  | The Criterion perspective Item Rank Matrix                     | In terms of Price, Car A is preferred over Car B |
| Rank Scale           | The Scale a factor/choice preffered over another factor/choice | Two factors contribute equally to the objective  |
| RI                   | Random Consistency Index                                       | 2: 0, 3: 0.58, 4: 0.9, 5: 1.12, ...              |
| CI                   | Consistency Index                                              | -                                                |
| CR                   | Consistency Ration (CI/RI)                                     | -                                                |

------------------------

## Install

```bash
$ npm install --save ahp
```

------------------------
## Quick Samples

### Hello World Sample
```javascript
const AHP = require('ahp');
var ahpContext = new AHP();

ahpContext.addItems(['VendorA', 'VendorB', 'VendorC']);

ahpContext.addCriteria(['price', 'functionality', 'UX']);

//rank criteria with rank scale
ahpContext.rankCriteriaItem('price', [
    ['VendorB', 'VendorC', 1 / 2],
    ['VendorA', 'VendorC', 1 / 2],
    ['VendorA', 'VendorB', 1]
]);

//rank criteria with rank scale
ahpContext.rankCriteriaItem('functionality', [
    ['VendorB', 'VendorC', 1],
    ['VendorA', 'VendorC', 5],
    ['VendorA', 'VendorB', 5]
]);

//rank criteria with absolute rank scole
ahpContext.setCriteriaItemRankByGivenScores('UX', [10, 10, 1]);

ahpContext.rankCriteria(
    [
        ['price', 'functionality', 3],
        ['price', 'UX', 3],
        ['functionality', 'UX', 1]
    ]
);

let output = ahpContext.run();
console.log(output);
```

Console output
```
{ error: null,
  rankingMatrix:
   [ [ 0.25, 0.7142857142857141, 0.4761904761904761 ],
     [ 0.25, 0.14285714285714285, 0.4761904761904761 ],
     [ 0.5, 0.14285714285714285, 0.047619047619047616 ] ],
  itemRankMetaMap:
   { price: { ci: 0, ri: 0.58, cr: 0 },
     functionality: { ci: 0, ri: 0.58, cr: 0 },
     UX: { ci: 0, ri: 0.58, cr: 0 } },
  criteriaRankMetaMap:
   { ci: 0,
     ri: 0.58,
     cr: 0,
     weightedVector: [ 0.6000000000000001, 0.20000000000000004, 0.20000000000000004 ] },
  rankedScoreMap:
   { VendorA: 0.3880952380952381,
     VendorB: 0.27380952380952384,
     VendorC: 0.33809523809523817 },
  rankedScores: [ 0.3880952380952381, 0.27380952380952384, 0.33809523809523817 ] }
```

### Import Data Context Sample
```javascript
const AHP = require('ahp');

var ahpContext = new AHP();

/*
notice that in this demo, we import price item ranking with matrix,
and import UX item ranking with absolute scores. Both are supported.
*/
ahpContext.import({
    items: ['VendorA', 'VendorB', 'VendorC'],
    criteria: ['price', 'functionality', 'UX'],
    criteriaItemRank: {
        price: [
            [1, 1, 0.5],
            [1, 1, 0.5],
            [2, 2, 1]
        ],
        functionality: [
            [1, 5, 5],
            [0.2, 1, 1],
            [0.2, 1, 1]
        ],
        UX: [10, 10, 1]
    },
    criteriaRank: [
        [1, 3, 3],
        [0.3333333333333333, 1, 1],
        [0.3333333333333333, 1, 1]
    ]
});

let output = ahpContext.run();
console.log(output);
```

Console output
```
{ error: null,
  rankingMatrix:
   [ [ 0.25, 0.7142857142857141, 0.4761904761904761 ],
     [ 0.25, 0.14285714285714285, 0.4761904761904761 ],
     [ 0.5, 0.14285714285714285, 0.047619047619047616 ] ],
  itemRankMetaMap:
   { price: { ci: 0, ri: 0.58, cr: 0 },
     functionality: { ci: 0, ri: 0.58, cr: 0 },
     UX: { ci: 0, ri: 0.58, cr: 0 } },
  criteriaRankMetaMap:
   { ci: 0,
     ri: 0.58,
     cr: 0,
     weightedVector: [ 0.6000000000000001, 0.20000000000000004, 0.20000000000000004 ] },
  rankedScoreMap:
   { VendorA: 0.3880952380952381,
     VendorB: 0.27380952380952384,
     VendorC: 0.33809523809523817 },
  rankedScores: [ 0.3880952380952381, 0.27380952380952384, 0.33809523809523817 ] }
```

### Export Data Context Sample
```javascript
const AHP = require('ahp');
var ahpContext = new AHP();
......
const util = require('util');
console.log(util.inspect(ahpContext.export(), false, null));
```

Console output
```
{ items: [ 'VendorA', 'VendorB', 'VendorC' ],
  criteria: [ 'price', 'functionality', 'UX' ],
  criteriaItemRank:
   { price: [ [ 1, 1, 0.5 ], [ 1, 1, 0.5 ], [ 2, 2, 1 ] ],
     functionality: [ [ 1, 5, 5 ], [ 0.2, 1, 1 ], [ 0.2, 1, 1 ] ],
     UX: [ [ 1, 1, 10 ], [ 1, 1, 10 ], [ 0.1, 0.1, 1 ] ] },
  criteriaRank:
   [ [ 1, 3, 3 ],
     [ 0.3333333333333333, 1, 1 ],
     [ 0.3333333333333333, 1, 1 ] ] }
```

### Output Analysis Process Information Sample
```javascript
const AHP = require('ahp');
var ahpContext = new AHP();
......
let analyticContext = ahpContext.debug();
for(let key in analyticContext){
    console.log(`${key}: `, analyticContext[key], '\n');
}
```

Console output
```
error:  null

rankingMatrix:  [ [ 0.25, 0.7142857142857141, 0.4761904761904761 ],
  [ 0.25, 0.14285714285714285, 0.4761904761904761 ],
  [ 0.5, 0.14285714285714285, 0.047619047619047616 ] ]

itemRankMetaMap:  { price: { ci: 0, ri: 0.58, cr: 0 },
  functionality: { ci: 0, ri: 0.58, cr: 0 },
  UX: { ci: 0, ri: 0.58, cr: 0 } }

criteriaRankMetaMap:  { ci: 0,
  ri: 0.58,
  cr: 0,
  weightedVector: [ 0.6000000000000001, 0.20000000000000004, 0.20000000000000004 ] }

rankedScoreMap:  { VendorA: 0.3880952380952381,
  VendorB: 0.27380952380952384,
  VendorC: 0.33809523809523817 }

rankedScores:  [ 0.3880952380952381, 0.27380952380952384, 0.33809523809523817 ]

log:  ==========================================
context:
items:
[ 'VendorA', 'VendorB', 'VendorC' ]
criteria:
[ 'price', 'functionality', 'UX' ]
criteriaItemRank:
{ price: [ [ 1, 1, 0.5 ], [ 1, 1, 0.5 ], [ 2, 2, 1 ] ],
  functionality: [ [ 1, 5, 5 ], [ 0.2, 1, 1 ], [ 0.2, 1, 1 ] ],
  UX: [ [ 1, 1, 10 ], [ 1, 1, 10 ], [ 0.1, 0.1, 1 ] ] }
criteriaRank:
[ [ 1, 3, 3 ],
  [ 0.3333333333333333, 1, 1 ],
  [ 0.3333333333333333, 1, 1 ] ]
__________________________________
criteriaItemRank['price']
---------------------------------------------
|          |   VendorA|   VendorB|   VendorC|
|----------|----------|----------|----------|
|   VendorA|     1.000|     1.000|     0.500|
|   VendorB|     1.000|     1.000|     0.500|
|   VendorC|     2.000|     2.000|     1.000|
---------------------------------------------

Consistentcy index: 0
Random index: 0.58
Consistentcy ratio: 0
CR<=0.1 => sufficient consistency
__________________________________
criteriaItemRank['functionality']
---------------------------------------------
|          |   VendorA|   VendorB|   VendorC|
|----------|----------|----------|----------|
|   VendorA|     1.000|     5.000|     5.000|
|   VendorB|     0.200|     1.000|     1.000|
|   VendorC|     0.200|     1.000|     1.000|
---------------------------------------------

Consistentcy index: 0
Random index: 0.58
Consistentcy ratio: 0
CR<=0.1 => sufficient consistency
__________________________________
criteriaItemRank['UX']
---------------------------------------------
|          |   VendorA|   VendorB|   VendorC|
|----------|----------|----------|----------|
|   VendorA|     1.000|     1.000|    10.000|
|   VendorB|     1.000|     1.000|    10.000|
|   VendorC|     0.100|     0.100|     1.000|
---------------------------------------------

Consistentcy index: 0
Random index: 0.58
Consistentcy ratio: 0
CR<=0.1 => sufficient consistency
__________________________________
criteriaRank:
---------------------------------------------------------
|             |        price|functionality|           UX|
|-------------|-------------|-------------|-------------|
|        price|        1.000|        3.000|        3.000|
|functionality|        0.333|        1.000|        1.000|
|           UX|        0.333|        1.000|        1.000|
---------------------------------------------------------

Consistentcy index: 0
Random index: 0.58
Consistentcy ratio: 0
CR<=0.1 => sufficient consistency
Criteria Weight Vector: 0.6000000000000001,0.20000000000000004,0.20000000000000004
__________________________________

rankingMatrix: (Higher score is better)
---------------------------------------
|             |VendorA|VendorB|VendorC|
|-------------|-------|-------|-------|
|        price|  0.250|  0.250|  0.500|
|functionality|  0.714|  0.143|  0.143|
|           UX|  0.476|  0.476|  0.048|
---------------------------------------

__________________________________
ranked item scores: (Higher score is better)
---------------
|       |Score|
|-------|-----|
|VendorA|0.388|
|VendorB|0.274|
|VendorC|0.338|
---------------

==========================================
```

------------------------

## API
- [import(context)](#import)
- [export()](#export)
- [addItem(item)](#addItem)
- [addItems(items)](#addItems)
- [removeItem(item)](#removeItem)
- [removeItems(items)](#removeItems)
- [addCriterion(criterion)](#addCriterion)
- [addCriteria(criteria)](#addCriteria)
- [removeCriterion(criterion)](#removeCriterion)
- [removeCriteria(criteria)](#removeCriteria)
- [rankCriteria(preferences)](#rankCriteria)
- [setCriteriaRankByGivenScores(scoreVector)](#setCriteriaRankByGivenScores)
- [rankCriteriaItem(criterion, preferences)](#rankCriteriaItem)
- [setCriteriaItemRankByGivenScores(criterion, scoreVector)](#setCriteriaItemRankByGivenScores)
- [resetCriteriaItemRank(criteria)](#resetCriteriaItemRank)
- [resetCriteriaRank()](#resetCriteriaRank)
- [findNextProblem()](#findNextProblem)
- [debug()](#debug)
- [run()](#run)

<a name="import"></a>
### import(context)

Description:

Importing context from JSON

Parameters:

| Parameter | Type | Description | Mandatory | Default Value |
| --------- | ---- | ----------- | --------- | ------------- |
| context | object | The context | true | - |

Return:

| Type | Description | 
| ---- | ----------- |
| AHP | The AHP object |

Example:
```javascript
ahpContext.import({
    items: ['Vendor A', 'Vendor B', 'Vendor C'],
    criteria: ['price', 'functionality', 'UX'],
    criteriaItemRank:
    {
        price: [[1, 1, 0.5], [1, 1, 0.5], [2, 2, 1]],
        functionality: [[1, 1, 5], [1, 1, 5], [0.2, 0.2, 1]],
        UX: [[1, 1, 10], [1, 1, 10], [0.1, 0.1, 1]]
    },
    criteriaRank:
    [[1, 3, 3],
    [0.3333333333333333, 1, 1],
    [0.3333333333333333, 1, 1]]
});
```

<a name="export"></a>
### export()

Description:

Exporting context as JSON

Parameters:

nil

Return:

| Type | Description | 
| ---- | ----------- |
| object | The exported AHP context JSON |

Example:
```javascript
ahpContext.export();
```

<a name="addItem"></a>
### addItem(item)

Description:

Adding Item

Parameters:

| Parameter | Type | Description | Mandatory | Default Value |
| --------- | ---- | ----------- | --------- | ------------- |
| Item | string | The item | true | - |

Return:

| Type | Description | 
| ---- | ----------- |
| AHP | The AHP object |

Example:
```javascript
ahpContext.addItem('Vendor A');
```

<a name="addItems"></a>
### addItems(items)

Description:

Adding Items

Parameters:

| Parameter | Type | Description | Mandatory | Default Value |
| --------- | ---- | ----------- | --------- | ------------- |
| Items | string[] | The items | true | - |

Return:

| Type | Description | 
| ---- | ----------- |
| AHP | The AHP object |

Example:
```javascript
ahpContext.addItems(['Vendor A', 'Vendor B', 'Vendor C']);
```

<a name="removeItem"></a>
### removeItem(item)

Description:

Removing Item

Parameters:

| Parameter | Type | Description | Mandatory | Default Value |
| --------- | ---- | ----------- | --------- | ------------- |
| Item | string | The item | true | - |

Return:

| Type | Description | 
| ---- | ----------- |
| AHP | The AHP object |

Example:
```javascript
ahpContext.removeItem('Vendor A');
```

<a name="removeItems"></a>
### removeItems(items)

Description:

Removing Items

Parameters:

| Parameter | Type | Description | Mandatory | Default Value |
| --------- | ---- | ----------- | --------- | ------------- |
| Items | string[] | The items | true | - |

Return:

| Type | Description | 
| ---- | ----------- |
| AHP | The AHP object |

Example:
```javascript
ahpContext.removeItems(['Vendor A', 'Vendor B', 'Vendor C']);
```

<a name="addCriterion"></a>
### addCriterion(criterion)

Description:

Adding criterion

Parameters:

| Parameter | Type | Description | Mandatory | Default Value |
| --------- | ---- | ----------- | --------- | ------------- |
| criterion | string | The criterion | true | - |

Return:

| Type | Description | 
| ---- | ----------- |
| AHP | The AHP object |

Example:
```javascript
ahpContext.addCriterion('price');
```

<a name="addCriteria"></a>
### addCriteria(criteria)

Description:

Adding criteria

Parameters:

| Parameter | Type | Description | Mandatory | Default Value |
| --------- | ---- | ----------- | --------- | ------------- |
| criteria | string[] | The criteria | true | - |

Return:

| Type | Description | 
| ---- | ----------- |
| AHP | The AHP object |

Example:
```javascript
ahpContext.addCriteria(['price', 'functionality', 'UX']);
```

<a name="removeCriterion"></a>
### removeCriterion(criterion)

Description:

Removing criterion

Parameters:

| Parameter | Type | Description | Mandatory | Default Value |
| --------- | ---- | ----------- | --------- | ------------- |
| criterion | string | The criterion | true | - |

Return:

| Type | Description | 
| ---- | ----------- |
| AHP | The AHP object |

Example:
```javascript
ahpContext.removeCriterion('price');
```

<a name="removeCriteria"></a>
### removeCriteria(criteria)

Description:

Removing criteria

Parameters:

| Parameter | Type | Description | Mandatory | Default Value |
| --------- | ---- | ----------- | --------- | ------------- |
| criteria | string[] | The criteria | true | - |

Return:

| Type | Description | 
| ---- | ----------- |
| AHP | The AHP object |

Example:
```javascript
ahpContext.removeCriteria(['price', 'functionality', 'UX']);
```

<a name="rankCriteria"></a>
### rankCriteria(preferences)

Description:

Ranking criteria

Parameters:

| Parameter | Type | Description | Mandatory | Default Value |
| --------- | ---- | ----------- | --------- | ------------- |
| criteria | {{preferredCriterion:string, comparingCriterion:string, scale:number}[]\|(string\|number)[]} | Array of Preference. The 'preferredCriterion' of preference object is the preferred criterion while 'comparingCriterion' is the comparing criterion. The 'scale' is the preferred rank scale. You can pass the 3 objects as an array of 3 objects as well. | true | - |

Return:

| Type | Description | 
| ---- | ----------- |
| AHP | The AHP object |

Example:
```javascript
ahpContext.rankCriteria(
    [
        {preferredCriterion: 'price', comparingCriterion: 'functionality', scale:3},
        {preferredCriterion: 'price', comparingCriterion: 'UX', scale:3},
        {preferredCriterion: 'functionality', comparingCriterion: 'UX', scale:1}
    ]
);

//or
ahpContext.rankCriteria(
    [
        ['price', 'functionality', 3],
        ['price', 'UX', 3],
        ['functionality', 'UX', 1]
    ]
);
```

<a name="setCriteriaRankByGivenScores"></a>
### setCriteriaRankByGivenScores(vector)

Description:

Ranking criteria by Given Scores. This is suitable for the use case which you want to directly define the criteria ranking scores.

Parameters:

| Parameter | Type | Description | Mandatory | Default Value |
| --------- | ---- | ----------- | --------- | ------------- |
| vector | number[] | The array of criteria ranking scores. The sequence follow the sequence which you define criteria. | true | - |

Return:

| Type | Description | 
| ---- | ----------- |
| AHP | The AHP object |

Example:
```javascript
//assume criteria = ['price', 'functionality', 'UX'];

ahpContext.setCriteriaRankByGivenScores([1, 2, 5]);
// is equivalent to
ahpContext.rankCriteria(
    [
        ['price', 'functionality', 1/2],
        ['price', 'UX', 1/5],
        ['functionality', 'UX', 2/5]
    ]
);
```

<a name="rankCriteriaItem"></a>
### rankCriteriaItem(criterion, preferences)

Description:

Rank Criteria perspective Item

Parameters:

| Parameter | Type | Description | Mandatory | Default Value |
| --------- | ---- | ----------- | --------- | ------------- |
| criterion | string | The criterion being used as perspective to rank the items | true | - |
| preferences | {{preferredItem:string, comparingItem:string, scale:number}[]\|(string\|number)[]} | Array of Preference. The 'preferredItem' of preference object is the preferred item while 'comparingItem' is the comparing item. The 'scale' is the preferred rank scale. You can pass the 3 objects as an array of 3 objects as well. | true | - |

Return:

| Type | Description | 
| ---- | ----------- |
| AHP | The AHP object |

Example:
```javascript
ahpContext.rankCriteriaItem('price', [
    {preferredItem:'VendorB', comparingItem:'VendorC', scale:1 / 2},
    {preferredItem:'VendorA', comparingItem:'VendorC', scale:1 / 2},
    {preferredItem:'VendorA', comparingItem:'VendorB', scale:1}
]);

//or
ahpContext.rankCriteriaItem('price', [
    ['VendorB', 'VendorC', 1 / 2],
    ['VendorA', 'VendorC', 1 / 2],
    ['VendorA', 'VendorB', 1]
]);
```

<a name="setCriteriaItemRankByGivenScores"></a>
### setCriteriaItemRankByGivenScores(criterion, vector)

Description:

Base on specific criterion to rank items by Given Scores. This is suitable for the use case which you want to directly define the criteria perspective item ranking scores.

Parameters:

| Parameter | Type | Description | Mandatory | Default Value |
| --------- | ---- | ----------- | --------- | ------------- |
| criterion | string | The criterion being used as perspective to rank the items | true | - |
| vector | number[] | The array of item ranking scores. The sequence follow the sequence which you define items. | true | - |

Return:

| Type | Description | 
| ---- | ----------- |
| AHP | The AHP object |

Example:
```javascript
ahpContext.setCriteriaItemRankByGivenScores('price', [10, 5, 7]);

// is equivalent to
ahpContext.rankCriteriaItem(
    'price',
    [
        ['Vendor A', 'Vendor B', 10/5],
        ['Vendor A', 'Vendor C', 10/7],
        ['Vendor B', 'Vendor C', 5/7]
    ]
);
```

<a name="resetCriteriaItemRank"></a>
### resetCriteriaItemRank(criteria)

Description:

Reset Criteria perspective Item ranking matrix.

Parameters:

| Parameter | Type | Description | Mandatory | Default Value |
| --------- | ---- | ----------- | --------- | ------------- |
| criteria | string[] | The criteria which you want to reset item ranking matrix. | true | - |

Return:

| Type | Description | 
| ---- | ----------- |
| AHP | The AHP object |

Example:
```javascript
ahpContext.resetCriteriaItemRank(['price', 'functionality']);
```

<a name="resetCriteriaRank"></a>
### resetCriteriaRank()

Description:

Reset Criteria ranking matrix.

Parameters:

nil

Return:

| Type | Description | 
| ---- | ----------- |
| AHP | The AHP object |

Example:
```javascript
ahpContext.resetCriteriaRank();
```

<a name="findNextProblem"></a>
### findNextProblem()

Description:

Auto check whether the existing input context can successfully done the AHP analysis process.
If there are missing information or data inconsistency, this function would return the Error it found.

Parameters:

nil

Return:

| Type | Description | 
| ---- | ----------- |
| ContextError | The Context Error object |

Example:
```javascript
let problem = ahpContext.findNextProblem();
```

<a name="debug"></a>
### debug()

Description:

Try to run the AHP analysis process.
The result information and the debug log output will be returned.

Parameters:

nil

Return Object properties:

| Property | Type | Description |
| -------- | ---- | ----------- |
| error | ContextError | The Context Error object if found, or null otherwise. |
| rankingMatrix | number[][] | The processed ranking matrix. The row entry represent each item's scores. Each entry in the row represent that item's score on a certain criteria. |
| itemRankMetaMap | object | The metadata(e.g: CI, RI, CR) for each criteria perspective item ranking matrix. |
| criteriaRankMetaMap | object | The metadata(e.g: CI, RI, CR) for criteria ranking matrix. |
| rankedScoreMap | object | The overall computed ranking score for each item |
| log | string | The debug log |

Example:
```javascript
......
let analyticContext = ahpContext.debug();
for(let key in analyticContext){
    console.log(`${key}: `, analyticContext[key], '\n');
}
```

Console output
```
error:
 null

rankingMatrix:
 [ [ 0.25, 0.7142857142857141, 0.4761904761904761 ],
  [ 0.25, 0.14285714285714285, 0.4761904761904761 ],
  [ 0.5, 0.14285714285714285, 0.047619047619047616 ] ]

itemRankMetaMap:
 { price: { ci: 0, ri: 0.58, cr: 0 },
  functionality: { ci: 0, ri: 0.58, cr: 0 },
  UX: { ci: 0, ri: 0.58, cr: 0 } }

criteriaRankMetaMap:
 { ci: 0,
  ri: 0.58,
  cr: 0,
  weightedVector: [ 0.6000000000000001, 0.20000000000000004, 0.20000000000000004 ] }

rankedScoreMap:
 { VendorA: 0.3880952380952381,
  VendorB: 0.27380952380952384,
  VendorC: 0.33809523809523817 }

log:
 ==========================================
context:
items:
[ 'VendorA', 'VendorB', 'VendorC' ]
criteria:
[ 'price', 'functionality', 'UX' ]
criteriaItemRank:
{ price: [ [ 1, 1, 0.5 ], [ 1, 1, 0.5 ], [ 2, 2, 1 ] ],
  functionality: [ [ 1, 5, 5 ], [ 0.2, 1, 1 ], [ 0.2, 1, 1 ] ],
  UX: [ [ 1, 1, 10 ], [ 1, 1, 10 ], [ 0.1, 0.1, 1 ] ] }
criteriaRank:
[ [ 1, 3, 3 ],
  [ 0.3333333333333333, 1, 1 ],
  [ 0.3333333333333333, 1, 1 ] ]
__________________________________
criteriaItemRank['price']
---------------------------------------------
|          |   VendorA|   VendorB|   VendorC|
|----------|----------|----------|----------|
|   VendorA|     1.000|     1.000|     0.500|
|   VendorB|     1.000|     1.000|     0.500|
|   VendorC|     2.000|     2.000|     1.000|
---------------------------------------------

Consistentcy index: 0
Consistentcy ratio: 0
CR<=0.1 => sufficient consistency
__________________________________
criteriaItemRank['functionality']
---------------------------------------------
|          |   VendorA|   VendorB|   VendorC|
|----------|----------|----------|----------|
|   VendorA|     1.000|     5.000|     5.000|
|   VendorB|     0.200|     1.000|     1.000|
|   VendorC|     0.200|     1.000|     1.000|
---------------------------------------------

Consistentcy index: 0
Consistentcy ratio: 0
CR<=0.1 => sufficient consistency
__________________________________
criteriaItemRank['UX']
---------------------------------------------
|          |   VendorA|   VendorB|   VendorC|
|----------|----------|----------|----------|
|   VendorA|     1.000|     1.000|    10.000|
|   VendorB|     1.000|     1.000|    10.000|
|   VendorC|     0.100|     0.100|     1.000|
---------------------------------------------

Consistentcy index: 0
Consistentcy ratio: 0
CR<=0.1 => sufficient consistency
__________________________________
criteriaRank:
---------------------------------------------------------
|             |        price|functionality|           UX|
|-------------|-------------|-------------|-------------|
|        price|        1.000|        3.000|        3.000|
|functionality|        0.333|        1.000|        1.000|
|           UX|        0.333|        1.000|        1.000|
---------------------------------------------------------

Consistentcy index: 0
Consistentcy ratio: 0
CR<=0.1 => sufficient consistency
Criteria Weight Vector: 0.6000000000000001,0.20000000000000004,0.20000000000000004
__________________________________

rankingMatrix: (Higher score is better)
---------------------------------------
|             |VendorA|VendorB|VendorC|
|-------------|-------|-------|-------|
|        price|  0.250|  0.250|  0.500|
|functionality|  0.714|  0.143|  0.143|
|           UX|  0.476|  0.476|  0.048|
---------------------------------------

__________________________________
ranked item scores: (Higher score is better)
---------------
|       |Score|
|-------|-----|
|VendorA|0.388|
|VendorB|0.274|
|VendorC|0.338|
---------------

==========================================
```

<a name="run"></a>
### run()

Description:

Try to run the AHP analysis process.
The result information will be returned.

Parameters:

nil

Return Object properties:

| Property | Type | Description |
| -------- | ---- | ----------- |
| error | ContextError | The Context Error object if found, or null otherwise. |
| rankingMatrix | number[][] | The processed ranking matrix. The row entry represent each item's scores. Each entry in the row represent that item's score on a certain criteria. |
| itemRankMetaMap | object | The metadata(e.g: CI, RI, CR) for each criteria perspective item ranking matrix. |
| criteriaRankMetaMap | object | The metadata(e.g: CI, RI, CR) for criteria ranking matrix. |
| rankedScoreMap | object | The overall computed ranking score for each item |

Example:
```javascript
......
let analyticContext = ahpContext.run();
for(let key in analyticContext){
    console.log(`${key}: `, analyticContext[key], '\n');
}
```

Console output
```
error:
 null

rankingMatrix:
 [ [ 0.25, 0.7142857142857141, 0.4761904761904761 ],
  [ 0.25, 0.14285714285714285, 0.4761904761904761 ],
  [ 0.5, 0.14285714285714285, 0.047619047619047616 ] ]

itemRankMetaMap:
 { price: { ci: 0, ri: 0.58, cr: 0 },
  functionality: { ci: 0, ri: 0.58, cr: 0 },
  UX: { ci: 0, ri: 0.58, cr: 0 } }

criteriaRankMetaMap:
 { ci: 0,
  ri: 0.58,
  cr: 0,
  weightedVector: [ 0.6000000000000001, 0.20000000000000004, 0.20000000000000004 ] }

rankedScoreMap:
 { VendorA: 0.3880952380952381,
  VendorB: 0.27380952380952384,
  VendorC: 0.33809523809523817 }
```

------------------------
## Classes

### AHP

Description

The AHP context class for input items, criteria & rankings. And then run the AHP process.

API Functions:
- [API functions](#api)

### ContextError

Description

The abstract base context error object.

Function:
- toQuestion(): Return the text representation of the Error followup message.

### NoItem

Description

There are no items defined.

Preperties 

| Property | Type | Description |
| -------- | ---- | ----------- |
| type | string | "NO_ITEM" |

### NoCriteria

Description

There are no criteria defined.

Preperties

| Property | Type | Description |
| -------- | ---- | ----------- |
| type | string | "NO_CRITERIA" |

### MissingCriteriaItemRank

Description

Some item ranking information is not yet input.

Preperties

| Property | Type | Description |
| -------- | ---- | ----------- |
| type | string | "MISSING_CRITERIA_ITEM_RANK" |
| context.criterion | string | The criterion of the missing criterion perspective item ranking matrix entry. |
| context.itemA | string | The first item of the missing criterion perspective item ranking matrix entry. |
| context.itemB | string | The second item of the missing criterion perspective item ranking matrix entry. |

### MissingCriteriaRank

Description

Some criteria ranking information is not yet input.

Preperties

| Property | Type | Description |
| -------- | ---- | ----------- |
| type | string | "MISSING_CRITERIA_RANK" |
| context.criterionA | string | The first criterion of the missing criterion ranking matrix entry. |
| context.criterionB | string | The second criterion of the missing criterion perspective ranking matrix entry. |

### CriteriaItemRankInsufficientConsistencyRatio

Description

The consistency ratio for item ranking calculated is inconsistent(>0.1).

Preperties

| Property | Type | Description |
| -------- | ---- | ----------- |
| type | string | "MISSING_CRITERIA_RANK" |
| context.criterion | string | The criterion of the criterion perspective item ranking matrix which has inconsistency ratio detected. |
| context.cr | number | The consistency ratio. |

### CriteriaRankInsufficientConsistencyRatio

Description

The consistency ratio for criteria ranking calculated is inconsistent(>0.1).

Preperties

| Property | Type | Description |
| -------- | ---- | ----------- |
| type | string | "MISSING_CRITERIA_RANK" |
| context.criterion | string | The criterion of the criterion perspective item ranking matrix which has inconsistency ratio detected. |
| context.cr | number | The consistency ratio. |

------------------------
## Human contact

- Eric Yu: airic.yu@gmail.com

