# Beagle View

The Beagle View is the entity responsible to manage a server-driven view. It can be created through
the Beagle Service via the function `createBeagleView`. The BeagleView can fetch a new view, update
its tree, navigate, etc.

## Accessing the Beagle Beagle View

A Beagle View is created in Angular or React when the component `BeagleRemoteView` is used. To get
access to the Beagle View of the `BeagleRemoteView`, you should use the property
`onCreateBeagleView`, in Angular, or `viewRef` in React. See the examples below:

**Angular:**
```html
<beagle-remote-view [loadParams]="loadParams" (onCreateBeagleView)="onCreateBeagleView($event)">
</beagle-remote-view>
```
```typescript
import { Component } from '@angular/core'
import { BeagleView } from '@zup-it/beagle-web'

@Component({
  // ...
})
class MyComponent {
  private beagleView: BeagleView | undefined

  // ...

  logBeagleView() {
    if (!this.beagleView) return
    console.log(this.beagleView))
  }

  onCreateBeagleView(beagleView) {
    this.beagleView = beagleView
    this.logBeagleView()
  }
}
```

**React:**
```typescript
import React, { useRef, MutableRefObject, useEffect } from 'react'
import { BeagleRemoteView } from '@zup-it/beagle-react'
import { BeagleView } from '@zup-it/beagle-web'

const MyComponent: FC = () => {
  const beagleView = useRef() as MutableRefObject<BeagleView | undefined>

  // ...

  logBeagleView() {
    if (!beagleView.current) return
    console.log(beagleView.current)
  }

  useEffect(logBeagleView, [])

  return <BeagleRemoteView path="/my-path" viewRef={beagleView} />
}
```

Above, in both examples, we accessed the Beagle View and logged it. It is important to notice that
we need to check for the Beagle View availability before using it. Since the Beagle View is created
by a child component, it won't be available before the children components are created.

## Fetching a view

To fetch a view from the backend and update the current view, you need to use the method `fetch` of
the `BeagleView`.

A fetch operation can be over the entire tree or just a branch. If it's the former, the entire tree
gets replaced by the result of the request. Otherwise, the tree is kept the same, but for the branch
we told `fetch` to update, this specific branch will get replaced by the result of the request.
Below we see an example of a call to the function `fetch`:

```typescript
// fetches the remote view at /my-path and uses it to replace the entire current view
beagleView.fetch({ path: '/my-path' })

// fetches the remote view at /my-lazy-container and uses it to replace the component with id 'lazy'
beagleView.fetch({ path: '/my-lazy-container' }, 'lazy')
```

`fetch` can accept 3 parameters, they are:

1. **loadParams:** required. object containing the parameters to control the request, the options
are the following:
    - path: required. Path to the view in the backend.
    - fallback: optional. A Beagle Tree to fallback to in case of an error.
    - method: optional. `get` by default. Use this option if you need another http method.
    - headers: optional. Use this option to pass additional headers to this single request.
    - shouldShowLoading: optional. Tells wether to use or not the loadingComponent while the view
    loads. Will use the global configuration if not specified.
    - shouldShowError?: optional. Tells wether or not to show the error component if the request
    fails. Will use the global configuration if not specified.
    - strategy: optional. Tells which
    [cache strategy](https://docs.usebeagle.io/resources/customization/beagle-para-web/cache-strategy)
    should be used to load this specific view. Will use the global configuration if not specified.
    - loadingComponent: optional. The loading component to use. Will use the global configuration if
    not specified.
    - errorComponent: optional. The error component to use. Will use the global configuration if not
    specified.
2. **anchor:** optional. Id of the node to attach the resulting view to. By default, it uses the
root node. Use it to update a single branch instead of the whole tree.
3. **mode:** optional. How to attach the resulting view to the anchor. There are four modes:
    - `replaceComponent`: default. Replaces the entire anchor with the result of the request.
    - `replace`: replaces the children of the anchor with the result of the request.
    - `prepend`: adds the result of the request at the start of the list of children of the anchor.
    - `append`: adds the result of the request at the end of the list of children of the anchor.

## Subscribing to events

You can subscribe to events in the Beagle View. There are two types of subscriptions, one that
listens to every update to the tree (`beagleView.subscribe`) and another that listens to every error
in the fetch/renderization process (`beagleView.addErrorListener`).

When calling `beagleView.subscribe`, you must pass a single parameter, which is a function that
receives the current rendered tree. See the example below:

```typescript
const unsubscribeLogger = beagleView.subscribe((newTree) => {
  console.log('The tree was updated!')
  console.log(newTree)
})
```

To remove a listener, just call the function it returned. In the previous example
`unsubscribeLogger()`.

Error listeners are registered in a similar way. The only difference is that they receive a list of
errors:

```typescript
const removeErrorListener = beagleView.addErrorListener((errors) => {
  console.log('Oops! An error just happened!')
  console.log(errors)
})
```

By default, Beagle logs every error in the fetch/rendering process to the console. Once a custom
error listener is added to the Beagle View, Beagle will stop logging errors by itself and use the
treatment provided by the developer instead.

## Destroying the Beagle View

To avoid memory leaks, the Beagle View must be destroyed if it won't be used again. If you're using
Beagle Angular or Beagle React, there's no need to worry about it, it will get done under the hood.
If you're using Beagle Web directly, you must call `beagleView.destroy()` when the remote view
is removed from the page.

## API

Below you can find all methods of the Beagle View and their description:

- **subscribe:** [subscribes to view changes](#Subscribing-to-events). Receives the listener and
returns a function to remove the listener.
- **addErrorListener:** [subscribes to errors](#Subscribing-to-events). Receives the listener and
returns a function to remove the listener.
- **fetch:** [fetches a view from the backend](#Fetching-a-view) and uses it to update the current
tree. Receives three parameters: the request options (required), the id of the node to be updated
(optional) and the insertion mode (optional).
- getRenderer: returns [the renderer](renderization.md#The-Renderer-API) of the view. Can be used
to update the tree directly.
- **getTree:** returns a copy of the currently rendered tree.
- **getBeagleNavigator:** returns the navigator.
- **getBeagleService:** returns the BeagleService that created this view.
- **destroy:** destroys this view.
