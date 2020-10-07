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

describe('Beagle Keep: actions: labels: remove', () => {
  describe('should remove label', () => {
    // load the view and wait until it's stable (no more initial renders)
    // click the button to remove one of the labels
    // wait for 2 renders (1st the loading, 2nd the label is removed)

    it.todo('should show a loading feedback for the label removed')

    it.todo('should remove the label (backend)')

    it.todo('should remove the label (ui)')
  })

  describe('should not remove label (error)', () => {
    // load the view and wait until it's stable (no more initial renders)
    // prepare the backend to respond with an error
    // click the button to remove one of the labels
    // wait for 2 renders (1st the loading, 2nd remove the loading)

    it.todo('should do two renders without any warnings or errors')

    it.todo('should remove the loading and do nothing to the label itself')

    it.todo('should show error feedback message')
  })
})
