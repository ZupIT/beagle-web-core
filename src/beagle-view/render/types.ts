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

import { BeagleUIElement, DataContext, IdentifiableBeagleUIElement, TreeUpdateMode } from 'beagle-tree/types'
import { ComponentManager, TemplateManager } from 'beagle-view/render/template-manager/types'

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
  doFullRender: (
    viewTree: BeagleUIElement<any>,
    anchor?: string,
    mode?: TreeUpdateMode,
  ) => void,

  /**
   * Renders according to a template manager. A template is chosen from the template manager according
   * to `case`, which is a boolean or a beagle expression that resolves to a boolean. When `case` is
   * an expression, it's resolved using the entire context of the current tree plus the contexts
   * passed in the parameter `context`.
   *
   * Since a template is used multiple times, it can produce repeated ids. Furthermore, depending
   * on the situation, it might be necessary to have tight control of how the ids are generated inside
   * a template (a list view, for instance). To avoid this, an id manager can be passed as parameter.
   * An id manager is a function that receives the original id in the template and return the id that
   * should be assigned. When no id manager is provided, the default process of assigning ids in
   * Beagle is used.
   *
   * @param templateManager manages which template is chosen from the template manager according
   * to `case`, which is a boolean or a beagle expression that resolves to a boolean. When `case` is
   * an expression, it's resolved using the entire context of the current tree plus the contexts
   * passed in the parameter `context`. When none of the the `case` are matched, the `default` template
   * will be used, but only if set, if it is not set the item will be not rendered.
   * @param anchor when `viewTree` is just a new branch to be added to the tree, `anchor` must be
   * specified, it is the id of the component to attach `viewTree` to.
   * @param contexts is the matrix of contexts to be rendered as children of the anchor element, each
   * item of the `contexts` array will be evaluated using the hierarchy contexts of the current tree plus the
   * contexts of each position.
   * @param componentManager returns the current element being cloned in to the three, along with its index,
   * where you can change or return more attributes to this component, before it is rendered in to the
   * screen.
 */
  doTemplateRender: (
    templateManager: TemplateManager,
    anchor: string,
    contexts: DataContext[][],
    componentManager?: ComponentManager,
  ) => void,
}
