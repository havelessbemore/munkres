import { munkres } from "munkres";

// Create a cost matrix. Cell [y, x] is the cost
// of assigning the y-th worker to the x-th job.
const costMatrix = [
  [1, 2, 3],
  [2, 4, 6],
  [3, 6, 9],
];

// Find a set of optimal assignments pairs (y, x).
const assignments = munkres(costMatrix);

console.log(assignments);
// Output: [[0, 2], [1, 1], [2, 0]]
