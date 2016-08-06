# phastly
functional fastly api with promises. A simple, minimal node.js fastly api wrapper. Sends the requests out and gives you back promises which resolve to the parsed object.

For information on request parameters and response formats, please read: <https://docs.fastly.com/api/>

Tested with node4+

Unlike current node fastly wrappers, this library seeks to add administrative endpoints such as adding and removing backends, in addition to purging.

In development and does not immediately seek to cover all endpoints but open to it. Pull requests and feature requests welcome.

## Usage

### Promises

```js
import * as fastly from 'phastly'

function setup(name) {
  fastly.createService(name)
  .then((newService) => {
    // use newService here
  })
}
```

### Async/Await
```js
import * as fastly from 'phastly'

async function setup(name) {
  let newService = await fastly.createService(name)
  // use newService here
}
```
