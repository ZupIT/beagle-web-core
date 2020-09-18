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
