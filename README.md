# Motivação

Este primeiro tópico será retirado depois que a proposta for aceita, e até por isso está em português.

Como tínhamos discutido anteriormente, o fluxo de renderização do Beagle, não é algo muito bem definido hoje e a maior parte dele está implementada via middlewares, que apesar de ser um recurso interessante, não escalou bem com a quantidade de coisas que tivemos a necessidade de fazer. Lá na [issue para a v1.1](https://github.com/ZupIT/beagle-web-core/issues/113) eu já tinha falado sobre esse problema e dado algumas ideias de como resolvê-lo. Resumindo, eu falei sobre a ideia de deixar o processo de renderização muito bem definido, indicando a ordem de tudo e quando cada coisa acontece. Além disso, sugeri a substituição de middlewares por lifecycles.

Este documento é a documentação sobre a feature escrita como se ela já estivesse pronta. Por favor leiam e opinem sobre o conteúdo. Como nada foi implementado ainda, agora é a hora de fazer qualquer mudança ou se discutir inclusive se vale implementar.

# List of contents

- [TL;DR;](#tldr)
- [Beagle Payload and Tree of components](#Beagle-Payload-and-Tree-of-components)
    * [What is the Tree of Components?](#What-is-the-Tree-of-Components?)
    * [The `children` property](#The-children-property)
- [Process and lifecycles](#Process-and-lifecycles)
    * [Process to render a view](#Process-to-render-a-view)
    * [BeforeStart](#BeforeStart)
    * [BeforeViewSnapshot](#BeforeViewSnapshot)
    * [AfterViewSnapshot](#AfterViewSnapshot)
    * [BeforeRender](#BeforeRender)

# TL;DR;

Sometimes, an image can tell more than words, the following graphic shows the full rendering process
of Beagle Web:

![Beagle Web Flow](https://i.ibb.co/ygdgKhQ/beagle-web-flow.png)

The Beagle lifecycles are:
- BeforeStart
- BeforeViewSnapshot
- AfterViewSnapshot
- BeforeRender

They can be used as global hooks to the lifecycle:

```typescript
const config = {
  // ...
  lifecycles: {
    beforeStart: (payload) => {
      // ...
    },
    beforeViewSnapshot: (payload) => {
      // ...
    },
    afterViewSnapshot: (payload) => {
      // ...
    },
    beforeRender: (payload) => {
      // ...
    },
  }
}
```

or local hooks to the lifecycles in a per-component basis (annotations):

```typescript
@BeagleBeforeStart((textComponentPayload) => {
  // ...
})
@BeagleBeforeViewSnapshot((textComponentPayload) => {
  // ...
})
@BeagleAfterViewSnapshot((textComponentPayload) => {
  // ...
})
@BeagleBeforeRender((textComponentPayload) => {
  // ...
})
@Component({
  // ...
})
class Text {
  // ...
}
```

If the children of a component comes with a different name than `children` or `child` from the
backend, the annotation `@BeagleChildren` can be used to fix the problem:

```typescript
@BeagleChildren({ property: 'rows' })
@Component({
  // ...
})
class Table {
  // ...
}
```

# Beagle Payload and Tree of components

The payload for beagle returned by the backend can be anything, but internally Beagle must work with
a tree of components. We must be able to traverse the tree and detect every component and its
children. We say the payload can be anything, because we give the developer the opportunity to
change it before it gets processed by Beagle.

We recommend that the backend always return a JSON representing a tree of components, as it is
expected by Beagle, but if, for some reason, it is not possible, Beagle Web makes it possible to
pre-process the response and build the tree in the front-end before Beagle actually works upon it.

## What is the Tree of Components?

The tree of components is the data structure used by Beagle Web. As the name suggests, it is a tree.
Each node in this tree has a type, several attributes and children. The type of the node is given by
the property `_beagleComponent_` and it is mandatory. The node type tells us which UI component the
node represents. A component will, most of the time, have attributes which are specific to that
component. e.g. a button, can have attributes like `text`, `onPress` and `disabled`, while an input
will have attributes like `value` and `placeholder`. If a node is not a leaf, i.e. if the component
has another component or set of components inside it, the node in the tree will have a property
called "children", which is an array of nodes and represents the child nodes of a node.

Below, we show an example of a tree of components ready to be processed by Beagle:

```json
{
  "_beagleComponent_": "container",
  "children": [
    {
      "_beagleComponent_": "image",
      "url": "https://i.ibb.co/rvRN9kv/logo.png"
    },
    {
      "_beagleComponent_": "text",
      "text": "Welcome to the Beagle playground!"
    },
    {
      "_beagleComponent_": "text",
      "text": "Use the panel on the left to start coding!"
    },
    {
      "_beagleComponent_": "button",
      "text": "Access the fast guide"
    }
  ]
}
```

The json above is a simpler version of the welcome page of the Beagle Playground website. It
renders a container to hold the rest of the elements: an image, two texts and a button. To see the
full example and the UI rendered by it, access the
[Beagle Playground](http://playground.usebeagle.io).

### The `children` property

We recommend to always use an array named `children` to specify the child nodes of a component. But,
Beagle will work out of the box if instead of an array of components, a single node is passed, and
will also work if instead of `children`, the name `child` is used. In some cases, the backend
programmer will have named the child nodes as something else. For instance, in a component that
represents a table, the children might be named `rows` instead of `children`, in this case, the
front-end developer can inform Beagle that, for this specific component, the name of the property
`children` is different. See the example below:

```typescript
@BeagleChildren({ property: 'rows' })
@Component({
  // ...
})
class Table {
  // ...
}
```

The example above is for Angular, but it would work the same way in other platforms. Click
[here](#todo) to see the full documentation of the annotation `@BeagleChildren`.

# Process and lifecycles

> Observation: lifecycles deprecates the feature middlewares. Middlewares will still be supported
at least until the next major version (2.0.0) and they will be interpreted as they were part of the
lifecycle `beforeRender`.

Beagle Web has a very well defined process from when a new payload is received to the moment it
gets rendered in the browser screen. We also have some "breakpoints" in this process where we let
the developer do his own stuff if he needs to. We call these breakpoints "lifecycles". If you're
familiar with frameworks like Angular and React you probably already know how lifecycles work. If
not, it is pretty simple! Keep reading.

## Process to render a view 

1. Run the global **beforeStart** hook;
2. Run the **beforeStart** hook of each component;
3. Assign an id to every node that doesn't have an id yet;
4. If needed, pre-fetch views that could be accessed next;
5. Run the global **beforeViewSnapshot** hook;
6. Run the **beforeViewSnapshot** hook of each component;
7. Takes a snapshot of the current tree and stores it. From now on, any reference to the current
rendered tree will be referencing a copy of this tree.
8. Starts processing a copy of the snapshotted view, the next lifecycles will run over this copy.
9. Run the global **afterViewSnapshot** hook;
10. Run the **afterViewSnapshot** hook of each component;
11. Deserialize beagle actions into javascript functions;
12. Evaluate contexts and expressions;
13. Interpret styles, converting the Beagle styling syntax to css;
14. Run the global **beforeRender** hook;
15. Run the **beforeRender** hook of each component;
16. If in development mode, check the types in the JSON, validating them against the interface of
each component.
17. Hand the component tree to the render function, which is responsible to render each component
in the tree. This function is different to each framework, Angular has a renderer and React has
another.

Steps 1 to 7 are run once for every payload, they are not run on every re-render of the view. Steps
8 to 17 are run every time a re-render is triggered on the view. Re-renders are triggered by the
`setContext` action. When using the internal BeagleView directly, any call to `updateWithFetch` or
`updateWithTree` considers the tree passed as a parameter a new tree, i.e. the full set of steps
will be run over the new tree (or branch). The behavior is the same for the action `addChildren`,
since it uses `updateWithTree` internally.

## BeforeStart

In the previous section, we said we let the user alter the payload before Beagle gets started, this
is our first lifecycle and we call it "BeforeStart". In an ideal scenario the payload would always
be correct and this would never be needed, but, unfortunately, it's not always the case.

This doesn't need to be used only to alter the payload, if the developer wants to run some code
every time a payload will get processed by Beagle, but before Beagle actually acts upon it, this is
where he would do it.

### Example of usage

Let's say we're developing an application that will work for WEB, iOS and Android.
Sometimes a payload will make sense for the mobile platforms, but not for web and we have to
transform it somehow. This will mainly happen if the components for the mobile apps were built
before realizing they would also be used for web. Again, this is not the ideal scenario, but it does
happen.

Even when all platforms are considered, there are scenarios where a payload won't make sense
for a particular platform, let's take the case of the default Beagle Component `screen`. `screen`
tells us things like the title of the view, the presence of a back button, and other interactivity
that will be made available in the navigation bar of a mobile app. See below an example of a JSON
defining a screen and an image corresponding to the UI it renders:

> TODO

Web applications have no equivalent to the mobile navigation bar and the default implementation of
the component `screen` in Beagle Web ignores the json describing the navigation bar. To interpret
the navigation bar and render it in a way that makes sense in a web environment, we have two
options: replace the default implementation of the component `screen` or transform the original
payload taking the data of the navigation bar inside the screen component and creating a component
we can understand.

If we choose the second alternative, this would be done via the lifecycle `BeforeStart`. See the
example below:

```typescript
const config = {
  // ...
  lifecycles: {
    beforeStart: (payload) => {
      // the screen component can only appear as the root of the component tree
      if (!payload._beagleComponent_ === 'beagle:screenComponent') return
      const navComponent = payload.navigationBar && {
        _beagleComponent_: 'custom:navigationBar',
        title: payload.navigationBar.title,
        items: payload.navigationBar.navigationBarItems,
      }
      // in this particular component (screen), the children is a single element, is mandatory and is named child
      payload.children = navComponent ? [navComponent, payload.child] : [payload.child]
      delete payload.child
    }
  }
}
```

The example above considers we have a custom component called `custom:navigationBar` that will
render a nav bar for us.

In the example above we set up a global hook to the `beforeStart` lifecycle. We can also use any
lifecycle in a per-component basis. Let's take the non-realistic example of renaming the property
`text` to `value` in a component called `Text`:

```typescript
@BeagleBeforeStart((textComponentPayload) => {
  textComponentPayload.value = textComponentPayload.text
  delete textComponentPayload.text
})
@Component({
  // ...
})
class Text {
  // ...
}
```

In this case, the payload received as parameter is not the entire tree, but the payload of the
component itself.

In any of the lifecycles, if nothing is returned, the process will continue with the tree passed
as parameter to the lifecycle function. If a new tree is returned by the function, the process
will continue with the tree returned.

## BeforeViewSnapshot

Runs just before the view snapshot, useful to alter the payload, but after the ids were already
assigned.

### Example of usage

Let's say you want to expose the internal beagle id as a property of the component. This could
be done with the following code:

```typescript
@BeagleBeforeViewSnapshot((myComponentPayload) => {
  myComponentPayload.exposedId = id
})
@Component({
  // ...
})
class MyComponent {
  @Input() exposedId: string
  // ...
}
```

Just like any other lifecycle, a hook to it could also have been set globally, via the
configuration:

```typescript
const config = {
  // ...
  lifecycles: {
    beforeViewSnapshot: (payload) => { /* ... */ }
    // ...
  },
}
```

## AfterViewSnapshot

Differently from the two previous lifecycles, the changes done here are valid for the current
render only, since any update to the view is done over a tree based on the snapshotted view, the 
modifications done in this lifecycle are not permanent and will be executed in every render.

This lifecycle can be used to run code that needs to run every time the view is rendered but
doesn't require actions, context, expressions and styles to have already been processed.

### Example of usage

Contexts are defined, referenced and manipulated in the JSON of the view. But what if we want to
access data of the application and not the view itself? Beagle offers a feature called
"[Global context](#todo)" that is able to deal with this scenario, but suppose there is no Global
context, we can still implement this behavior by using the AfterViewSnapshot lifecycle.

Let's say we have a financial application and we want to show the user's balance. We must guarantee
that, in every re-render the most recent value for the balance will be used, for this reason, it
can't be done in the previous lifecycles (BeforeStart and BeforeViewSnapshot).

```json
{
  "_beagleComponent_": "container",
  "context": {
    "id": "user",
    "value": {
      "name": "",
      "balance": 0
    }
  },
  "children": [
    {
      "_beagleComponent_": "text",
      "text": "@{user.name}, your balance is $@{user.balance}"
    }
  ]

}
```

In the JSON above, we use the context `user`, this context starts with empty values and the view
has no way of knowing the correct values. So, before processing the contexts and expressions, 
we can replace the values of the context in the JSON by the values we have in our application. See
the example below:

```typescript
function findContextById(payload, id) {
  if (payload.context && payload.context.id === id) return payload.context
  const it = Beagle.Children.iterator(payload)
  while (!it.done) {
    const context = findContextById(it.next(), id)
    if (context) return context
  }
}

const config = {
  // ...
  lifecycles: {
    afterViewSnapshot: (payload) => {
      const userContext = findContextById(payload, 'user')
      const userData = getUserData() // this method gets the user data from the application
      userContext.name = userData.name
      userContext.balance = userData.balance
    }
  }
}
```

With the code above we tell Beagle to replace the values in the context "user" by the values in
the application. This piece of code cannot be placed before the view is snapshotted because we have
the requirement to update the balance value in every render. It also can't be placed in the next
lifecycle (BeforeRender), because the context would then be already evaluated and our values
wouldn't be processed.

It is important to notice that the action `setContext` would not work over the context `user`, since
we are always replacing the values for this context before processing any expression. This is just
an example to show how this lifecycle could be used. To use application values in your beagle view,
it is always preferred to use the [global context](#todo).

## BeforeRender

Just like the previous lifecycle (AfterViewSnapshot), the changes done here are valid for the
current render only and is executed in every render. The difference from BeforeRender to
AfterViewSnapshot, is that it is guaranteed that all actions, expressions and styles have already
been processed.

### Example of usage

Let's say the backend decided to express colors in the following format:
`{ red: number, green: number, blue: number }`. For example, black would be
`{ red: 0, green: 0, blue: 0 }`. This is not a valid color for browsers, so we decide to
convert the value of every color property to a valid RGB format. Basically, the function that could
do this work is the following:

```typescript
const colorProperties: ['color', 'backgroundColor', 'borderColor']

function fixColorCodes(componentPayload) {
  const style = componentPayload.style
  if (!style) return
  colorProperties.forEach((property) => {
    if (!style[property]) return
    style[property] = `rgb(${style[property].red}, ${style[property].green}, ${style[property].blue})`
  })
}
```

Now we just need to execute the function above for every component in the tree. But when exactly
should we call it?

Suppose we want to have a dynamic behavior for the color by changing it via the context feature.
Check the JSON below:

```json
{
  "_beagleComponent_": "beagle:container",
  "context": {
    "id": "bgColor",
    "value": {
      "red": 255,
      "green": 255,
      "blue": 255
    },
  },
  "children": [
    {
      "_beagleComponent_": "beagle:text",
      "text": "My dynamically colored text",
      "style": {
        "backgroundColor": "@{bgColor}"
      }
    },
    {
      "_beagleComponent_": "beagle:button",
      "text": "red",
      "onPress": [
        {
          "_beagleAction_": "setContext",
          "contextId": "bgColor",
          "value": {
            "red": 255,
            "green": 0,
            "blue": 0
          }
        }
      ],
      "_beagleComponent_": "beagle:button",
      "text": "green",
      "onPress": [
        {
          "_beagleAction_": "setContext",
          "contextId": "bgColor",
          "value": {
            "red": 0,
            "green": 255,
            "blue": 0
          }
        }
      ],
      "_beagleComponent_": "beagle:button",
      "text": "blue",
      "onPress": [
        {
          "_beagleAction_": "setContext",
          "contextId": "bgColor",
          "value": {
            "red": 0,
            "green": 0,
            "blue": 255
          }
        }
      ]
    }
  ]
}
```

From the JSON above we can see that the text starts with a white background and as soon as the user
presses a button, the background color changes.

If we call `fixColorCodes` before the context is evaluated, we'll be trying to execute it over the
string `@{bgColor}` instead of the object `{ red: 255, green: 255, blue: 255 }` which will get
us a massive runtime error, since `red`, `green` or `blue` are not properties of a string.
BeforeStart, BeforeViewSnapshot and AfterViewSnapshot are all executed before the context gets
evaluated, so everything that might be affected by the context, must be executed in the last
lifecycle: BeforeRender.

```typescript
function fixColorForComponentTree(tree) {
  fixColorCodes(tree)
  if (!tree.children) return
  tree.children.forEach(fixColorForComponentTree)
}

const config = {
  // ...
  lifecycles: {
    // ...
    beforeRender: fixColorForComponentTree,
  }
}
```
