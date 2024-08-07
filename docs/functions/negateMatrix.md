[**munkres**](../README.md) • **Docs**

***

[munkres](../globals.md) / negateMatrix

# Function: negateMatrix()

## negateMatrix(matrix)

> **negateMatrix**(`matrix`): `void`

Negates the values in a given matrix.

This is useful for converting a profit matrix
into a cost matrix, or vice versa.

### Parameters

• **matrix**: [`Matrix`](../type-aliases/Matrix.md)\<`number`\>

The matrix to be negated. Modified in place.

### Returns

`void`

### Example

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

### Defined in

[helpers.ts:191](https://github.com/havelessbemore/munkres/blob/96ca8c3d8a7149b86376a9ca1eea1dab78a6109c/src/helpers.ts#L191)

## negateMatrix(matrix)

> **negateMatrix**(`matrix`): `void`

### Parameters

• **matrix**: [`Matrix`](../type-aliases/Matrix.md)\<`bigint`\>

### Returns

`void`

### Defined in

[helpers.ts:192](https://github.com/havelessbemore/munkres/blob/96ca8c3d8a7149b86376a9ca1eea1dab78a6109c/src/helpers.ts#L192)
