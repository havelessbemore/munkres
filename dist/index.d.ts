export declare type costFn = <A, B = A>(a: A, b: B, context: unknown) => number;

export declare type CostMatrix = Matrix<number>;

export declare type Matrix<T> = T[][];

export declare class Munkres {
    mat: CostMatrix;
    protected covY: boolean[];
    protected covX: boolean[];
    protected mask: number[][];
    constructor(mat: CostMatrix);
    assign(): void;
    protected _step1(): void;
    protected _step2(): void;
    protected _step3(): number;
    protected _step4(): number;
    protected _step5(y: number, x: number): void;
    protected _step6(): number;
    protected _findMinUncovered(): number;
    protected _findPrimeInRow(y: number): number;
    protected _findStarInCol(x: number): number;
    protected _findStarInRow(y: number): number;
    protected _findUncoveredZero(): [number, number];
    protected _resetCoverage(): void;
    protected _resetPrimes(): void;
}

export declare const Zero: {
    readonly NONE: 0;
    readonly STAR: 1;
    readonly PRIME: 2;
};

export { }
