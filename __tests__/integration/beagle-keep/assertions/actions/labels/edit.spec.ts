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

describe('Beagle Keep: actions: labels: edit', () => {
  describe('should edit label', () => {
    // load the view and wait until it's stable (no more initial renders)
    // edit a label
    // wait for 3 renders (1st the loading, 2nd the edited label, 3rd remove the loading)
    
    it.todo('should do three renders without any warnings or errors')

    it.todo('should show a loading feedback for the edited label')

    it.todo('should replace the data in the edited label')

    it.todo('should hide the loading feedback for the edited label')
  })

  describe('should not edit label (error case)', () => {
    // load the view and wait until it's stable (no more initial renders)
    // edit a label
    // prepare the service to respond with an error
    // wait for 2 renders (1st the loading, 2nd remove the loading)
    
    it.todo('should do two renders without any warnings or errors')

    it.todo('should remove the loading and do nothing to the contents of the label itself')

    it.todo('should show error feedback message')
  })
})
