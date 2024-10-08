[**munkres**](../README.md) • **Docs**

***

[munkres](../globals.md) / genMatrix

# Function: genMatrix()

> **genMatrix**\<`T`\>(`rows`, `cols`, `callbackFn`): [`Matrix`](../type-aliases/Matrix.md)\<`T`\>

Constructs a matrix with given dimensions
using a provided callback function.

## Type Parameters

• **T**

## Parameters

• **rows**: `number`

The number of rows in the matrix.

• **cols**: `number`

The number of columns in the matrix.

• **callbackFn**

Given row and column indices, returns a value.

## Returns

[`Matrix`](../type-aliases/Matrix.md)\<`T`\>

A matrix where the values at position `[r][c]`
represent the value derived from row `r` and column `c`.

## Example

```typescript
// Define workers, jobs, and a simple cost function
const workers = ['Alice', 'Bob'];
const jobs = ['Job1', 'Job2'];
const costFn = (w: number, j: number) => workers[w].length + jobs[j].length;

// Create a cost matrix
const costs = createMatrix(workers.length, jobs.length, costFn);
// [
//   [9, 9], // ['Alice' + 'Job1', 'Alice' + 'Job2']
//   [7, 7]  // [  'Bob' + 'Job1',   'Bob' + 'Job2']
// ]
```

## Defined in

[helpers.ts:78](https://github.com/havelessbemore/munkres/blob/eaf56415da666c8098716c88966089276f8d68fc/src/helpers.ts#L78)
