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

### Defined in

[munkres.ts:18](https://github.com/havelessbemore/munkres/blob/113202b0c1b467d28937703cda450103cdf776b4/src/munkres.ts#L18)

## munkres(costMatrix)

> **munkres**(`costMatrix`): [`Pair`](../type-aliases/Pair.md)\<`number`\>[]

### Parameters

• **costMatrix**: [`MatrixLike`](../type-aliases/MatrixLike.md)\<`bigint`\>

### Returns

[`Pair`](../type-aliases/Pair.md)\<`number`\>[]

### Defined in

[munkres.ts:19](https://github.com/havelessbemore/munkres/blob/113202b0c1b467d28937703cda450103cdf776b4/src/munkres.ts#L19)
