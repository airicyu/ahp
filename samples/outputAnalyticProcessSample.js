'use strict';
const AHP = require('./../../ahp');

module.exports = AHP;

var ahpContext = new AHP();
ahpContext.addItems(['VendorA', 'VendorB', 'VendorC']);
ahpContext.addCriteria(['price', 'functionality', 'UX']);

ahpContext.rankCriteriaItem('price', [
    ['VendorB', 'VendorC', 1 / 2],
    ['VendorA', 'VendorC', 1 / 2],
    ['VendorA', 'VendorB', 1]
]);
ahpContext.rankCriteriaItem('functionality', [
    ['VendorB', 'VendorC', 1],
    ['VendorA', 'VendorC', 5],
    ['VendorA', 'VendorB', 5]
]);
ahpContext.rankCriteriaItem('UX', [
    ['VendorB', 'VendorC', 10],
    ['VendorA', 'VendorC', 10],
    ['VendorA', 'VendorB', 1]
]);
ahpContext.rankCriteria(
    [
        ['price', 'functionality', 3],
        ['price', 'UX', 3],
        ['functionality', 'UX', 1]
    ]
);

let analyticContext = ahpContext.debug();
for (let key in analyticContext) {
    console.log(`${key}:\n`, analyticContext[key], '\n');
}