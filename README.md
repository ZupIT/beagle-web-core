# Ideias a respeito da implementação de Analytics no Beagle

- Precisamos de uma solução automática baseada no JSON
- Precisamos também de uma solução manual, onde o próprio dev dispara o analytics
- Precisamos de uma API de Analytics

# Interfaces

```typescript
// Backend Analytics API

interface BackendAnalyticsRecord {
  type: string,
  screen?: string,
  timestamp: string, // colocar no backend apenas, não passar no post
  sessionId: string,
  platform: string,
  [key: string]: any,
}

interface Authentication {
  sessionId: string,
  accessToken: string,
}

interface BeagleAnalyticsServiceAPI {
  // POST /session
  // appId e appKey seriam headers, enquanto o restante iria no body, como json
  startSession: (userId: string, userData: Record<string, any>, appId: string, appKey?: string) => Authentication,

  // POST /record
  // record vai no body, como json. authentication vai nos headers
  createRecord: (record: AnalyticsRecord, authentication: Authentication) => void
}

// Analytics config (Blackend magic)

interface ConfigurationJson {
  enableScreenAnalytics?: boolean, // default is true
  actions: Record<string, string[]>,
}

// frontend Analytics API (exposed)

interface AnalyticsRecord {
  type: string,
  [key: string]: any,
}

interface Analytics {
  startSession: (userId: string, userData: Record<string, any>) => Promise<void>,
  createRecord: (record: AnalyticsRecord) => Promise<void>,
}

interface AnalyticsOptions {
  configurationEndpoint?: string, // padrão ${baseUrl}/analytics
  configuration?: ConfigurationJson, // definir um default caso não seja definido
  provider: Analytics,
}

interface BeagleConfig {
  // ...
  analytics?: AnalyticsOptions,
}

interface BeagleAnalyticsOptions {
  url?: string,
  appKey: string, // verificar necessidade
  appId: string,
}

declare function createBeagleAnalyticsProvider(options: BeagleAnalyticsOptions): Analytics

// View specific analytics configuration. Overwrites default configuration for an action

interface AnalyticsActionOptions {
  enable: boolean,
  attributes?: string[], // default é a config global
  additionalEntries?: Record<string, any>,
}

interface BeagleAction {
  // ...
  analytics?: AnalyticsActionOptions,
}

```
