'use strict';
const AHP = require('./../../ahp');

module.exports = AHP;

/*
var ahpContext = new AHP();
ahpContext.addItems(['tom', 'dick', 'harry']);
ahpContext.addCriteria(['experience', 'education', 'charisma', 'age']);

ahpContext.rankCriteriaItem('experience', [{
        preferredItem: 'dick',
        comparingItem: 'tom',
        scale: 4
    },
    {
        preferredItem: 'tom',
        comparingItem: 'harry',
        scale: 4
    },
    {
        preferredItem: 'dick',
        comparingItem: 'harry',
        scale: 9
    }
]);
ahpContext.rankCriteriaItem('education', [{
        preferredItem: 'tom',
        comparingItem: 'dick',
        scale: 3
    },
    {
        preferredItem: 'harry',
        comparingItem: 'tom',
        scale: 5
    },
    {
        preferredItem: 'harry',
        comparingItem: 'dick',
        scale: 7
    }
]);
ahpContext.rankCriteriaItem('charisma', [{
        preferredItem: 'tom',
        comparingItem: 'dick',
        scale: 5
    },
    {
        preferredItem: 'tom',
        comparingItem: 'harry',
        scale: 9
    },
    {
        preferredItem: 'dick',
        comparingItem: 'harry',
        scale: 4
    }
]);
ahpContext.rankCriteriaItem('age', [{
        preferredItem: 'dick',
        comparingItem: 'tom',
        scale: 3
    },
    {
        preferredItem: 'tom',
        comparingItem: 'harry',
        scale: 5
    },
    {
        preferredItem: 'dick',
        comparingItem: 'harry',
        scale: 9
    }
]);
ahpContext.rankCriteria(
    [{
            preferredCriterion: 'experience',
            comparingCriterion: 'education',
            scale: 4
        },
        {
            preferredCriterion: 'experience',
            comparingCriterion: 'charisma',
            scale: 3
        },
        {
            preferredCriterion: 'experience',
            comparingCriterion: 'age',
            scale: 7
        },
        {
            preferredCriterion: 'charisma',
            comparingCriterion: 'education',
            scale: 3
        },
        {
            preferredCriterion: 'education',
            comparingCriterion: 'age',
            scale: 3
        },
        {
            preferredCriterion: 'charisma',
            comparingCriterion: 'age',
            scale: 5
        }
    ]
);
let output = ahpContext.debug();
console.log(output.log);*/

'use strict';
//const AHP = require('ahp');
var ahpContext = new AHP();
ahpContext.import({
    items: ['tom', 'dick', 'harry'],
    criteria: ['experience', 'education', 'charisma', 'age'],
    criteriaItemRank: {
        experience: [
            [1, 1/4, 4],
            [4, 1, 9],
            [1/4, 1/9, 1]
        ],
        education: [
            [1, 3, 1/5],
            [1/3, 1, 1/7],
            [5, 7, 1]
        ],
        charisma: [
            [1, 5, 9],
            [1/5, 1, 4],
            [1/9, 1/4, 1]
        ],
        age: [
            [1, 1/3, 5],
            [3, 1, 9],
            [1/5, 1/9, 1]
        ]
    },
    criteriaRank: [
        [1, 4, 3, 7],
        [1/4, 1, 1/3, 3],
        [1/3, 3, 1, 5],
        [1/7, 1/3, 1/5, 1]
    ]
});
let output = ahpContext.debug();
console.log(output.log);