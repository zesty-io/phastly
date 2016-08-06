import request from 'request-promise'
import ramda from 'ramda'

if (!process.env.FASTLY_API_KEY) {
  throw new Error('Missing env var FASTLY_API_KEY')
}

/**
 * phastly module.
 * @module phastly
**/

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

  return sendP({method, endpoint, form: data})
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

  return sendP({method, endpoint, form: params})
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

  return sendP({method, endpoint, form: params})
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

  return sendP({method, endpoint, form: params})
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

  return sendP({method, endpoint, form: data})
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

  return sendP({method, endpoint, form: settings})
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

  return sendP({method, endpoint, form: settings})
}

/**
 * Wrapper to send a fastly api request. Not for external use unless you want to send a custom request.
 * @param  {Object} request options: baseUrl (string), form (object), endpoint (string), headers (object), method (string), timeout (number)
 * @return {Promise} resolving to response
 */
export function sendP({baseUrl, form, endpoint = '', headers = {}, method = 'GET', timeout = 5000}) {

  baseUrl = baseUrl || 'https://api.fastly.com'

  const fastlyKey = process.env.FASTLY_API_KEY
  const uri       = `${baseUrl}/${endpoint}`

  if (uri === '/') {
    throw new Error('missing baseUrl and/or endpoint!')
  }

  const defaultHeaders = {
    'Fastly-Key': fastlyKey,
    'Accept': 'application/json'
  }

  let sendHeaders = ramda.merge(defaultHeaders, headers)

  const options = {
    method,
    uri,
    headers: sendHeaders,
    timeout,
  }

  if (form) {
    options.form = form
  }

  return request(options)
  .then((response) => {

    if (!response) {
      let optionsLog = options
      delete optionsLog.headers['Fastly-Key']
      throw new Error(`request failed with options: ${JSON.stringify(optionsLog)}`)
    }

    return JSON.parse(response)
  })
}
