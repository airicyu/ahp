'use strict';
const AHP = require('./../../ahp');

module.exports = AHP;

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
console.log(output.log);