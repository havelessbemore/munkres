window.BENCHMARK_DATA = {
  "lastUpdate": 1713197995090,
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
          "id": "3978f3760e5d0cb863494a567fe25cd1779ad438",
          "message": "Update CI benchmark",
          "timestamp": "2024-04-15T11:55:40-04:00",
          "tree_id": "f7219bb02fbabb577e2fda1b1d8f66ad77b66b18",
          "url": "https://github.com/havelessbemore/munkres/commit/3978f3760e5d0cb863494a567fe25cd1779ad438"
        },
        "date": 1713196683896,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "number[4096][4096]",
            "value": 0.49,
            "range": "±0.49%",
            "unit": "ops/sec",
            "extra": "10 samples"
          },
          {
            "name": "bigint[4096][4096]",
            "value": 0.12,
            "range": "±0.49%",
            "unit": "ops/sec",
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
          "id": "6125a65e5d03064e651c4da7e53d964697d65eda",
          "message": "Update coverage to only run on main branch",
          "timestamp": "2024-04-15T12:17:42-04:00",
          "tree_id": "9680a61e40a58af79e3a0895d73a40a0b3c655de",
          "url": "https://github.com/havelessbemore/munkres/commit/6125a65e5d03064e651c4da7e53d964697d65eda"
        },
        "date": 1713197994212,
        "tool": "benchmarkjs",
        "benches": [
          {
            "name": "number[4096][4096]",
            "value": 0.55,
            "range": "±0.42%",
            "unit": "ops/sec",
            "extra": "10 samples"
          },
          {
            "name": "bigint[4096][4096]",
            "value": 0.13,
            "range": "±0.84%",
            "unit": "ops/sec",
            "extra": "10 samples"
          }
        ]
      }
    ]
  }
}