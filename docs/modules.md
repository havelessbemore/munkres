[munkres](README.md) / Exports

# munkres

## Table of contents

### References

- [default](modules.md#default)

### Type Aliases

- [Matrix](modules.md#matrix)
- [MatrixLike](modules.md#matrixlike)
- [Pair](modules.md#pair)

### Functions

- [copyMatrix](modules.md#copymatrix)
- [createMatrix](modules.md#creatematrix)
- [genMatrix](modules.md#genmatrix)
- [getMatrixMax](modules.md#getmatrixmax)
- [getMatrixMin](modules.md#getmatrixmin)
- [invertMatrix](modules.md#invertmatrix)
- [munkres](modules.md#munkres)
- [negateMatrix](modules.md#negatematrix)

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

[types/matrix.d.ts:37](https://github.com/havelessbemore/munkres/blob/0f713ec5652acecc132284c6fc11cb2b86608591/src/types/matrix.d.ts#L37)

___

### MatrixLike

Ƭ **MatrixLike**\<`T`\>: `ArrayLike`\<`ArrayLike`\<`T`\>\>

Defines a two-dimensional, read-only matrix with elements of type `T`.

Unlike [Matrix](modules.md#matrix), `MatrixLike` uses ArrayLike objects,
allowing for more flexible matrix-like data structures, such as those made
with typed arrays or other sequence-like objects.

The outer array represents the rows of the matrix, and each inner array
represents the columns in a row. This type is generic and can be used to
create matrices of any given type.

**`Example`**

```typescript
const matrix: MatrixLike<number> = {
  length: 3,
  0: { length: 3, 0: 1, 1: 2, 2: 3 },
  1: { length: 3, 0: 4, 1: 5, 2: 6 },
  2: { length: 3, 0: 7, 1: 8, 2: 9 }
};
```

**`Example`**

```typescript
// Using MatrixLike with NodeList in DOM manipulation
const divMatrix: MatrixLike<HTMLElement> = document.querySelectorAll('.foo');
```

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[types/matrixLike.d.ts:28](https://github.com/havelessbemore/munkres/blob/0f713ec5652acecc132284c6fc11cb2b86608591/src/types/matrixLike.d.ts#L28)

___

### Pair

Ƭ **Pair**\<`A`, `B`\>: [`A`, `B`]

Represents a pair of elements.

The first element is of type `A` and the second element is of type `B`.
If not specified, `B` defaults to `A`, signifying a pair of the same
type.

This is useful for scenarios such as key-value pairs, coordinates, and
other dual-element structures.

**`Example`**

```typescript
// A pair of numbers
const coordinate: Pair<number> = [15, 20];
```

**`Example`**

```typescript
// A pair of a string and a number
const keyValue: Pair<string, number> = ['age', 30];
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `A` | `A` |
| `B` | `A` |

#### Defined in

[types/pair.d.ts:23](https://github.com/havelessbemore/munkres/blob/0f713ec5652acecc132284c6fc11cb2b86608591/src/types/pair.d.ts#L23)

## Functions

### copyMatrix

▸ **copyMatrix**\<`T`\>(`matrix`): [`Matrix`](modules.md#matrix)\<`T`\>

Creates a copy from a given matrix or matrix-like input.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `matrix` | [`MatrixLike`](modules.md#matrixlike)\<`T`\> | The matrix to be copied. |

#### Returns

[`Matrix`](modules.md#matrix)\<`T`\>

A copy of the given matrix.

#### Defined in

[helpers.ts:14](https://github.com/havelessbemore/munkres/blob/0f713ec5652acecc132284c6fc11cb2b86608591/src/helpers.ts#L14)

___

### createMatrix

▸ **createMatrix**\<`R`, `C`, `T`\>(`rows`, `cols`, `callbackFn`): [`Matrix`](modules.md#matrix)\<`T`\>

Constructs a matrix from a set of row
and column objects using a provided callback function.

#### Type parameters

| Name |
| :------ |
| `R` |
| `C` |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `rows` | `ArrayLike`\<`R`\> | An array of row objects (such as workers). |
| `cols` | `ArrayLike`\<`C`\> | An array of column objects (such as jobs). |
| `callbackFn` | (`row`: `R`, `col`: `C`) => `T` | Given a row and a column, returns a value. |

#### Returns

[`Matrix`](modules.md#matrix)\<`T`\>

A matrix where the values at position `[r][c]`
represent the value derived from row `r` and column `c`.

**`Example`**

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

#### Defined in

[helpers.ts:44](https://github.com/havelessbemore/munkres/blob/0f713ec5652acecc132284c6fc11cb2b86608591/src/helpers.ts#L44)

___

### genMatrix

▸ **genMatrix**\<`T`\>(`rows`, `cols`, `callbackFn`): [`Matrix`](modules.md#matrix)\<`T`\>

Constructs a matrix with given dimensions
using a provided callback function.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `rows` | `number` | The number of rows in the matrix. |
| `cols` | `number` | The number of columns in the matrix. |
| `callbackFn` | (`row`: `number`, `col`: `number`) => `T` | Given row and column indices, returns a value. |

#### Returns

[`Matrix`](modules.md#matrix)\<`T`\>

A matrix where the values at position `[r][c]`
represent the value derived from row `r` and column `c`.

**`Example`**

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

#### Defined in

[helpers.ts:78](https://github.com/havelessbemore/munkres/blob/0f713ec5652acecc132284c6fc11cb2b86608591/src/helpers.ts#L78)

___

### getMatrixMax

▸ **getMatrixMax**(`matrix`): `number` \| `undefined`

Finds the maximum value in a given matrix.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `matrix` | [`MatrixLike`](modules.md#matrixlike)\<`number`\> | The matrix. |

#### Returns

`number` \| `undefined`

The maximum value, or `undefined` if the matrix is empty.

#### Defined in

[helpers.ts:93](https://github.com/havelessbemore/munkres/blob/0f713ec5652acecc132284c6fc11cb2b86608591/src/helpers.ts#L93)

▸ **getMatrixMax**(`matrix`): `bigint` \| `undefined`

#### Parameters

| Name | Type |
| :------ | :------ |
| `matrix` | [`MatrixLike`](modules.md#matrixlike)\<`bigint`\> |

#### Returns

`bigint` \| `undefined`

#### Defined in

[helpers.ts:94](https://github.com/havelessbemore/munkres/blob/0f713ec5652acecc132284c6fc11cb2b86608591/src/helpers.ts#L94)

___

### getMatrixMin

▸ **getMatrixMin**(`matrix`): `number` \| `undefined`

Finds the minimum value in a given matrix.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `matrix` | [`MatrixLike`](modules.md#matrixlike)\<`number`\> | The matrix. |

#### Returns

`number` \| `undefined`

The minimum value, or `undefined` if the matrix is empty.

#### Defined in

[helpers.ts:108](https://github.com/havelessbemore/munkres/blob/0f713ec5652acecc132284c6fc11cb2b86608591/src/helpers.ts#L108)

▸ **getMatrixMin**(`matrix`): `bigint` \| `undefined`

#### Parameters

| Name | Type |
| :------ | :------ |
| `matrix` | [`MatrixLike`](modules.md#matrixlike)\<`bigint`\> |

#### Returns

`bigint` \| `undefined`

#### Defined in

[helpers.ts:109](https://github.com/havelessbemore/munkres/blob/0f713ec5652acecc132284c6fc11cb2b86608591/src/helpers.ts#L109)

___

### invertMatrix

▸ **invertMatrix**(`matrix`, `bigVal?`): `void`

Inverts the values in a given matrix by
subtracting each element from a specified large value.

This is useful for converting a profit matrix
into a cost matrix, or vice versa.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `matrix` | [`Matrix`](modules.md#matrix)\<`number`\> | The cost matrix to be inverted. Modified in place. |
| `bigVal?` | `number` | (Optional) A large value used as the basis for inversion. If not provided, the maximum value in the matrix is used. |

#### Returns

`void`

**`Example`**

```ts
const matrix = [
  [1, 2, 3],
  [4, 5, 6]
];

// Invert the matrix
invertMatrix(matrix);

// matrix is now:
// [
//   [5, 4, 3],
//   [2, 1, 0]
// ]
```

**`Example`**

```ts
const matrix = [
  [10, 20],
  [30, 40]
];

// Invert the matrix with a given bigVal
invertMatrix(matrix, 50);

// matrix is now:
// [
//   [40, 30],
//   [20, 10]
// ]
```

#### Defined in

[helpers.ts:157](https://github.com/havelessbemore/munkres/blob/0f713ec5652acecc132284c6fc11cb2b86608591/src/helpers.ts#L157)

▸ **invertMatrix**(`matrix`, `bigVal?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `matrix` | [`Matrix`](modules.md#matrix)\<`bigint`\> |
| `bigVal?` | `bigint` |

#### Returns

`void`

#### Defined in

[helpers.ts:158](https://github.com/havelessbemore/munkres/blob/0f713ec5652acecc132284c6fc11cb2b86608591/src/helpers.ts#L158)

___

### munkres

▸ **munkres**(`costMatrix`): [`Pair`](modules.md#pair)\<`number`\>[]

Find the optimal assignments of `y` workers to `x` jobs to
minimize total cost.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `costMatrix` | [`MatrixLike`](modules.md#matrixlike)\<`number`\> | The cost matrix, where `mat[y][x]` represents the cost of assigning worker `y` to job `x`. |

#### Returns

[`Pair`](modules.md#pair)\<`number`\>[]

An array of pairs `[y, x]` representing the optimal assignment
of workers to jobs. Each pair consists of a worker index `y` and a job
index `x`, indicating that worker `y` is assigned to job `x`.

#### Defined in

[munkres.ts:18](https://github.com/havelessbemore/munkres/blob/0f713ec5652acecc132284c6fc11cb2b86608591/src/munkres.ts#L18)

▸ **munkres**(`costMatrix`): [`Pair`](modules.md#pair)\<`number`\>[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `costMatrix` | [`MatrixLike`](modules.md#matrixlike)\<`bigint`\> |

#### Returns

[`Pair`](modules.md#pair)\<`number`\>[]

#### Defined in

[munkres.ts:19](https://github.com/havelessbemore/munkres/blob/0f713ec5652acecc132284c6fc11cb2b86608591/src/munkres.ts#L19)

___

### negateMatrix

▸ **negateMatrix**(`matrix`): `void`

Negates the values in a given matrix.

This is useful for converting a profit matrix
into a cost matrix, or vice versa.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `matrix` | [`Matrix`](modules.md#matrix)\<`number`\> | The matrix to be negated. Modified in place. |

#### Returns

`void`

**`Example`**

```ts
const matrix = [
  [1,  2, 3],
  [4, -5, 6],
  [7,  8, 9]
];

// Negate the matrix
negateMatrix(matrix);

// matrix is now:
// [
//   [-1, -2, -3],
//   [-4,  5, -6],
//   [-7, -8, -9]
// ]
```

#### Defined in

[helpers.ts:191](https://github.com/havelessbemore/munkres/blob/0f713ec5652acecc132284c6fc11cb2b86608591/src/helpers.ts#L191)

▸ **negateMatrix**(`matrix`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `matrix` | [`Matrix`](modules.md#matrix)\<`bigint`\> |

#### Returns

`void`

#### Defined in

[helpers.ts:192](https://github.com/havelessbemore/munkres/blob/0f713ec5652acecc132284c6fc11cb2b86608591/src/helpers.ts#L192)
