import AHP from "../src/ahp.js";
import numeric from "numericjs";

describe("ahp-test", function () {
  test("Test base flow", function (done) {
    //test construct with context
    var ahpContext = new AHP({
      items: ["VendorA", "VendorB", "VendorC"],
      criteria: ["price", "functionality", "UX", "support"],
      criteriaItemRank: {
        price: [
          [1, 1, 0.5],
          [1, 1, 0.5],
          [2, 2, 1],
        ],
        functionality: [
          [1, 1, 5],
          [1, 1, 5],
          [0.2, 0.2, 1],
        ],
        UX: [
          [1, 1, 10],
          [1, 1, 10],
          [0.1, 0.1, 1],
        ],
        support: [
          [1, 0.2, 0.2],
          [5, 1, 1],
          [5, 1, 1],
        ],
      },
      criteriaRank: [
        [1, 3, 3, 2],
        [0.3333333333333333, 1, 1, 0.5],
        [0.3333333333333333, 1, 1, 0.5],
        [0.5, 2, 2, 1],
      ],
    });

    let {
      error,
      rankingMatrix,
      itemRankMetaMap,
      criteriaRankMetaMap,
      rankedScoreMap,
    } = ahpContext.run();
    expect(error).toBeNull();
    expect(rankingMatrix).not.toBeNull();
    expect(itemRankMetaMap).not.toBeNull();
    expect(criteriaRankMetaMap).not.toBeNull();
    expect(rankedScoreMap).not.toBeNull();

    done();
  });

  test("Test base flow with blank constructor", function (done) {
    //test blank constructor
    var ahpContext = new AHP();
    ahpContext.addItems(["a", "b"]);
    ahpContext.removeItems(["a", "b"]);
    ahpContext.removeItems(["a", "b"]);
    ahpContext.addItems(["VendorA", "VendorB", "VendorC"]);
    ahpContext.removeItems(["a", "b"]);
    ahpContext.removeCriteria(["p", "q"]);
    ahpContext.addCriteria(["p", "q"]);
    ahpContext.removeCriteria(["p", "q"]);
    ahpContext.removeCriteria(["p", "q"]);
    ahpContext.addCriteria(["price", "functionality", "UX", "support"]);
    ahpContext.addItem("VendorD");
    ahpContext.addCriterion("dummy");
    ahpContext.addItem("VendorE");
    ahpContext.addItem("VendorF");
    ahpContext.addCriterion("dummy2");
    ahpContext.removeItems(["VendorD"]);
    ahpContext.removeItem("VendorE");
    ahpContext.addItem("VendorE");
    ahpContext.addItem("VendorF");
    ahpContext.removeItems(["VendorE", "VendorF"]);
    ahpContext.addCriterion("dummy3");
    ahpContext.addCriterion("dummy3");
    ahpContext.removeCriterion("dummy");
    ahpContext.removeCriteria(["dummy2", "dummy3"]);

    ahpContext.rankCriteriaItem("typo criteria", [
      {
        preferredItem: "VendorB",
        comparingItem: "VendorC",
        scale: 1 / 2,
      },
      ["VendorA", "VendorC", 1 / 2],
      ["VendorA", "VendorB", 1],
    ]);

    ahpContext.rankCriteriaItem("price", [
      {
        preferredItem: "typo VendorB",
        comparingItem: "typo VendorC",
        scale: 1 / 2,
      },
      ["VendorA", "VendorC", 1 / 2],
      ["VendorA", "VendorB", 1],
    ]);

    ahpContext.rankCriteriaItem("price", [
      {
        preferredItem: "VendorB",
        comparingItem: "VendorC",
        scale: 1 / 2,
      },
      ["VendorA", "VendorC", 1 / 2],
      ["VendorA", "VendorB", 1],
    ]);
    ahpContext.rankCriteriaItem("functionality", [
      ["VendorB", "VendorC", 5],
      ["VendorA", "VendorC", 5],
      ["VendorA", "VendorB", 1],
    ]);
    ahpContext.rankCriteriaItem("UX", [
      ["VendorB", "VendorC", 10],
      ["VendorA", "VendorC", 10],
      ["VendorA", "VendorB", 1],
    ]);
    ahpContext.rankCriteriaItem("support", [
      ["VendorB", "VendorC", 1],
      ["VendorA", "VendorC", 1 / 5],
      ["VendorA", "VendorB", 1 / 5],
    ]);
    ahpContext.rankCriteria([
      {
        preferredCriterion: "price",
        comparingCriterion: "functionality",
        scale: 3,
      },
      ["typo price", "UX", 3],
      ["price", "UX", 3],
      ["price", "support", 2],
      ["functionality", "UX", 1],
      ["functionality", "support", 1 / 2],
      ["UX", "support", 1 / 2],
    ]);
    let {
      error,
      rankingMatrix,
      itemRankMetaMap,
      criteriaRankMetaMap,
      rankedScoreMap,
    } = ahpContext.run();
    expect(error).toBeNull();
    expect(rankingMatrix).not.toBeNull();
    expect(itemRankMetaMap).not.toBeNull();
    expect(criteriaRankMetaMap).not.toBeNull();
    expect(rankedScoreMap).not.toBeNull();

    done();
  });

  test("Test base flow with blank constructor 2", function (done) {
    //test blank constructor, adding information with different sequences
    var ahpContext = new AHP();
    ahpContext.addCriteria(["price", "functionality", "UX", "support"]);
    ahpContext.addItems(["VendorA", "VendorB", "VendorC"]);
    ahpContext.addCriterion("dummy");
    ahpContext.addItem("VendorD");
    ahpContext.removeCriteria(["dummy"]);
    ahpContext.removeItems(["VendorD"]);

    ahpContext.rankCriteria([
      {
        preferredCriterion: "price",
        comparingCriterion: "functionality",
        scale: 3,
      },
      ["price", "UX", 3],
      ["price", "support", 2],
      ["functionality", "UX", 1],
      ["functionality", "support", 1 / 2],
      ["UX", "support", 1 / 2],
    ]);

    ahpContext.rankCriteriaItem("UX", [
      ["VendorB", "VendorC", 10],
      ["VendorA", "VendorC", 10],
      ["VendorA", "VendorB", 1],
    ]);
    ahpContext.rankCriteriaItem("support", [
      ["VendorB", "VendorC", 1],
      ["VendorA", "VendorC", 1 / 5],
      ["VendorA", "VendorB", 1 / 5],
    ]);
    ahpContext.rankCriteriaItem("price", [
      {
        preferredItem: "VendorB",
        comparingItem: "VendorC",
        scale: 1 / 2,
      },
      ["VendorA", "VendorC", 1 / 2],
      ["VendorA", "VendorB", 1],
    ]);
    ahpContext.rankCriteriaItem("functionality", [
      ["VendorB", "VendorC", 5],
      ["VendorA", "VendorC", 5],
      ["VendorA", "VendorB", 1],
    ]);

    let {
      error,
      rankingMatrix,
      itemRankMetaMap,
      criteriaRankMetaMap,
      rankedScoreMap,
    } = ahpContext.run();
    expect(error).toBeNull();
    expect(rankingMatrix).not.toBeNull();
    expect(itemRankMetaMap).not.toBeNull();
    expect(criteriaRankMetaMap).not.toBeNull();
    expect(rankedScoreMap).not.toBeNull();

    done();
  });

  test("Test import", function (done) {
    var ahpContext = new AHP();
    ahpContext.import({
      items: ["VendorA", "VendorB", "VendorC"],
      criteria: ["price", "functionality", "UX", "support"],
      criteriaItemRank: {
        price: [
          [1, 1, 0.5],
          [1, 1, 0.5],
          [2, 2, 1],
        ],
        functionality: [
          [1, 1, 5],
          [1, 1, 5],
          [0.2, 0.2, 1],
        ],
        UX: [
          [1, 1, 10],
          [1, 1, 10],
          [0.1, 0.1, 1],
        ],
        support: [
          [1, 0.2, 0.2],
          [5, 1, 1],
          [5, 1, 1],
        ],
      },
      criteriaRank: [
        [1, 3, 3, 2],
        [0.3333333333333333, 1, 1, 0.5],
        [0.3333333333333333, 1, 1, 0.5],
        [0.5, 2, 2, 1],
      ],
    });

    let {
      error,
      rankingMatrix,
      itemRankMetaMap,
      criteriaRankMetaMap,
      rankedScoreMap,
    } = ahpContext.run();

    expect(error).toBeNull();
    expect(rankingMatrix).not.toBeNull();
    expect(itemRankMetaMap).not.toBeNull();
    expect(criteriaRankMetaMap).not.toBeNull();
    expect(rankedScoreMap).not.toBeNull();
    done();
  });

  test("Test import 2", function (done) {
    var ahpContext = new AHP();
    ahpContext.import({
      items: ["VendorA", "VendorB", "VendorC"],
      criteria: ["price", "functionality", "UX", "support"],
      criteriaItemRank: {
        price: [
          ["a", 1, 0.5],
          [1, 1, 0.5],
          [2, 2, 1],
        ],
        functionality: [
          [1, 1, 5],
          [1, 1, 5],
          [0.2, 0.2, 1],
        ],
        UX: [
          [1, 1, 10],
          [1, 1, 10],
          [0.1, 0.1, 1],
        ],
        support: [
          [1, 0.2, 0.2],
          [5, 1, 1],
          [5, 1, 1],
        ],
      },
      criteriaRank: [
        [1, "#", 3, 2],
        [0.3333333333333333, 1, 1, 0.5],
        [0.3333333333333333, 1, 1, 0.5],
        [0.5, 2, 2, 1],
      ],
    });

    expect(ahpContext).toEqual({
      items: ["VendorA", "VendorB", "VendorC"],
      criteria: ["price", "functionality", "UX", "support"],
      criteriaItemRank: {
        price: [
          [null, 1, 0.5],
          [1, 1, 0.5],
          [2, 2, 1],
        ],
        functionality: [
          [1, 1, 5],
          [1, 1, 5],
          [0.2, 0.2, 1],
        ],
        UX: [
          [1, 1, 10],
          [1, 1, 10],
          [0.1, 0.1, 1],
        ],
        support: [
          [1, 0.2, 0.2],
          [5, 1, 1],
          [5, 1, 1],
        ],
      },
      criteriaRank: [
        [1, null, 3, 2],
        [0.3333333333333333, 1, 1, 0.5],
        [0.3333333333333333, 1, 1, 0.5],
        [0.5, 2, 2, 1],
      ],
    });
    done();
  });

  test("Test import 3", function (done) {
    var ahpContext = new AHP();
    ahpContext.import({
      items: ["VendorA", "VendorB", "VendorC"],
      criteria: ["price", "functionality", "UX", "support"],
    });

    expect(ahpContext).toEqual({
      items: ["VendorA", "VendorB", "VendorC"],
      criteria: ["price", "functionality", "UX", "support"],
      criteriaItemRank: {
        price: [
          [1, 0, 0],
          [0, 1, 0],
          [0, 0, 1],
        ],
        functionality: [
          [1, 0, 0],
          [0, 1, 0],
          [0, 0, 1],
        ],
        UX: [
          [1, 0, 0],
          [0, 1, 0],
          [0, 0, 1],
        ],
        support: [
          [1, 0, 0],
          [0, 1, 0],
          [0, 0, 1],
        ],
      },
      criteriaRank: [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1],
      ],
    });

    done();
  });

  test("Test export", function (done) {
    var ahpContext = new AHP();

    var importContent = {
      items: ["VendorA", "VendorB", "VendorC"],
      criteria: ["price", "functionality", "UX", "support"],
      criteriaItemRank: {
        price: [
          [1, 1, 0.5],
          [1, 1, 0.5],
          [2, 2, 1],
        ],
        functionality: [
          [1, 1, 5],
          [1, 1, 5],
          [0.2, 0.2, 1],
        ],
        UX: [
          [1, 1, 10],
          [1, 1, 10],
          [0.1, 0.1, 1],
        ],
        support: [
          [1, 0.2, 0.2],
          [5, 1, 1],
          [5, 1, 1],
        ],
      },
      criteriaRank: [
        [1, 3, 3, 2],
        [0.3333333333333333, 1, 1, 0.5],
        [0.3333333333333333, 1, 1, 0.5],
        [0.5, 2, 2, 1],
      ],
    };
    var exported = ahpContext.import(importContent).export();
    expect(exported).toEqual(importContent);
    done();
  });

  test("Test missing item", function (done) {
    var ahpContext = new AHP().import({
      items: [],
      criteria: ["price", "functionality", "UX", "support"],
      criteriaItemRank: {
        price: [
          [1, 1, 0.5],
          [1, 1, 0.5],
          [2, 2, 1],
        ],
        functionality: [
          [1, 1, 5],
          [1, 1, 5],
          [0.2, 0.2, 1],
        ],
        UX: [
          [1, 1, 10],
          [1, 1, 10],
          [0.1, 0.1, 1],
        ],
        support: [
          [1, 0.2, 0.2],
          [5, 1, 1],
          [5, 1, 1],
        ],
      },
      criteriaRank: [
        [1, 3, 3, 2],
        [0.3333333333333333, 1, 1, 0.5],
        [0.3333333333333333, 1, 1, 0.5],
        [0.5, 2, 2, 1],
      ],
    });

    let {
      error,
      rankingMatrix,
      itemRankMetaMap,
      criteriaRankMetaMap,
      rankedScoreMap,
    } = ahpContext.run();

    expect(error).not.toBeNull();
    expect(error.type).toEqual(AHP.contextErrorType.NoItem);
    expect(error.getDescription()).toEqual(
      "Missing comparison options information."
    );
    expect(rankingMatrix).toBeNull();
    expect(itemRankMetaMap).toBeNull();
    expect(criteriaRankMetaMap).toBeNull();
    expect(rankedScoreMap).toBeNull();
    done();
  });

  test("Test missing criteria", function (done) {
    var ahpContext = new AHP().import({
      items: ["VendorA", "VendorB", "VendorC"],
      criteria: [],
      criteriaItemRank: {
        price: [
          [1, 1, 0.5],
          [1, 1, 0.5],
          [2, 2, 1],
        ],
        functionality: [
          [1, 1, 5],
          [1, 1, 5],
          [0.2, 0.2, 1],
        ],
        UX: [
          [1, 1, 10],
          [1, 1, 10],
          [0.1, 0.1, 1],
        ],
        support: [
          [1, 0.2, 0.2],
          [5, 1, 1],
          [5, 1, 1],
        ],
      },
      criteriaRank: [
        [1, 3, 3, 2],
        [0.3333333333333333, 1, 1, 0.5],
        [0.3333333333333333, 1, 1, 0.5],
        [0.5, 2, 2, 1],
      ],
    });

    let {
      error,
      rankingMatrix,
      itemRankMetaMap,
      criteriaRankMetaMap,
      rankedScoreMap,
    } = ahpContext.run();

    expect(error).not.toBeNull();
    expect(error.type).toEqual(AHP.contextErrorType.NoCriteria);
    expect(error.getDescription()).toEqual(
      "Missing comparison criteria information."
    );
    expect(rankingMatrix).toBeNull();
    expect(itemRankMetaMap).toBeNull();
    expect(criteriaRankMetaMap).toBeNull();
    expect(rankedScoreMap).toBeNull();
    done();
  });

  test("Test missing criteria item rank", function (done) {
    var ahpContext = new AHP().import({
      items: ["VendorA", "VendorB", "VendorC"],
      criteria: ["price", "functionality", "UX", "support"],
      criteriaItemRank: {
        price: [
          [1, 1, 0.5],
          [1, 1, 0.5],
          [2, 2, 0],
        ],
        functionality: [
          [1, 1, 5],
          [1, 1, 5],
          [0.2, 0.2, 1],
        ],
        UX: [
          [1, 1, 10],
          [1, 1, 10],
          [0.1, 0.1, 1],
        ],
        support: [
          [1, 0.2, 0.2],
          [5, 1, 1],
          [5, 1, 1],
        ],
      },
      criteriaRank: [
        [1, 3, 3, 2],
        [0.3333333333333333, 1, 1, 0.5],
        [0.3333333333333333, 1, 1, 0.5],
        [0.5, 2, 2, 1],
      ],
    });

    let {
      error,
      rankingMatrix,
      itemRankMetaMap,
      criteriaRankMetaMap,
      rankedScoreMap,
    } = ahpContext.run();

    expect(error).not.toBeNull();
    expect(error.type).toEqual(AHP.contextErrorType.MissingCriteriaItemRank);
    expect(error.getDescription())
      .toEqual(`In terms of criterion "price", which option do you prefer more and what is the scale level do you prefer?
Option (A): "VendorC", Option (B): "VendorC"

Scale(1-9):
1: Equal importance
3: Somewhat more importance
5: Much more important
7: Very much more important
9: Absolutely more important
2,4,6,8: Intermediate values
`);
    expect(rankingMatrix).not.toBeNull();
    expect(itemRankMetaMap).not.toBeNull();
    expect(criteriaRankMetaMap).not.toBeNull();
    expect(rankedScoreMap).not.toBeNull();
    done();
  });

  test("Test missing criteria rank", function (done) {
    var ahpContext = new AHP().import({
      items: ["VendorA", "VendorB", "VendorC"],
      criteria: ["price", "functionality", "UX", "support"],
      criteriaItemRank: {
        price: [
          [1, 1, 0.5],
          [1, 1, 0.5],
          [2, 2, 1],
        ],
        functionality: [
          [1, 1, 5],
          [1, 1, 5],
          [0.2, 0.2, 1],
        ],
        UX: [
          [1, 1, 10],
          [1, 1, 10],
          [0.1, 0.1, 1],
        ],
        support: [
          [1, 0.2, 0.2],
          [5, 1, 1],
          [5, 1, 1],
        ],
      },
      criteriaRank: [
        [1, 3, 3, 0],
        [0.3333333333333333, 1, 1, 0.5],
        [0.3333333333333333, 1, 1, 0.5],
        [0.5, 2, 2, 1],
      ],
    });

    let {
      error,
      rankingMatrix,
      itemRankMetaMap,
      criteriaRankMetaMap,
      rankedScoreMap,
    } = ahpContext.run();

    expect(error).not.toBeNull();
    expect(error.type).toEqual(AHP.contextErrorType.MissingCriteriaRank);
    expect(error.getDescription())
      .toEqual(`Which critetion do you prefer more and what is the scale level do you prefer?
Option (A): "price", Option (B): "support"

Scale(1-9):
1: Equal importance
3: Somewhat more importance
5: Much more important
7: Very much more important
9: Absolutely more important
2,4,6,8: Intermediate values
`);
    expect(rankingMatrix).not.toBeNull();
    expect(itemRankMetaMap).not.toBeNull();
    expect(criteriaRankMetaMap).not.toBeNull();
    expect(rankedScoreMap).not.toBeNull();
    done();
  });

  test("Test criterion item rank CR > 0.1 (inconsistent)", function (done) {
    //test construct with context
    var ahpContext = new AHP({
      items: ["VendorA", "VendorB", "VendorC"],
      criteria: ["price", "functionality", "UX", "support"],
      criteriaItemRank: {
        price: [
          [1, 2, 4],
          [0.5, 1, 0.5],
          [0.25, 2, 1],
        ],
        functionality: [
          [1, 1, 5],
          [1, 1, 5],
          [0.2, 0.2, 1],
        ],
        UX: [
          [1, 1, 10],
          [1, 1, 10],
          [0.1, 0.1, 1],
        ],
        support: [
          [1, 0.2, 0.2],
          [5, 1, 1],
          [5, 1, 1],
        ],
      },
      criteriaRank: [
        [1, 3, 3, 2],
        [0.3333333333333333, 1, 1, 0.5],
        [0.3333333333333333, 1, 1, 0.5],
        [0.5, 2, 2, 1],
      ],
    });

    let problem = ahpContext.findNextProblem();
    expect(problem).not.toBeNull();
    expect(problem.type).toEqual(
      AHP.contextErrorType.CriteriaItemRankInsufficientConsistencyRatio
    );
    expect(problem.getDescription()).toEqual(
      'In terms of criterion "price", criteria item rank matrix consistency ratio > 0.1'
    );

    let {
      error,
      rankingMatrix,
      itemRankMetaMap,
      criteriaRankMetaMap,
      rankedScoreMap,
    } = ahpContext.run();

    expect(error).not.toBeNull();
    expect(error.type).toEqual(
      AHP.contextErrorType.CriteriaItemRankInsufficientConsistencyRatio
    );
    expect(error.getDescription()).toEqual(
      'In terms of criterion "price", criteria item rank matrix consistency ratio > 0.1'
    );

    done();
  });

  test("Test criterion rank CR > 0.1 (inconsistent)", function (done) {
    //test construct with context
    var ahpContext = new AHP({
      items: ["VendorA", "VendorB", "VendorC"],
      criteria: ["price", "functionality", "UX", "support"],
      criteriaItemRank: {
        price: [
          [1, 1, 1],
          [1, 1, 1],
          [1, 1, 1],
        ],
        functionality: [
          [1, 1, 5],
          [1, 1, 5],
          [0.2, 0.2, 1],
        ],
        UX: [
          [1, 1, 10],
          [1, 1, 10],
          [0.1, 0.1, 1],
        ],
        support: [
          [1, 0.2, 0.2],
          [5, 1, 1],
          [5, 1, 1],
        ],
      },
      criteriaRank: [
        [1, 2, 1, 1],
        [1, 1, 1, 1],
        [2, 1, 1, 1],
        [2, 2, 2, 1],
      ],
    });

    let problem = ahpContext.findNextProblem();
    expect(problem.type).toEqual(
      AHP.contextErrorType.CriteriaRankInsufficientConsistencyRatio
    );
    expect(problem.getDescription()).toEqual(
      "Criteria rank matrix consistency ratio > 0.1"
    );

    let {
      error,
      rankingMatrix,
      itemRankMetaMap,
      criteriaRankMetaMap,
      rankedScoreMap,
    } = ahpContext.run();
    expect(error).not.toBeNull();
    expect(error.type).toEqual(
      AHP.contextErrorType.CriteriaRankInsufficientConsistencyRatio
    );
    expect(error.getDescription()).toEqual(
      "Criteria rank matrix consistency ratio > 0.1"
    );

    done();
  });

  test("Test resetCriteriaItemRank", function (done) {
    var ahpContext = new AHP().import({
      items: ["VendorA", "VendorB", "VendorC"],
      criteria: ["price", "functionality", "UX", "support"],
      criteriaItemRank: {
        price: [
          [1, 1, 0.5],
          [1, 1, 0.5],
          [2, 2, 1],
        ],
        functionality: [
          [1, 1, 5],
          [1, 1, 5],
          [0.2, 0.2, 1],
        ],
        UX: [
          [1, 1, 10],
          [1, 1, 10],
          [0.1, 0.1, 1],
        ],
        support: [
          [1, 0.2, 0.2],
          [5, 1, 1],
          [5, 1, 1],
        ],
      },
      criteriaRank: [
        [1, 3, 3, 0],
        [0.3333333333333333, 1, 1, 0.5],
        [0.3333333333333333, 1, 1, 0.5],
        [0.5, 2, 2, 1],
      ],
    });

    ahpContext.resetCriteriaItemRank(["price"]);
    expect(ahpContext.criteriaItemRank["price"][0][0]).toEqual(1);
    expect(ahpContext.criteriaItemRank["price"][0][1]).toEqual(0);
    expect(ahpContext.criteriaItemRank["price"][0][2]).toEqual(0);
    expect(ahpContext.criteriaItemRank["price"][1][0]).toEqual(0);
    expect(ahpContext.criteriaItemRank["price"][1][1]).toEqual(1);
    expect(ahpContext.criteriaItemRank["price"][1][2]).toEqual(0);
    expect(ahpContext.criteriaItemRank["price"][2][0]).toEqual(0);
    expect(ahpContext.criteriaItemRank["price"][2][1]).toEqual(0);
    expect(ahpContext.criteriaItemRank["price"][2][2]).toEqual(1);
    done();
  });

  test("Test resetCriteriaRank", function (done) {
    var ahpContext = new AHP().import({
      items: ["VendorA", "VendorB", "VendorC"],
      criteria: ["price", "functionality", "UX", "support"],
      criteriaItemRank: {
        price: [
          [1, 1, 0.5],
          [1, 1, 0.5],
          [2, 2, 1],
        ],
        functionality: [
          [1, 1, 5],
          [1, 1, 5],
          [0.2, 0.2, 1],
        ],
        UX: [
          [1, 1, 10],
          [1, 1, 10],
          [0.1, 0.1, 1],
        ],
        support: [
          [1, 0.2, 0.2],
          [5, 1, 1],
          [5, 1, 1],
        ],
      },
      criteriaRank: [
        [1, 3, 3, 0],
        [0.3333333333333333, 1, 1, 0.5],
        [0.3333333333333333, 1, 1, 0.5],
        [0.5, 2, 2, 1],
      ],
    });

    ahpContext.resetCriteriaRank();
    expect(ahpContext.criteriaRank[0][0]).toEqual(1);
    expect(ahpContext.criteriaRank[0][1]).toEqual(0);
    expect(ahpContext.criteriaRank[0][2]).toEqual(0);
    expect(ahpContext.criteriaRank[0][3]).toEqual(0);
    expect(ahpContext.criteriaRank[1][0]).toEqual(0);
    expect(ahpContext.criteriaRank[1][1]).toEqual(1);
    expect(ahpContext.criteriaRank[1][2]).toEqual(0);
    expect(ahpContext.criteriaRank[1][3]).toEqual(0);
    expect(ahpContext.criteriaRank[2][0]).toEqual(0);
    expect(ahpContext.criteriaRank[2][1]).toEqual(0);
    expect(ahpContext.criteriaRank[2][2]).toEqual(1);
    expect(ahpContext.criteriaRank[2][3]).toEqual(0);
    expect(ahpContext.criteriaRank[3][0]).toEqual(0);
    expect(ahpContext.criteriaRank[3][1]).toEqual(0);
    expect(ahpContext.criteriaRank[3][2]).toEqual(0);
    expect(ahpContext.criteriaRank[3][3]).toEqual(1);
    done();
  });

  test("Test setCriteriaItemRankByGivenScores", function (done) {
    var ahpContext = new AHP().import({
      items: ["Civic", "Saturn", "Escort", "Miata"],
      criteria: ["Style", "Reliability", "Fuel Economy"],
      criteriaItemRank: {
        Style: [
          [1, 1 / 4, 4, 1 / 6],
          [4, 1, 4, 1 / 4],
          [1 / 4, 1 / 4, 1, 1 / 5],
          [6, 4, 5, 1],
        ],
        Reliability: [
          [1, 2, 5, 1],
          [1 / 2, 1, 3, 2],
          [1 / 5, 1 / 3, 1, 1 / 4],
          [1, 1 / 2, 4, 1],
        ],
        /*'Fuel Economy': [[1,34/27, 34/24, 34/28],
                [27/34,1,27/24, 27/28],
                [24/34,24/27,1,24/28],
                [28/34,28/27,28/24,1]]*/
      },
      criteriaRank: [
        [1, 1 / 2, 3],
        [2, 1, 4],
        [1 / 3, 1 / 4, 1],
      ],
    });

    ahpContext.setCriteriaItemRankByGivenScores(
      "Fuel Economy",
      [34, 27, 24, 28]
    );
    let error = numeric.sum(
      numeric.sub(ahpContext.criteriaItemRank["Fuel Economy"], [
        [1, 34 / 27, 34 / 24, 34 / 28],
        [27 / 34, 1, 27 / 24, 27 / 28],
        [24 / 34, 24 / 27, 1, 24 / 28],
        [28 / 34, 28 / 27, 28 / 24, 1],
      ])
    );

    expect(error).toEqual(0);
    done();
  });

  test("Test setCriteriaRankByGivenScores", function (done) {
    var ahpContext = new AHP().import({
      items: ["Civic", "Saturn", "Escort", "Miata"],
      criteria: ["Style", "Reliability", "Fuel Economy"],
      criteriaItemRank: {
        Style: [
          [1, 1 / 4, 4, 1 / 6],
          [4, 1, 4, 1 / 4],
          [1 / 4, 1 / 4, 1, 1 / 5],
          [6, 4, 5, 1],
        ],
        Reliability: [
          [1, 2, 5, 1],
          [1 / 2, 1, 3, 2],
          [1 / 5, 1 / 3, 1, 1 / 4],
          [1, 1 / 2, 4, 1],
        ],
        "Fuel Economy": [
          [1, 34 / 27, 34 / 24, 34 / 28],
          [27 / 34, 1, 27 / 24, 27 / 28],
          [24 / 34, 24 / 27, 1, 24 / 28],
          [28 / 34, 28 / 27, 28 / 24, 1],
        ],
      },
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
        [5, 5 / 2, 1],
      ])
    );

    expect(error).toEqual(0);
    done();
  });

  test("Test calculation ok", function (done) {
    var ahpContext = new AHP().import({
      items: ["x", "y", "z"],
      criteria: ["a", "b"],
      criteriaItemRank: {
        a: [
          [1, 1, 7],
          [1, 1, 3],
          [1 / 7, 1 / 3, 1],
        ],
        b: [
          [1, 1 / 5, 1 / 2],
          [5, 1, 5],
          [2, 1 / 5, 1],
        ],
      },
      criteriaRank: [
        [1, 3],
        [1 / 3, 1],
      ],
    });

    let {
      error,
      rankingMatrix,
      itemRankMetaMap,
      criteriaRankMetaMap,
      rankedScoreMap,
    } = ahpContext.run();

    expect(error).toBeNull();
    expect(rankingMatrix[0][0] - 0.51).toBeLessThan(0.005);
    expect(rankingMatrix[0][1] - 0.11).toBeLessThan(0.005);
    expect(rankingMatrix[1][0] - 0.39).toBeLessThan(0.005);
    expect(rankingMatrix[1][1] - 0.7).toBeLessThan(0.005);
    expect(rankingMatrix[2][0] - 0.1).toBeLessThan(0.005);
    expect(rankingMatrix[2][1] - 0.18).toBeLessThan(0.005);
    expect(itemRankMetaMap["a"].ci - 0.04).toBeLessThan(0.005);
    expect(itemRankMetaMap["a"].cr - 0.07).toBeLessThan(0.005);
    expect(itemRankMetaMap["b"].ci - 0.03).toBeLessThan(0.005);
    expect(itemRankMetaMap["b"].cr - 0.05).toBeLessThan(0.005);
    expect(criteriaRankMetaMap.weightedVector[0]).toEqual(0.75);
    expect(criteriaRankMetaMap.weightedVector[1]).toEqual(0.25);
    expect(rankedScoreMap["x"] - 0.41).toBeLessThan(0.005);
    expect(rankedScoreMap["y"] - 0.47).toBeLessThan(0.005);
    expect(rankedScoreMap["z"] - 0.12).toBeLessThan(0.005);
    done();
  });

  test("Test printMatrixAsStr", function (done) {
    AHP.printMatrixAsStr();
    let output = AHP.printMatrixAsStr(
      [
        [0, 1],
        [2, 3],
      ],
      ["a", "b"],
      5
    );
    let expectOutput = `-------------------
|     |    a|    b|
|-----|-----|-----|
|    a|0.000|1.000|
|    b|2.000|3.000|
-------------------
`;
    expect(output).toEqual(expectOutput);
    done();
  });

  test("Test print2DMatrixAsStr", function (done) {
    AHP.printMatrixAsStr();
    let output = AHP.print2DMatrixAsStr(
      [
        [0, 1],
        [2, 3],
      ],
      ["a", "b"],
      ["c", "d"],
      5
    );
    let expectOutput = `-------------------
|     |    a|    b|
|-----|-----|-----|
|    c|0.000|1.000|
|    d|2.000|3.000|
-------------------
`;
    expect(output).toEqual(expectOutput);
    done();
  });

  test("Test calculateMatrixConsistency", function (done) {
    let consistency = AHP.calculateMatrixConsistency([]);
    expect(consistency).toEqual({
      ci: null,
      ri: null,
      cr: null,
      weightedVector: null,
    });

    consistency = AHP.calculateMatrixConsistency([
      [1, 3, 3, 2],
      [0.3333333333333333, 1, 1, 0.5],
      [0.3333333333333333, 1, 1, 0.5],
      [0.5, 2, 2, 1],
    ]);
    let expectValue = {
      ci: 0.0034529788815798788,
      ri: 0.9,
      cr: 0.003836643201755421,
      weightedVector: [
        0.45467032967032966, 0.1411401098901099, 0.1411401098901099,
        0.2630494505494505,
      ],
    };

    expect(consistency).toEqual(expectValue);
    done();
  });
});
