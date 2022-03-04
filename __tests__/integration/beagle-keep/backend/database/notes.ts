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

import { find, findIndex, cloneDeep } from 'lodash'
import { LoremIpsum } from 'lorem-ipsum'
import { create as createRNG } from 'random-seed'
import { getLabels, Label } from './labels'

export interface Note {
  id: number,
  labels: number[],
  text: string,
  createdAt: number,
  title?: string,
}

export interface FullNote extends Omit<Note, 'labels'> {
  labels: Label[],
}

const MAX_LENGTH = 100
const rng = createRNG('1600721513470')
let idCounter = 0

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4
  },
  wordsPerSentence: {
    max: 16,
    min: 4
  },
  // guarantees the same sentences will be generated everytime
  random: rng.random,
})

const initialNotes: Note[] = [
  {
    id: idCounter++,
    title: 'Dentist',
    text: lorem.generateParagraphs(1),
    createdAt: 1600453354284,
    labels: [0],
  },
  {
    id: idCounter++,
    title: 'Gym exercises for monday',
    text: lorem.generateParagraphs(3),
    createdAt: 1600453354284,
    labels: [0],
  },
  {
    id: idCounter++,
    title: 'Send research results',
    text: lorem.generateParagraphs(1),
    createdAt: 1600453354284,
    labels: [1, 2],
  },
  {
    id: idCounter++,
    title: 'Market list for september',
    text: lorem.generateParagraphs(2),
    createdAt: 1600453354284,
    labels: [3],
  },
  {
    id: idCounter++,
    title: 'Check the new coffee brand',
    text: lorem.generateParagraphs(1),
    createdAt: 1600453354284,
    labels: [3],
  },
  {
    id: idCounter++,
    title: 'Ask for a raise',
    text: lorem.generateParagraphs(4),
    createdAt: 1600453354284,
    labels: [1],
  },
  {
    id: idCounter++,
    title: 'Ask George to read his e-mails',
    text: lorem.generateParagraphs(2),
    createdAt: 1600453354284,
    labels: [1],
  },
  {
    id: idCounter++,
    title: 'Parents meeting at school',
    text: lorem.generateParagraphs(3),
    createdAt: 1600453354284,
    labels: [0],
  },
]

let notes = cloneDeep(initialNotes)

function asFullNote(note: Note): FullNote {
  const labels = getLabels()
  const noteLabels = note.labels.map(id => find(labels, { id })).filter(l => !!l) as Label[]
  return { ...note, labels: noteLabels }
}

function asNote(note: FullNote): Note {
  return {
    ...note,
    labels: note.labels.map(({ id }) => id)
  }
}

export function getNotes(): FullNote[] {
  return notes.map(n => ({
    ...asFullNote(n),
    text: n.text.length <= MAX_LENGTH ? n.text : `${n.text.substr(0, MAX_LENGTH)}...`,
  }))
}

export function getNoteById(id: number): FullNote | undefined {
  const note = find(notes, { id })
  return note && asFullNote(note)
}

export function addNote(note: Omit<FullNote, 'id'>) {
  const noteWithId = { ...note, id: idCounter++ }
  notes.push(asNote(noteWithId))
  return noteWithId
}

export function removeNoteById(id: number) {
  const index = findIndex(notes, { id })
  if (index !== -1) notes.splice(index, 1)
}

export function editNote(note: FullNote) {
  const index = findIndex(notes, { id: note.id })
  if (index !== -1) notes[index] = asNote(note)
  return note
}

export function resetNotes() {
  notes = cloneDeep(initialNotes)
}
