[**munkres**](../README.md) • **Docs**

***

[munkres](../globals.md) / invertMatrix

# Function: invertMatrix()

## invertMatrix(matrix, bigVal)

> **invertMatrix**(`matrix`, `bigVal`?): `void`

Inverts the values in a given matrix by
subtracting each element from a specified large value.

This is useful for converting a profit matrix
into a cost matrix, or vice versa.

### Parameters

• **matrix**: [`Matrix`](../type-aliases/Matrix.md)\<`number`\>

The cost matrix to be inverted. Modified in place.

• **bigVal?**: `number`

(Optional) A large value used as the basis for inversion.
If not provided, the maximum value in the matrix is used.

### Returns

`void`

### Examples

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

### Defined in

[helpers.ts:157](https://github.com/havelessbemore/munkres/blob/eaf56415da666c8098716c88966089276f8d68fc/src/helpers.ts#L157)

## invertMatrix(matrix, bigVal)

> **invertMatrix**(`matrix`, `bigVal`?): `void`

### Parameters

• **matrix**: [`Matrix`](../type-aliases/Matrix.md)\<`bigint`\>

• **bigVal?**: `bigint`

### Returns

`void`

### Defined in

[helpers.ts:158](https://github.com/havelessbemore/munkres/blob/eaf56415da666c8098716c88966089276f8d68fc/src/helpers.ts#L158)
