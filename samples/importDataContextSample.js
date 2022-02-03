import AHP from "ahp";

const ahpContext = new AHP();

ahpContext.import({
  items: ["VendorA", "VendorB", "VendorC"],
  criteria: ["price", "functionality", "UX"],
  criteriaItemRank: {
    price: [
      [1, 1, 0.5],
      [1, 1, 0.5],
      [2, 2, 1],
    ],
    functionality: [
      [1, 5, 5],
      [0.2, 1, 1],
      [0.2, 1, 1],
    ],
    UX: [
      [1, 1, 10],
      [1, 1, 10],
      [0.1, 0.1, 1],
    ],
  },
  criteriaRank: [
    [1, 3, 3],
    [0.3333333333333333, 1, 1],
    [0.3333333333333333, 1, 1],
  ],
});

const output = ahpContext.run();
console.log(output);
