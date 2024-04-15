window.BENCHMARK_DATA = {
  "lastUpdate": 1713206418849,
  "repoUrl": "https://github.com/havelessbemore/munkres",
  "entries": {
    "Munkres Benchmarks": [
      {
        "commit": {
          "author": {
            "email": "dev.michael.rojas@gmail.com",
            "name": "havelessbemore",
            "username": "havelessbemore"
          },
          "committer": {
            "email": "dev.michael.rojas@gmail.com",
            "name": "havelessbemore",
            "username": "havelessbemore"
          },
          "distinct": true,
          "id": "03dc04c4eb13ffe4593c6d95adb280448a7d1bce",
          "message": "Update ci.bench.ts",
          "timestamp": "2024-04-15T14:29:45-04:00",
          "tree_id": "6272801365388c482d8cf6aeef1926020409677e",
          "url": "https://github.com/havelessbemore/munkres/commit/03dc04c4eb13ffe4593c6d95adb280448a7d1bce"
        },
        "date": 1713205943542,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "number[4096][4096]",
            "value": 1854.3185600999998,
            "unit": "ms",
            "range": "±6.58%",
            "extra": "10 samples"
          },
          {
            "name": "bigint[4096][4096]",
            "value": 7689.995308,
            "unit": "ms",
            "range": "±6.64%",
            "extra": "10 samples"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "email": "dev.michael.rojas@gmail.com",
            "name": "havelessbemore",
            "username": "havelessbemore"
          },
          "committer": {
            "email": "dev.michael.rojas@gmail.com",
            "name": "havelessbemore",
            "username": "havelessbemore"
          },
          "distinct": true,
          "id": "aa4732c0f6d4d1e2497cbe66bf1a428bec2c97fc",
          "message": "Change benchmark workflow's node version from 21 to 20",
          "timestamp": "2024-04-15T14:37:38-04:00",
          "tree_id": "9b61231a45f534a20b300bb629c23e02001abcc0",
          "url": "https://github.com/havelessbemore/munkres/commit/aa4732c0f6d4d1e2497cbe66bf1a428bec2c97fc"
        },
        "date": 1713206418465,
        "tool": "customSmallerIsBetter",
        "benches": [
          {
            "name": "number[4096][4096]",
            "value": 2250.9367762999996,
            "unit": "ms",
            "range": "±9.36%",
            "extra": "10 samples"
          },
          {
            "name": "bigint[4096][4096]",
            "value": 8150.9530288,
            "unit": "ms",
            "range": "±6.76%",
            "extra": "10 samples"
          }
        ]
      }
    ]
  }
}