# **Beagle Web**
[![CII Best Practices](https://bestpractices.coreinfrastructure.org/projects/5396/badge)](https://bestpractices.coreinfrastructure.org/projects/5396)

## **Table of Contents**

### 1. [**About**](#about)
### 2. [**Usage**](#usage)
>#### 2.1. [**Installation**](#installation)
>#### 2.2. [**How does it work?**](#how-does-it-work)
### 3. [**Configuration**](#configuration)
### 4. [**API**](#api)
### 5. [**Documentation**](#documentation)
### 6. [**Contributing**](#contributing)
### 7. [**Code of Conduct**](#code-of-conduct)
### 8. [**License**](#license)
### 9. [**Community**](#community)

## **About**

Beagle Web is the library used to render Beagle views in any Javascript project. It is currently used to develop Beagle for Angular, React, and React Native. The code here is the core part of all these libraries. If you're looking to develop a project in any of these frameworks, check out: 

- Beagle Angular: [**npm**](https://www.npmjs.com/package/@zup-it/beagle-angular),
[**Git**](https://github.com/ZupIT/beagle-web-angular)
- Beagle React: [**npm**](https://www.npmjs.com/package/@zup-it/beagle-react),
[**Git**](https://github.com/ZupIT/beagle-web-react)
- Beagle React Native: npm, [**Git**](https://github.com/ZupIT/beagle-web-react)

This library is to develop your project in Javascript or in a Javascript framework Beagle doesn't support yet. You can help us support Beagle on more platforms, you can publish a new library.


## **Usage**

### **Installation**
You can use both yarn and npm. In this example, we use yarn. In your project's directory, type in your terminal: 

```bash
yarn add @zup-it/beagle-web
```

### **How does it work?**
This library is responsible for fetching views, parsing them, and updating the UI according to the results. These views are obtained from a Beagle backend service once navigation is performed by the application. The entry point for all these features is the BeagleService, which can be created through the function `createBeagleService`. See the example below:

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

Beagle Service requires a configuration object where you set up how the lib is going to behave.
The `baseUrl` and `components` properties are required. The `baseUrl` must be set according to the address of your backend application. The `components` is a map of type `<string, any>` and there must be one key for each component that the backend can return. The value will depend on how you render the components in your project. If we take React, for instance, the value is a Functional
Component. In Angular, the values of this map would be classes.

## **Configuration**

### **Creating a view**
After creating the Beagle Service, you can start to create Beagle Views, which are the main entity of your server-driven UIs. To create a Beagle View, you should use the `createView` method of the Beagle Service. A Beagle View must be observed and it will show some content as soon as navigation is performed. In the example below we create a view and navigate it to `home`, logging the results to the console: 

```typescript
const myView = beagleService.createView()

myView.subscribe((view) => {
  console.log(view)
})

myView.getNavigator().pushView({ url: '/home' })
```

Your main loop is the function passed as a parameter to `subscribe`. This function is called every time a change happens to the view. In the example, it was called twice, the first time it had a view with a loading component, and the second one the request ends, the home itself. If an error happens, it will have an error component instead of the home.

### **Rendering a view**
The view received by the function passed to `subscribe` is always a Beagle Tree, i.e. it will always be an object with an `id`, a `_beagleComponent_` and, maybe, an array of `children`. The id is a unique identifier for an element in the tree while the `_beagleComponent_` tells which component should be loaded. Any additional parameter is considered to be a property of the component itself.

In React, for instance, you could render a Beagle tree using a recursive strategy with React.createElement. See below: 

```typescript
function renderReact(beagleElement) {
  const { id, _beagleComponent_, children, ...props } = beagleElement
  const Component = beagleService.getConfig().components[_beagleComponent_]
  const reactChildren = children && children.map(renderReact)
  return React.createElement(Component, { ...props, key: id }, reactChildren)
}

myView.subscribe(renderReact) 
```

The rendering strategy will depend entirely on how you define your components or the framework you're using. It is worth remembering again that we have implementations for both React and Angular and if you're using those, you should be using these libraries instead:
- [**Beagle React**](https://www.npmjs.com/package/@zup-it/beagle-react)
- [**Beagle Angular**](https://www.npmjs.com/package/@zup-it/beagle-angular)

The properties of a component can be strings, numbers, booleans, maps, arrays or even functions. 
- A button, for example, can have `text`, `disabled` and `onPress` where: 
1. The first is its text;
2. The second tells if it's clickable or not;
3. The third is a function that must be called when it's pressed. 

With React as an example, we could have implemented this component in the following way:

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

### **Beagle Tree data structure**
Beagle works over a tree of components and, for it to work, it must respect some rules. [**For more information, check out the documentation**](docs/data-structure.md).

### **Dynamic behaviors: context, expressions and actions**
Beagle thinks the server-driven UI should not bring detriment to the user experience and if our views are always static we might have to make an excessive number of requests and not be able to offer a truly dynamic interface to the end-user. Besides, it can get tricky to program complex interfaces if every time a component needs to communicate with how the logic is handled to the backend. To solve these issues, Beagle brings the concept of contexts, expressions, and actions.

[**For more information, check out the Resources section**](https://docs.usebeagle.io/resources/comunication-between-components-and-context).

### **The rendering process (lifecycles)**
Beagle Web library has a well-defined process of how it fetches, process, and renders a view. There's a sequence that must be respected and hook points where the developer can execute some code of his own (lifecycles). [**For more information, check out the Renderization section**](docs/renderization.md).

## **API**
Check out below more information about the API offered by Beagle WEB.

### **Beagle View**
Beagle View is the entity responsible to manage a server-driven view. You can create through Beagle Service via the `createBeagleView` function. BeagleView can fetch a new view, update its tree, navigate, etc. [**For more information, check out the Beagle View page**](docs/beagle-view.md).

### **Beagle Tree**
Beagle Tree is the entity used to represent a server-driven view and it has a tree structure. Beagle offers many functions to help traverse this tree, find specific components or alter it. [**For more information, check out Beagle Tree documentation**](docs/beagle-tree).

### **Services**
Beagle offers access to some services that might be useful to achieve the exact behavior wanted for your application. Beagle Service is the main service, but as soon as we create it, we have access to all of the following:

- [**GlobalContext**](docs/services#GlobalContext)
- [**UrlBuilder**](docs/services#UrlBuilder)
- [**ViewClient**](docs/services#ViewClient)
- [**RemoteCache**](docs/services#RemoteCache)
- [**DefaultHeaders**](docs/services#DefaultHeaders)

[**For more information, access the documentation**](docs/services).

### **Tests**

For more information about how Beagle Web cire is internally tested, check out
[**the readme for Tests**](docs/tests.md).

## **Documentation**

You can find Beagle's documentation on our [**website**][site].

Beagle's documentation discusses components, APIs, and topics that are specific to [**Beagle documentation**][b-docs].

[site]: https://usebeagle.io/
[b-docs]: https://docs.usebeagle.io/

## **Contributing Guide**

If you want to contribute to this module, access our [**Contributing Guide**][contribute] to learn about our development process, how to propose bug fixes and improvements, and how to build and test your changes to Beagle.

[contribute]: https://github.com/ZupIT/beagle-ios/blob/main/CONTRIBUTING.md

### **Developer Certificate of Origin - DCO**

 This is a security layer for the project and for the developers. It is mandatory.
 
 Follow one of these two methods to add DCO to your commits:
 
**1. Command line**
 Follow the steps: 
 **Step 1:** Configure your local git environment adding the same name and e-mail configured at your GitHub account. It helps to sign commits manually during reviews and suggestions.

 ```
git config --global user.name “Name”
git config --global user.email “email@domain.com.br”
```

**Step 2:** Add the Signed-off-by line with the `'-s'` flag in the git commit command:

```
$ git commit -s -m "This is my commit message"
```

**2. GitHub website**
You can also manually sign your commits during GitHub reviews and suggestions, follow the steps below: 

**Step 1:** When the commit changes box opens, manually type or paste your signature in the comment box, see the example:

```
Signed-off-by: Name < e-mail address >
```

For this method, your name and e-mail must be the same registered on your GitHub account.

## **Code of Conduct**

Please read the [**code of conduct**](https://github.com/ZupIT/beagle/blob/main/CODE_OF_CONDUCT.md).

## **License**

[**Apache License 2.0**](https://github.com/ZupIT/beagle-web-core/blob/main/LICENSE).


## **Community**
Do you have any question about Beagle? Let's chat in our [**forum**](https://forum.zup.com.br/). 
