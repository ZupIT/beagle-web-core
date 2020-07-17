export type DefaultSchema = Record<string, Record<string, any>>

export type ComponentName<Schema> = keyof Schema | 'custom:error' | 'custom:loading'

export interface DataContext {
  id: string,
  value?: any,
}

export interface BeagleUIElement<Schema = DefaultSchema> {
  _beagleComponent_: ComponentName<Schema>,
  context?: DataContext,
  children?: Array<BeagleUIElement<Schema>>,
  style?: Record<string, any>,
  [key: string]: any,
}

export interface IdentifiableBeagleUIElement<Schema = DefaultSchema>
  extends BeagleUIElement<Schema> {
  id: string,
  children?: Array<IdentifiableBeagleUIElement<Schema>>,
}
