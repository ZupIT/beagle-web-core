import { find, findIndex } from 'lodash'
import { LoremIpsum } from 'lorem-ipsum'
import { getLabels, Label } from './labels'

interface Note {
  id: number,
  labels: number[],
  text: string,
  createdAt: number,
  title?: string,
}

interface FullNote extends Omit<Note, 'labels'> {
  labels: Label[],
}

const MAX_LENGTH = 100
let randomCounter = 0
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
  random: () => randomCounter++ / 100,
})

const notes: Note[] = [
  {
    id: idCounter++,
    title: 'Dentist',
    text: lorem.generateParagraphs(1),
    createdAt: 1600453354284,
    labels: [1],
  },
  {
    id: idCounter++,
    title: 'Gym exercises for monday',
    text: lorem.generateParagraphs(3),
    createdAt: 1600453354284,
    labels: [1],
  },
  {
    id: idCounter++,
    title: 'Send research results',
    text: lorem.generateParagraphs(1),
    createdAt: 1600453354284,
    labels: [2, 3],
  },
  {
    id: idCounter++,
    title: 'Market list for september',
    text: lorem.generateParagraphs(2),
    createdAt: 1600453354284,
    labels: [4],
  },
  {
    id: idCounter++,
    title: 'Check the new coffee brand',
    text: lorem.generateParagraphs(1),
    createdAt: 1600453354284,
    labels: [4],
  },
  {
    id: idCounter++,
    title: 'Ask for a raise',
    text: lorem.generateParagraphs(4),
    createdAt: 1600453354284,
    labels: [2],
  },
  {
    id: idCounter++,
    title: 'Ask George to read his e-mails',
    text: lorem.generateParagraphs(2),
    createdAt: 1600453354284,
    labels: [2],
  },
  {
    id: idCounter++,
    title: 'Parents meeting at school',
    text: lorem.generateParagraphs(3),
    createdAt: 1600453354284,
    labels: [1],
  },
]

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
    text: n.text.length <= MAX_LENGTH ? n.text : `${n.text.substr(MAX_LENGTH)}...`,
  }))
}

export function getNoteById(id: number): FullNote | undefined {
  const note = find(notes, { id })
  return note && asFullNote(note)
}

export function addNote(note: Omit<FullNote, 'id'>) {
  const noteWithId = { ...note, id: idCounter++ }
  notes.push(asNote(noteWithId))
}

export function removeNote(id: number) {
  const index = findIndex(notes, { id })
  if (index !== -1) notes.splice(index, 1)
}

export function editNote(note: FullNote) {
  const index = findIndex(notes, { id: note.id })
  if (index !== -1) notes[index] = asNote(note)
}
