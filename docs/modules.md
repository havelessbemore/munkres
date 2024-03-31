[munkres](README.md) / Exports

# munkres

## Table of contents

### Type Aliases

- [Matrix](modules.md#matrix)

### Functions

- [createCostMatrix](modules.md#createcostmatrix)
- [getMaxCost](modules.md#getmaxcost)
- [getMinCost](modules.md#getmincost)
- [invertCostMatrix](modules.md#invertcostmatrix)
- [munkres](modules.md#munkres)
- [negateCostMatrix](modules.md#negatecostmatrix)

## Type Aliases

### Matrix

Ƭ **Matrix**\<`T`\>: `T`[][]

Defines a two-dimensional matrix with elements of type `T`.

The matrix is represented as a double array. The outer array represents
the rows of the matrix, and each inner array represents the columns in a
row. This type is generic and can be used to create matrices of any
given type, including `number`, `string`, `boolean`, `bigint`, etc.

**`Example`**

```ts
const numberMatrix: Matrix<number> = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];
```

**`Example`**

```ts
const bigintMatrix: Matrix<bigint> = [
  [1n, 2n, 3n],
  [4n, 5n, 6n],
  [7n, 8n, 9n]
];
```

**`Example`**

```ts
const stringMatrix: Matrix<string> = [
  ['a', 'b', 'c'],
  ['d', 'e', 'f'],
  ['g', 'h', 'i']
];
```

**`Example`**

```ts
const booleanMatrix: Matrix<boolean> = [
  [true, false, true],
  [false, true, false],
  [true, true, false]
];
```

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[types/matrix.d.ts:37](https://github.com/havelessbemore/munkres/blob/c7ee0aa/src/types/matrix.d.ts#L37)

## Functions

### createCostMatrix

▸ **createCostMatrix**\<`W`, `J`\>(`workers`, `jobs`, `costFn`): [`Matrix`](modules.md#matrix)\<`number`\>

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
| `costFn` | (`worker`: `W`, `job`: `J`) => `number` | Given a worker and a job, returns the numeric cost of assigning that worker to that job. |

#### Returns

[`Matrix`](modules.md#matrix)\<`number`\>

A cost matrix where the values at position `[y][x]`
represent the cost of assigning the `y`-th worker to the `x`-th job.

**`Example`**

```ts
// Define workers, jobs, and a simple cost function
const workers = ['Alice', 'Bob'];
const jobs = ['Job1', 'Job2'];
const costFn = (worker: string, job: string) =\> worker.length + job.length;

// Create the cost matrix
const matrix = createCostMatrix(workers, jobs, costFn);
// [
//   [9, 9], // ['Alice' + 'Job1', 'Alice' + 'Job2']
//   [7, 7]  // [  'Bob' + 'Job1',   'Bob' + 'Job2']
// ]
```

#### Defined in

[utils/costMatrix.ts:33](https://github.com/havelessbemore/munkres/blob/c7ee0aa/src/utils/costMatrix.ts#L33)

▸ **createCostMatrix**\<`W`, `J`\>(`workers`, `jobs`, `costFn`): [`Matrix`](modules.md#matrix)\<`bigint`\>

#### Type parameters

| Name |
| :------ |
| `W` |
| `J` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `workers` | `W`[] |
| `jobs` | `J`[] |
| `costFn` | (`worker`: `W`, `job`: `J`) => `bigint` |

#### Returns

[`Matrix`](modules.md#matrix)\<`bigint`\>

#### Defined in

[utils/costMatrix.ts:38](https://github.com/havelessbemore/munkres/blob/c7ee0aa/src/utils/costMatrix.ts#L38)

___

### getMaxCost

▸ **getMaxCost**(`costMatrix`): `number` \| `undefined`

Finds the maximum value in a given cost matrix.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `costMatrix` | [`Matrix`](modules.md#matrix)\<`number`\> | The cost matrix. |

#### Returns

`number` \| `undefined`

The maximum value, or `undefined` if the matrix is empty.

#### Defined in

[utils/costMatrix.ts:58](https://github.com/havelessbemore/munkres/blob/c7ee0aa/src/utils/costMatrix.ts#L58)

▸ **getMaxCost**(`costMatrix`): `bigint` \| `undefined`

#### Parameters

| Name | Type |
| :------ | :------ |
| `costMatrix` | [`Matrix`](modules.md#matrix)\<`bigint`\> |

#### Returns

`bigint` \| `undefined`

#### Defined in

[utils/costMatrix.ts:59](https://github.com/havelessbemore/munkres/blob/c7ee0aa/src/utils/costMatrix.ts#L59)

___

### getMinCost

▸ **getMinCost**(`costMatrix`): `number` \| `undefined`

Finds the maximum value in a given cost matrix.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `costMatrix` | [`Matrix`](modules.md#matrix)\<`number`\> | The cost matrix. |

#### Returns

`number` \| `undefined`

The maximum value, or `undefined` if the matrix is empty.

#### Defined in

[utils/costMatrix.ts:73](https://github.com/havelessbemore/munkres/blob/c7ee0aa/src/utils/costMatrix.ts#L73)

▸ **getMinCost**(`costMatrix`): `bigint` \| `undefined`

#### Parameters

| Name | Type |
| :------ | :------ |
| `costMatrix` | [`Matrix`](modules.md#matrix)\<`bigint`\> |

#### Returns

`bigint` \| `undefined`

#### Defined in

[utils/costMatrix.ts:74](https://github.com/havelessbemore/munkres/blob/c7ee0aa/src/utils/costMatrix.ts#L74)

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
| `costMatrix` | [`Matrix`](modules.md#matrix)\<`number`\> | The cost matrix to be inverted. Modified in place. |
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

[utils/costMatrix.ts:122](https://github.com/havelessbemore/munkres/blob/c7ee0aa/src/utils/costMatrix.ts#L122)

▸ **invertCostMatrix**(`costMatrix`, `bigVal?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `costMatrix` | [`Matrix`](modules.md#matrix)\<`bigint`\> |
| `bigVal?` | `bigint` |

#### Returns

`void`

#### Defined in

[utils/costMatrix.ts:126](https://github.com/havelessbemore/munkres/blob/c7ee0aa/src/utils/costMatrix.ts#L126)

___

### munkres

▸ **munkres**(`costMatrix`): [`number`, `number`][]

Find the optimal assignments of `y` workers to `x` jobs to
minimize total cost.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `costMatrix` | [`Matrix`](modules.md#matrix)\<`number`\> | The cost matrix, where `mat[y][x]` represents the cost of assigning worker `y` to job `x`. |

#### Returns

[`number`, `number`][]

An array of pairs `[y, x]` representing the optimal assignment
of workers to jobs. Each pair consists of a worker index `y` and a job
index `x`, indicating that worker `y` is assigned to job `x`.

**`Remarks`**

Runs the [Munkres algorithm (aka Hungarian algorithm)](https://en.wikipedia.org/wiki/Hungarian_algorithm) to solve
the [assignment problem](https://en.wikipedia.org/wiki/Assignment_problem).

#### Defined in

[munkres.ts:22](https://github.com/havelessbemore/munkres/blob/c7ee0aa/src/munkres.ts#L22)

▸ **munkres**(`costMatrix`): [`number`, `number`][]

#### Parameters

| Name | Type |
| :------ | :------ |
| `costMatrix` | [`Matrix`](modules.md#matrix)\<`bigint`\> |

#### Returns

[`number`, `number`][]

#### Defined in

[munkres.ts:23](https://github.com/havelessbemore/munkres/blob/c7ee0aa/src/munkres.ts#L23)

___

### negateCostMatrix

▸ **negateCostMatrix**(`costMatrix`): `void`

Negates the values in a given cost matrix.

This is useful for converting a minimized cost matrix
into a maximized cost matrix (or vice versa).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `costMatrix` | [`Matrix`](modules.md#matrix)\<`number`\> | The cost matrix to be negated. Modified in place. |

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

[utils/costMatrix.ts:162](https://github.com/havelessbemore/munkres/blob/c7ee0aa/src/utils/costMatrix.ts#L162)

▸ **negateCostMatrix**(`costMatrix`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `costMatrix` | [`Matrix`](modules.md#matrix)\<`bigint`\> |

#### Returns

`void`

#### Defined in

[utils/costMatrix.ts:163](https://github.com/havelessbemore/munkres/blob/c7ee0aa/src/utils/costMatrix.ts#L163)
