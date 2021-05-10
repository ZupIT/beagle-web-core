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

import { BeagleUIElement, DefaultSchema, IdentifiableBeagleUIElement, TreeUpdateMode } from 'beagle-tree/types'

export interface Renderer {
  /**
   * Does a partial render to the BeagleView. Compared to the full render, it will skip every step
   * until the view snapshot, i.e, it will start by taking the view snapshot and end doing a render
   * to the screen. Useful when updating a view that has already been rendered. If the `viewTree`
   * hasn't been rendered before, you should use `doFullRender` instead.
   * 
   * To see the full documentation of the renderization process, please follow this link:
   * https://github.com/ZupIT/beagle-web-core/blob/master/docs/renderization.md
   * 
   * @param viewTree the new tree to render, can be just a new branch to add to the current tree
   * @param anchor when `viewTree` is just a new branch to be added to the tree, `anchor` must be
   * specified, it is the id of the component to attach `viewTree` to.
   * @param mode when `viewTree` is just a new branch to be added to the tree, the mode must be
   * specified. It can be `append`, `prepend` or `replace`.
   */
  doPartialRender: (
    viewTree: IdentifiableBeagleUIElement<any>,
    anchor?: string,
    mode?: TreeUpdateMode,
  ) => void,
  /**
   * Does a full render to the BeagleView. A full render means that every renderization step will
   * be executed for the tree passed as parameter. If `viewTree` has been rendered at least once,
   * you should call `doPartialRender` instead.
   * 
   * To see the full documentation of the renderization process, please follow this link:
   * https://github.com/ZupIT/beagle-web-core/blob/master/docs/renderization.md
   * 
   * @param viewTree the new tree to render, can be just a new branch to add to the current tree
   * @param anchor when `viewTree` is just a new branch to be added to the tree, `anchor` must be
   * specified, it is the id of the component to attach `viewTree` to.
   * @param mode when `viewTree` is just a new branch to be added to the tree, the mode must be
   * specified. It can be `append`, `prepend` or `replace`.
   */
  doFullRender: (viewTree: BeagleUIElement<any>, anchor?: string, mode?: TreeUpdateMode) => void,

  preProcess: (viewTree: BeagleUIElement<any>) => IdentifiableBeagleUIElement<DefaultSchema>,
  /**
   * Does a Pre-process the tree, Adding the Beagle ID.
   *
   * To see the full documentation of the renderization process, please follow this link:
   * https://github.com/ZupIT/beagle-web-core/blob/master/docs/renderization.md
   * 
   * @param viewTree the new tree to render, can be just a new branch to add to the current tree
   * 
   */
}
