import {
  BeagleConfig,
  ComponentMetadata,
  Lifecycle,
  LifecycleHook,
  ChildrenMetadata,
} from './types'

export interface ExtractedMetadata {
  children: Record<string, ChildrenMetadata>,
  lifecycles: Record<Lifecycle, Record<string, LifecycleHook>>,
}

function extract(components: BeagleConfig<any>['components']) {
  const keys = Object.keys(components)
  const extractedMetadata: ExtractedMetadata = {
    children: {},
    lifecycles: {
      afterViewSnapshot: {},
      beforeRender: {},
      beforeStart: {},
      beforeViewSnapshot: {},
    },
  }

  keys.forEach((key) => {
    const component = components[key]
    const metadata: ComponentMetadata | undefined = component.__beagleMetadata
    if (!metadata) return
    if (metadata.children) extractedMetadata.children[key] = metadata.children
    if (metadata.lifecycles) {
      const lifecycleKeys = Object.keys(metadata.lifecycles) as Lifecycle[]
      lifecycleKeys.forEach(lifecycleKey => {
        const hook = metadata.lifecycles[lifecycleKey]
        if (!hook) return
        extractedMetadata.lifecycles[lifecycleKey][key] = hook
      })
    }
  })

  return extractedMetadata
}

export default {
  extract,
}
