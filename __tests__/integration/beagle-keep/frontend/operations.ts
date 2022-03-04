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

// todo: this entire code should be replaced by custom operations when they are available
import { find, isNil } from 'lodash'
import Operation from 'operation'
import { FullNote } from '../backend/database/notes'

export default () => {
  // @ts-ignore
  Operation.filterNotesByLabel = (notes: FullNote[], labelId: number) => (
    isNil(labelId) ? notes : notes.filter(({ labels }) => !!find(labels, { id: labelId }))
  )
}
