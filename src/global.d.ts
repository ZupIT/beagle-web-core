// lodash
declare namespace _ {
  export function get(object: any, path: string, defaultValue?: any): any
  export function set<T>(object: T, path: string, newValue: any): T
}
