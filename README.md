# Resumo

Este documento tem como objetivo sugerir propostas para a primeira versão do Beagle Web após a 1.0
(provavelmente a 1.1). Acredito que devemos focar no aperfeiçoamento daquilo que já oferecemos.
Portanto, vejo os seguintes pontos como os principais em que devemos trabalhar:

1. Aperfeiçoamento da arquitetura
2. Melhorias de performance
3. Correção de bugs
4. Documentação top sobre a arquitetura, getting started, exemplos no playground e tópicos avançados
5. Aperfeiçoar o playground
6. ~~Rever o funcionamento do Beagle Angular. O que podemos melhorar? Vale trocar a abordagem?~~
7. ~~Implementar o Beagle no React Native~~
8. ~~Implementar o Beagle no React Electron~~

Risquei os ponto 6, pois, apesar de ser um grande ponto de melhoria, é algo muito complexo e
acredito que seria mais prudente colocá-lo para a versão seguinte (provavelmente 1.2).

Risquei os pontos 7 e 8, pois acredito que sejam menos importantes em relação aos demais e poderiam
estar na versão 1.2 ao invés de a 1.1.

Os pontos 6, 7 e 8 podem ser desenvolvidos em paralelo com o restante, caso faltem tasks para a
equipe.

**É importante lembrar que não podemos ter breaking changes nessas versões.**

# Propostas

A proposta 1 e a 2 são as únicas que precisam de um grande detalhamento, as demais são auto-explicativas.

## Melhorias de arquitetura e performance (core)

O Beagle web hoje funciona bem para nós, é um código extensível e desacoplado que nos permite
implementar novas funcionalidades com muita agilidade. Mas isso traz um problema: como não temos
uma definição clara e objetiva da arquitetura, não é fácil entender como tudo funciona, o que acaba
levando ao uso errado de middlewares ou outras funcionalidades da lib. Até mesmo para nós, é comum
criarmos middlewares que executam em ordem errada. Precisamos que o dev saiba claramente como tudo
funciona e em que momentos seu código irá rodar.

Destacamos os seguintes pontos que precisamos melhorar na arquitetura:

### Middlewares

Middlewares foi uma boa ideia para criar um ponto de extensão fácil de se usar na lib, mas a medida
que o projeto cresceu em complexidade, a utilização de middlewares se tornou algo confuso e perigoso.

- A ordem dos middlewares é excessivamente importante
- O dev pode criar um middleware que sobrescreve uma expressão (`${exemplo.de.expressao}`), nesse
caso, todo o contexto vai parar de funcionar e ele provavelmente não vai saber o por que.
- Não está claro o momento em que os middlewares rodam.
- Muitos problemas são resolvidos com middlewares, o que pode levar a um problema de performance.

**Proposta:** remover os middlewares. Não remover a funcionalidade, mas oferecê-la de forma mais
bem organizada. Um dos pontos é melhor documentar a arquitetura, nessa documentação fica claro
quais passos executamos e a ordem em que eles são executados. Existem alguns pontos chave nesse
processo, por exemplo, logo após o JSON chegar do servidor, logo antes de se atribuir a árvore ao
Beagle View ou logo antes de renderizar a view. Esses deveriam ser nossos pontos de extensão, e ao
invés de chamá-los de middlewares, poderíamos chamá-los de lifecycles, como em outros frameworks de
renderização. Dessa forma, fica mais claro onde cada coisa será executada e impedimos que alguns
erros aconteçam, pois poderemos garantir uma ordem nos nossos processos.

Sobre não ter breaking changes, podemos deprecar os middlewares, mas continuar os executando como
se fosse algum dos lifecycles.

Além disso, algumas coisas que se tornaram muito comuns no decorrer do nosso desenvolvimento podem
virar annotations. Veja o exemplo do próximo tópico.

### Children, child, itens, rows, etc

Tentamos mudar o restante das frentes para padronizarem tudo como "children", mas não funcionou.
Como resultado, temos um middleware para cada componente fora do padrão e sempre que um novo é
adicionado, precisamos de um middleware novo. Isso não está legal!

**Proposta:** abraçar a falta de padrão e adotar uma solução mais fácil, clara e performática para
o problema. A primeira coisa que fazemos ao receber um json é interpretar a árvore, quem são os nós
e quem é filho de quem. Para isso, por padrão, verificamos apenas "children" e "child", mas os
componentes provedenciados na config podem declarar onde estão seus filhos, de forma que não
precisemos criar um middleware sempre que um componente aparece usando um padrão diferente.

Essa definição de quem são os filhos pode ser feita através de uma anotação, veja o exemplo a
seguir:

```typescript
@BeagleChildren({ propertyName: 'rows' })
export class BeagleTable extends Component {
  // ...
}
```

`@BeagleChildren` recebe um objeto ao invés de uma string, pois podemos colocar outras propriedades
interessantes alí. Veja a sessão "Validação de tipos".

### Middlewares/lifecycles por componente

Hoje os middlewares são definidos na config, o que não parece um lugar muito legal para definir, por
exemplo, algo que deve rodar por conta de um componente específico. Além disso, isso anda nos
obrigando a misturar lógica dos componentes com o Beagle Web Core.

**Proposta:** considerando que a proposta de substituir middlewares por lifecycles foi aceita,
podemos definir um lifecycle específico do componente junto a ele, com annotation. Veja o exemplo:

```typescript
function createTabItemStructure(tabViewElement: BeagleUIElement) {
  // ...
}

@BeagleBeforePreProcessing(createTabItemStructure)
export class TabView extends Component {
  // ...
}
```

### Validação de tipos

Hoje, validamos a tipagem dos componentes apenas com o Typescript. Em runtime, se algo vem errado do
backend, se o cara transforma um tipo de dado errado em algum middleware ou se uma expressão resolve
para um tipo de dado errado, acontecerá um erro no componente, sem avisarmos nada ao dev.

Por exemplo, suponha que o dev faça um middleware que transforma algo que era array para uma
string, e o componente final espera array. Provavelmente vai ocorrer erro em runtime, pois, o
componente pode usar `map`, por exemplo, que não existe em uma string. É difícil o dev saber que
aconteceu um erro de tipo, que o JSON renderizado não respeitava o contrato do componente dele.

Outro exemplo mais comum é o uso de uma expressão que resolve para um tipo de dado não esperado
ou que se quer é resolvido. Suponha um componente que recebe um array e o JSON traz como valor
`"@{clients}"`. `clients` deve existir no contexto e deve ser um array. Mas se isso não acontecer,
vai ser difícil o dev descobrir onde está o erro.

Para resolver esse problema, devemos adicionar um passo no fluxo quando o modo de execução é
"development". Isso não rodaria em produção. Nesse passo compararíamos o objeto que queremos
renderizar com a definição de tipo do componente. Se algo estiver diferente, logamos um warning
para o dev dizendo o que está errado.

Outra validação interessante seria quanto aos filhos. Alguns componentes podem ter apenas um
filho, outros podem ter filhos de um único tipo. Junto a anotação "@BeagleChildren" poderíamos
permitir especificar propriedades como "maximumNumberOfChildren", "minimumNumberOfChildren" e
"allowedChildrenComponents".

### Documentação

Precisamos ter bem documentado em um formato fácil de se entender todo o fluxo do Beagle, desde a
requição para o JSON até a renderização na tela.

Já comecei a desenvolver isso, estou representando todo o fluxo (considerando as mudanças propostas)
através de uma imagem.

![Beagle Web Flow](https://i.ibb.co/Bq5TScW/tm-J6c-JSPWT9-W-Et-Y1-I5-Mq-Trm-K9-Pkanozlh3y5-DCl-GOq-WG-Xhm-H3-Xf0svn-Pr-XI5-AXTNCw-Fax-TMy-CT8-Sz-W7n-w2560-h1001-rw.png)

### Conclusão

Vale lembrar que tudo aqui está sujeito à modificações e é provável que isso aconteça, já que, com
certeza, só vamos enxergar alguns problemas na hora que formos implementar.

Estou particularmente insatisfeito com a nomenclatura dos processos e dos lifecycles (veja na
imagem que descreve o fluxo/arquitetura). Por favor, Deem sugestões.

Submetam PR's para esse documento para propor novas melhorias para v1.1 e para melhorar o que já
foi proposto. Ou comentem na issue [#113](https://github.com/ZupIT/beagle-web-core/issues/113).
