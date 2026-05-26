[**munkres**](../README.md)

***

[munkres](../globals.md) / MatrixLike

# Type Alias: MatrixLike\<T\>

> **MatrixLike**\<`T`\> = `ArrayLike`\<`ArrayLike`\<`T`\>\>

Defined in: [types/matrixLike.ts:28](https://github.com/havelessbemore/munkres/blob/40b2e813ddbf553c3dca1e2c6416306e26df6f6c/src/types/matrixLike.ts#L28)

Defines a two-dimensional, read-only matrix with elements of type `T`.

Unlike [Matrix](Matrix.md), `MatrixLike` uses ArrayLike objects,
allowing for more flexible matrix-like data structures, such as those made
with typed arrays or other sequence-like objects.

The outer array represents the rows of the matrix, and each inner array
represents the columns in a row. This type is generic and can be used to
create matrices of any given type.

## Type Parameters

### T

`T`

## Examples

```typescript
const matrix: MatrixLike<number> = {
  length: 3,
  0: { length: 3, 0: 1, 1: 2, 2: 3 },
  1: { length: 3, 0: 4, 1: 5, 2: 6 },
  2: { length: 3, 0: 7, 1: 8, 2: 9 }
};
```

```typescript
// Using MatrixLike with NodeList in DOM manipulation
const divMatrix: MatrixLike<HTMLElement> = document.querySelectorAll('.foo');
```
