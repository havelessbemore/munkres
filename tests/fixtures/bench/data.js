window.BENCHMARK_DATA = {
  "lastUpdate": 1713631006123,
  "repoUrl": "https://github.com/havelessbemore/munkres",
  "entries": {
    "Munkres Benchmarks": [
      {
        "commit": {
          "author": { "name": "A", "email": "a@example.com", "username": "auser" },
          "committer": { "name": "A", "email": "a@example.com", "username": "auser" },
          "distinct": true,
          "id": "1111111111111111111111111111111111111111",
          "message": "first commit",
          "timestamp": "2024-04-20T12:32:24-04:00",
          "tree_id": "aaa",
          "url": "https://github.com/havelessbemore/munkres/commit/1111111111111111111111111111111111111111"
        },
        "date": 1713631006123,
        "tool": "customSmallerIsBetter",
        "benches": [{ "name": "number[2048][2048]", "value": 100, "unit": "ms" }]
      },
      {
        "commit": {
          "author": { "name": "B", "email": "b@example.com", "username": "buser" },
          "committer": { "name": "B", "email": "b@example.com", "username": "buser" },
          "distinct": true,
          "id": "2222222222222222222222222222222222222222",
          "message": "third commit (out of order to test sort)",
          "timestamp": "2025-06-01T10:00:00+00:00",
          "tree_id": "bbb",
          "url": "https://github.com/havelessbemore/munkres/commit/2222222222222222222222222222222222222222"
        },
        "date": 9999999999999,
        "tool": "customSmallerIsBetter",
        "benches": [{ "name": "number[2048][2048]", "value": 110, "unit": "ms" }]
      },
      {
        "commit": {
          "author": { "name": "C", "email": "c@example.com", "username": "cuser" },
          "committer": { "name": "C", "email": "c@example.com", "username": "cuser" },
          "distinct": true,
          "id": "3333333333333333333333333333333333333333",
          "message": "second commit (out of order to test sort)",
          "timestamp": "2024-12-15T08:00:00+00:00",
          "tree_id": "ccc",
          "url": "https://github.com/havelessbemore/munkres/commit/3333333333333333333333333333333333333333"
        },
        "date": 1734249600000,
        "tool": "customSmallerIsBetter",
        "benches": [{ "name": "number[2048][2048]", "value": 105, "unit": "ms" }]
      }
    ]
  }
};