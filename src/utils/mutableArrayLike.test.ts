import { describe, expect, it } from "@jest/globals";
import { partitionByMin } from "./mutableArrayLike";

describe(`${partitionByMin.name}()`, () => {
  it("should not change the array when min equals max", () => {
    const keys = [0, 1, 2, 3];
    const values = [10, 20, 30, 40];
    partitionByMin(keys, values, 2, 2);
    expect(keys).toEqual([0, 1, 2, 3]);
  });

  it("should not change the array when min is greater than max", () => {
    const keys = [0, 1, 2, 3];
    const values = [10, 20, 30, 40];
    partitionByMin(keys, values, 2, 1);
    expect(keys).toEqual([0, 1, 2, 3]);
  });

  it("should handle the case where all elements are the same", () => {
    const keys = [0, 1, 2, 3];
    const values = [1, 1, 1, 1];
    const mid = partitionByMin(keys, values);
    expect(mid).toBe(4);
    expect(keys).toEqual([0, 1, 2, 3]);
  });

  it("should return initial index + 1 when values are ascending", () => {
    const keys = [0, 1, 2, 3];
    const values = [10, 20, 30, 40];
    const mid = partitionByMin(keys, values, 1);
    expect(mid).toBe(2);
    expect(keys).toEqual([0, 1, 2, 3]);
  });

  it("should return initial index + 1 when all values are greater", () => {
    const keys = [0, 1, 2, 3, 4];
    const values = [10, 20, 40, 30, 21];
    const mid = partitionByMin(keys, values, 1);
    expect(mid).toBe(2);
    expect(keys).toEqual([0, 1, 2, 3, 4]);
  });

  it("should return initial index + 1 when values are descending", () => {
    const keys = [3, 2, 1, 0];
    const values = [10, 20, 30, 40];
    const mid = partitionByMin(keys, values, 1);
    expect(mid).toBe(2);
    expect(keys.slice(1, mid)).toEqual([0]);
  });

  it("should partition correctly with integers", () => {
    const keys = [0, 1, 2, 3, 4];
    const values = [5, 3, 2, 4, 1];
    const mid = partitionByMin(keys, values);
    expect(keys.slice(0, mid)).toEqual([4]);
  });

  it("should partition correctly with multiple min integers", () => {
    const keys = [0, 1, 2, 3, 4, 5];
    const values = [5, 3, 1, 2, 4, 1];
    const mid = partitionByMin(keys, values);
    expect(keys.slice(0, mid)).toEqual([2, 5]);
  });

  it("should partition correctly for example 1", () => {
    const indices = [0, 1, 2, 3, 4];
    const values = [5, 3, 2, 4, 1];
    const mid = partitionByMin(indices, values);
    expect(indices.slice(0, mid)).toEqual([4]);
  });

  it("should partition correctly for example 2", () => {
    const indices = [0, 5, 3, 2, 4, 1];
    const values = [10, 20, 80, 50, 30, 50];
    const mid = partitionByMin(indices, values, 1, 4);
    expect(indices.slice(1, mid)).toEqual([5, 3]);
  });
});
