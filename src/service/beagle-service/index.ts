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

import { DefaultSchema } from 'beagle-tree/types'
import Configuration from './configuration'
import { createServices } from './services'
import { BeagleConfig, BeagleService } from './types'

function createBeagleUIService<
  Schema = DefaultSchema,
  ConfigType extends BeagleConfig<Schema> = BeagleConfig<Schema>
>(config: ConfigType): BeagleService {
  Configuration.validate(config)
  const processedConfig = Configuration.process(config)
  const services = createServices(config)

  const beagleService: BeagleService = {
    ...services,
    ...processedConfig,
    getConfig: () => config,
  }

  return beagleService
}

export default {
  create: createBeagleUIService,
}
