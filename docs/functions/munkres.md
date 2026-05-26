[**munkres**](../README.md)

***

[munkres](../globals.md) / munkres

# Function: munkres()

## Call Signature

> **munkres**(`costMatrix`): [`Pair`](../type-aliases/Pair.md)\<`number`\>[]

Defined in: [munkres.ts:18](https://github.com/havelessbemore/munkres/blob/40b2e813ddbf553c3dca1e2c6416306e26df6f6c/src/munkres.ts#L18)

Find the optimal assignments of `y` workers to `x` jobs to
minimize total cost.

### Parameters

#### costMatrix

[`MatrixLike`](../type-aliases/MatrixLike.md)\<`number`\>

The cost matrix, where `mat[y][x]` represents the cost
of assigning worker `y` to job `x`.

### Returns

[`Pair`](../type-aliases/Pair.md)\<`number`\>[]

An array of pairs `[y, x]` representing the optimal assignment
of workers to jobs. Each pair consists of a worker index `y` and a job
index `x`, indicating that worker `y` is assigned to job `x`.

## Call Signature

> **munkres**(`costMatrix`): [`Pair`](../type-aliases/Pair.md)\<`number`\>[]

Defined in: [munkres.ts:19](https://github.com/havelessbemore/munkres/blob/40b2e813ddbf553c3dca1e2c6416306e26df6f6c/src/munkres.ts#L19)

Find the optimal assignments of `y` workers to `x` jobs to
minimize total cost.

### Parameters

#### costMatrix

[`MatrixLike`](../type-aliases/MatrixLike.md)\<`bigint`\>

The cost matrix, where `mat[y][x]` represents the cost
of assigning worker `y` to job `x`.

### Returns

[`Pair`](../type-aliases/Pair.md)\<`number`\>[]

An array of pairs `[y, x]` representing the optimal assignment
of workers to jobs. Each pair consists of a worker index `y` and a job
index `x`, indicating that worker `y` is assigned to job `x`.
