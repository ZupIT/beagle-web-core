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

import { findIndex } from 'lodash'

export interface Label {
  id: number,
  name: string,
  color: string,
}

let idCounter = 0

const labels: Label[] = [
  {
    id: idCounter++,
    name: 'Personal',
    color: '#00ff00',
  },
  {
    id: idCounter++,
    name: 'Work',
    color: '#0000ff',
  },
  {
    id: idCounter++,
    name: 'Urgent',
    color: '#ff0000',
  },
  {
    id: idCounter++,
    name: 'Supermarket',
    color: '#ffff00',
  }
]

export function getLabels() {
  return labels
}

export function addLabel(label: Omit<Label, 'id'>) {
  const labelWithId = { ...label, id: idCounter++ }
  labels.push(labelWithId)
}

export function removeById(id: number) {
  const index = findIndex(labels, { id })
  if (index !== -1) labels.splice(index, 1)
}

export function editLabel(label: Label) {
  const index = findIndex(labels, { id: label.id })
  if (index !== -1) labels[index] = label
}
