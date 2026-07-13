window.BENCHMARK_DATA = {
  "lastUpdate": 1783933541714,
  "repoUrl": "https://github.com/Ultimaker/GCodeInsight",
  "entries": {
    "GCodeAnalyzer GH-17816-0": [
      {
        "commit": {
          "author": {
            "name": "Erwan MATHIEU",
            "username": "wawanbreton",
            "email": "erwan.mathieu@ultimaker.com"
          },
          "committer": {
            "name": "Erwan MATHIEU",
            "username": "wawanbreton",
            "email": "erwan.mathieu@ultimaker.com"
          },
          "id": "673d4aa9bbe689e2b9fe9f93e6cc43d8ddbf5778",
          "message": "Fix gcode path not matching time file\n\nCURA-13226",
          "timestamp": "2026-07-10T13:43:47Z",
          "url": "https://github.com/Ultimaker/GCodeInsight/commit/673d4aa9bbe689e2b9fe9f93e6cc43d8ddbf5778"
        },
        "date": 1783702953201,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "Slicing time",
            "value": 1.158,
            "unit": "s"
          },
          {
            "name": "Print time",
            "value": 1313,
            "unit": "s"
          },
          {
            "name": "Buffer overflows",
            "value": 22471,
            "unit": "#"
          }
        ]
      },
      {
        "commit": {
          "author": {
            "name": "Erwan MATHIEU",
            "username": "wawanbreton",
            "email": "erwan.mathieu@ultimaker.com"
          },
          "committer": {
            "name": "Erwan MATHIEU",
            "username": "wawanbreton",
            "email": "erwan.mathieu@ultimaker.com"
          },
          "id": "6182450170166657579cd4f3c6b244d275db2cb0",
          "message": "Properly handle files with spaces in name\n\nCURA-13226",
          "timestamp": "2026-07-13T06:35:24Z",
          "url": "https://github.com/Ultimaker/GCodeInsight/commit/6182450170166657579cd4f3c6b244d275db2cb0"
        },
        "date": 1783933527073,
        "tool": "customBiggerIsBetter",
        "benches": [
          {
            "name": "Slicing time",
            "value": 1.138,
            "unit": "s"
          },
          {
            "name": "Print time",
            "value": 1313,
            "unit": "s"
          },
          {
            "name": "Buffer overflows",
            "value": 22476,
            "unit": "#"
          }
        ]
      }
    ]
  }
}