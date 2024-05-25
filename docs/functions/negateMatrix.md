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

### Source

[helpers.ts:191](https://github.com/havelessbemore/munkres/blob/8a47bb771bc09e489d433204d9422a435c3c97fd/src/helpers.ts#L191)

## negateMatrix(matrix)

> **negateMatrix**(`matrix`): `void`

### Parameters

• **matrix**: [`Matrix`](../type-aliases/Matrix.md)\<`bigint`\>

### Returns

`void`

### Source

[helpers.ts:192](https://github.com/havelessbemore/munkres/blob/8a47bb771bc09e489d433204d9422a435c3c97fd/src/helpers.ts#L192)
