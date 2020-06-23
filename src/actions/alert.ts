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

import { ActionHandler, AlertAction, BeagleAction } from './types'

const alert: ActionHandler<AlertAction> = ({ action, handleAction, ...other }) => {
  const { message, onPressOk } = action

  function runAction(actionToRun?: BeagleAction | BeagleAction[]) {
    if (!actionToRun) return
    const actions = Array.isArray(actionToRun) ? actionToRun : [actionToRun]
    actions.forEach(action => handleAction({ action, handleAction, ...other }))
  }
  
  window.alert(message)
  if (onPressOk) runAction(onPressOk)
}

export default alert
