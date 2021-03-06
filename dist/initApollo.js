'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})

var _extends2 = require('babel-runtime/helpers/extends')

var _extends3 = _interopRequireDefault(_extends2)

exports.default = initApollo

var _apolloBoost = require('apollo-boost')

var _apolloCacheInmemory = require('apollo-cache-inmemory')

var _isomorphicFetch = require('isomorphic-fetch')

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch)

var _lodash = require('lodash.isfunction')

var _lodash2 = _interopRequireDefault(_lodash)

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj }
}

var apolloClient = null

// Polyfill fetch() on the server (used by apollo-client)
if (!process.browser) {
  global.fetch = _isomorphicFetch2.default
}

var createDefaultCache = function createDefaultCache() {
  return new _apolloCacheInmemory.InMemoryCache()
}

function create(apolloConfig, initialState) {
  var createCache = apolloConfig.createCache || createDefaultCache

  var config = (0, _extends3.default)(
    {
      connectToDevTools: process.browser,
      ssrMode: !process.browser, // Disables forceFetch on the server (so queries are only run once)
      cache: createCache().restore(initialState || {})
    },
    apolloConfig
  )

  delete config.createCache

  return new _apolloBoost.ApolloClient(config)
}

function initApollo(apolloConfig, initialState, ctx) {
  if ((0, _lodash2.default)(apolloConfig)) {
    apolloConfig = apolloConfig(ctx)
  }
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser) {
    return create(apolloConfig, initialState)
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(apolloConfig, initialState)
  }

  return apolloClient
}
