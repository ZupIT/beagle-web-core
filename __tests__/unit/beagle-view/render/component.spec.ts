/*
 * Copyright 2020, 2022 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
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

import Component from 'beagle-view/render/component'
import { createTable } from './component.mock'

describe('Beagle View: render: component', () => {
  it('should convert children according to component\'s metadata', () => {
    const component = createTable()
    const rows = component.rows
    Component.formatChildrenProperty(component, { property: 'rows' })

    expect(component.rows).toBeUndefined()
    expect(component.children).toBe(rows)
  })

  it('should replace children according to component\'s metadata', () => {
    const component = createTable()
    const rows = component.rows
    component.children = [{ _beagleComponent_: 'custom:text' }]
    Component.formatChildrenProperty(component, { property: 'rows' })

    expect(component.rows).toBeUndefined()
    expect((component as any).children).toBe(rows)
  })

  it('should convert single child object according to component\'s metadata', () => {
    const component = createTable()
    const row = component.rows[0]
    component.rows = row
    Component.formatChildrenProperty(component, { property: 'rows' })

    expect(component.rows).toBeUndefined()
    expect(component.children).toEqual([row])
  })
})
