'use strict';

var should = require('chai').should;
var expect = require('chai').expect;
var supertest = require('supertest');
var AHP = require('./../src/ahp.js');
var numeric = require('numericjs');

describe('ahp-test', function () {
    this.timeout(2000);

    before(function (done) {
        done();
    });

    it("Test base flow", function (done) {

        //test construct with context
        var ahpContext = new AHP({
            items: ['VendorA', 'VendorB', 'VendorC'],
            criteria: ['price', 'functionality', 'UX', 'support'],
            criteriaItemRank: {
                price: [
                    [1, 1, 0.5],
                    [1, 1, 0.5],
                    [2, 2, 1]
                ],
                functionality: [
                    [1, 1, 5],
                    [1, 1, 5],
                    [0.2, 0.2, 1]
                ],
                UX: [
                    [1, 1, 10],
                    [1, 1, 10],
                    [0.1, 0.1, 1]
                ],
                support: [
                    [1, 0.2, 0.2],
                    [5, 1, 1],
                    [5, 1, 1]
                ]
            },
            criteriaRank: [
                [1, 3, 3, 2],
                [0.3333333333333333, 1, 1, 0.5],
                [0.3333333333333333, 1, 1, 0.5],
                [0.5, 2, 2, 1]
            ]
        });

        let {
            error,
            rankingMatrix,
            itemRankMetaMap,
            criteriaRankMetaMap,
            rankedScoreMap
        } = ahpContext.run();
        expect(error).to.null;
        expect(rankingMatrix).to.not.null;
        expect(itemRankMetaMap).to.not.null;
        expect(criteriaRankMetaMap).to.not.null;
        expect(rankedScoreMap).to.not.null;

        done();
    });

    it("Test base flow with blank constructor", function (done) {
        //test blank constructor
        var ahpContext = new AHP();
        ahpContext.addItems(['a', 'b']);
        ahpContext.removeItems(['a', 'b']);
        ahpContext.removeItems(['a', 'b']);
        ahpContext.addItems(['VendorA', 'VendorB', 'VendorC']);
        ahpContext.removeItems(['a', 'b']);
        ahpContext.removeCriteria(['p', 'q']);
        ahpContext.addCriteria(['p', 'q']);
        ahpContext.removeCriteria(['p', 'q']);
        ahpContext.removeCriteria(['p', 'q']);
        ahpContext.addCriteria(['price', 'functionality', 'UX', 'support']);
        ahpContext.addItem('VendorD');
        ahpContext.addCriterion('dummy');
        ahpContext.addItem('VendorE');
        ahpContext.addItem('VendorF');
        ahpContext.addCriterion('dummy2');
        ahpContext.removeItems(['VendorD']);
        ahpContext.removeItem('VendorE');
        ahpContext.addItem('VendorE');
        ahpContext.addItem('VendorF');
        ahpContext.removeItems(['VendorE', 'VendorF']);
        ahpContext.addCriterion('dummy3');
        ahpContext.addCriterion('dummy3');
        ahpContext.removeCriterion('dummy');
        ahpContext.removeCriteria(['dummy2', 'dummy3']);

        ahpContext.rankCriteriaItem('typo criteria', [{
                preferredItem: 'VendorB',
                comparingItem: 'VendorC',
                scale: 1 / 2
            },
            ['VendorA', 'VendorC', 1 / 2],
            ['VendorA', 'VendorB', 1]
        ]);

        ahpContext.rankCriteriaItem('price', [{
                preferredItem: 'typo VendorB',
                comparingItem: 'typo VendorC',
                scale: 1 / 2
            },
            ['VendorA', 'VendorC', 1 / 2],
            ['VendorA', 'VendorB', 1]
        ]);

        ahpContext.rankCriteriaItem('price', [{
                preferredItem: 'VendorB',
                comparingItem: 'VendorC',
                scale: 1 / 2
            },
            ['VendorA', 'VendorC', 1 / 2],
            ['VendorA', 'VendorB', 1]
        ]);
        ahpContext.rankCriteriaItem('functionality', [
            ['VendorB', 'VendorC', 5],
            ['VendorA', 'VendorC', 5],
            ['VendorA', 'VendorB', 1]
        ]);
        ahpContext.rankCriteriaItem('UX', [
            ['VendorB', 'VendorC', 10],
            ['VendorA', 'VendorC', 10],
            ['VendorA', 'VendorB', 1]
        ]);
        ahpContext.rankCriteriaItem('support', [
            ['VendorB', 'VendorC', 1],
            ['VendorA', 'VendorC', 1 / 5],
            ['VendorA', 'VendorB', 1 / 5]
        ]);
        ahpContext.rankCriteria(
            [{
                    preferredCriterion: 'price',
                    comparingCriterion: 'functionality',
                    scale: 3
                },
                ['typo price', 'UX', 3],
                ['price', 'UX', 3],
                ['price', 'support', 2],
                ['functionality', 'UX', 1],
                ['functionality', 'support', 1 / 2],
                ['UX', 'support', 1 / 2]
            ]
        );
        let {
            error,
            rankingMatrix,
            itemRankMetaMap,
            criteriaRankMetaMap,
            rankedScoreMap
        } = ahpContext.run();
        expect(error).to.null;
        expect(rankingMatrix).to.not.null;
        expect(itemRankMetaMap).to.not.null;
        expect(criteriaRankMetaMap).to.not.null;
        expect(rankedScoreMap).to.not.null;

        done();
    });

    it("Test base flow with blank constructor 2", function (done) {
        //test blank constructor, adding information with different sequences
        var
            ahpContext = new AHP();
        ahpContext.addCriteria(['price', 'functionality', 'UX', 'support']);
        ahpContext.addItems(['VendorA', 'VendorB', 'VendorC']);
        ahpContext.addCriterion('dummy');
        ahpContext.addItem('VendorD');
        ahpContext.removeCriteria(['dummy']);
        ahpContext.removeItems(['VendorD']);

        ahpContext.rankCriteria(
            [{
                    preferredCriterion: 'price',
                    comparingCriterion: 'functionality',
                    scale: 3
                },
                ['price', 'UX', 3],
                ['price', 'support', 2],
                ['functionality', 'UX', 1],
                ['functionality', 'support', 1 / 2],
                ['UX', 'support', 1 / 2]
            ]
        );

        ahpContext.rankCriteriaItem('UX', [
            ['VendorB', 'VendorC', 10],
            ['VendorA', 'VendorC', 10],
            ['VendorA', 'VendorB', 1]
        ]);
        ahpContext.rankCriteriaItem('support', [
            ['VendorB', 'VendorC', 1],
            ['VendorA', 'VendorC', 1 / 5],
            ['VendorA', 'VendorB', 1 / 5]
        ]);
        ahpContext.rankCriteriaItem('price', [{
                preferredItem: 'VendorB',
                comparingItem: 'VendorC',
                scale: 1 / 2
            },
            ['VendorA', 'VendorC', 1 / 2],
            ['VendorA', 'VendorB', 1]
        ]);
        ahpContext.rankCriteriaItem('functionality', [
            ['VendorB', 'VendorC', 5],
            ['VendorA', 'VendorC', 5],
            ['VendorA', 'VendorB', 1]
        ]);

        let {
            error,
            rankingMatrix,
            itemRankMetaMap,
            criteriaRankMetaMap,
            rankedScoreMap
        } = ahpContext.run();
        expect(error).to.null;
        expect(rankingMatrix).to.not.null;
        expect(itemRankMetaMap).to.not.null;
        expect(criteriaRankMetaMap).to.not.null;
        expect(rankedScoreMap).to.not.null;

        done();
    });

    it("Test import", function (done) {
        var ahpContext = new AHP();
        ahpContext.import({
            items: ['VendorA', 'VendorB', 'VendorC'],
            criteria: ['price', 'functionality', 'UX', 'support'],
            criteriaItemRank: {
                price: [
                    [1, 1, 0.5],
                    [1, 1, 0.5],
                    [2, 2, 1]
                ],
                functionality: [
                    [1, 1, 5],
                    [1, 1, 5],
                    [0.2, 0.2, 1]
                ],
                UX: [
                    [1, 1, 10],
                    [1, 1, 10],
                    [0.1, 0.1, 1]
                ],
                support: [
                    [1, 0.2, 0.2],
                    [5, 1, 1],
                    [5, 1, 1]
                ]
            },
            criteriaRank: [
                [1, 3, 3, 2],
                [0.3333333333333333, 1, 1, 0.5],
                [0.3333333333333333, 1, 1, 0.5],
                [0.5, 2, 2, 1]
            ]
        });

        let {
            error,
            rankingMatrix,
            itemRankMetaMap,
            criteriaRankMetaMap,
            rankedScoreMap
        } = ahpContext.run();

        expect(error).to.null;
        expect(rankingMatrix).to.not.null;
        expect(itemRankMetaMap).to.not.null;
        expect(criteriaRankMetaMap).to.not.null;
        expect(rankedScoreMap).to.not.null;
        done();
    });

    it("Test import 2", function (done) {
        var ahpContext = new AHP();
        ahpContext.import({
            items: ['VendorA', 'VendorB', 'VendorC'],
            criteria: ['price', 'functionality', 'UX', 'support'],
            criteriaItemRank: {
                price: [
                    ["a", 1, 0.5],
                    [1, 1, 0.5],
                    [2, 2, 1]
                ],
                functionality: [
                    [1, 1, 5],
                    [1, 1, 5],
                    [0.2, 0.2, 1]
                ],
                UX: [
                    [1, 1, 10],
                    [1, 1, 10],
                    [0.1, 0.1, 1]
                ],
                support: [
                    [1, 0.2, 0.2],
                    [5, 1, 1],
                    [5, 1, 1]
                ]
            },
            criteriaRank: [
                [1, "#", 3, 2],
                [0.3333333333333333, 1, 1, 0.5],
                [0.3333333333333333, 1, 1, 0.5],
                [0.5, 2, 2, 1]
            ]
        });

        expect(ahpContext).to.eql({
            "items": ["VendorA", "VendorB", "VendorC"],
            "criteria": ["price", "functionality", "UX",
                "support"
            ],
            "criteriaItemRank": {
                "price": [
                    [null, 1, 0.5],
                    [1, 1, 0.5],
                    [2, 2, 1]
                ],
                "functionality": [
                    [1, 1, 5],
                    [1, 1, 5],
                    [0.2, 0.2, 1]
                ],
                "UX": [
                    [1, 1, 10],
                    [1, 1, 10],
                    [0.1, 0.1, 1]
                ],
                "support": [
                    [
                        1, 0.2, 0.2
                    ],
                    [5, 1, 1],
                    [5, 1, 1]
                ]
            },
            "criteriaRank": [
                [1, null, 3, 2],
                [0.3333333333333333, 1, 1, 0.5],
                [0.3333333333333333, 1, 1, 0.5],
                [0.5, 2, 2, 1]
            ]
        });
        done();
    });

    it("Test import 3", function (done) {
        var ahpContext = new AHP();
        ahpContext.import({
            items: ['VendorA', 'VendorB', 'VendorC'],
            criteria: ['price', 'functionality', 'UX', 'support'],
        });

        expect(ahpContext).to.eql({
            "items": ["VendorA", "VendorB", "VendorC"],
            "criteria": ["price", "functionality", "UX",
                "support"
            ],
            "criteriaItemRank": {
                "price": [
                    [1, 0, 0],
                    [0, 1, 0],
                    [0, 0, 1]
                ],
                "functionality": [
                    [1, 0, 0],
                    [0, 1, 0],
                    [0, 0, 1]
                ],
                "UX": [
                    [1, 0, 0],
                    [0, 1, 0],
                    [0, 0, 1]
                ],
                "support": [
                    [1, 0, 0],
                    [0, 1, 0],
                    [0, 0, 1]
                ]
            },
            "criteriaRank": [
                [1, 0, 0, 0],
                [0, 1, 0, 0],
                [0, 0, 1, 0],
                [0, 0, 0, 1]
            ]
        });

        done();
    });

    it("Test export", function (done) {
        var ahpContext = new AHP();

        var importContent = {
            items: ['VendorA', 'VendorB', 'VendorC'],
            criteria: ['price', 'functionality', 'UX', 'support'],
            criteriaItemRank: {
                price: [
                    [1, 1, 0.5],
                    [1, 1, 0.5],
                    [2, 2, 1]
                ],
                functionality: [
                    [1, 1, 5],
                    [1, 1, 5],
                    [0.2, 0.2, 1]
                ],
                UX: [
                    [1, 1, 10],
                    [1, 1, 10],
                    [0.1, 0.1, 1]
                ],
                support: [
                    [1, 0.2, 0.2],
                    [5, 1, 1],
                    [5, 1, 1]
                ]
            },
            criteriaRank: [
                [1, 3, 3, 2],
                [0.3333333333333333, 1, 1, 0.5],
                [0.3333333333333333, 1, 1, 0.5],
                [0.5, 2, 2, 1]
            ]
        };
        var exported = ahpContext.import(importContent).export();
        expect(JSON.stringify(exported)).equal(JSON.stringify(importContent));
        done();
    });

    it("Test missing item", function (done) {
        var ahpContext = new AHP().import({
            items: [],
            criteria: ['price', 'functionality', 'UX', 'support'],
            criteriaItemRank: {
                price: [
                    [1, 1, 0.5],
                    [1, 1, 0.5],
                    [2, 2, 1]
                ],
                functionality: [
                    [1, 1, 5],
                    [1, 1, 5],
                    [0.2, 0.2, 1]
                ],
                UX: [
                    [1, 1, 10],
                    [1, 1, 10],
                    [0.1, 0.1, 1]
                ],
                support: [
                    [1, 0.2, 0.2],
                    [5, 1, 1],
                    [5, 1, 1]
                ]
            },
            criteriaRank: [
                [1, 3, 3, 2],
                [0.3333333333333333, 1, 1, 0.5],
                [0.3333333333333333, 1, 1, 0.5],
                [0.5, 2, 2, 1]
            ]
        });

        let {
            error,
            rankingMatrix,
            itemRankMetaMap,
            criteriaRankMetaMap,
            rankedScoreMap
        } = ahpContext.run();

        expect(error).to.not.null;
        expect(error.type).to.equal(AHP.contextErrorType.NoItem);
        expect(error.getDescription()).to.equal('Missing comparison options information.');
        expect(rankingMatrix).to.null;
        expect(itemRankMetaMap).to.null;
        expect(criteriaRankMetaMap).to.null;
        expect(rankedScoreMap).to.null;
        done();
    });

    it("Test missing criteria", function (done) {
        var ahpContext = new AHP().import({
            items: ['VendorA', 'VendorB', 'VendorC'],
            criteria: [],
            criteriaItemRank: {
                price: [
                    [1, 1, 0.5],
                    [1, 1, 0.5],
                    [2, 2, 1]
                ],
                functionality: [
                    [1, 1, 5],
                    [1, 1, 5],
                    [0.2, 0.2, 1]
                ],
                UX: [
                    [1, 1, 10],
                    [1, 1, 10],
                    [0.1, 0.1, 1]
                ],
                support: [
                    [1, 0.2, 0.2],
                    [5, 1, 1],
                    [5, 1, 1]
                ]
            },
            criteriaRank: [
                [1, 3, 3, 2],
                [0.3333333333333333, 1, 1, 0.5],
                [0.3333333333333333, 1, 1, 0.5],
                [0.5, 2, 2, 1]
            ]
        });

        let {
            error,
            rankingMatrix,
            itemRankMetaMap,
            criteriaRankMetaMap,
            rankedScoreMap
        } = ahpContext.run();

        expect(error).to.not.null;
        expect(error.type).to.equal(AHP.contextErrorType.NoCriteria);
        expect(error.getDescription()).to.equal('Missing comparison criteria information.');
        expect(rankingMatrix).to.null;
        expect(itemRankMetaMap).to.null;
        expect(criteriaRankMetaMap).to.null;
        expect(rankedScoreMap).to.null;
        done();
    });

    it("Test missing criteria item rank", function (done) {
        var ahpContext = new AHP().import({
            items: ['VendorA', 'VendorB', 'VendorC'],
            criteria: ['price', 'functionality', 'UX', 'support'],
            criteriaItemRank: {
                price: [
                    [1, 1, 0.5],
                    [1, 1, 0.5],
                    [2, 2, 0]
                ],
                functionality: [
                    [1, 1, 5],
                    [1, 1, 5],
                    [0.2, 0.2, 1]
                ],
                UX: [
                    [1, 1, 10],
                    [1, 1, 10],
                    [0.1, 0.1, 1]
                ],
                support: [
                    [1, 0.2, 0.2],
                    [5, 1, 1],
                    [5, 1, 1]
                ]
            },
            criteriaRank: [
                [1, 3, 3, 2],
                [0.3333333333333333, 1, 1, 0.5],
                [0.3333333333333333, 1, 1, 0.5],
                [0.5, 2, 2, 1]
            ]
        });

        let {
            error,
            rankingMatrix,
            itemRankMetaMap,
            criteriaRankMetaMap,
            rankedScoreMap
        } = ahpContext.run();

        expect(error).to.not.null;
        expect(error.type).to.equal(AHP.contextErrorType.MissingCriteriaItemRank);
        expect(error.getDescription()).to.equal(`In terms of criterion "price", which option do you prefer more and what is the scale level do you prefer?
Option (A): "VendorC", Option (B): "VendorC"

Scale(1-9):
1: Equal importance
3: Somewhat more importance
5: Much more important
7: Very much more important
9: Absolutely more important
2,4,6,8: Intermediate values
`);
        expect(rankingMatrix).to.not.null;
        expect(itemRankMetaMap).to.not.null;
        expect(criteriaRankMetaMap).to.not.null;
        expect(rankedScoreMap).to.not.null;
        done();
    });

    it("Test missing criteria rank", function (done) {
        var ahpContext = new AHP().import({
            items: ['VendorA', 'VendorB', 'VendorC'],
            criteria: ['price', 'functionality', 'UX', 'support'],
            criteriaItemRank: {
                price: [
                    [1, 1, 0.5],
                    [1, 1, 0.5],
                    [2, 2, 1]
                ],
                functionality: [
                    [1, 1, 5],
                    [1, 1, 5],
                    [0.2, 0.2, 1]
                ],
                UX: [
                    [1, 1, 10],
                    [1, 1, 10],
                    [0.1, 0.1, 1]
                ],
                support: [
                    [1, 0.2, 0.2],
                    [5, 1, 1],
                    [5, 1, 1]
                ]
            },
            criteriaRank: [
                [1, 3, 3, 0],
                [0.3333333333333333, 1, 1, 0.5],
                [0.3333333333333333, 1, 1, 0.5],
                [0.5, 2, 2, 1]
            ]
        });

        let {
            error,
            rankingMatrix,
            itemRankMetaMap,
            criteriaRankMetaMap,
            rankedScoreMap
        } = ahpContext.run();

        expect(error).to.not.null;
        expect(error.type).to.equal(AHP.contextErrorType.MissingCriteriaRank);
        expect(error.getDescription()).to.equal(`Which critetion do you prefer more and what is the scale level do you prefer?
Option (A): "price", Option (B): "support"

Scale(1-9):
1: Equal importance
3: Somewhat more importance
5: Much more important
7: Very much more important
9: Absolutely more important
2,4,6,8: Intermediate values
`);
        expect(rankingMatrix).to.not.null;
        expect(itemRankMetaMap).to.not.null;
        expect(criteriaRankMetaMap).to.not.null;
        expect(rankedScoreMap).to.not.null;
        done();
    });

    it("Test criterion item rank CR > 0.1 (inconsistent)", function (done) {

        //test construct with context
        var ahpContext = new AHP({
            items: ['VendorA', 'VendorB', 'VendorC'],
            criteria: ['price', 'functionality', 'UX', 'support'],
            criteriaItemRank: {
                price: [
                    [1, 2, 4],
                    [0.5, 1, 0.5],
                    [0.25, 2, 1]
                ],
                functionality: [
                    [1, 1, 5],
                    [1, 1, 5],
                    [0.2, 0.2, 1]
                ],
                UX: [
                    [1, 1, 10],
                    [1, 1, 10],
                    [0.1, 0.1, 1]
                ],
                support: [
                    [1, 0.2, 0.2],
                    [5, 1, 1],
                    [5, 1, 1]
                ]
            },
            criteriaRank: [
                [1, 3, 3, 2],
                [0.3333333333333333, 1, 1, 0.5],
                [0.3333333333333333, 1, 1, 0.5],
                [0.5, 2, 2, 1]
            ]
        });

        let problem = ahpContext.findNextProblem();
        expect(problem).to.not.null;
        expect(problem.type).to.equal(AHP.contextErrorType.CriteriaItemRankInsufficientConsistencyRatio);
        expect(problem.getDescription()).to.equal('In terms of criterion "price", criteria item rank matrix consistency ratio > 0.1');

        let {
            error,
            rankingMatrix,
            itemRankMetaMap,
            criteriaRankMetaMap,
            rankedScoreMap
        } = ahpContext.run();

        expect(error).to.not.null;
        expect(error.type).to.equal(AHP.contextErrorType.CriteriaItemRankInsufficientConsistencyRatio);
        expect(error.getDescription()).to.equal('In terms of criterion "price", criteria item rank matrix consistency ratio > 0.1');

        done();
    });

    it("Test criterion rank CR > 0.1 (inconsistent)", function (done) {

        //test construct with context
        var ahpContext = new AHP({
            items: ['VendorA', 'VendorB', 'VendorC'],
            criteria: ['price', 'functionality', 'UX', 'support'],
            criteriaItemRank: {
                price: [
                    [1, 1, 1],
                    [1, 1, 1],
                    [1, 1, 1]
                ],
                functionality: [
                    [1, 1, 5],
                    [1, 1, 5],
                    [0.2, 0.2, 1]
                ],
                UX: [
                    [1, 1, 10],
                    [1, 1, 10],
                    [0.1, 0.1, 1]
                ],
                support: [
                    [1, 0.2, 0.2],
                    [5, 1, 1],
                    [5, 1, 1]
                ]
            },
            criteriaRank: [
                [1, 2, 4, 2],
                [0.5, 1, 0.5, 0.5],
                [0.25, 2, 1, 0.5],
                [0.5, 2, 2, 1]
            ]
        });

        let problem = ahpContext.findNextProblem();
        expect(problem.type).to.equal(AHP.contextErrorType.CriteriaRankInsufficientConsistencyRatio);
        expect(problem.getDescription()).to.equal('Criteria rank matrix consistency ratio > 0.1');

        let {
            error,
            rankingMatrix,
            itemRankMetaMap,
            criteriaRankMetaMap,
            rankedScoreMap
        } = ahpContext.run();
        expect(error).to.not.null;
        expect(error.type).to.equal(AHP.contextErrorType.CriteriaRankInsufficientConsistencyRatio);
        expect(error.getDescription()).to.equal('Criteria rank matrix consistency ratio > 0.1');

        done();
    });

    it("Test resetCriteriaItemRank", function (done) {
        var ahpContext = new AHP().import({
            items: ['VendorA', 'VendorB', 'VendorC'],
            criteria: ['price', 'functionality', 'UX', 'support'],
            criteriaItemRank: {
                price: [
                    [1, 1, 0.5],
                    [1, 1, 0.5],
                    [2, 2, 1]
                ],
                functionality: [
                    [1, 1, 5],
                    [1, 1, 5],
                    [0.2, 0.2, 1]
                ],
                UX: [
                    [1, 1, 10],
                    [1, 1, 10],
                    [0.1, 0.1, 1]
                ],
                support: [
                    [1, 0.2, 0.2],
                    [5, 1, 1],
                    [5, 1, 1]
                ]
            },
            criteriaRank: [
                [1, 3, 3, 0],
                [0.3333333333333333, 1, 1, 0.5],
                [0.3333333333333333, 1, 1, 0.5],
                [0.5, 2, 2, 1]
            ]
        });

        ahpContext.resetCriteriaItemRank(['price']);
        expect(ahpContext.criteriaItemRank['price'][0][0]).to.equal(1);
        expect(ahpContext.criteriaItemRank['price'][0][1]).to.equal(0);
        expect(ahpContext.criteriaItemRank['price'][0][2]).to.equal(0);
        expect(ahpContext.criteriaItemRank['price'][1][0]).to.equal(0);
        expect(ahpContext.criteriaItemRank['price'][1][1]).to.equal(1);
        expect(ahpContext.criteriaItemRank['price'][1][2]).to.equal(0);
        expect(ahpContext.criteriaItemRank['price'][2][0]).to.equal(0);
        expect(ahpContext.criteriaItemRank['price'][2][1]).to.equal(0);
        expect(ahpContext.criteriaItemRank['price'][2][2]).to.equal(1);
        done();
    });

    it("Test resetCriteriaRank", function (done) {
        var ahpContext = new AHP().import({
            items: ['VendorA', 'VendorB', 'VendorC'],
            criteria: ['price', 'functionality', 'UX', 'support'],
            criteriaItemRank: {
                price: [
                    [1, 1, 0.5],
                    [1, 1, 0.5],
                    [2, 2, 1]
                ],
                functionality: [
                    [1, 1, 5],
                    [1, 1, 5],
                    [0.2, 0.2, 1]
                ],
                UX: [
                    [1, 1, 10],
                    [1, 1, 10],
                    [0.1, 0.1, 1]
                ],
                support: [
                    [1, 0.2, 0.2],
                    [5, 1, 1],
                    [5, 1, 1]
                ]
            },
            criteriaRank: [
                [1, 3, 3, 0],
                [0.3333333333333333, 1, 1, 0.5],
                [0.3333333333333333, 1, 1, 0.5],
                [0.5, 2, 2, 1]
            ]
        });

        ahpContext.resetCriteriaRank();
        expect(ahpContext.criteriaRank[0][0]).to.equal(1);
        expect(ahpContext.criteriaRank[0][1]).to.equal(0);
        expect(ahpContext.criteriaRank[0][2]).to.equal(0);
        expect(ahpContext.criteriaRank[0][3]).to.equal(0);
        expect(ahpContext.criteriaRank[1][0]).to.equal(0);
        expect(ahpContext.criteriaRank[1][1]).to.equal(1);
        expect(ahpContext.criteriaRank[1][2]).to.equal(0);
        expect(ahpContext.criteriaRank[1][3]).to.equal(0);
        expect(ahpContext.criteriaRank[2][0]).to.equal(0);
        expect(ahpContext.criteriaRank[2][1]).to.equal(0);
        expect(ahpContext.criteriaRank[2][2]).to.equal(1);
        expect(ahpContext.criteriaRank[2][3]).to.equal(0);
        expect(ahpContext.criteriaRank[3][0]).to.equal(0);
        expect(ahpContext.criteriaRank[3][1]).to.equal(0);
        expect(ahpContext.criteriaRank[3][2]).to.equal(0);
        expect(ahpContext.criteriaRank[3][3]).to.equal(1);
        done();
    });

    it("Test setCriteriaItemRankByGivenScores", function (done) {
        var ahpContext = new AHP().import({
            items: ['Civic', 'Saturn', 'Escort', 'Miata'],
            criteria: ['Style', 'Reliability', 'Fuel Economy'],
            criteriaItemRank: {
                Style: [
                    [1, 1 / 4, 4, 1 / 6],
                    [4, 1, 4, 1 / 4],
                    [1 / 4, 1 / 4, 1, 1 / 5],
                    [6, 4, 5, 1]
                ],
                Reliability: [
                    [1, 2, 5, 1],
                    [1 / 2, 1, 3, 2],
                    [1 / 5, 1 / 3, 1, 1 / 4],
                    [1, 1 / 2, 4, 1]
                ],
                /*'Fuel Economy': [[1,34/27, 34/24, 34/28],
                [27/34,1,27/24, 27/28],
                [24/34,24/27,1,24/28],
                [28/34,28/27,28/24,1]]*/
            },
            criteriaRank: [
                [1, 1 / 2, 3],
                [2, 1, 4],
                [1 / 3, 1 / 4, 1]
            ]
        });

        ahpContext.setCriteriaItemRankByGivenScores('Fuel Economy', [34, 27, 24, 28]);
        let error = numeric.sum(
            numeric.sub(ahpContext.criteriaItemRank['Fuel Economy'], [
                [1, 34 / 27, 34 / 24, 34 / 28],
                [27 / 34, 1, 27 / 24, 27 / 28],
                [24 / 34, 24 / 27, 1, 24 / 28],
                [28 / 34, 28 / 27, 28 / 24, 1]
            ]));

        expect(error).to.equal(0);
        done();
    });

    it("Test setCriteriaRankByGivenScores", function (done) {
        var ahpContext = new AHP().import({
            items: ['Civic', 'Saturn', 'Escort', 'Miata'],
            criteria: ['Style', 'Reliability', 'Fuel Economy'],
            criteriaItemRank: {
                Style: [
                    [1, 1 / 4, 4, 1 / 6],
                    [4, 1, 4, 1 / 4],
                    [1 / 4, 1 / 4, 1, 1 / 5],
                    [6, 4, 5, 1]
                ],
                Reliability: [
                    [1, 2, 5, 1],
                    [1 / 2, 1, 3, 2],
                    [1 / 5, 1 / 3, 1, 1 / 4],
                    [1, 1 / 2, 4, 1]
                ],
                'Fuel Economy': [
                    [1, 34 / 27, 34 / 24, 34 / 28],
                    [27 / 34, 1, 27 / 24, 27 / 28],
                    [24 / 34, 24 / 27, 1, 24 / 28],
                    [28 / 34, 28 / 27, 28 / 24, 1]
                ]
            }
            /*criteriaRank:
            [[1, 1/2, 1/5],
            [2,1,2/5],
            [5,5/2,1]]*/
        });

        ahpContext.setCriteriaRankByGivenScores([1, 2, 5]);
        let error = numeric.sum(
            numeric.sub(ahpContext.criteriaRank, [
                [1, 1 / 2, 1 / 5],
                [2, 1, 2 / 5],
                [5, 5 / 2, 1]
            ]));

        expect(error).to.equal(0);
        done();
    });

    it("Test calculation ok", function (done) {
        var ahpContext = new AHP().import({
            items: ['x', 'y', 'z'],
            criteria: ['a', 'b'],
            criteriaItemRank: {
                a: [
                    [1, 1, 7],
                    [1, 1, 3],
                    [1 / 7, 1 / 3, 1]
                ],
                b: [
                    [1, 1 / 5, 1 / 2],
                    [5, 1, 5],
                    [2, 1 / 5, 1]
                ]
            },
            criteriaRank: [
                [1, 3],
                [1 / 3, 1]
            ]
        });

        let {
            error,
            rankingMatrix,
            itemRankMetaMap,
            criteriaRankMetaMap,
            rankedScoreMap
        } = ahpContext.run();

        expect(error).to.be.null;
        expect(rankingMatrix[0][0] - 0.51).lessThan(0.005);
        expect(rankingMatrix[0][1] - 0.11).lessThan(0.005);
        expect(rankingMatrix[1][0] - 0.39).lessThan(0.005);
        expect(rankingMatrix[1][1] - 0.70).lessThan(0.005);
        expect(rankingMatrix[2][0] - 0.10).lessThan(0.005);
        expect(rankingMatrix[2][1] - 0.18).lessThan(0.005);
        expect(itemRankMetaMap['a'].ci - 0.04).lessThan(0.005);
        expect(itemRankMetaMap['a'].cr - 0.07).lessThan(0.005);
        expect(itemRankMetaMap['b'].ci - 0.03).lessThan(0.005);
        expect(itemRankMetaMap['b'].cr - 0.05).lessThan(0.005);
        expect(criteriaRankMetaMap.weightedVector[0]).to.equal(0.75);
        expect(criteriaRankMetaMap.weightedVector[1]).to.equal(0.25);
        expect(rankedScoreMap['x'] - 0.41).lessThan(0.005);
        expect(rankedScoreMap['y'] - 0.47).lessThan(0.005);
        expect(rankedScoreMap['z'] - 0.12).lessThan(0.005);
        done();
    });

    it("Test printMatrixAsStr", function (done) {
        AHP.printMatrixAsStr()
        let output = AHP.printMatrixAsStr([
            [0, 1],
            [2, 3]
        ], ['a', 'b'], 5);
        let expectOutput =
            `-------------------
|     |    a|    b|
|-----|-----|-----|
|    a|0.000|1.000|
|    b|2.000|3.000|
-------------------
`;
        expect(output).to.equal(expectOutput);
        done();
    });

    it("Test print2DMatrixAsStr", function (done) {
        AHP.printMatrixAsStr()
        let output = AHP.print2DMatrixAsStr([
            [0, 1],
            [2, 3]
        ], ['a', 'b'], ['c', 'd'], 5);
        let expectOutput =
            `-------------------
|     |    a|    b|
|-----|-----|-----|
|    c|0.000|1.000|
|    d|2.000|3.000|
-------------------
`;
        expect(output).to.equal(expectOutput);
        done();
    });

    it("Test calculateMatrixConsistency", function (done) {
        let consistency = AHP.calculateMatrixConsistency([]);
        expect(consistency).to.eql({
            ci: null,
            ri: null,
            cr: null,
            weightedVector: null
        });

        consistency = AHP.calculateMatrixConsistency([
            [1, 3, 3, 2],
            [0.3333333333333333, 1, 1, 0.5],
            [0.3333333333333333, 1, 1, 0.5],
            [0.5, 2, 2, 1]
        ]);
        let expectValue = {
            ci: 0.005179468322369818,
            ri: 0.9,
            cr: 0.0057549648026331305,
            weightedVector: [
                0.45467032967032966,
                0.1411401098901099,
                0.1411401098901099,
                0.2630494505494505
            ]
        };

        expect(consistency).to.eql(expectValue);
        done();
    });

});