# testing__version-aggregator-service
A service that aggregates testing__version-service's or other testing__version-aggregator-service's.

For example, say you have `testing__version-aggregator-service`'s running on `localhost:8080` and `localhost:8001` and a `testing__version-service` running on `localhost:8000`.

If you `POST` to `localhost:8080/aggregate` with the following body:

```json
{
  "versionServices": [
    { "url": "http://localhost:8000" }
  ],
  "versionAggregatorServices": [
    {
      "url": "http://localhost:8001",
      "requestBody": {
        "versionServices": [
          { "url": "http://localhost:8000" },
          { "url": "http://localhost:8002" }
        ]
      }
    }
  ]
}
```

You should get the following response:

```json
{
  "versionServices": [
    {
      "url": "http://localhost:8000",
      "status": 200,
      "body": {
        "version": "v3.0.0"
      }
    }
  ],
  "versionAggregatorServices": [
    {
      "url": "http://localhost:8001",
      "status": 200,
      "body": {
        "versionServices": [
          {
            "url": "http://localhost:8000",
            "status": 200,
            "body": {
              "version": "v3.0.0"
            }
          },
          {
            "url": "http://localhost:8002",
            "error": "Error: connect ECONNREFUSED 127.0.0.1:8002"
          }
        ],
        "versionAggregatorServices": []
      }
    }
  ]
}
```
