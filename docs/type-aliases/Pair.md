[**munkres**](../README.md)

***

[munkres](../globals.md) / Pair

# Type Alias: Pair\<A, B\>

> **Pair**\<`A`, `B`\> = \[`A`, `B`\]

Defined in: [types/pair.ts:23](https://github.com/havelessbemore/munkres/blob/40b2e813ddbf553c3dca1e2c6416306e26df6f6c/src/types/pair.ts#L23)

Represents a pair of elements.

The first element is of type `A` and the second element is of type `B`.
If not specified, `B` defaults to `A`, signifying a pair of the same
type.

This is useful for scenarios such as key-value pairs, coordinates, and
other dual-element structures.

## Type Parameters

### A

`A`

### B

`B` = `A`

## Examples

```typescript
// A pair of numbers
const coordinate: Pair<number> = [15, 20];
```

```typescript
// A pair of a string and a number
const keyValue: Pair<string, number> = ['age', 30];
```
