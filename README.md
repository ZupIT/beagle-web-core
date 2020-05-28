# Motivação

1. Avaliar testes de hipótese.
2. Oferecer UIs levemente diferentes dependendo das características do usuário.
3. Usar I.A. para gerar conclusões inteligentes sobre o uso do aplicativo e propor novos testes de hipóteses.

Para atingir esses objetivos, precisamos possibilitar uma análise inteligente do uso de uma aplicação feita com Beagle. Dessa forma precisamos de uma solução de Analytics com as seguintes características:

- Plugável. Queremos que o cliente use nossa solução de analytics, mas não podemos obrigá-lo.
- Automática. Independente dos componentes usados, o desenvolvedor não deve precisar fazer muito para começar a analisar o uso da aplicação. Temos um grande poder na representação de ações. Dessa forma podemos gerar dados de analytics sem que o dev programe uma linha de código. Também podemos observar o carregamento de views e gerar uma entrada de analytics do tipo `navigation` sempre que uma view é acessada.
- Também precisamos de um modo manual. Se o dev cria um componente custom que precisa disparar alguns analytics específicos, ele deve poder gerar esses dados.
- As configurações do analytics devem ser definidas no backend, para se manter a característica server-driven.

**Em resumo:**

Precisamos criar uma interface de Analytics que:
- será usada pela nossa própria lib para gerar entradas de analytics automáticas;
- pode ser usada pelo desenvolvedor para disparar analytics custom dentro de seus componentes customizados;
- é configurada de acordo com o backend;
- será implementada pelo BeagleAnalytics, mas também pode ser implementada como GoogleAnalytics, por exemplo.

# Exemplos de analytics automáticos

## Acesso de view
Toda vez que uma view é acessada, uma entrada é gerada automáticamente (já temos isso).

## Ações
Sempre que uma ação é disparada, podemos tratá-la em nossa lib, gerando uma entrada de analytics
automaticamente.

Quando uma ação é disparada, sabemos o nome da ação, o id do elemento que a disparou, o nome
do evento e os demais dados da ação, que são diferentes para cada tipo de ação disparada.

### Exemplo

Definição do componente e da ação no JSON.
```json
{
  "_beagleComponent_": "button",
  "id": "btn-next",
  "text": "Próximo passo",
  "onPress": {
    "_beagleAction_": "pushView",
    "route": "/step2",
  }
}
```

Entrada de Analytics gerada automáticamente quando usuário clica no botão:

```json
{
  "type": "action",
  "screen": "/step1",
  "event": "onPress",
  "component": {
    "type": "beagle:button",
    "id": "btn-next",
    "position": { "x": 158, "y": 350 }
  },
  "beagleAction": "pushView",
  "route": "/step2",
  "sessionId": "ANENw588HHA78",
}
```

Uma sessão possui dados como:

```json
{
  "id": "ANENw588HHA78",
  "userId": "a1489",
  "platform": "android 10",
  "beagle": "beagle-android@1.0",

  "geolocation": {
    "latitude": 58.78987854,
    "longitude": -187.7865789,
  },
  
  "city": "Uberlândia",
  "state": "Minas Gerais",
  "country": "Brazil",
  "sex": "m",
  "age": 47,
  "phoneNumber": "(34) 99827-7858",
  "connectionType": "4G",
  "carrier": "Vivo"
}
```

### Problemas com dados sigilosos

Definição do componente e da ação no JSON.
```json
{
  "_beagleComponent_": "form",
  "id": "payment-form",
  "onSubmit": {
    "_beagleAction_": "sendRequest",
    "url": "/payment",
    "method": "post",
    "data": {
      "cardNumber": "4589-4587-8958-0022",
      "cardHolder": "Charles Darwin",
      "expiration": "12/2020",
      "cvv": "458"
    }
  }
}
```

Entrada no Analytics gerada quando o formulário é submetido:

```json
{
  "type": "action",
  "screen": "/payment",
  "platform": "android",
  "event": "onPress",
  "componentType": "form",
  "componentId": "payment-form",
  "beagleAction": "sendRequest",
  "url": "/payment",
  "method": "post",
  "data": {
    "cardNumber": "4589-4587-8958-0022",
    "cardHolder": "Charles Darwin",
    "expiration": "12/2020",
    "cvv": "458"
  }
}
```

### Ações que não precisam gerar Analytics

```json
{
  "_beagleComponent_": "container",
  "_context_": {
    "id": "name",
    "value": ""
  },
  "children": [
    {
      "_beagleComponent_": "input",
      "id": "name", 
      "value": "${name}",
      "onChange": {
        "_beagleAction_": "setContext",
        "value": "${onChange.value}"
      }
    }
  ]
}
```

No exemplo acima, não há a menor necessidade de gerar analytics sempre que o valor do contexto
mudar.

### Solução: whitelist de ações

A solução para esse problema consiste na especificação de uma whitelist de ações e valores que são
permitidos gerar analytics. Essa whitelist é uma configuração programada no backend e baixada pelo
front-end ao inicializar o serviço de Analytics.

A whitelist é definida de forma global, mas uma ação específica pode ter um comportamento diferente
da configuração global. Para isso, a propriedade "analytics" deve ser passada junto à ação no JSON
da view. Veja um exemplo:

```json
{
  "_beagleComponent_": "form",
  "id": "payment-form",
  "onSubmit": {
    "_beagleAction_": "sendRequest",
    "analytics": { "enabled": false },
    "url": "/payment",
    "method": "post",
    "data": {
      "cardNumber": "4589-4587-8958-0022",
      "cardHolder": "Charles Darwin",
      "expiration": "12/2020",
      "cvv": "458"
    }
  }
}
```

# Interface do backend (BeagleAnalytics)

O Beagle deve oferecer uma api online de Analytics. Veja a definição dos serviços e modelos de
dados.

```typescript
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
```

# Interface no front-end

No front-end deve-se passar a seguinte configuração para o Beagle:

```typescript
interface BeagleConfig {
  // ...
  analytics?: {
    provider: Analytics,
    configurationEndpoint?: string, // padrão ${baseUrl}/analytics
    configuration?: ConfigurationJson, // definir um default caso não seja definido
  },
}
```

## Interface de Analytics

Cada provider de analytics deve implementar essa interface. Exemplos: `BeagleAnalyticsProvider`, 
`GoogleAnalyticsProvider`, `BrazeAnalyticsProvider`.

```typescript
interface AnalyticsRecord {
  type: string,
  [key: string]: any,
}

interface Analytics {
  startSession: (userId: string, userData: Record<string, any>) => Promise<void>,
  createRecord: (record: AnalyticsRecord) => Promise<void>,
}
```

## Configuração global do Analytics

A configuração será definida no backend e será obtida em formato JSON:

```typescript
interface ConfigurationJson {
  enableScreenAnalytics?: boolean, // default is true
  actions: Record<string, string[]>,
}
```

### Configuração local de ação para o Analytics (disponível no JSON da view)

```typescript
interface AnalyticsActionOptions {
  enable: boolean,
  attributes?: string[], // default é a config global
  additionalEntries?: Record<string, any>,
}
```
