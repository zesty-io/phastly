import request from 'request-promise'
import ramda from 'ramda'

let fastlyApiKey = process.env.FASTLY_API_KEY

/**
 * phastly module.
 * @module phastly
**/

/**
 * Wrapper to send a fastly api request. Use this if the endpoint you need hasn't been mapped to a function.
 * @param  {Object} options
 * @param  {Object} options.params parameters to upload with encoding: application/x-www-form-urlencoded
 * @param  {string} options.baseUrl fastly api baseUrl (default: 'https://api.fastly.com')
 * @param  {string} options.endpoint fastly api endpoint e.g. 'service/${serviceId}/version/${version}/backend' (default: '')
 * @param  {Object} options.headers add to or overwrite the default headers (default: {'Fastly-Key', Accept})
 * @param  {string} options.method the http method (default: GET)
 * @param  {number} options.timeout the connection timeout in ms (default: 5000)
 * @return {Promise} resolving to response
 */
export function sendP({params, baseUrl, endpoint = '', headers = {}, method = 'GET', timeout = 5000}) {

  if (!fastlyApiKey) {
    throw new Error('Fastly API Key missing, try setting env var FASTLY_API_KEY')
  }

  baseUrl = baseUrl || 'https://api.fastly.com'

  const url = `${baseUrl}/${endpoint}`

  if (url === '/') {
    throw new Error('missing baseUrl and/or endpoint!')
  }

  const defaultHeaders = {
    'Fastly-Key': fastlyApiKey,
    'Accept': 'application/json'
  }

  const sendHeaders = ramda.merge(defaultHeaders, headers)

  const options = {
    form: params,
    headers: sendHeaders,
    method,
    timeout,
    url,
  }

  return request(options)
  .then((response) => {

    if (!response) {
      let optionsLog = options
      delete optionsLog.headers['Fastly-Key']
      throw new Error(`request failed with sanitized options: ${JSON.stringify(optionsLog)}`)
    }

    return JSON.parse(response)
  })
}

/**
 * Instant Purge a particular service of items tagged with a Surrogate Key. Soft Purging sets an object's TTL to 0s, forcing revalidation. For best results, Soft Purging should be used in conjuction with stale_while_revalidate and stale_if_error.
 * @param  {string}  serviceId
 * @param  {string}  key
 * @param  {Boolean} [soft=false] sets an object's TTL to 0s
 * @return {Promise} resolves to parsed api result object
 */
export function purgeP(serviceId, key, soft = false) {

  const method   = 'POST'
  const endpoint = `/service/${serviceId}/purge/${key}`
  const headers  = soft ? {'Fastly-Soft-Purge': 1} : {}

  return sendP({endpoint, method, headers})
}

/**
 * Instant Purge an individual URL. Soft Purging sets an object's TTL to 0s, forcing revalidation. For best results, Soft Purging should be used in conjuction with stale_while_revalidate and stale_if_error.
 * @param  {string}  url
 * @param  {Boolean} [soft=false]
 * @return {Promise} resolves to parsed api result object
 */
export function purgeUrlP(url, soft = false) {

  const method  = 'PURGE'
  const headers = soft ? {'Fastly-Soft-Purge': 1} : {}

  return sendP({baseUrl: url, method, headers})
}

/**
 * Instant Purge everything from a service
 * @param  {string} serviceId
 * @return {Promise} resolves to parsed api result object
 */
export function purgeAllP(serviceId) {

  const method   = 'POST'
  const endpoint = `/service/${serviceId}/purge_all`

  return sendP({endpoint, method})
}

/**
 * Create a backend for a particular service and version
 * @param  {string} serviceId
 * @param  {number} version
 * @param  {Object} data  keys are backend object keys
 * @return {Promise} resolves to parsed api result object
 */
export function createBackendP(serviceId, version, data) {

  const method   = 'POST'
  const endpoint = `/service/${serviceId}/version/${version}/backend`

  return sendP({method, endpoint, params: data})
}

/**
 * Delete the backend for a particular service and version
 * @param  {string} serviceId
 * @param  {number} version
 * @param  {string} name  name of backend
 * @return {Promise} resolves to parsed api result object
 */
export function deleteBackendP(serviceId, version, name) {

  const method   = 'DELETE'
  const endpoint = `/service/${serviceId}/version/${version}/backend/${name}`

  return sendP({method, endpoint})
}

/**
 * Create a service
 * @param  {string} name
 * @return {Promise} resolves to parsed api result object
 */
export function createServiceP(name) {

  const method   = 'POST'
  const endpoint = '/service'
  const params   = {name}

  return sendP({method, endpoint, params})
}

/**
 * Update a service
 * @param  {Object} params key/values of paramters to update
 * @return {Promise} resolves to parsed api result object
 */
export function updateServiceP(serviceId, params) {

  const method   = 'PUT'
  const endpoint = `/service/${serviceId}`

  return sendP({method, endpoint, params})
}

/**
 * Create a version for a particular service
 * @param  {string} serviceId
 * @return {Promise} resolves to parsed api result object
 */
export function createServiceVersionP(serviceId) {

  const method   = 'POST'
  const endpoint = `/service/${serviceId}/version`

  return sendP({method, endpoint})
}

/**
 * Update a particular version for a particular service.
 * @param  {string} serviceId
 * @param  {number} version
 * @param  {Object} data  keys are service object keys
 * @return {Promise} resolves to parsed api result object
 */
export function updateServiceVersionP(serviceId, version, data) {

  const method   = 'PUT'
  const endpoint = `/service/${serviceId}/version/${version}`
  const params   = data

  return sendP({method, endpoint, params})
}

/**
 * Validate the version for a particular service and version
 * @param  {string} serviceId
 * @param  {number} version
 * @return {Promise} resolves to parsed api result object
 */
export function validateServiceVersionP(serviceId, version) {

  const endpoint = `/service/${serviceId}/version/${version}/validate`

  return sendP({endpoint})
}

/**
 * Activate the current version
 * @param  {string} serviceId
 * @param  {number} version
 * @return {Promise} resolves to parsed api result object
 */
export function activateServiceVersionP(serviceId, version) {

  const method   = 'PUT'
  const endpoint = `/service/${serviceId}/version/${version}/activate`

  return sendP({method, endpoint})
}

/**
 * Deactivate the current version
 * @param  {string} serviceId
 * @param  {number} version
 * @return {Promise} resolves to parsed api result object
 */
export function deactivateServiceVersionP(serviceId, version) {

  const method   = 'PUT'
  const endpoint = `/service/${serviceId}/version/${version}/deactivate`

  return sendP({method, endpoint})
}

/**
 * Clone the current configuration into a new version
 * @param  {string} serviceId
 * @param  {number} version
 * @return {Promise} resolves to parsed api result object
 */
export function cloneServiceVersion(serviceId, version) {

  const method   = 'PUT'
  const endpoint = `/service/${serviceId}/version/${version}/clone`

  return sendP({method, endpoint})
}

/**
 * Locks the specified version
 * @param  {string} serviceId
 * @param  {number} version
 * @return {Promise} resolves to parsed api result object
 */
export function lockServiceVersion(serviceId, version) {

  const method   = 'PUT'
  const endpoint = `/service/${serviceId}/version/${version}/lock`

  return sendP({method, endpoint})
}

/**
 * Delete a service
 * @param  {string} serviceId
 * @return {Promise} resolves to parsed api result object
 */
export function deleteServiceP(serviceId) {

  const method   = 'DELETE'
  const endpoint = `/service/${serviceId}`

  return sendP({method, endpoint})
}

/**
 * Rename a service
 * @param  {string} serviceId
 * @param  {string} newName
 * @return {Promise} resolves to parsed api result object
 */
export function renameServiceP(serviceId, newName) {

  const method   = 'PUT'
  const endpoint = `/service/${serviceId}`
  const params   = {name: newName}

  return sendP({method, endpoint, params})
}

/**
 * helper function - get active version from a fastly version list
 * @param  {Object[]} versions of the service
 * @return {Object} version information
 */
export function filterActiveVersion(versions) {

  const actives = ramda.filter((version) => {
    return version.active === true
  }, versions)

  return actives[0]
}

/**
 * List services
 * @return {Promise} resolves to parsed api result object
 */
export function ListServicesP() {

  const endpoint = '/service'

  return sendP({endpoint})
}

/**
 * Get a service by id
 * @param  {string} serviceId
 * @return {Promise} resolves to parsed api result object
 */
export function getServiceP(serviceId) {

  const endpoint = `/service/${serviceId}`

  return sendP({endpoint})
}

/**
 * Get a service by name
 * @param  {string} name name of service
 * @return {Promise} resolves to parsed api result object
 */
export function getServiceByNameP(name) {

  const endpoint = `/service/search?name=${encodeURIComponent(name)}`

  return sendP({endpoint})
}

/**
 * List detailed information on a specified service
 * @param  {string} serviceId
 * @return {Promise} resolves to parsed api result object
 */
export function getServiceDetailsP(serviceId) {

  const endpoint = `/service/${serviceId}/details`

  return sendP({endpoint})
}

/**
 * List the domains within a service
 * @param  {string} service id
 * @return {Promise} resolves to deserialized response
 */
export function getServiceDomainsP(id) {

  const endpoint = `/service/${id}/domain`

  return sendP({endpoint})
}

/**
 * Create a domain for a particular service and version
 * @param  {string} serviceId
 * @param  {number} version
 * @param  {Object} data  fastly domain object
 * @return {Promise} resolves to parsed api result object
 */
export function createDomainP(serviceId, version, data) {

  const method   = 'POST'
  const endpoint = `/service/${serviceId}/version/${version}/domain`

  return sendP({method, endpoint, params: data})
}

/**
 * Check all domains' DNS for a particular service and version
 * @param  {string} serviceId
 * @param  {number} version
 * @return {Promise} resolves to parsed api result object
 */
export function checkAllDomainsP(serviceId, version) {

  const endpoint = `/service/${serviceId}/version/${version}/domain/check_all`

  return sendP({endpoint})
}

/**
 * Create a new Request Settings object
 * @param  {string} serviceId
 * @param  {number} version
 * @param  {Object} settings fastly request settings object: {hash_keys, action, ...}
 * @return {Promise}
 */
export function createRequestSettingP(serviceId, version, settings) {

  const method   = 'POST'
  const endpoint = `/service/${serviceId}/version/${version}/request_settings`

  return sendP({method, endpoint, params: settings})
}

/**
 * Update the settings for a particular service and version
 * @param  {string} serviceId
 * @param  {number} version
 * @param  {Object} settings  fastly settings object e.g. {general.default_host, general.default_ttl, ...}
 * @return {Promise} resolves to parsed api result object
 */
export function updateSettingsP(serviceId, version, settings) {

  const method   = 'PUT'
  const endpoint = `/service/${serviceId}/version/${version}/settings`

  return sendP({method, endpoint, params: settings})
}

/**
 * set or change the fastly api key
 * @param {string} key your fastly api key
 */
export function setApiKey(key) {
  fastlyApiKey = key
}
