[**munkres**](../README.md) • **Docs**

***

[munkres](../globals.md) / Matrix

# Type Alias: Matrix\<T\>

> **Matrix**\<`T`\>: `T`[][]

Defines a two-dimensional matrix with elements of type `T`.

The matrix is represented as a double array. The outer array represents
the rows of the matrix, and each inner array represents the columns in a
row. This type is generic and can be used to create matrices of any
given type, including `number`, `string`, `boolean`, `bigint`, etc.

## Type Parameters

• **T**

## Examples

```ts
const numberMatrix: Matrix<number> = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];
```

```ts
const bigintMatrix: Matrix<bigint> = [
  [1n, 2n, 3n],
  [4n, 5n, 6n],
  [7n, 8n, 9n]
];
```

```ts
const stringMatrix: Matrix<string> = [
  ['a', 'b', 'c'],
  ['d', 'e', 'f'],
  ['g', 'h', 'i']
];
```

```ts
const booleanMatrix: Matrix<boolean> = [
  [true, false, true],
  [false, true, false],
  [true, true, false]
];
```

## Defined in

[types/matrix.ts:37](https://github.com/havelessbemore/munkres/blob/4bfebf21ecf3548e55b78d5bd6e0dc43a9f8d935/src/types/matrix.ts#L37)
