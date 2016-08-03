import request from 'request-promise'
import ramda from 'ramda'


if (!process.env.FASTLY_API_KEY) {
  throw new Error('Missing env var FASTLY_API_KEY')
}

/**
 * send the fastly request
 * @param  {Object} request options
 * @return {Promise} resolving to response
 */
export function send({baseUrl, endpoint = '', form, headers = {}, method = 'GET', timeout = 5000}) {

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

export function purgeUrl(url, soft = false) {

  const method  = 'PURGE'
  const headers = soft ? {'Fastly-Soft-Purge': 1} : {}

  return send({baseUrl: url, method, headers})
}

export function purge(service, key, soft = false) {

  const method   = 'POST'
  const endpoint = `service/${service}/purge/${key}`
  const headers  = soft ? {'Fastly-Soft-Purge': 1} : {}

  return send({endpoint, method, headers})
}

export function purgeAll(service) {

  const method   = 'POST'
  const endpoint = `service/${service}/purge_all`

  return send({endpoint, method})
}

export function createBackend(service, version, params) {

  const method   = 'POST'
  const endpoint = `service/${service}/version/${version}/backend`

  return send({method, endpoint, form: params})
}

export function deleteBackend(service, version, name) {

  const method   = 'DELETE'
  const endpoint = `service/${service}/version/${version}/backend/${name}`

  return send({method, endpoint})
}

export function createService(name) {

  const method   = 'POST'
  const endpoint = '/service'
  const params   = {name}

  return send({method, endpoint, form: params})
}

export function deleteService(id) {

  const method   = 'DELETE'
  const endpoint = `/service/${id}`

  return send({method, endpoint})
}

export function renameService(id, newName) {

  const method   = 'PUT'
  const endpoint = `/service/${id}`
  const params   = {name: newName}

  return send({method, endpoint, form: params})
}

export function getServices() {

  const method   = 'GET'
  const endpoint = 'service'

  return send({method, endpoint})
}

export function getService(id) {

  const method   = 'GET'
  const endpoint = `service/${id}`

  return send({method, endpoint})
}

export function getServiceDetails(id) {

  const method   = 'GET'
  const endpoint = `service/${id}/details`

  return send({method, endpoint})
}

/**
 * List the domains within a service
 * @param  {string} service id
 * @return {Promise} resolves to deserialized response
 */
export function getServiceDomains(id) {

  const method   = 'GET'
  const endpoint = `service/${id}/domain`

  return send({method, endpoint})
}
