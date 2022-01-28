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

export const pageStyle = {
  flex: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  size: {
    height: { value: 100, type: 'PERCENT' },
  },
}

export const cardStyle = {
  size: {
    maxWidth: { value: 500, type: 'REAL' },
  },
  flex: {
    flexDirection: 'COLUMN',
  },
  padding: { 
    all: { value: 15, type: 'REAL' },
  },
  margin: {
    bottom: { value: 30, type: 'REAL' },
  },
  backgroundColor: '#333',
  cornerRadius: { radius: 20 },
}

export const buttonGroupStyle = {
  flex: {
    flex: 1,
    justifyContent: 'SPACE_BETWEEN',
    flexDirection: 'ROW',
  }
}
