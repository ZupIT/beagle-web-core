/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { BeagleUIElement } from 'beagle-tree/types'

function createElements() {
  const text: BeagleUIElement = { _beagleComponent_: 'beagle:text' }
  const textR1C1: BeagleUIElement = { ...text, text: 'R1C1' }
  const textR1C2: BeagleUIElement = { ...text, text: 'R1C2', color: null }
  const textR1C3: BeagleUIElement = { ...text, text: 'R1C3' }
  const textR2C1: BeagleUIElement = { ...text, text: 'R2C1' }
  const textR2C2: BeagleUIElement = { ...text, text: 'R2C2' }
  const textR2C3: BeagleUIElement = { ...text, text: 'R2C3' }

  const buttonR1C1: BeagleUIElement = {
    _beagleComponent_: 'beagle:button',
    onPress: {
      _beagleAction_: 'beagle:pushView',
      route: {
        url: '/render.integration.spec',
        shouldPrefetch: true,
      },
    },
  }

  const column: BeagleUIElement = { _beagleComponent_: 'custom:column' }
  const columnR1C1: BeagleUIElement = { ...column, content: [textR1C1, buttonR1C1] }
  const columnR1C2: BeagleUIElement = { ...column, content: [textR1C2] }
  const columnR1C3: BeagleUIElement = { ...column, content: [textR1C3] }
  const columnR2C1: BeagleUIElement = { ...column, content: [textR2C1] }
  const columnR2C2: BeagleUIElement = { ...column, content: [textR2C2], spacing: null }
  const columnR2C3: BeagleUIElement = { ...column, content: [textR2C3] }

  const row: BeagleUIElement = { _beagleComponent_: 'custom:row' }
  const row1: BeagleUIElement = { ...row, columns: [columnR1C1, columnR1C2, columnR1C3] }
  const row2: BeagleUIElement = { ...row, columns: [columnR2C1, columnR2C2, columnR2C3] }

  const table: BeagleUIElement = {
    _beagleComponent_: 'custom:table',
    header: 'My table',
    id: 'table',
    rows: [row1, row2],
  }

  const number: BeagleUIElement = {
    _beagleComponent_: 'beagle:text',
    text: 'result: @{sum(test, 10)}',
    style: {
      margin: {
        bottom: {
          value: 30,
          type: 'REAL',
        },
      },
    },
  }

  const root: BeagleUIElement = {
    _beagleComponent_: 'beagle:container',
    context: {
      id: 'test',
      value: 10,
    },
    children: [table, number],
  }

  return {
    root,
    table,
    row1,
    row2,
    columnR1C1,
    columnR1C2,
    columnR1C3,
    columnR2C1,
    columnR2C2,
    columnR2C3,
    textR1C1,
    buttonR1C1,
    textR1C2,
    textR1C3,
    textR2C1,
    textR2C2,
    textR2C3,
    number,
  }
}

function createPreProcessedElements() {
  const elements = createElements()

  // ids
  elements.root.id = '_beagle_1'
  elements.row1.id = '_beagle_2'
  elements.columnR1C1.id = '_beagle_3'
  elements.textR1C1.id = '_beagle_4'
  elements.buttonR1C1.id = '_beagle_5'
  elements.columnR1C2.id = '_beagle_6'
  elements.textR1C2.id = '_beagle_7'
  elements.columnR1C3.id = '_beagle_8'
  elements.textR1C3.id = '_beagle_9'
  elements.row2.id = '_beagle_10'
  elements.columnR2C1.id = '_beagle_11'
  elements.textR2C1.id = '_beagle_12'
  elements.columnR2C2.id = '_beagle_13'
  elements.textR2C2.id = '_beagle_14'
  elements.columnR2C3.id = '_beagle_15'
  elements.textR2C3.id = '_beagle_16'
  elements.number.id = '_beagle_17'

  // children
  elements.table.children = elements.table.rows
  delete elements.table.rows
  elements.row1.children = elements.row1.columns
  delete elements.row1.columns
  elements.columnR1C1.children = elements.columnR1C1.content
  delete elements.columnR1C1.content
  elements.columnR1C2.children = elements.columnR1C2.content
  delete elements.columnR1C2.content
  elements.columnR1C3.children = elements.columnR1C3.content
  delete elements.columnR1C3.content
  elements.row2.children = elements.row2.columns
  delete elements.row2.columns
  elements.columnR2C1.children = elements.columnR2C1.content
  delete elements.columnR2C1.content
  elements.columnR2C2.children = elements.columnR2C2.content
  delete elements.columnR2C2.content
  elements.columnR2C3.children = elements.columnR2C3.content
  delete elements.columnR2C3.content

  // remove nulls
  delete elements.textR1C2.color
  delete elements.columnR2C2.spacing

  return elements
}

function createReadyToRenderElements() {
  const elements = createPreProcessedElements()

  elements.buttonR1C1.onPress = expect.any(Function)
  elements.number.text = 'result: 20'
  elements.number.style = { marginBottom: '30px' }

  return elements
}

export function createTree() {
  const original = createElements().root
  const preProcessed = createPreProcessedElements().root
  const readyToRender = createReadyToRenderElements().root

  return { original, preProcessed, readyToRender }
}
