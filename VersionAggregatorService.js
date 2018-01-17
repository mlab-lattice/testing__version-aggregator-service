const carbon = require('carbon-io')
const o  = carbon.atom.o(module).main
const _o = carbon.bond._o(module)
const __ = carbon.fibers.__(module).main

__(() => {
  module.exports = o({
    _type: carbon.carbond.Service,
    port: _o('env:PORT') || 8080,
    endpoints: {
      // This ain't pretty but it'll do.
      aggregate: o({
        _type: carbon.carbond.Endpoint,
        post: {
          parameters: {
            body: {
              location: 'body',
              required: true,
              schema: {
                type: 'object',
                properties: {
                  versionServices: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        url: {
                          type: 'string',
                        },
                      },
                    },
                  },
                  versionAggregatorServices: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        url: {
                          type: 'string',
                        },
                        requestBody: {
                          type: 'object',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          service: (req) => {
            const versionServiceResponses = []
            if (req.parameters.body.versionServices) {
              for (let versionService of req.parameters.body.versionServices) {
                let resp
                try {
                  resp = _o(versionService.url).getEndpoint("version").get()
                } catch (err) {
                  versionServiceResponses.push({
                    url: versionService.url,
                    error: err.toString(),
                  })
                  continue
                }

                versionServiceResponses.push({
                  url: versionService.url,
                  status: resp.statusCode,
                  body: resp.body,
                })
              }
            }

            const versionAggregationServiceResponses = []
            if (req.parameters.body.versionAggregatorServices) {
              for (let versionAggregatorService of req.parameters.body.versionAggregatorServices) {
                let resp
                try {
                  resp = _o(versionAggregatorService.url).getEndpoint("aggregate").post(versionAggregatorService.requestBody)
                } catch (err) {
                  versionAggregationServiceResponses.push({
                    url: versionAggregatorService.url,
                    error: err.toString(),
                  })
                  continue
                }

                versionAggregationServiceResponses.push({
                  url: versionAggregatorService.url,
                  status: resp.statusCode,
                  body: resp.body,
                })
              }
            }

            return {
              versionServices: versionServiceResponses,
              versionAggregatorServices: versionAggregationServiceResponses,
            }
          },
        },
      }),
      status: o({
        _type: carbon.carbond.Endpoint,
        get: (req) => {
          return { ok: true }
        },
      })
    },
  })
})
