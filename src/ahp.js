'use strict';

var math = require('mathjs');
var numeric = require('numericjs');
const util = require('util');

/* Random Consistency Index */
const RI_MAP = {
    2: 0,
    3: 0.58,
    4: 0.9,
    5: 1.12,
    6: 1.24,
    7: 1.32,
    8: 1.41,
    9: 1.45,
    10: 1.49
}

/* AHP Rank Scale Table */
const AHP_RANK_SCALE_TABLE = [{
        scale: 1,
        definition: 'Equal importance',
        explaination: 'Two factors contribute equally to the objective.'
    },
    /*{
        scale: 2,
        definition: 'Between scale 1 and 3',
        explaination: 'Between scale 1 and 3'
    },*/
    {
        scale: 3,
        definition: 'Somewhat more importance',
        explaination: 'Experience and judgement slightly favor one over the other.'
    },
    /*
    {
        scale: 4,
        definition: 'Between scale 3 and 5',
        explaination: 'Between scale 3 and 5'
    },
    */
    {
        scale: 5,
        definition: 'Much more important',
        explaination: 'Experience and judgment strongly favor one over the other.'
    },
    /*
    {
        scale: 6,
        definition: 'Between scale 5 and 7',
        explaination: 'Between scale 5 and 7'
    },
    */
    {
        scale: 7,
        definition: 'Very much more important',
        explaination: 'Experience and judgment very strongly favor one over the other. Its importance is demonstrated in practice.'
    },
    /*
    {
        scale: 8,
        definition: 'Between scale 7 and 9',
        explaination: 'Between scale 7 and 9'
    },
    */
    {
        scale: 9,
        definition: 'Absolutely more important',
        explaination: 'The evidence favoring one over the other is of the highest possible validity.'
    }
];



/**
 * Class AHP
 * 
 * @class AHP
 */
class AHP {

    /**
     * Creates an instance of AHP.
     * 
     * @memberOf AHP
     */
    constructor(context) {
        this.items = [];
        this.criteria = [];
        this.criteriaItemRank = {}; //for each criteria, compare between items
        this.criteriaRank = [];

        if (context) {
            this.import(context);
        }
    }

    /**
     * Import context
     * 
     * @param {object} context 
     * @returns {AHP}
     * 
     * @memberOf AHP
     */
    import (context) {
        let self = this;
        if (context.items && context.items.length > 0) {
            self.addItems(context.items);
        }
        if (context.criteria && context.criteria.length > 0) {
            self.addCriteria(context.criteria);
        }
        if (context.criteriaItemRank) {
            for (var criterion in context.criteriaItemRank) {
                self.criteriaItemRank[criterion] = self.criteriaItemRank[criterion] || [];

                let criterionItemRankContext = context.criteriaItemRank[criterion];

                //1D array => input with ranking score
                if (Array.isArray(criterionItemRankContext) && criterionItemRankContext[0] && !Array.isArray(criterionItemRankContext[0])) {
                    let scoreVector = criterionItemRankContext;
                    for (let i = 0; i < scoreVector.length; i++) {
                        for (let j = 0; j < scoreVector.length; j++) {
                            self.criteriaItemRank[criterion][i][j] = scoreVector[i] / scoreVector[j];
                            if (isNaN(self.criteriaItemRank[criterion][i][j])) {
                                self.criteriaItemRank[criterion][i][j] = null
                            }
                        }
                    }
                } else if (Array.isArray(criterionItemRankContext) && criterionItemRankContext[0] && Array.isArray(criterionItemRankContext[0])) {
                    for (var i = 0; i < criterionItemRankContext.length; i++) {
                        self.criteriaItemRank[criterion][i] = criterionItemRankContext[i] || [];
                        for (var j = 0; j < criterionItemRankContext[i].length; j++) {
                            self.criteriaItemRank[criterion][i][j] = criterionItemRankContext[i][j];
                            if (isNaN(self.criteriaItemRank[criterion][i][j])) {
                                self.criteriaItemRank[criterion][i][j] = null
                            }
                        }
                    }
                }

            }
        }

        if (context.criteriaRank) {

            let criteriaRankContext = context.criteriaRank;
            //1D array => input with ranking score
            if (Array.isArray(criteriaRankContext) && criteriaRankContext[0] && !Array.isArray(criteriaRankContext[0])) {
                let scoreVector = criteriaRankContext;
                for (let i = 0; i < scoreVector.length; i++) {
                    for (let j = 0; j < scoreVector.length; j++) {
                        self.criteriaRank[i][j] = scoreVector[i] / scoreVector[j];
                        if (isNaN(self.criteriaRank[i][j])) {
                            self.criteriaRank[i][j] = null
                        }
                    }
                }
            } else if (Array.isArray(criteriaRankContext) && criteriaRankContext[0] && Array.isArray(criteriaRankContext[0])) {
                for (var i = 0; i < criteriaRankContext.length; i++) {
                    self.criteriaRank[i] = self.criteriaRank[i] || []
                    for (var j = 0; j < criteriaRankContext[i].length; j++) {
                        self.criteriaRank[i][j] = criteriaRankContext[i][j];
                        if (isNaN(self.criteriaRank[i][j])) {
                            self.criteriaRank[i][j] = null
                        }
                    }
                }
            }

        }
        return self;
    }


    /**
     * Export context as Json
     * 
     * @returns {AHP}
     * 
     * @memberOf AHP
     */
    export () {
        let self = this;
        let json = {
            items: [],
            criteria: [],
            criteriaItemRank: {},
            criteriaRank: []
        };
        json.items.push.apply(json.items, self.items)
        json.criteria.push.apply(json.criteria, self.criteria)
        json.criteriaItemRank = JSON.parse(JSON.stringify(self.criteriaItemRank));
        json.criteriaRank = JSON.parse(JSON.stringify(self.criteriaRank));
        return json;
    }

    /**
     * Add Items
     * 
     * @param {string[]} items 
     * @returns {AHP}
     * 
     * @memberOf AHP
     */
    addItems(items) {
        let self = this;
        items = items.filter((item) => self.items.indexOf(item) === -1);

        let originalLength = self.items.length;
        self.items.push.apply(self.items, items);

        for (let criterion of self.criteria) {
            for (let row of self.criteriaItemRank[criterion]) {
                row.push.apply(row, Array(items.length).fill(0));
            }
            items.forEach((item, i) => {
                let newRow = Array(self.items.length).fill(0);
                newRow[originalLength + i] = 1;
                self.criteriaItemRank[criterion].push(newRow);
            })
        }

        return self;
    }


    /**
     * Add Item
     * 
     * @param {string} item 
     * @returns {AHP}
     * 
     * @memberOf AHP
     */
    addItem(item) {
        this.addItems([item]);
        return this;
    }


    /**
     * Remove Item
     * 
     * @param {string} item 
     * @returns {AHP}
     * 
     * @memberOf AHP
     */
    removeItem(item) {
        let self = this;
        let index = self.items.indexOf(item);
        if (index >= 0) {
            self.items.splice(index, 1);

            for (let criterion of self.criteria) {
                self.criteriaItemRank[criterion].splice(index, 1);
                for (let row of self.criteriaItemRank[criterion]) {
                    row.splice(index, 1);
                }
            }
        }
        return self;
    }

    /**
     * Remove Items
     * 
     * @param {string[]} items 
     * @returns {AHP}
     * 
     * @memberOf AHP
     */
    removeItems(items) {
        let self = this;
        items.forEach(item => self.removeItem(item));
        return self;
    }


    /**
     * Add Criteria
     * 
     * @param {string[]} criteria 
     * @returns {AHP}
     * 
     * @memberOf AHP
     */
    addCriteria(criteria) {
        var self = this;
        criteria = criteria.filter((criterion) => self.criteria.indexOf(criterion) === -1);

        let originalLength = self.criteria.length;
        self.criteria.push.apply(self.criteria, criteria);

        for (let criterion of self.criteria) {
            if (!self.criteriaItemRank[criterion]) {
                self.criteriaItemRank[criterion] = numeric.identity(self.items.length);
            }
        }

        for (let row of self.criteriaRank) {
            row.push.apply(row, Array(criteria.length).fill(0));
        }
        criteria.forEach((criterion, i) => {
            let newRow = Array(self.criteria.length).fill(0);
            newRow[originalLength + i] = 1;
            self.criteriaRank.push(newRow);
        })

        return self;
    }


    /**
     * Add Criterion
     * 
     * @param {string} criterion 
     * @returns {AHP}
     * 
     * @memberOf AHP
     */
    addCriterion(criterion) {
        return this.addCriteria([criterion]);
    }


    /**
     * Remove Criterion
     * 
     * @param {string} criterion 
     * @returns {AHP}
     * 
     * @memberOf AHP
     */
    removeCriterion(criterion) {
        let self = this;
        let index = self.criteria.indexOf(criterion);
        if (index >= 0) {
            self.criteria.splice(index, 1);

            delete self.criteriaItemRank[criterion]

            self.criteriaRank.splice(index, 1);
            for (let row of self.criteriaRank) {
                row.splice(index, 1);
            }
        }
        return self;
    }


    /**
     * Remove Criteria
     * 
     * @param {string[]} criteria 
     * @returns {AHP}
     * 
     * @memberOf AHP
     */
    removeCriteria(criteria) {
        let self = this;
        criteria.forEach(criterion => self.removeCriterion(criterion));
        return self;
    }


    /**
     * Reset Criteria perspective Item Rank Matrix
     * 
     * @param {string[]} criteria 
     * @returns {AHP}
     * 
     * @memberOf AHP
     */
    resetCriteriaItemRank(criteria) {
        let self = this;
        criteria.forEach(function (criterion) {
            this.criteriaItemRank[criterion] = numeric.identity(self.items.length);
        }, this);
        return self;
    }

    /**
     * Reset Criteria Rank Matrix
     * 
     * @returns {AHP}
     * 
     * @memberOf AHP
     */
    resetCriteriaRank() {
        let self = this;
        this.criteriaRank = numeric.identity(self.criteria.length);
        return self;
    }


    /**
     * Set Criteria perspective Item Rank By Given Scores
     * 
     * @param {string} criterion 
     * @param {number[]} scoreVector 
     * @returns {AHP}
     * 
     * @memberOf AHP
     */
    setCriteriaItemRankByGivenScores(criterion, scoreVector) {
        let self = this;
        for (let i = 0; i < scoreVector.length; i++) {
            for (let j = 0; j < scoreVector.length; j++) {
                self.criteriaItemRank[criterion][i][j] = scoreVector[i] / scoreVector[j];
            }
        }
        return self;
    }


    /**
     * Rank Criteria perspective Item
     * 
     * @param {string} criterion 
     * @param {{preferredItem:string, comparingItem:string, scale:number}[]|(string|number)[]} preferences - Array of Preference. The 'preferredItem' of preference object is the preferred item while 'comparingItem' is the comparing item. The 'scale' is the preferred rank scale. You can pass the 3 objects as an array of 3 objects as well.
     * @returns {AHP}
     * 
     * @memberOf AHP
     */
    rankCriteriaItem(criterion, preferences) {
        let self = this;
        if (self.criteria.indexOf(criterion) === -1) {
            return self;
        }

        for (let prefer of preferences) {
            let preferredItem, comparingItem, scale;
            if (Array.isArray(prefer)) {
                [preferredItem, comparingItem, scale] = prefer;
            } else {
                preferredItem = prefer.preferredItem;
                comparingItem = prefer.comparingItem;
                scale = prefer.scale;
            }
            let itemAIndex = self.items.indexOf(preferredItem);
            let itemBIndex = self.items.indexOf(comparingItem);
            if (itemAIndex >= 0 && itemBIndex >= 0) {
                self.criteriaItemRank[criterion][itemAIndex][itemBIndex] = scale;
                self.criteriaItemRank[criterion][itemBIndex][itemAIndex] = 1 / scale;
            }
        }
        return self;
    }

    /**
     * Set Criteria Rank By Given Scores
     * 
     * @param {string} criterion
     * @param {number[]} scoreVector
     * @returns {AHP}
     * 
     * @memberOf AHP
     */
    setCriteriaRankByGivenScores(scoreVector) {
        let self = this;
        for (let i = 0; i < scoreVector.length; i++) {
            for (let j = 0; j < scoreVector.length; j++) {
                self.criteriaRank[i][j] = scoreVector[i] / scoreVector[j];
            }
        }
        return self;
    }

    /**
     * Rank Criteria
     * 
     * @param {string} criterion 
     * @param {{preferredCriterion:string, comparingCriterion:string, scale:number}[]|(string|number)[]} preferences - Array of Preference. The 'preferredCriterion' of preference object is the preferred criterion while 'comparingCriterion' is the comparing criterion. The 'scale' is the preferred rank scale. You can pass the 3 objects as an array of 3 objects as well.
     * @returns {AHP}
     * 
     * @memberOf AHP
     */
    rankCriteria(preferences) {
        let self = this;

        for (let prefer of preferences) {
            let preferredCriterion, comparingCriterion, scale;
            if (Array.isArray(prefer)) {
                [preferredCriterion, comparingCriterion, scale] = prefer;
            } else {
                preferredCriterion = prefer.preferredCriterion;
                comparingCriterion = prefer.comparingCriterion;
                scale = prefer.scale;
            }
            let criterionAIndex = self.criteria.indexOf(preferredCriterion);
            let criterionBIndex = self.criteria.indexOf(comparingCriterion);
            if (criterionAIndex >= 0 && criterionBIndex >= 0) {
                self.criteriaRank[criterionAIndex][criterionBIndex] = scale;
                self.criteriaRank[criterionBIndex][criterionAIndex] = 1 / scale;
            }
        }
        return self;
    }

    /**
     * Find next Problem,
     * 
     * @returns {ContextError}
     * 
     * @memberOf AHP
     */
    findNextProblem() {
        let self = this;

        if (!self.items || self.items.length === 0) {
            return new NoItem();
        }

        if (!self.criteria || self.criteria.length === 0) {
            return new NoCriteria();
        }

        let [result, rowI, colI] = AHP.findRankMatrixIncompleteCell(self.criteriaRank);
        if (result) {
            return new MissingCriteriaRank({
                criterionA: self.criteria[rowI],
                criterionB: self.criteria[colI]
            });
        }

        for (let crit in self.criteriaItemRank) {
            let [result, rowI, colI] = AHP.findRankMatrixIncompleteCell(self.criteriaItemRank[crit]);
            if (result) {
                return new MissingCriteriaItemRank({
                    criterion: crit,
                    itemA: self.items[rowI],
                    itemB: self.items[colI]
                });
            }
        }

        let {
            ci,
            ri,
            cr,
            weightedVector
        } = AHP.calculateMatrixConsistency(self.criteriaRank);
        if (cr > 0.1) {
            return new CriteriaRankInsufficientConsistencyRatio({
                cr: cr
            });
        }

        for (let j = 0; j < self.criteria.length; j++) {
            let crit = self.criteria[j];
            let {
                ci,
                ri,
                cr,
                weightedVector
            } = AHP.calculateMatrixConsistency(self.criteriaItemRank[crit]);
            if (cr > 0.1) {
                return new CriteriaItemRankInsufficientConsistencyRatio({
                    criterion: crit,
                    cr: cr
                });
            }
        }

        return null;
    }

    /**
     * Debug Analytic Process
     * @returns {error: ContextError, rankingMatrix: number[][], criteriaRankMetaMap:{{ci:number,ri:number,cr:number}}, critWeightVector, rankedScoreMap:{item:number}, rankedScores: number[], log:string }
     * 
     * @memberOf AHP
     */
    debug() {
        let self = this;
        let log = '';
        let debugLog = function () {
            for (let obj of arguments) {
                if (typeof obj === 'object') {
                    log += util.inspect(obj, false, null);
                } else {
                    log += obj
                }
                log += '\n';
            }
        }

        debugLog('==========================================');
        debugLog('context:')
        debugLog('items: ', self.items);
        debugLog('criteria: ', self.criteria);
        debugLog('criteriaItemRank: ', self.criteriaItemRank);
        debugLog('criteriaRank: ', self.criteriaRank);
        debugLog('__________________________________');

        let problem = self.findNextProblem();
        if (problem) {
            debugLog(problem);
        }

        if (problem && (problem.type === AHP.contextErrorType.NoItem || problem.type === AHP.contextErrorType.NoCriteria
                /* ||
                                problem.type === AHP.contextErrorType.MissingCriteriaItemRank || problem.type === AHP.contextErrorType.MissingCriteriaRank*/
            )) {
            return {
                error: problem,
                rankingMatrix: null,
                itemRankMetaMap: null,
                criteriaRankMetaMap: null,
                rankedScoreMap: null,
                log: log
            };
        }

        let rankCompleteCounter = 0;
        for (let crit in self.criteriaItemRank) {
            let completed = AHP.checkRankMatrixCompleted(self.criteriaItemRank[crit]);

            debugLog(`criteriaItemRank['${crit}']`);
            if (!completed) {
                debugLog('(Incomplete)')
            };
            debugLog(AHP.printMatrixAsStr(self.criteriaItemRank[crit], self.items, 10));

            if (completed) {
                let {
                    ci,
                    ri,
                    cr
                } = AHP.calculateMatrixConsistency(self.criteriaItemRank[crit]);
                debugLog(`Consistentcy index: ${ci}`);
                debugLog(`Random index: ${ri}`);
                debugLog(`Consistentcy ratio: ${cr}`);
                if (cr <= 0.1) {
                    debugLog(`CR<=0.1 => sufficient consistency`);
                    rankCompleteCounter++;
                } else {
                    debugLog(`CR>0.1 => insufficient consistency`);
                }
            }
            debugLog('__________________________________');
        }

        let maxCriteionLength = self.criteria.map(a => a.length).reduce((a, b) => Math.max(a.length, b.length), 5);
        let critRankCompleted = self.criteriaRank.length > 0 && AHP.checkRankMatrixCompleted(self.criteriaRank);
        debugLog(`criteriaRank:`);
        if (!critRankCompleted) {
            debugLog('(Incomplete)')
        };
        debugLog(AHP.printMatrixAsStr(self.criteriaRank, self.criteria, 5));

        if (critRankCompleted) {
            let {
                ci,
                ri,
                cr,
                weightedVector
            } = AHP.calculateMatrixConsistency(self.criteriaRank);
            debugLog(`Consistentcy index: ${ci}`);
            debugLog(`Random index: ${ri}`);
            debugLog(`Consistentcy ratio: ${cr}`);
            if (cr > 0.1) {
                critRankCompleted = false;
                debugLog(`CR>0.1 => insufficient consistency`);
            } else {
                debugLog(`CR<=0.1 => sufficient consistency`);
            }
            debugLog(`Criteria Weight Vector: ${weightedVector}`);
            debugLog('__________________________________\n');
        }


        let rankingMatrix = Array(self.items.length).fill(null).map(() => Array(self.criteria.length).fill(0));
        let itemRankMetaMap = {};
        for (let j = 0; j < self.criteria.length; j++) {
            let crit = self.criteria[j];
            let {
                ci,
                ri,
                cr,
                weightedVector
            } = AHP.calculateMatrixConsistency(self.criteriaItemRank[crit]);
            for (let i = 0; i < weightedVector.length; i++) {
                rankingMatrix[i][j] = weightedVector[i];
            }
            itemRankMetaMap[crit] = {
                ci,
                ri,
                cr
            }
        }
        debugLog('rankingMatrix: (Higher score is better)');
        debugLog(AHP.print2DMatrixAsStr(numeric.transpose(rankingMatrix), self.items, self.criteria, 5));
        debugLog('__________________________________');

        let criteriaRankMetaMap = AHP.calculateMatrixConsistency(self.criteriaRank);
        let critWeightVector = criteriaRankMetaMap.weightedVector

        let rankedScores = numeric.dotMV(rankingMatrix, critWeightVector);
        let rankedScoreMap = {};
        self.items.forEach((item, i) => {
            rankedScoreMap[item] = rankedScores[i];
        });
        debugLog('ranked item scores: (Higher score is better)');
        debugLog(AHP.print2DMatrixAsStr(numeric.transpose([rankedScores]), ['Score'], self.items, 5));
        debugLog('==========================================');

        return {
            error: problem,
            rankingMatrix,
            itemRankMetaMap,
            criteriaRankMetaMap,
            rankedScoreMap,
            rankedScores,
            log
        };
    }

    /**
     * Debug Analytic Process
     * @returns {error: ContextError, rankingMatrix: number[][], criteriaRankMetaMap:{{ci:number,ri:number,cr:number}}, critWeightVector, rankedScoreMap:{item:number}, rankedScores: number[] }
     * 
     * @memberOf AHP
     */
    run() {
        let {
            error,
            rankingMatrix,
            itemRankMetaMap,
            criteriaRankMetaMap,
            rankedScoreMap,
            rankedScores
        } = this.debug();
        return {
            error,
            rankingMatrix,
            itemRankMetaMap,
            criteriaRankMetaMap,
            rankedScoreMap,
            rankedScores
        }
    }

    /**
     * Find Rank Matrix Incomplete Cell which is not defined or NaN.
     * 
     * @static
     * @param {number[][]} matrix 
     * @returns {(boolean|number)[]} - Array object. The inner array contains `find result` as the 1st object (boolean), and the row index and column index of incomplete cell as 2nd and 3rd object.
     * 
     * @memberOf AHP
     */
    static findRankMatrixIncompleteCell(matrix) {
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix.length; j++) {
                if (isNaN(matrix[i][j]) || matrix[i][j] <= 0) {
                    return [true, i, j];
                }
            }
        }
        return [false, -1, -1];
    }

    /**
     * Check Rank Matrix Complated.
     * @static
     * @param {number[][]} matrix 
     * @returns {boolean}
     * 
     * @memberOf AHP
     */
    static checkRankMatrixCompleted(matrix) {
        for (let row of matrix) {
            for (let cell of row) {
                if (isNaN(cell) || cell <= 0) {
                    return false;
                }
            }
        }
        return true;
    }

    /**
     * static util function for printing matrix
     * 
     * @static
     * @param {number[][]} matrix 
     * @param {string[]} matrixHeaders 
     * @param {number} minCellLength 
     * @returns {string}
     * 
     * @memberOf AHP
     */
    static printMatrixAsStr(matrix, matrixHeaders, minCellLength) {
        if (!matrix || !matrixHeaders || matrix.length !== matrixHeaders.length) {
            return null;
        }
        let maxItemLength = matrixHeaders.map(a => a.length).reduce((a, b) => Math.max(a, b), minCellLength);
        let str = '';
        str += '-'.repeat(maxItemLength + (matrixHeaders.length) * (maxItemLength + 1) + 2) + '\n';
        str += '|' + ' '.repeat(maxItemLength) + '|' + matrixHeaders.map(item => (' '.repeat(maxItemLength - item.length) + item)).join('|') + '|\n';
        str += '|' + '-'.repeat(maxItemLength) + '|' + matrixHeaders.map(item => ('-'.repeat(maxItemLength))).join('|') + '|\n';
        for (let i = 0; i < matrix.length; i++) {
            let rowItem = matrixHeaders[i];
            let row = matrix[i];
            str += '|' + ' '.repeat(maxItemLength - rowItem.length) + rowItem + '|' +
                row.map((datum) => {
                    let rounded = Number(Math.round(datum + 'e3') + 'e-3').toFixed(3);
                    let str = rounded.toString();
                    if (str.length < maxItemLength) {
                        str = ' '.repeat(maxItemLength - str.length) + str;
                    }
                    return str;
                }).join('|') +
                '|\n';
        };
        str += '-'.repeat(maxItemLength + (matrixHeaders.length) * (maxItemLength + 1) + 2) + '\n';
        return str;
    }

    static print2DMatrixAsStr(matrix, matrixColHeaders, matrixRowItems, minCellLength) {
        if (!matrix || !matrixColHeaders || !matrixRowItems || matrix.length !== matrixRowItems.length) {
            return null;
        }
        let maxItemLength = matrixColHeaders.map(a => a.length).reduce((a, b) => Math.max(a, b), minCellLength);
        let maxRowItemLength = matrixRowItems.map(a => a.length).reduce((a, b) => Math.max(a, b), minCellLength);
        let str = '';
        str += '-'.repeat(maxRowItemLength + (matrixColHeaders.length) * (maxItemLength + 1) + 2) + '\n';
        str += '|' + ' '.repeat(maxRowItemLength) + '|' + matrixColHeaders.map(item => (' '.repeat(maxItemLength - item.length) + item)).join('|') + '|\n';
        str += '|' + '-'.repeat(maxRowItemLength) + '|' + matrixColHeaders.map(item => ('-'.repeat(maxItemLength))).join('|') + '|\n';
        for (let i = 0; i < matrix.length; i++) {
            let rowItem = matrixRowItems[i];
            let row = matrix[i];
            str += '|' + ' '.repeat(maxRowItemLength - rowItem.length) + rowItem + '|' +
                row.map((datum) => {
                    let rounded = Number(Math.round(datum + 'e3') + 'e-3').toFixed(3);
                    let str = rounded.toString();
                    if (str.length < maxItemLength) {
                        str = ' '.repeat(maxItemLength - str.length) + str;
                    }
                    return str;
                }).join('|') +
                '|\n';
        };
        str += '-'.repeat(maxRowItemLength + (matrixColHeaders.length) * (maxItemLength + 1) + 2) + '\n';
        return str;
    }

    /**
     * static util function for calculating matrix consistency
     * 
     * @static
     * @param {number[][]} matrix 
     * @returns {ci: number, ri: number, cr: number, weightedVector: number[]}
     * 
     * @memberOf AHP
     */
    static calculateMatrixConsistency(matrix) {
        if (matrix.length === 0) {
            return {
                ci: null,
                ri: null,
                cr: null,
                weightedVector: null
            }
        }

        let weightedMatrix = [];

        for (let i = 0; i < matrix.length; i++) {
            let row = [];
            for (let j = 0; j < matrix.length; j++) {
                row.push(matrix[i][j]);
            }
            weightedMatrix.push(row);
        }

        for (let i = 0; i < matrix.length; i++) {
            let colWeightFactor = 1 / math.sum(matrix.map((row) => row[i]));
            for (let j = 0; j < matrix.length; j++) {
                weightedMatrix[j][i] = matrix[j][i] * colWeightFactor;
            }
        }

        let weightedVector = weightedMatrix.map(row => math.mean(row));
        let consistentcyVector = numeric.dotMV(matrix, weightedVector);
        let consistentcyMeasures = [];
        for (let i = 0; i < weightedVector.length; i++) {
            consistentcyMeasures[i] = consistentcyVector[i] / weightedVector[i];
        }
        let avgConsistentcyMeasures = math.mean(consistentcyMeasures);
        let ci = (avgConsistentcyMeasures - matrix.length) / (matrix.length-1);
        let ri = RI_MAP[matrix.length];
        let cr = ri > 0 ? ci / ri : 0;
        return {
            ci,
            ri,
            cr,
            weightedVector
        };
    }
}


/**
 * Context Error
 * 
 * @class ContextError
 */
class ContextError {

    /**
     * Creates an instance of ContextError.
     * 
     * @memberOf ContextError
     */
    constructor() {
        this.type = null;
        this.context = {};
    }

    /**
     * get description
     * @returns {string}
     * @memberOf ContextError
     */
    getDescription() {}
}


/**
 * No Item Error
 * 
 * @class NoItem
 * @extends {ContextError}
 */
class NoItem extends ContextError {

    /**
     * Creates an instance of NoItem.
     * 
     * @memberOf NoItem
     */
    constructor() {
        super();
        this.type = "NO_ITEM";
    }

    /**
     * get description
     * @returns {string}
     * @memberOf NoItem
     */
    getDescription() {
        return 'Missing comparison options information.';
    }
}


/**
 * No Criteria Error
 * 
 * @class NoCriteria
 * @extends {ContextError}
 */
class NoCriteria extends ContextError {

    /**
     * Creates an instance of NoCriteria.
     * 
     * @memberOf NoCriteria
     */
    constructor() {
        super();
        this.type = "NO_CRITERIA";
    }

    /**
     * get description
     * @returns {string}
     * @memberOf NoCriteria
     */
    getDescription() {
        return 'Missing comparison criteria information.';
    }
}

/**
 * Missing Criteria Iteam Rank Error
 * 
 * @class MissingCriteriaItemRank
 * @extends {ContextError}
 */
class MissingCriteriaItemRank extends ContextError {

    /**
     * Creates an instance of MissingCriteriaItemRank.
     * @param {any} {
     *         criterion,
     *         itemA,
     *         itemB
     *     } 
     * 
     * @memberOf MissingCriteriaItemRank
     */
    constructor({
        criterion,
        itemA,
        itemB
    }) {
        super();
        this.type = 'MISSING_CRITERIA_ITEM_RANK';
        this.context = {
            criterion,
            itemA,
            itemB
        };
    }

    /**
     * get description
     * @returns {string}
     * @memberOf MissingCriteriaItemRank
     */
    getDescription() {
        return `In terms of criterion "${this.context.criterion}", which option do you prefer more and what is the scale level do you prefer?\n` +
            `Option (A): "${this.context.itemA}", Option (B): "${this.context.itemB}"\n\n` +
            `Scale(1-9):\n` +
            AHP_RANK_SCALE_TABLE.map(scaleItem => `${scaleItem.scale}: ${scaleItem.definition}`).join('\n') + '\n' +
            '2,4,6,8: Intermediate values\n';
    }
}


/**
 * Missing Criteria Rank Error
 * 
 * @class MissingCriteriaRank
 * @extends {ContextError}
 */
class MissingCriteriaRank extends ContextError {
    /**
     * Creates an instance of MissingCriteriaRank.
     * @param {any} {
     *         criterionA,
     *         criterionB
     *     } 
     * 
     * @memberOf MissingCriteriaRank
     */
    constructor({
        criterionA,
        criterionB
    }) {
        super();
        this.type = 'MISSING_CRITERIA_RANK';
        this.context = {
            criterionA,
            criterionB
        };
    }

    /**
     * get description
     * @returns {string}
     * @memberOf MissingCriteriaRank
     */
    getDescription() {
        return `Which critetion do you prefer more and what is the scale level do you prefer?\n` +
            `Option (A): "${this.context.criterionA}", Option (B): "${this.context.criterionB}"\n\n` +
            `Scale(1-9):\n` +
            AHP_RANK_SCALE_TABLE.map(scaleItem => `${scaleItem.scale}: ${scaleItem.definition}`).join('\n') + '\n' +
            '2,4,6,8: Intermediate values\n';
    }

}

/**
 * Criteria Item Rank Insufficient Consistendy Ratio Error
 * 
 * @class CriteriaItemRankInsufficientConsistencyRatio
 * @extends {ContextError}
 */
class CriteriaItemRankInsufficientConsistencyRatio extends ContextError {

    /**
     * Creates an instance of CriteriaItemRankInsufficientConsistencyRatio.
     * @param {any} {
     *         criterion,
     *         cr
     *     } 
     * 
     * @memberOf CriteriaItemRankInsufficientConsistencyRatio
     */
    constructor({
        criterion,
        cr
    }) {
        super();
        this.type = 'CRITERIA_ITEM_RANK_INSUFFICIENT_CONSISTENCY_RATIO';
        this.context = {
            criterion,
            cr
        };
    }

    /**
     * get description
     * @returns {string}
     * @memberOf CriteriaItemRankInsufficientConsistencyRatio
     */
    getDescription() {
        return `In terms of criterion "${this.context.criterion}", criteria item rank matrix consistency ratio > 0.1`;
    }
}


/**
 * Criteria Tank Insufficiency Ratio
 * 
 * @class CriteriaRankInsufficientConsistencyRatio
 * @extends {ContextError}
 */
class CriteriaRankInsufficientConsistencyRatio extends ContextError {

    /**
     * Creates an instance of CriteriaRankInsufficientConsistencyRatio.
     * @param {any} {
     *         cr
     *     } 
     * 
     * @memberOf CriteriaRankInsufficientConsistencyRatio
     */
    constructor({
        cr
    }) {
        super();
        this.type = 'CRITERIA_RANK_INSUFFICIENT_CONSISTENCY_RATIO';
        this.context = {
            cr
        };
    }

    /**
     * get description
     * @returns {string}
     * @memberOf CriteriaRankInsufficientConsistencyRatio
     */
    getDescription() {
        return `Criteria rank matrix consistency ratio > 0.1`;
    }
}

AHP.AHP_RANK_SCALE_TABLE = AHP_RANK_SCALE_TABLE;
AHP.contextErrorType = {
    NoItem: 'NO_ITEM',
    NoCriteria: 'NO_CRITERIA',
    MissingCriteriaItemRank: 'MISSING_CRITERIA_ITEM_RANK',
    MissingCriteriaRank: 'MISSING_CRITERIA_RANK',
    CriteriaItemRankInsufficientConsistencyRatio: 'CRITERIA_ITEM_RANK_INSUFFICIENT_CONSISTENCY_RATIO',
    CriteriaRankInsufficientConsistencyRatio: 'CRITERIA_RANK_INSUFFICIENT_CONSISTENCY_RATIO'
};
module.exports = AHP;
