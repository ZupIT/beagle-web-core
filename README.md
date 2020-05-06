# Especificação - Eventos, Ações, Contextos e Bindings

## Introdução

### Eventos
Eventos são disparados pelos componentes da aplicação ou por uma ação. No JSON, tudo que está relacionado a uma ação é um evento.

Exemplo:

```json
{
 "onPress": ACTION,
}
```

Onde `ACTION` corresponde a uma ação qualquer. Note que, normalmente, eventos começam com o prefixo "on". Exemplos: onPress, onInit, onChange, onFocus, onBlur.

Qualquer componente pode disparar eventos, mas os atributos que declaram eventos, assim como qualquer outro, devem estar na especificação do componente. Por exemplo, um "button", além dos atributos "type", "value" e "style", também possui o atributo "onPress", que é do tipo "Action", pois sempre deve estar relacionado a uma ação.

### Ações
Ações são sempre valores associados a eventos. Uma ação é identificada pela chave `_actionType_`. `_actionType_`, além de indicar que o objeto é uma ação, identifica o tipo de ação que deve ser executada.

Alguns exemplos de `_actionType_` são:
- alert: mostra uma caixa de alerta do sistema com uma mensagem e um botão de ok para fechar a mensagem.
- setContext: essa é a principal ação nesta especificação. Ela altera algum valor em algum contexto. Contextos serão vistos mais a frente.
- sendRequest: dispara uma requisição http.

Junto ao `_actionType_`, uma ação deve definir os parâmetros esperados pelo tipo de ação especificado. Uma ação do tipo "alert", por exemplo, espera os seguintes parâmetros:
- message: mensagem a ser exibida.
- onPressOk: opcional. Ação que deve ser executada quando o botão de ok for pressionado.

Portanto, para abrir uma caixa de alerta do sistema ao clicar em um botão, por exemplo, poderíamos usar a seguinte combinação de ação e evento:

```json
{
  "_beagleType_": "button",
  "value": "Clique para abrir o alerta",
  "onPress": {
    "_actionType_": "alert",
    "message": "Caixa de alerta foi aberta! Clique em \"ok\" para fechar."
  }
}
```

Atente-se para o fato de que a ação "alert" é apenas um exemplo. Qualquer ação, com qualquer `_actionType_` poderia ser lançada no evento de "onPress".

### Contexto
Um contexto pode ser estabelecido em qualquer componente Beagle que aceite um ou mais filhos. Todo contexto é identificado pela chave `_context_`. Se a chave `_context_` é encontrada no JSON, então um contexto está sendo definido a partir daquele ponto na árvore, ou seja, o escopo desse contexto é o próprio elemento onde ele foi definido e todos seus descendentes.

Um contexto nada mais é que uma variável. Essa variável pode ser de qualquer tipo, inclusive um mapa, definindo um conjunto de pares <key, value>. Através de bindings (próximo tópico), o valor de um contexto pode ser acessado por qualquer componente ou ação em seu escopo.

Um contexto possui sempre um id e um valor. Veja um exemplo de componente que define um contexto:

```json
{
  "_beagleType_": "container",
  "_context_": {
    "id": "myText",
    "value": "Hello World!",
  },
  "children": [
    {
      "_beagleType_": "text",
      "value": "Exemplo de contexto"
    }
  ]
}
````

O contexto acima é uma simples string, mas ele poderia também ser um número, um array ou um mapa <chave, valor>, não há restrição de tipo.

### Bindings
A ideia de contexto não faz sentido por si só, é necessário poder acessá-lo. Para acessar um contexto, faz-se uso de "bindings" que nada mais são que strings em um formato especial que identifica um valor dentro de algum contexto disponível.

#### Acessando os bindings

Um binding é identificado pelo prefixo `${` e sufixo `}`. Tudo entre os símbolos `${` e `}` identificam o valor do contexto pelo qual o binding deve ser trocado ao renderizar a tela. O valor é sempre identificado pelo id do contexto. Veja o exemplo a seguir:

Contexto:
```json
{
  "id": "myText",
  "value": "Hello World"
}
```

Para acessar o texto "Hello World" através de binding, bastaria especificar o id do contexto: `${myText}`.

O exemplo acima funciona bem para strings e números, mas na maioria das vezes, o valor do contexto é um mapa <chave, valor>. Nesses casos, utiliza-se pontos para acessar as sub-estruturas. Veja o exemplo:

Contexto:
```json
{
  "id": "user",
  "value": {
    "cpf": "014.225.235-12",
    "phoneNumbers": {
      "cellphone": "(34) 98856-8563",
      "telephone": "(34) 3214-5588"
    }
  }
}
```

Para acessar o cpf através de binding: `${user.cpf}`.
Para acessar o número de celular através de binding: `${user.phoneNumbers.cellphone}`.

Se o valor no contexto for um array, deve-se utilizar os símbolos `[` e `]` para acessar posições específicas. Veja o exemplo:

Contexto:
```json
{
  "id": "movies",
  "value": {
    "genre": "sci-fi",
    "titles": [
      {
        "title": "Inception",
        "year": 2010,
        "rating": 8.8,
      },
      {
        "title": "Contact",
        "year": 1997,
        "rating": 7.4,
      }
    ]
  }
}
````

Para acessar o título do segundo filme: `${movies.titles[1].title}`.

Note que a notação de array é sempre _zero-based_, ou seja, o primeiro elemento do array é sempre 0, e não 1.

Um binding referente a um contexto só funciona dentro do escopo desse contexto. Bindings referentes a contextos de escopos diferentes ou inexistentes não serão resolvidos e na tela aparecerão como foram digitados. Por exemplo, se o binding é `${client.name}` e o contexto "client" não é acessível ou não possui o caminho "name", na tela, esse binding não sofrerá modificação, ou seja, aparecerá exatamente como `${client.name}`.

Reforçando a ideia acima, bindings nunca devem lançar exceção! Se o contexto não é acessível, o binding não é substituído por valor algum.

#### Tipos de dados dos bindings

Considere o seguinte contexto:
```json
{
  "id": "family",
  "value": {
    "father": {
      "name": "Olavo Oliveira",
      "age": 50
    },
    "mother": {
      "name": "Olívia Oliveira",
      "age": 52
    },
    "children": [
      {
        "name": "Paulo Oliveira",
        "age": 18
      },
      {
        "name": "Daniela Oliveira",
        "age": 16
      }
    ]
  }
}
```

Se quisermos referenciar a idade do pai, podemos fazer isso de duas formas:
1. `"${family.father.age}"`
2. `"A idade do pai é ${family.father.age}"`

No primeiro caso, o binding será substituído pelo número 50. No segundo caso, o binding será substituído pela string "50".

Para referenciar os filhos:
1. `"${family.children}"`
2. `"Os filhos do casal são ${family.children}"`

No primeiro caso, o binding será substituído pelo array de filhos. No segundo caso o binding será substituído por uma representação em string desse array (JSON).

De forma geral, um binding sempre é representado por uma string. Se nessa string existe apenas o binding, o tipo de dado do valor substituído é o tipo da variável no contexto. Caso contrário, se o binding está no meio de um texto, o binding será substituído por uma representação em string do dado, independente do tipo de dado no contexto.

#### Escapando um binding
É possível que se queira escrever em um texto exatamente uma string no formato "${nome}", mas se isso for feito, as operações de bindings serão realizadas em cima dessa string. Para que os bindings não rodem em cima dessa string, deve-se escapar essa expressão. Veja um exemplo:

Deseja-se escrever extamente "${client.name}", ou seja essa string não deve ser trocada.

```json
{
  "_beagleType": "text",
  "value": "\\${client.name}"
}
```

Considerando um contexto onde `client.name` vale `João`, para fins de teste, é importante validar os seguintes casos:

- `${client.name}` resulta em `João`.
- `\\${client.name}` resulta em `${client.name}`.
- `\\\\${client.name}` resulta em `\João`.
- `\\\\\\${client.name}` resulta em `\${client.name}`.

#### Limitações na nomenclatura de variáveis
Variáveis em um binding podem conter apenas letras, números e o caracter "_".

## Ações customizadas
O Beagle oferecerá uma série de ações para o desenvolvedor, mas não é incomum que o desenvolvedor queira implementar comportamentos muito específicos que o Beagle sozinho não conseguiria oferecer. Para isso, o usuário poderá declarar suas próprias ações, chamadas de "customActions".

Uma customAction possui obrigatoriamente um `_actionType_` que deve ser único e identificar a ação. Além do `_actionType_`, a customAction pode receber qualquer atributo que faça sentido para ela. Por exemplo, uma customAction que mostra mensagens de feedback na tela poderia chamar "showFeedbackMessage" e ter o seguinte esquema (notação Typescript):

```typescript
interface ShowFeedbackMessageAction {
  _actionType_: 'showFeedbackMessage',
  level?: 'info' | 'warning' | 'success' | 'error',
  text: string,
  duration?: number,
}
```

As funções que tratam as customActions são chamadas de "ActionHandlers" e devem ser declaradas no Beagle de forma que ele entenda qual função trata cada customAction. Cabe aos times de ios, android e web decidir o melhor local para declará-las em suas respectivas libs. Nas libs de web, por exemplo, as customActions e seus respectivos handlers são declarados na  configuração do Beagle como um mapa chave-valor, onde as chaves correspondem aos action types e os valores aos action handlers.

Um ActionHandler deve implementar uma interface pré-definida pela lib e sua execução deve receber a customAction lançada como parâmetro. Veja um exemplo em Typescript que apresenta o tratamento da customAction showFeedbackMessage apresentada anteriormente:

```typescript
import { ActionHandler } from '@zup-it/beagle-react'
import { messageDelivery } from 'components/FeedbackMessage'
 
export const feedbackMessageHandler: ActionHandler<ShowFeedbackMessageAction> = ({ action }) => {
  messageDelivery.send({
    text: action.text,
    level: action.level,
    duration: action.duration,
  })
}
```

Na configuração do Beagle, associa-se a função "feedbackMessageHandler" ao action type "showFeedbackMessage". Veja:

```typescript
export default createBeagleUIService({
  baseUrl: 'http://beagleurl.com',
  components: {
    /* components go here */
  },
  customActions: {
    showFeedbackMessage: feedbackMessageHandler,
  },
})
```

## Contextos implícitos
Contextos implícitos são qualquer contexto que existe, possui um escopo, pode ser acessado por bindings, mas não foi declarado através da palavra `_context_` no JSON. Contextos implícitos podem ser criados apenas por eventos.

Em alguns casos, é necessário acessar alguma informação particular do evento que disparou uma ação. Um exemplo muito comum é o evento de "onChange" lançado por qualquer tipo de componente que permite entrada de dados. Se o valor de um componente de entrada de dados muda e queremos disparar uma ação baseada nisso, é fundamental que sejamos capazes de saber qual o novo valor.

Ao ser disparado, o evento de "onChange" cria um contexto implícito chamado de "onChange". O contexto implícito sempre tem id igual ao nome do evento que o criou. O valor do contexto "onChange" criado é um objeto que possui o campo "value", o valor de "onChange.value", portanto, é o novo valor entrado no componente.

"OnChange" não é o único evento que cria um contexto implícito. Outros exemplos são "onFocus", "onBlur", "onSuccess" e "onError", sendo esses dois últimos eventos disparados pela ação de "sendRequest".

O escopo de um contexto implícito é apenas a ação ou o conjunto de ações relacionadas ao evento que criou o contexto.

Veja um exemplo de contexto criado implicitamente:

```json
{
  "_beagleType_": "input",
  "label": "CEP",
  "onBlur": {
    "_actionType_": "sendRequest",
    "url": "https://viacep.com.br/ws/${onBlur.value}/json",
    "method": "get"
  }
}
```

No exemplo acima, por mais que em nenhum momento tenha sido um declarado o contexto "onBlur", podemos usá-lo no binding, pois sabe-se que, de forma implícita, ele foi criado pelo evento "onBlur".

## Hierarquia de contextos

Como dito na seção de contextos, o escopo de um contexto é o próprio componente onde ele foi definido e seus descendentes. Mas, o que acontece se um dos descendentes também declara um contexto?

Nesse caso, existirá mais de um contexto no escopo, e eles podem ser identificados normalmente nos bindings através de seus ids. Se existem dois contextos com o mesmo id no mesmo escopo, vale o contexto correspondente ao primeiro ascendente, ou seja, o contexto mais próximo considerando a direção dos filhos para os pais.

Ao utilizar a ação "setContext", o atributo "context" indica o id do contexto que deve ser alterado. Se o atributo "context" é omitido, o contexto a ser alterado será o primeiro ascendente, desconsiderando qualquer contexto implícito.

Considerando uma leitura da árvore que inicia na raiz e termina nas folhas, a hierarquia de contextos pode ser implementada como uma pilha, de forma que sempre que se encontra um contexto na árvore de componentes, esse contexto é adicionado como primeiro elemento no array de contextos. Assim, pode-se definir que a ordem de importância dos contextos nesse array é da primeira para a última posição.

## Ações padrões
Estas são ações que devem ser implementadas no Beagle e disponibilizadas para todos os desenvolvedores, sem a necessidade de declará-las como custom actions.

### SetContext
Essa é a ação mais importante e serve para estabelecer uma comunicação entre componentes. A ação de "setContext" tem a função de mudar valores em algum contexto disponível na hierarquia de contextos do componente. Veja a especificação do setContext em notação Typescript:

```typescript
interface SetContextAction {
  _actionType_: 'setContext',
  context?: string,
  path?: string,
  value: string,
}
```

**Em uma ação de setContext, após alterar o valor no contexto indicado, deve-se reavaliar os bindings na árvore, considerando os novos valores.** Pode-se reavaliar apenas a parte da árvore no escopo do contexto alterado, já que o restante da árvore não é afetado pelo contexto em questão. Não há problema em reavaliar a árvore inteira, apenas não é necessário.

#### context
`context` é opcional e diz qual contexto na hierarquia de contextos deve ser alterado. A referência é feita através do id do contexto. Quando omitido, referencia o primeiro contexto da hierarquia, ou seja, primeiro contexto ascendente (direção dos filhos para os pais) desconsiderando qualquer contexto implícito. Esta ação altera apenas contextos explícitos.

#### path
`path` diz qual subestrutura do valor do contexto deve ser alterada. Considere o seguinte exemplo de valor para o contexto:

```json
{
  "name": {
    "first": "João",
    "last": "Rodrigues"
  },
  "addresses": [
    {
      "zip": "25758-021",
      "number": 580
    }
  ]
}
```

Para alterar apenas o primeiro nome, o valor de `path` deve ser `name.first`. Para alterar o nome inteiro, `path` deve valer `name`. Para alterar o número do primeiro endereço, `path` deve valer `addresses[0].number`. `path` é opcional e quando omitido troca todo o valor do contexto.

#### value
`value` é um campo obrigatório que define o novo valor do contexto no campo indicado por `path`. Pode ser string, némero, array ou um objeto (mapa <chave, valor>).

### SendRequest

Esta ação é responsável por disparar requisições HTTP. Os dados retornados pela requisição podem ser acessados através do contexto implícito criado pelo evento "onSuccess". Esta ação dispara eventos que podem ser associados a outras ações, o que permite um encadeamento de ações. Veja a especificação do sendRequest em notação Typescript:

```typescript
interface SendRequestAction {
  _actionType_: 'sendRequest',
  url: string,
  method?: 'get' | 'post' | 'put' | 'patch' | 'delete',
  data?: any,
  headers?: Record<string, string>,
  onSuccess?: BeagleAction,
  onError?: BeagleAction,
  onFinish?: BeagleAction,
}
```

#### url
A URL para onde deve-se enviar a requisição. Utiliza o URLBuilder, ou seja, o padrão de URL aqui é o mesmo seguido no restante do Beagle, se inicia com "/" é um path relativo, caso contrário, é absoluto.

#### method
Opcional. Indica o método da requisição. Quando não especificado, o valor é "get".

#### data
Opcional. Valor a ser enviado no corpo da requisição. Esse valor será convertido para JSON ao enviar a requisição.

#### headers
Opcional. Mapa <chave, valor>, onde o valor é sempre uma string. Representa headers adicionais a serem enviados na requisição.

#### onSuccess
Opcional. É um evento, ou seja, deve ser associado a uma ação. A ação associada é executada assim que a requisição termina e é bem sucedida. O evento de onSuccess cria um contexto implícito com o seguinte valor:

- `data`: corpo da resposta. Se a resposta era um JSON, `data` contem a resposta parseada. Caso contrário, é uma string. Se a resposta é vazia, `data` não tem valor.
- `status`: número correspondente ao status da requisição. Exemplo: 422.
- `statusText`: texto correspondente ao status da requisição. Exemplo: "Bad request".

Por "requisição bem sucedida" entende-se qualquer requisição que foi enviada, obteve uma resposta e o status da resposta foi um código menor que 400.

#### onError
Opcional. É um evento, ou seja, deve ser associado a uma ação. A ação associada é executada assim que ocorre um erro na requisição. O evento de onError cria um contexto implícito com o seguinte valor:

- `data`: corpo da resposta. Se a resposta era um JSON, `data` contem a resposta parseada. Caso contrário, é uma string. Se a resposta é vazia ou inexistente, `data` não tem valor.
- `status`: número correspondente ao status da requisição. Se não houve resposta, `status` não tem valor.
- `statusText`: texto correspondente ao status da requisição. Se não houve resposta, `statusText` não tem valor.
- `message`: string com uma mensagem que identifica o erro ocorrido.

`message` deve ter o seguinte comportamento: caso a requisição termine e tenha um status, deve valer o mesmo que `statusText`. Caso a requisição não termine devido a algum erro no processo (exceção, por exemplo), deve valer uma representação em string do erro.

#### onFinish
Opcional. É um evento, ou seja, deve ser associado a uma ação. A ação associada é executada sempre que a requisição termina, seja com sucesso ou erro. onFinish, diferente de onSuccess e onError, não cria um contexto implícito.

### AddChildren
Esta ação serve para alterar galhos da árvore de UI, ou seja, ela manipula os filhos de um nó mudando o atributo children de algum componente da árvore. Esta ação pode ser representada da seguinte forma em notação Typescript:

```typescript
interface AddChildrenAction {
  _actionType_: 'addChildren',
  componentId: string,
  value: BeagleUIElement[],
  mode?: 'append' | 'prepend' | 'replace',
}
```

Na notação acima, o tipo `BeagleUIElement` representa um componente, ou seja, um nó da árvore.

#### componentId
Indica em qual componente deve-se adicionar os filhos. Deve sempre referenciar o id de algum componente na árvore.

#### value
Nesse campo deve-se passar os nós que devem ser adicionados como filho do elemento indicado pelo "componentId". Será sempre um array de elementos de UI (componentes).

#### mode
Opcional. Diz como os filhos em `value` devem ser adicionados ao elemento de id `componentId`. Existem três métodos de inserção possíveis:
- `append`: padrão, `mode` assume esse valor quando não é especificado. Adiciona os filhos ao final da lista de filhos do componente.
- `prepend`: adiciona os filhos no início da lista de filhos do componente.
- `replace`: troca o array de filhos atual do componente pelo novo, perdendo todos os elementos que existiam anteriormente.

### Ações de navegação
Estas ações geram uma navegação na aplicação. Esta navegação pode afetar a aplicação como um todo ou apenas a view correspondente ao Beagle. As definições de como deve funcionar a navegação foram definidas previamente e devem ser replicadas aqui. A seguir, apresenta-se as definições de cada ação de navegação em notação Typescript.

```typescript
interface OpenExternalURLAction {
  _actionType_: 'openExternalURL',
  url: string,
}

interface OpenNativeRouteAction {
  _actionType_: 'openNativeRoute',
  route: string,
  data?: Record<string, any>,
}

interface PushStackAction {
  _actionType_: 'pushStack',
  route: string,
}

interface PopStackAction {
  _actionType_: 'popStack',
}

interface PushViewAction {
  _actionType_: 'pushView',
  route: string,
}

interface PopViewAction {
  _actionType_: 'popView',
}

interface PopToViewAction {
  _actionType_: 'popToView',
  route: string,
}

interface ResetNavigationAction {
  _actionType_: 'resetNavigation',
  route: string,
}
```

Para mais detalhes sobre estas ações, favor consultar as definições sobre navegação. Nenhuma dessas ações cria contextos implícitos.

### Alert e confirm

Mostram as caixas de diálogo nativas do sistema. Alert mostra uma mensagem e um botão "ok". Confirm mostra uma mensagem e dois botões: "ok" e "cancel". A seguir apresenta-se as definições de ambas ações em notação Typescript.

```typescript
interface AlertAction {
  _actionType_: 'alert',
  message: string,
  onPressOk?: BeagleAction,
}

interface ConfirmAction {
  _actionType_: 'confirm',
  message: string,
  onPressOk?: BeagleAction,
  onPressCancel?: BeagleAction,
}
```

`onPressOk` e `onPressCancel` são eventos, ou seja, serão associados à ações e permitem que se faça um encadeamento de ações. A ação associada ao `onPressOk` é executada quando o botão de ok é pressionado. A ação associada ao `onPressCancel` é executada quando o botão de cancel é pressionado.

## Componentes padrões e eventos esperados

### Button
O componente de botão possui os eventos `onPress` e `onLongPress`. Nenhum desses eventos cria contexto implícito.

### Form
O componente de form possui os eventos `onSubmit` e `onReset`. Nenhum desses eventos cria contexto implícito.

### Inputs
Todo componente de entrada de dados possui os eventos `onChange`, `onFocus` e `onBlur`. `onChange` é disparado quando o valor do input muda. `onFocus` é disparado quando o input recebe foco. `onBlur` é disparado quando o input perde foco.

Esses três eventos criam um contexto implícito onde o valor é do tipo (notação Typescript):

```typescript
{
  value: any,
}
```

Onde `value` é o valor do campo. Na maioria dos casos, `value` será uma string, mas em checkboxes, por exemplo, `value` será booleano. Outros tipos de componentes para entrada de dados poderia ter outros tipos como valor. Por esse motivo, prefere-se não especificar um tipo para `value`.

### Containers
Containers devem disparar o evento `onInit` ao serem inicializados pela primeira vez.

## Exemplos

A seguir apresenta-se uma série de exemplos usando as definições de evento, ação, contexto e bindings. Os exemplos apontam para páginas web rodando o beagle, abram as ferramentas de desenvolvedor (F12) para observar as rqeuisições e analisar os JSONs.

- [Texto reativo](https://beagle-interaction-poc.netlify.app/#reactive-text)
- [Abertura de modal](https://beagle-interaction-poc.netlify.app/#modal)
- [Submissão de formulário](https://beagle-interaction-poc.netlify.app/#form)
- [Feedbacks em formulários](https://beagle-interaction-poc.netlify.app/#form-with-feedback)
- [Indicador de loading ao enviar formulários](https://beagle-interaction-poc.netlify.app/#form-with-loading)
- [Autocomplete em formulários (CEP preenche o restante dos campos)](https://beagle-interaction-poc.netlify.app/#form-with-autocomplete)
- [Separação entre modelo de apresentação (view) e dados](https://beagle-interaction-poc.netlify.app/#lazy-data-model)
- [Carregando uma modal de forma lazy (conteúdo só carrega quando a modal é aberta)](https://beagle-interaction-poc.netlify.app/#lazy-modal)
- [Lista de filmes, onde novos filmes são adicionados sempre que se clica no botão](https://beagle-interaction-poc.netlify.app/#movie-list)
