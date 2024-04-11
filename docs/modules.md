[munkres](README.md) / Exports

# munkres

## Table of contents

### References

- [default](modules.md#default)

### Type Aliases

- [Matrix](modules.md#matrix)
- [Tuple](modules.md#tuple)

### Functions

- [createCostMatrix](modules.md#createcostmatrix)
- [getMaxCost](modules.md#getmaxcost)
- [getMinCost](modules.md#getmincost)
- [invertCostMatrix](modules.md#invertcostmatrix)
- [munkres](modules.md#munkres)
- [negateCostMatrix](modules.md#negatecostmatrix)

## References

### default

Renames and re-exports [munkres](modules.md#munkres)

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

[types/matrix.d.ts:37](https://github.com/havelessbemore/munkres/blob/23bcaf55e3b66d378ff9d655b1acea8b8bb2ea16/src/types/matrix.d.ts#L37)

___

### Tuple

Ƭ **Tuple**\<`A`, `B`\>: [`A`, `B`]

#### Type parameters

| Name | Type |
| :------ | :------ |
| `A` | `A` |
| `B` | `A` |

#### Defined in

[types/tuple.d.ts:1](https://github.com/havelessbemore/munkres/blob/23bcaf55e3b66d378ff9d655b1acea8b8bb2ea16/src/types/tuple.d.ts#L1)

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

[utils/costMatrix.ts:34](https://github.com/havelessbemore/munkres/blob/23bcaf55e3b66d378ff9d655b1acea8b8bb2ea16/src/utils/costMatrix.ts#L34)

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

[utils/costMatrix.ts:39](https://github.com/havelessbemore/munkres/blob/23bcaf55e3b66d378ff9d655b1acea8b8bb2ea16/src/utils/costMatrix.ts#L39)

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

[utils/costMatrix.ts:59](https://github.com/havelessbemore/munkres/blob/23bcaf55e3b66d378ff9d655b1acea8b8bb2ea16/src/utils/costMatrix.ts#L59)

▸ **getMaxCost**(`costMatrix`): `bigint` \| `undefined`

#### Parameters

| Name | Type |
| :------ | :------ |
| `costMatrix` | [`Matrix`](modules.md#matrix)\<`bigint`\> |

#### Returns

`bigint` \| `undefined`

#### Defined in

[utils/costMatrix.ts:60](https://github.com/havelessbemore/munkres/blob/23bcaf55e3b66d378ff9d655b1acea8b8bb2ea16/src/utils/costMatrix.ts#L60)

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

[utils/costMatrix.ts:74](https://github.com/havelessbemore/munkres/blob/23bcaf55e3b66d378ff9d655b1acea8b8bb2ea16/src/utils/costMatrix.ts#L74)

▸ **getMinCost**(`costMatrix`): `bigint` \| `undefined`

#### Parameters

| Name | Type |
| :------ | :------ |
| `costMatrix` | [`Matrix`](modules.md#matrix)\<`bigint`\> |

#### Returns

`bigint` \| `undefined`

#### Defined in

[utils/costMatrix.ts:75](https://github.com/havelessbemore/munkres/blob/23bcaf55e3b66d378ff9d655b1acea8b8bb2ea16/src/utils/costMatrix.ts#L75)

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

[utils/costMatrix.ts:123](https://github.com/havelessbemore/munkres/blob/23bcaf55e3b66d378ff9d655b1acea8b8bb2ea16/src/utils/costMatrix.ts#L123)

▸ **invertCostMatrix**(`costMatrix`, `bigVal?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `costMatrix` | [`Matrix`](modules.md#matrix)\<`bigint`\> |
| `bigVal?` | `bigint` |

#### Returns

`void`

#### Defined in

[utils/costMatrix.ts:127](https://github.com/havelessbemore/munkres/blob/23bcaf55e3b66d378ff9d655b1acea8b8bb2ea16/src/utils/costMatrix.ts#L127)

___

### munkres

▸ **munkres**(`costMatrix`): [`Tuple`](modules.md#tuple)\<`number`\>[]

Find the optimal assignments of `y` workers to `x` jobs to
minimize total cost.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `costMatrix` | [`Matrix`](modules.md#matrix)\<`number`\> | The cost matrix, where `mat[y][x]` represents the cost of assigning worker `y` to job `x`. |

#### Returns

[`Tuple`](modules.md#tuple)\<`number`\>[]

An array of pairs `[y, x]` representing the optimal assignment
of workers to jobs. Each pair consists of a worker index `y` and a job
index `x`, indicating that worker `y` is assigned to job `x`.

#### Defined in

[munkres.ts:20](https://github.com/havelessbemore/munkres/blob/23bcaf55e3b66d378ff9d655b1acea8b8bb2ea16/src/munkres.ts#L20)

▸ **munkres**(`costMatrix`): [`Tuple`](modules.md#tuple)\<`number`\>[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `costMatrix` | [`Matrix`](modules.md#matrix)\<`bigint`\> |

#### Returns

[`Tuple`](modules.md#tuple)\<`number`\>[]

#### Defined in

[munkres.ts:21](https://github.com/havelessbemore/munkres/blob/23bcaf55e3b66d378ff9d655b1acea8b8bb2ea16/src/munkres.ts#L21)

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

[utils/costMatrix.ts:163](https://github.com/havelessbemore/munkres/blob/23bcaf55e3b66d378ff9d655b1acea8b8bb2ea16/src/utils/costMatrix.ts#L163)

▸ **negateCostMatrix**(`costMatrix`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `costMatrix` | [`Matrix`](modules.md#matrix)\<`bigint`\> |

#### Returns

`void`

#### Defined in

[utils/costMatrix.ts:164](https://github.com/havelessbemore/munkres/blob/23bcaf55e3b66d378ff9d655b1acea8b8bb2ea16/src/utils/costMatrix.ts#L164)
