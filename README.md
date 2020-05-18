# Ideias a respeito da implementação de Analytics no Beagle

- Precisamos de uma solução automática baseada no JSON
- Precisamos também de uma solução manual, onde o próprio dev dispara o analytics
- Precisamos de uma API de Analytics

# API de Analytics

Devemos fornecer uma API de analytics para o dev. Essa API deve implementar a interface
`BeagleAnalytics`. Dessa forma, permitimos que third-parties possam ser usados como soluções de
Analytics e modularizamos nossa solução.

A interface `BeagleAnalytics` é definida da seguinte forma (notação typescript):

```typescript
interface AnalyticsRecord {
  type: string,
  [key: string]: any,
}

interface BeagleAnalytics {
  startSession: (userId: string, userData: Record<string, any>) => Promise<void>,
  createRecord: (record: AnalyticsRecord) => Promise<void>,
  createActionRecord: (action: BeagleAction, sourceComponentId: string, eventName: string) => Promise<void>,
}
```

A API online que registra as informações de Analytics, oferece os seguintes serviços (notação
typescript):

```typescript
interface AnalyticsRecord {
  type: string,
  screen?: string,
  // timestamp: string, colocar no backend
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
  startSession: (userId: string, userData: Record<string, any>, appId: string, appKey: string) => Authentication,

  // POST /record
  createRecord: (record: AnalyticsRecord, authentication: Authentication) => void
}
```

# Entradas automáticas de Analytics
Considerando que o dev já tenha iniciado a sessão do analytics. Podemos criar novos registros sempre
que alguma BeagleAction for executada. Considerando a camada de eventos que trata da comunicação
entre componentes e navegação (feature nova), é fácil, de maneira automática "trackear" o
comportamento do usuário.

Sempre que uma ação é disparada, internamente no Beagle, sem necessidade do dev codar, podemos
chamar a API de Analytics:

```typescript
analyticsApi.createActionRecord(action, component.id, eventName)
```

Suponha que uma ação de navegação tenha sido disparada no clique de um botão com id
"next-step-button". Poderíamos criar o seguinte Record no Analytics:

```json
{
  "type": "action",
  "beagleAction": "pushView",
  "route": "/step2",
  "eventName": "onPress",
  "sourceComponent": "next-step-button"
}
```

Mas, temos que ter muito cuidado com informações sigilosas. Se é tudo automático, poderíamos
acabar criando o seguinte Record ao submeter um formulário:

```json
{
  "type": "action",
  "beagleAction": "sendRequest",
  "url": "/payment",
  "method": "post",
  "data": {
    "cardNumber": "4589-4587-8958-0022",
    "cardHolder": "Charles Darwin",
    "expiration": "12/2020",
    "cvv": "458",
  },
  "eventName": "onSubmit",
  "sourceComponent": "payment-form"
}
```

**Como poderíamos identificar dados sensíveis e impedir que eles sejam enviados?**

Poderíamos, por padrão, nunca enviar dados da ação além de `_beagleAction_`. E daí, criamos um
`whitelist`:

```javascript
const actionsWhitelists = [
  {
    beagleAction: 'sendRequest',
    whitelist: ['url', 'method'],
  }
]
const analytics = new BeagleAnalytics(appId, appKey, actionsWhitelists)
```

**Nem todas as ações precisam de analytics**

Podemos criar um campo de texto controlado no Beagle, por exemplo. Dessa forma, cada keypress
dispara uma ação. Não faz sentido gerarmos analytics pra isso.

Será que essa whitelist também deveria considerar nomes de eventos ou tipos de componentes?
Poderíamos bloquear ações disparadas em inputs ou eventos com nome "onChange".

O que seria melhor whitelist ou blacklist?

# Entradas manuais de Analytics
O dev pode querer criar entradas específicas de analytics relacionadas ao comportamento do seu
custom component. Para isso, ele tem que poder importar a instância do BeagleAnalytics (singleton)
e utilizá-la em seu código.

Exemplo em React:
```typescript
import { FC } from 'react'
import { analytics } from '@zup-it/beagle-react'

interface DragAndDropProps {
  leftItems: string[],
  rightItems: string[],
}

const DragAndDrop: FC<DragAndDropProps> = ({ leftItems, rightItems }) => {
  function onDropItem(item: string, from: 'left' | 'right', to: 'left' | 'right') {
    analytics.createRecord({
      type: 'drag-n-drop',
      from,
      to,
    })
  }

  // ...
}

export default DragAndDrop
```

Dessa forma, o dev pode criar qualquer tipo de Record para o analytics, de forma manual.

# Informações mais difíceis de se coletar automaticamente

- Em que posição estava o elemento na tela
- ...

# Config de analytics (whitelist/blacklist) no backend
- config global em um endpoint
- configs locais nos jsons das views
