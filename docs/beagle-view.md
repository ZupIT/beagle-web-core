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

To navigate to a new remote view, you should use the Beagle Navigator. To access the navigator of
the BeagleView, you must call `beagleView.getNavigator()`.

```typescript
// fetches the remote view at /my-path, adds it to the navigation history and renders its tree.
beagleView.getNavigator().pushView({ url: '/my-path' })
```

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
- getRenderer: returns [the renderer](renderization.md#The-Renderer-API) of the view. Can be used
to update the tree directly.
- **getTree:** returns a copy of the currently rendered tree.
- **getNavigator:** returns the navigator.
- **getBeagleService:** returns the BeagleService that created this view.
- **destroy:** destroys this view.
