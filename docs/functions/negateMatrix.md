[**munkres**](../README.md)

***

[munkres](../globals.md) / negateMatrix

# Function: negateMatrix()

## Call Signature

> **negateMatrix**(`matrix`): `void`

Defined in: [helpers.ts:191](https://github.com/havelessbemore/munkres/blob/40b2e813ddbf553c3dca1e2c6416306e26df6f6c/src/helpers.ts#L191)

Negates the values in a given matrix.

This is useful for converting a profit matrix
into a cost matrix, or vice versa.

### Parameters

#### matrix

[`Matrix`](../type-aliases/Matrix.md)\<`number`\>

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

## Call Signature

> **negateMatrix**(`matrix`): `void`

Defined in: [helpers.ts:192](https://github.com/havelessbemore/munkres/blob/40b2e813ddbf553c3dca1e2c6416306e26df6f6c/src/helpers.ts#L192)

Negates the values in a given matrix.

This is useful for converting a profit matrix
into a cost matrix, or vice versa.

### Parameters

#### matrix

[`Matrix`](../type-aliases/Matrix.md)\<`bigint`\>

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
