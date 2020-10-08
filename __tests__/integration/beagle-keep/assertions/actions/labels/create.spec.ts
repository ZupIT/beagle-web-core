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

describe('Beagle Keep: actions: labels: create', () => {
  describe('should enable/disable label creation', () => {
    // load the view and wait until it's stable (no more initial renders)
    // click the button to create a new label
    // wait for 1 render: the form to add a new label will appear
    // click the button to remove the "create label" item
    // wait for 1 render: the form to add a new label will disappear

    it.todo('should do two renders without any warnings or errors')

    it.todo('should enable/add "create label" item')

    it.todo('should disable/remove "create label" item')
  })

  describe('should create label', () => {
    // load the view and wait until it's stable (no more initial renders)
    // click the button to create a new label
    // wait for 1 render: the form to add a new label will appear
    // type in the new label data
    // click the button to save the new label
    /* wait for 2 renders (1st the loading, 2nd the addition of the new label to the list and
    removal of the creation form) */

    it.todo('should do three renders without any warnings or errors')

    it.todo('should show a loading feedback for the "create label" item')

    it.todo('should add the created label to the list of labels')

    it.todo('should disable/remove "create label" item')
  })

  /* because the error case of create a label is the same as the error case of edit label, we don't 
  need to retest it */
})
