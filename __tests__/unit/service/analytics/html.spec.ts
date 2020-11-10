/**
 * @jest-environment jsdom
 */

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

/**
 * @jest-environment jsdom
 */

import htmlHelpers from 'utils/html'

describe('Actions Analytics Service', () => {

  beforeAll(() => {

    const root = document.createElement('root')
    const divA = document.createElement('div')
    const divB = document.createElement('div')
    const buttonA = document.createElement('button')
    const buttonB = document.createElement('button')

    root.setAttribute('id', 'root')
    divA.setAttribute('data-beagle-id', '_beagle_2')
    divB.setAttribute('data-beagle-id', '_beagle_3')
    buttonA.innerHTML = 'Push Stack'
    buttonA.setAttribute('data-beagle-id', '_beagle_5')
    buttonB.setAttribute('data-beagle-id', '_beagle_6')

    root.appendChild(divA)
    divA.appendChild(divB)
    divB.appendChild(buttonA)
    divB.appendChild(buttonB)

    document.body.appendChild(root)
  })

  it('should getElementByBeagleId', () => {
    //@ts-ignore
    const result: Element = htmlHelpers.getElementByBeagleId("_beagle_5")
    expect(result.nodeName).toEqual('BUTTON')
    expect(result.innerHTML).toEqual('Push Stack')
  })

  it('should getPath', () => {
    const expectedXPath = 'BODY/ROOT/DIV/DIV/BUTTON/'
    //@ts-ignore
    const result: Element = htmlHelpers.getElementByBeagleId("_beagle_5")
    const xPath = htmlHelpers.getPath(result)
    expect(xPath).toEqual(expectedXPath)
  })

  it('should getPosition', () => {
    //@ts-ignore
    const result: Element = htmlHelpers.getElementByBeagleId("_beagle_6")
    const position = htmlHelpers.getElementPosition(result)
    expect(position).toEqual({ x: 0, y: 0 })
  })

})
