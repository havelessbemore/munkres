[**munkres**](../README.md) • **Docs**

***

[munkres](../globals.md) / munkres

# Function: munkres()

## munkres(costMatrix)

> **munkres**(`costMatrix`): [`Pair`](../type-aliases/Pair.md)\<`number`\>[]

Find the optimal assignments of `y` workers to `x` jobs to
minimize total cost.

### Parameters

• **costMatrix**: [`MatrixLike`](../type-aliases/MatrixLike.md)\<`number`\>

The cost matrix, where `mat[y][x]` represents the cost
of assigning worker `y` to job `x`.

### Returns

[`Pair`](../type-aliases/Pair.md)\<`number`\>[]

An array of pairs `[y, x]` representing the optimal assignment
of workers to jobs. Each pair consists of a worker index `y` and a job
index `x`, indicating that worker `y` is assigned to job `x`.

### Source

[munkres.ts:18](https://github.com/havelessbemore/munkres/blob/5ace585f0cdcff36ea78e3571791e71f76cf4bc5/src/munkres.ts#L18)

## munkres(costMatrix)

> **munkres**(`costMatrix`): [`Pair`](../type-aliases/Pair.md)\<`number`\>[]

### Parameters

• **costMatrix**: [`MatrixLike`](../type-aliases/MatrixLike.md)\<`bigint`\>

### Returns

[`Pair`](../type-aliases/Pair.md)\<`number`\>[]

### Source

[munkres.ts:19](https://github.com/havelessbemore/munkres/blob/5ace585f0cdcff36ea78e3571791e71f76cf4bc5/src/munkres.ts#L19)
