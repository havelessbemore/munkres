[**munkres**](../README.md) • **Docs**

***

[munkres](../globals.md) / Pair

# Type Alias: Pair\<A, B\>

> **Pair**\<`A`, `B`\>: [`A`, `B`]

Represents a pair of elements.

The first element is of type `A` and the second element is of type `B`.
If not specified, `B` defaults to `A`, signifying a pair of the same
type.

This is useful for scenarios such as key-value pairs, coordinates, and
other dual-element structures.

## Type Parameters

• **A**

• **B** = `A`

## Examples

```typescript
// A pair of numbers
const coordinate: Pair<number> = [15, 20];
```

```typescript
// A pair of a string and a number
const keyValue: Pair<string, number> = ['age', 30];
```

## Defined in

[types/pair.ts:23](https://github.com/havelessbemore/munkres/blob/1a41104a2d067b3df1a0b5e9aecaaada88bbf79b/src/types/pair.ts#L23)
