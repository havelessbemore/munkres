[**munkres**](../README.md) • **Docs**

***

[munkres](../globals.md) / createMatrix

# Function: createMatrix()

> **createMatrix**\<`R`, `C`, `T`\>(`rows`, `cols`, `callbackFn`): [`Matrix`](../type-aliases/Matrix.md)\<`T`\>

Constructs a matrix from a set of row
and column objects using a provided callback function.

## Type parameters

• **R**

• **C**

• **T**

## Parameters

• **rows**: `ArrayLike`\<`R`\>

An array of row objects (such as workers).

• **cols**: `ArrayLike`\<`C`\>

An array of column objects (such as jobs).

• **callbackFn**

Given a row and a column, returns a value.

## Returns

[`Matrix`](../type-aliases/Matrix.md)\<`T`\>

A matrix where the values at position `[r][c]`
represent the value derived from row `r` and column `c`.

## Example

```typescript
// Define workers, jobs, and a simple cost function
const workers = ['Alice', 'Bob'];
const jobs = ['Job1', 'Job2'];
const costFn = (worker: string, job: string) => worker.length + job.length;

// Create a cost matrix
const costs = createMatrix(workers, jobs, costFn);
// [
//   [9, 9], // ['Alice' + 'Job1', 'Alice' + 'Job2']
//   [7, 7]  // [  'Bob' + 'Job1',   'Bob' + 'Job2']
// ]
```

## Source

[helpers.ts:44](https://github.com/havelessbemore/munkres/blob/5ace585f0cdcff36ea78e3571791e71f76cf4bc5/src/helpers.ts#L44)
