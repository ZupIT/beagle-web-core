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

describe('Beagle Keep: actions: details: create note', () => {
  describe('should create note', () => {
    /* from home, navigate to details with globalContext.selectedNote = null and wait the view to
    become stable (no more initial renders). We'll use a popView, for this reason, we must start
    from home */
    // type the title, the text and add some labels to the note
    // click the button to save the note
    // wait for 4 renders: 1st: a loading overlay on the form; 2nd, 3rd and 4th: navigation to home

    /* expect the warning to have been about a context that doesn't exist anymore. It will try to
    remove the loading overlay after the page has been navigated already. */
    it.todo('should do 4 renders with no errors and 1 warning')

    it.todo('should show a success feedback message')

    it.todo('should navigate to "home"')

    it.todo('the note we created should now be visible in the list of notes in the view "home"')
  })

  describe('should not create note (error case)', () => {
    /* navigate to details with globalContext.selectedNote = null and wait the view to become stable
    (no more initial renders) */
    // type the title, the text and add some labels to the note
    // prepare the backend to respond with an error
    // click the button to save the note
    // wait for 2 renders: 1st: a loading overlay on the form; 2nd: the loading overlay is removed.

    it.todo('should do 2 renders with no warnings or errors')

    it.todo('should show an error feedback message')

    it.todo('should remove the loading overlay')
  })
})
