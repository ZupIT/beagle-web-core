/*
  * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
  *
  * Licensed under the Apache License, Version 2.0 (the "License");
  * you may not use this file except in compliance with the License.
  * You may obtain a copy of the License at
  *
  *  http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS,
  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  * See the License for the specific language governing permissions and
  * limitations under the License.
*/

import beagleLogger from '../BeagleLogger'
import { ActionHandler, SubmitFormAction } from './types'

const submitForm: ActionHandler<SubmitFormAction> = ({ element }) => {
  const domNode = document.querySelector(`[data-beagle-id="${element.id}"]`)
  if (!domNode) {
    beagleLogger.log('error', 'Could not submit the form because the element who triggered the action is not in the dom anymore.')
    return
  }

  const form = domNode.closest('form')
  if (!form) {
    beagleLogger.log('error', 'Could not submit because the element who triggered the action "submitForm" is not inside any form.')
    return
  }

  form.requestSubmit()
}

export default submitForm
