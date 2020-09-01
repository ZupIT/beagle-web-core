# The Beagle data structure

Beagle works over a tree of components and, for it to work, it must respect some rules. In
Typescript terms, the Beagle Tree can be defined as follows:

```typescript
export interface BeagleUIElement {
  _beagleComponent_: string,
  id: string,
  context?: DataContext,
  children?: BeagleUIElement[],
  style?: Style,
  [key: string]: any,
}
```

Where:

- `_beagleComponent_` is the name of the UI component to render.
- `id` is a unique identifier for the node. Observation: although the `id` is required by the
internal tree structure, before processing the tree, Beagle assigns random unique ids for each node
without an id, making it optional in the json provided by the backend.
- `context` is a [context](https://docs.usebeagle.io/resources/comunication-between-components-and-context)
defined for the component and its children.
- `children` is an array of nodes representing the children of the current node.
- `style` is the stylization rules for the component. These rules are not CSS, instead it's a
[structure defined by Beagle](https://docs.usebeagle.io/resources/estilizacao/web#stylizing-components-through-json);
- Additionally, a node has every property expected by the component itself, a text component could
have `text` and `justify`, while a button could have `onPress`, `text` and `disabled`.

Below, we show an example of a tree of components ready to be processed by Beagle:

```json
{
  "_beagleComponent_": "container",
  "id": "container",
  "children": [
    {
      "_beagleComponent_": "image",
      "id": "logo",
      "url": "https://i.ibb.co/rvRN9kv/logo.png"
    },
    {
      "_beagleComponent_": "text",
      "id": "welcome",
      "text": "Welcome to the Beagle playground!"
    },
    {
      "_beagleComponent_": "text",
      "id": "instructions",
      "text": "Use the panel on the left to start coding!"
    },
    {
      "_beagleComponent_": "button",
      "id": "fast-guide",
      "text": "Access the fast guide"
    }
  ]
}
```

The json above is a simpler version of the welcome page of the Beagle Playground website. It
renders a container to hold the rest of the elements: an image, two texts and a button. To see the
full example and the UI rendered by it, access the
[Beagle Playground](https://beagle-playground.netlify.app/).

## The Beagle Payload

In the type defined in the last section (`BeagleUIElement`), we can see that the `id` is a required
property and that the children of a node must always be named `children`. Our backend though may not
guarantee any of that. For this reason, Beagle internally generates unique ids for every node
without an id and translates the children property. A table component, for instance, might have its
children in the property `rows`. Before starting to process the tree, Beagle converts `rows` to the
expected name `children` (see section [The `children` property](#The-Children-Property)).

In fact, the payload returned by the backend can be anything, but internally Beagle must work with
a tree of components (`BeagleUIElement`). We must be able to traverse the tree and detect every
component and its children. We say the payload can be anything, because we give the developer the
opportunity to change it before it gets processed by Beagle.

We recommend that the backend always return a JSON representing a tree of components, as it is
expected by Beagle, but if, for some reason, it is not possible, Beagle Web makes it possible to
pre-process the response and build the tree in the front-end before Beagle actually works upon it
(see [lifecycles](renderization.md)).

### The children property

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

The example above is for Angular, but it would work the same way in other platforms. If your
component is functional or if you don't want to use decorators (annotations), you can use it as a
function, see the example below:

```typescript
const Table = (props) => {
  // ...
}

BeagleChildren({ property: 'rows' })(Table)
```
