[munkres](README.md) / Exports

# munkres

## Table of contents

### Type Aliases

- [CostFn](modules.md#costfn)
- [CostMatrix](modules.md#costmatrix)
- [Matrix](modules.md#matrix)

### Functions

- [createCostMatrix](modules.md#createcostmatrix)
- [getMaxCost](modules.md#getmaxcost)
- [getMinCost](modules.md#getmincost)
- [invertCostMatrix](modules.md#invertcostmatrix)
- [munkres](modules.md#munkres)
- [negateCostMatrix](modules.md#negatecostmatrix)

## Type Aliases

### CostFn

Ƭ **CostFn**\<`A`, `B`\>: (`a`: `A`, `b`: `B`) => `number`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `A` | `A` |
| `B` | `A` |

#### Type declaration

▸ (`a`, `b`): `number`

##### Parameters

| Name | Type |
| :------ | :------ |
| `a` | `A` |
| `b` | `B` |

##### Returns

`number`

#### Defined in

[types/costFn.d.ts:1](https://github.com/havelessbemore/munkres/blob/e84c80e/src/types/costFn.d.ts#L1)

___

### CostMatrix

Ƭ **CostMatrix**: [`Matrix`](modules.md#matrix)\<`number`\>

#### Defined in

[types/costMatrix.d.ts:3](https://github.com/havelessbemore/munkres/blob/e84c80e/src/types/costMatrix.d.ts#L3)

___

### Matrix

Ƭ **Matrix**\<`T`\>: `T`[][]

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[types/matrix.d.ts:1](https://github.com/havelessbemore/munkres/blob/e84c80e/src/types/matrix.d.ts#L1)

## Functions

### createCostMatrix

▸ **createCostMatrix**\<`W`, `J`\>(`workers`, `jobs`, `costFn`): [`CostMatrix`](modules.md#costmatrix)

Constructs a cost matrix for a set of
workers and jobs using a provided cost function.

Each element of the matrix represents the cost associated with assigning a
specific worker to a specific job. The cost is determined by `costFn`,
which computes the cost based on a worker-job pair.

#### Type parameters

| Name |
| :------ |
| `W` |
| `J` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `workers` | `W`[] | An array of workers. |
| `jobs` | `J`[] | An array of jobs. |
| `costFn` | [`CostFn`](modules.md#costfn)\<`W`, `J`\> | Given a worker and a job, returns the numeric cost of assigning that worker to that job. |

#### Returns

[`CostMatrix`](modules.md#costmatrix)

A [CostMatrix](modules.md#costmatrix) where the values at position `[y][x]`
represent the cost of assigning the `y`-th worker to the `x`-th job.

**`Example`**

```ts
// Define workers, jobs, and a simple cost function
const workers = ['Alice', 'Bob'];
const jobs = ['Job1', 'Job2'];
const costFn = (worker: string, job: string) => worker.length + job.length;

// Create the cost matrix
const matrix = createCostMatrix(workers, jobs, costFn);
// [
//   [9, 9], // ['Alice' + 'Job1', 'Alice' + 'Job2']
//   [7, 7]  // [  'Bob' + 'Job1',   'Bob' + 'Job2']
// ]
```

#### Defined in

[utils/costMatrix.ts:35](https://github.com/havelessbemore/munkres/blob/e84c80e/src/utils/costMatrix.ts#L35)

___

### getMaxCost

▸ **getMaxCost**(`costMatrix`): `number` \| `undefined`

Finds the maximum value in a given cost matrix.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `costMatrix` | [`CostMatrix`](modules.md#costmatrix) | The cost matrix. |

#### Returns

`number` \| `undefined`

The maximum value, or `undefined` if the matrix is empty.

#### Defined in

[utils/costMatrix.ts:60](https://github.com/havelessbemore/munkres/blob/e84c80e/src/utils/costMatrix.ts#L60)

___

### getMinCost

▸ **getMinCost**(`costMatrix`): `number` \| `undefined`

Finds the maximum value in a given cost matrix.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `costMatrix` | [`CostMatrix`](modules.md#costmatrix) | The cost matrix. |

#### Returns

`number` \| `undefined`

The maximum value, or `undefined` if the matrix is empty.

#### Defined in

[utils/costMatrix.ts:87](https://github.com/havelessbemore/munkres/blob/e84c80e/src/utils/costMatrix.ts#L87)

___

### invertCostMatrix

▸ **invertCostMatrix**(`costMatrix`, `bigVal?`): `void`

Inverts the values in a given cost matrix by
subtracting each element from a specified large value.

This is useful for converting a minimized cost matrix
into a maximized cost matrix (or vice versa).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `costMatrix` | [`CostMatrix`](modules.md#costmatrix) | The cost matrix to be inverted. The matrix is modified in place. |
| `bigVal?` | `number` | (Optional) A large value used as the basis for inversion. If not provided, the maximum value in the matrix is used. |

#### Returns

`void`

**`Example`**

```ts
const costMatrix = [
  [1, 2, 3],
  [4, 5, 6]
];

// Invert the matrix
invertCostMatrix(costMatrix);

// costMatrix is now:
// [
//   [5, 4, 3],
//   [2, 1, 0]
// ]
```

**`Example`**

```ts
const anotherMatrix = [
  [10, 20],
  [30, 40]
];

// Invert the matrix with a given bigVal
invertCostMatrix(anotherMatrix, 50);

// costMatrix is now:
// [
//   [40, 30],
//   [20, 10]
// ]
```

#### Defined in

[utils/costMatrix.ts:148](https://github.com/havelessbemore/munkres/blob/e84c80e/src/utils/costMatrix.ts#L148)

___

### munkres

▸ **munkres**(`costMatrix`): [`number`, `number`][]

Find the optimal assignments of `y` workers to `x` jobs to
minimize total cost.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `costMatrix` | [`CostMatrix`](modules.md#costmatrix) | The cost matrix, where `mat[y][x]` represents the cost of assigning worker `y` to job `x`. |

#### Returns

[`number`, `number`][]

An array of pairs `[y, x]` representing the optimal assignment
of workers to jobs. Each pair consists of a worker index `y` and a job
index `x`, indicating that worker `y` is assigned to job `x`.

**`Remarks`**

Runs the [Munkres algorithm (aka Hungarian algorithm)](https://en.wikipedia.org/wiki/Hungarian_algorithm) to solve
the [assignment problem](https://en.wikipedia.org/wiki/Assignment_problem).

#### Defined in

[munkres.ts:20](https://github.com/havelessbemore/munkres/blob/e84c80e/src/munkres.ts#L20)

___

### negateCostMatrix

▸ **negateCostMatrix**(`costMatrix`): `void`

Negates the values in a given cost matrix.

This is useful for converting a minimized cost matrix
into a maximized cost matrix (or vice versa).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `costMatrix` | [`CostMatrix`](modules.md#costmatrix) | The cost matrix to be negated. The matrix is modified in place. |

#### Returns

`void`

**`Example`**

```ts
const costMatrix = [
  [1,  2, 3],
  [4, -5, 6],
  [7,  8, 9]
];

// Negate the cost matrix
negateCostMatrix(costMatrix);

// costMatrix is now:
// [
//   [-1, -2, -3],
//   [-4,  5, -6],
//   [-7, -8, -9]
// ]
```

#### Defined in

[utils/costMatrix.ts:192](https://github.com/havelessbemore/munkres/blob/e84c80e/src/utils/costMatrix.ts#L192)
