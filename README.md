# Beagle
Beagle is an open source project with the objective to reduce the complexity of implementing
server-driven UIs for any kind of project. Our main goal is to offer a simple set of libraries
that makes it very easy to define a view in the backend (Beagle Backend For Front-End) and consume
it in the front-end rendering every component described by the view definition (Beagle Front-End
libraries).

While developing Beagle we always have in mind that the developer shouldn't change too much of
the way he usually develops their components, so it is easy to adapt already existing design systems
to work with Beagle.

For now, Beagle supports Android native, iOS native, WEB Angular and WEB React. We are soon going
to add support for some mobile frameworks, like React Native and Flutter. This repository addresses
only Beagle WEB, to check the other platforms, you should go to https://github.com/ZupIT/beagle.

To know more about Beagle as a whole, please visit our
[documentation page](https://docs.usebeagle.io).

## Beagle WEB
Beagle WEB is the library used to render beagle views in any javascript project, i.e. it is
currently used to develop Beagle for Angular, Beagle for React and Beagle for React Native. The code
here is the core part of all these libraries. If you're looking to develop a project in any of these
frameworks, you should be looking in the following places instead:

- Beagle Angular: [npm](https://www.npmjs.com/package/@zup-it/beagle-angular),
[git](https://github.com/ZupIT/beagle-web-angular)
- Beagle React: [npm](https://www.npmjs.com/package/@zup-it/beagle-react),
[git](https://github.com/ZupIT/beagle-web-react)
- Beagle React Native: npm, [git](https://github.com/ZupIT/beagle-web-react)

This library is for you if you are going to develop your project in pure javascript or in a
javascript framework we don't yet support. If it's the second case, you're welcome to publish it as
a new library and help us support Beagle in more platforms!

## Installation
You can use both yarn and npm. In this example, we use yarn. In your project's directory, in your
terminal, type:

```bash
yarn add @zup-it/beagle-web
```

## How does it work?
This library is responsible for fetching and parsing a view from a Beagle backend, managing loading
and error feedbacks, updates to the view and also navigation. The entry point for all these features
is the BeagleService, which can be created through the function `createBeagleService`. See the
example below:

```typescript
import createBeagleService from '@zup-it/beagle-web'

const beagleService = createBeagleService({
  baseUrl: 'https://beagle-bff.mysite.com', // the base url of the backend providing the views
  // the components of your application
  components: {
    container: myContainerComponent,
    textInput: myTextInputComponent,
  },
})
```

The Beagle Service requires a configuration object where you set up how the lib is going to behave.
The `baseUrl` and `components` properties are required. The `baseUrl` must be set according to the
address of your backend application. The `components` is a map of type `<string, any>` and there
must be one key for each component that the backend can return. The value will depend on how you
render the components in your project. If we take React, for instance, the value is a Functional
Component. In Angular, the values of this map would be classes.

### Creating a view
After creating the Beagle Service, you can start to create Beagle Views, which are the main entity
of your server-driven UIs. To create a Beagle View, you should use the `createView` method of the
Beagle Service. A Beagle View must be observed and it also must fetch something for it to have an
effect. In the example below we fetch the view `home` and we log it to the console.

```typescript
const myView = beagleService.createView()

myView.subscribe((view) => {
  console.log(view)
})

myView.fetch({ path: '/home' })
```

Your main loop is the function passed as parameter to `subscribe`. This function is called everytime
a change happens to the view. In the example above it will be called twice, the first time it will
have a view with a loading component and the second time, when the request ends, the home itself. If
an error happens along the way, it will have an error component instead of the home.

### Rendering a view
The view received by the function passed to `subscribe` is always a Beagle Tree, i.e. it will always
be an object with an `id`, a `_beagleComponent_` and, maybe, an array of `children`. The id is a
unique identifier for an element in the tree while the `_beagleComponent_` tells which component
should be loaded. Any additional parameter is considered to be a property of the component itself.

In React, for instance, you could render a beagle tree using a recursive strategy with
React.createElement.

```typescript
function renderReact(beagleElement) {
  const { id, _beagleComponent_, children, ...props } = beagleElement
  const Component = beagleService.getConfig().components[_beagleComponent_]
  const reactChildren = children && children.map(renderReact)
  return React.createElement(Component, { ...props, key: id }, reactChildren)
}

myView.subscribe(renderReact) 
```

The rendering strategy will depend entirely on how you define your components or the framework
you're using. It is worth remembering again that we have implementations for both React and Angular
and if you're using those, you should be using these libraries instead:
[Beagle React](https://www.npmjs.com/package/@zup-it/beagle-react)
[Beagle Angular](https://www.npmjs.com/package/@zup-it/beagle-angular).

The properties of a component can be strings, numbers, booleans, maps, arrays or even functions. A
button, for example, can have `text`, `disabled` and `onPress`, where the first is its text, the
second tells if it's clickable or not and the third is a function that must be called when its
pressed. Taking again React as an example, we could have implemented this component in the following
way:

```typescript
import React, { FC } from 'react'

interface ButtonInterface {
  text: string,
  disabled?: boolean,
  onPress: () => void,
}

const Button: FC<ButtonInterface> = ({ text, disabled, onPress }) => (
  <button disabled={disabled} onClick={onPress}>{text}</button>
)

export default Button
```

## The Beagle Tree data structure
Beagle works over a tree of components and, for it to work, it must respect some rules.
[Read more](docs/data-structure.md)

## Dynamic behaviors: context, expressions and actions
Beagle thinks the server driven UI should not bring detriment to the user experience and if our
views are always static we might have to make an excessive number of requests and not be able to
offer a true dynamic interface to the end-user. Besides, it can get very tricky to program complex
interfaces if everytime a component needs to communicate with another the logic is handled to the
backend. To solve these issues, Beagle brings the concept of contexts, expressions and actions.
[Read more](https://docs.usebeagle.io/resources/comunication-between-components-and-context).

## The rendering process (lifecycles)
Every Beagle Web library has a very well defined process of how it fetches, process and renders a
view. There's an order that must always be respected and hook points where the developer can execute
some code of his own (lifecycles). [Read more](docs/renderization.md)

## API
In the following sections we describe the API offered by Beagle WEB.

### Beagle View
The Beagle View is the entity responsible to manage a server-driven view. It can be created through
the Beagle Service via the function `createBeagleView`. The BeagleView can fetch a new view, update
its tree, navigate, etc. [Read more](docs/beagle-view.md)

### Beagle Tree
The Beagle Tree is the entity used to represent a server-driven view, as its name says, it has a
tree structure. Beagle offers many functions to help traversing this tree, finding specific
components or altering it. [Read more](docs/beagle-tree)

### Services
Besides the ability to create views, Beagle offers access to some services that might be useful to
achieve the exact behavior wanted for your application. The Beagle Service is the main service, but
as soon as we create it, we have access to all of the following:

- [GlobalContext](docs/services#GlobalContext)
- [UrlBuilder](docs/services#UrlBuilder)
- [ViewClient](docs/services#ViewClient)
- [RemoteCache](docs/services#RemoteCache)
- [DefaultHeaders](docs/services#DefaultHeaders)

[Read more](docs/services)

## Notes to contributors
If you intend to contribute to this project, you should know more about the code specifically. Here
we talk about how the code is organized, the tools we use and some coding conventions we adopted.
[Read more](docs/contributor)
