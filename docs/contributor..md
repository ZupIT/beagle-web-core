# Notes to contributors
If you intend to contribute to this project, you should know more about the code specifically. Here
we talk about how the code is organized, the tools we use and some coding conventions we adopted.

## Project structure
This project has four main directory in its root:

- __tests__: every unit and integration test should be placed here. To run the tests, type
`yarn test` in the cmd.
- bin: executable scripts needed for development, e.g. script to publish the library.
- docs: place for github md files other than the README.md.
- src: the main directory, the source code of the library.

### The `src` directory

The `src` directory groups its files by functionality. The following directories can be found in
its root:

- action: every beagle action should be placed here. Examples: `setContext`, `pushView`,
`addChildren`, `sendRequest`.
- beagle-tree: every function and type related to the tree structure of a beagle view should be
placed here. Examples: `forEach`, `findById`, `clone`, `replaceInTree`, `BeagleUIElement`.
- beagle-view: everything related to the beagle-view and its sub-entities should be placed here.
It is in `beagle-view/render` where all the rendering process of a view is found. Examples: the
BeagleView itself, the Navigator, the Renderer.
- error: error classes.
- legacy: sometimes we need to deprecate a piece of code before we can remove it. This is the place
for this type of code. Everytime it is possible to separate the deprecated code from the rest, the
deprecated code goes here.
- metadata: beagle can read metadata from the components passed in its configuration. The metadata
is usually about the typing of each component and the children they're able to receive. This
metadata is retrieved through annotations.
- operation: beagle accepts operations in its expression language. Operations are pure functions and
they should all be placed under this directory.
- service: given an instance of beagle, services work like singletons, i.e. for a single instance of
Beagle there will be only one instance of each of the services. Examples: `BeagleService`,
`GlobalContext`, `URLBuilder`.
- utils: utility functions related to an entity. For a file to be considered utility, we must be
able to place it in any other project and it would still be useful, i.e. the functions must be
100% decoupled from Beagle. Examples: string utils, object utils, url utils.
- index.ts: manages all exports of this lib.
- types.ts: if it doesn't feel right to place a type anywhere else, if it really is global to the
lib, it should be placed here.

## Naming conventions

### Directories and files
Directories and files should always be named using kebab-case, i.e. only lowercase letters and `-`
to separate words. The single exception is classes: every file that represents a class should be
named using CamelCase with a first capital letter. Besides error classes, in this project, we
decided not to use classes.

#### Aliases
To avoid the excessive use of `../../..` we are using aliases, i.e, you should never use `..` to
make an import, instead, you should reference the entire path from `src`. For instance, no matter
where you are in the code base, to import the `BeagleError`, you'll always use
`import BeagleError from errors/BeagleError`.

So aliases work when the lib is exported, after building we run `tscpaths`, which corrects the paths
in each file, replacing the aliases for the actual path.

### Variables
Variables should use the camelCase pattern. The first letter should be capital only if the variable
represents classes, types or definitions of entities. See the examples below:

```typescript
import BeagleService from 'service/beagle-service'
import URLBuilder from 'service/network/url-builder'
import BeagleError from 'error/beagle-error'

interface MyInterface {}

type MyType = {}

const beagleService = BeagleService.create({
  // ...
})

const urlBuilder = URLBuilder.create('')

const error = new BeagleError('oops!')
```

Note that instances always start with lower case and classes, types or definitions of entities
always start with a capital letter.

We don't have a pattern for constants, you can use either full uppercase letters with `_` to
separate words or the common camelCase pattern. This is because in javascript, most of our variables
are constants and naming all of them in uppercase letters would make a very difficult to read code.

### Functions
Functions should always be named using camelCase. The first letter should always be lowercase.

## Classes
The only classes in this code base are error classes, every other entity must be represented by
objects, functions and typescript interfaces.

Everytime we want to define a structure that can be instantiated we use a typescript interface, a
javascript object and a function to create an instance of the structure. See the example below of
the service `URLBuilder`:

The interface:
```typescript
export interface URLBuilder {
  build: (path: string) => string,
}
```

The file responsible to instantiate the structure:
```typescript
function createURLBuilder(baseUrl: string): URLBuilder {
  // ...
  return {
    build: (path: string) {
      // ...
    }
  }
}

export default {
  create: createURLBuilder,
}
```

To actually instantiate the URLBuilder:
```typescript
import URLBuilder from 'service/network/url-builder'

const urlBuilder = URLBuilder.create('http://base-url')
```

Every structure that can be instantiated must follow this pattern!

## Coding conventions
Every coding convention is checked by es-lint. No pull request is going to be accepted if it doesn't
pass the es-lint check. To run es-lint, type `yarn lint` in the cmd.

To check all conventions, please check the file `.eslintrc.js`.

## License headers
Every source or test file must have the license header. Pull requests with files without the header
won't be accepted. Please, copy the header text from the file `src/index.ts`.

## Tests
Tests are extremely important in this library. If anything breaks here, every angular, react and
react-native projects using Beagle will be affected. Any new feature or modification must be tested.
Pull requests that adds or change a functionality and doesn't update the related tests won't be
accepted. All tests must be placed under the directory `__tests__` and must follow the same
directory structure of `src`. The tests are written using Jest.

## Tools
These are the main tools used in this project:
- typescript
- jest
- eslint
- node
- lodash
