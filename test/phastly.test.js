import test from 'ava'
import Chance from 'chance'

import * as fastly from '../build/index.js'

const chance = new Chance()

let service = {
  name: 'test-' + chance.word({length: 30})
}

test.serial('create a new service', async t => {

  let newService = await fastly.createService(service.name)

  t.truthy(newService)
  t.truthy(newService.id)
  t.is(newService.name, service.name)
  service = newService
})

test.serial('delete a service', async t => {
  await fastly.deleteService(service.id)
})
