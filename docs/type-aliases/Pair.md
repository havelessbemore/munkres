[**munkres**](../README.md) • **Docs**

***

[munkres](../globals.md) / Pair

# Type alias: Pair\<A, B\>

> **Pair**\<`A`, `B`\>: [`A`, `B`]

Represents a pair of elements.

The first element is of type `A` and the second element is of type `B`.
If not specified, `B` defaults to `A`, signifying a pair of the same
type.

This is useful for scenarios such as key-value pairs, coordinates, and
other dual-element structures.

## Examples

```typescript
// A pair of numbers
const coordinate: Pair<number> = [15, 20];
```

```typescript
// A pair of a string and a number
const keyValue: Pair<string, number> = ['age', 30];
```

## Type parameters

• **A**

• **B** = `A`

## Source

[types/pair.d.ts:23](https://github.com/havelessbemore/munkres/blob/5ace585f0cdcff36ea78e3571791e71f76cf4bc5/src/types/pair.d.ts#L23)
