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

import { IdentifiableBeagleUIElement } from '../src/types'

export const treeE: IdentifiableBeagleUIElement = {
  id: 'E',
  _beagleType_: 'type-E',
  value: 'teste',
  children: [
    {
      id: 'D.0',
      _beagleType_: 'type-B',
      children: [
        {
          id: 'D.0.0',
          _beagleType_: 'type-C',
          style: 'Style.TestChildren.MockStyle'
        },
      ]
    },
    {
      id: 'D.1',
      _beagleType_: 'type-D',
      style: 'Design.StyleChildren.MockStyle'
    },
  ],
  style: 'Design.TextStyle.MockStyle'
}

export const treeEParsed: IdentifiableBeagleUIElement = {
  id: 'E',
  _beagleType_: 'type-E',
  value: 'teste',
  children: [
    {
      id: 'D.0',
      _beagleType_: 'type-B',
      children: [
        {
          id: 'D.0.0',
          _beagleType_: 'type-C',
          styleClass: 'style-test-children-mock-style'
        },
      ]
    },
    {
      id: 'D.1',
      _beagleType_: 'type-D',
      styleClass: 'design-style-children-mock-style'
    },
  ],
  styleClass: 'design-text-style-mock-style'
}

export const treeMargin: IdentifiableBeagleUIElement = {
  id: 'F',
  _beagleType_: 'type-F',
  value: 'teste',
  children: [
    {
      id: 'D.0',
      _beagleType_: 'type-B',
      children: [
        {
          id: 'D.0.0',
          _beagleType_: 'type-C',
          flex: {
            margin: {
              all: {
                value: 8.0,
                type: 'REAL'
              }
            }
          }
        },
      ]
    },
    {
      id: 'D.1',
      _beagleType_: 'type-D',
      flex: {
        margin: {
          top: {
            value: 16.0,
            type: 'REAL'
          },
          bottom: {
            value: 16.0,
            type: 'REAL'
          },
          left: {
            value: 5.0,
            type: 'PERCENT'
          }
        }
      },
    },
  ],
  flex: {
    margin: {
      horizontal: {
        value: 16.0,
        type: 'REAL'
      },
    }
  }
}

export const treeMarginParsed: IdentifiableBeagleUIElement = {
  id: 'F',
  _beagleType_: 'type-F',
  value: 'teste',
  children: [
    {
      id: 'D.0',
      _beagleType_: 'type-B',
      children: [
        {
          id: 'D.0.0',
          _beagleType_: 'type-C',
          flex: {
            margin: {
              all: {
                value: 8.0,
                type: 'REAL'
              }
            }
          },
          styleProperties: {
            margin: '8px'
          }
        },
      ]
    },
    {
      id: 'D.1',
      _beagleType_: 'type-D',
      flex: {
        margin: {
          top: {
            value: 16.0,
            type: 'REAL'
          },
          bottom: {
            value: 16.0,
            type: 'REAL'
          },
          left: {
            value: 5.0,
            type: 'PERCENT'
          }
        }
      },
      styleProperties: {
        marginTop: '16px',
        marginBottom: '16px',
        marginLeft: '5%'
      }
    },
  ],
  flex: {
    margin: {
      horizontal: {
        value: 16.0,
        type: 'REAL'
      },
    }
  },
  styleProperties: {
    margin: '0 16px'
  }
}

export const treePadding: IdentifiableBeagleUIElement = {
  id: 'F',
  _beagleType_: 'type-F',
  value: 'teste',
  children: [
    {
      id: 'D.0',
      _beagleType_: 'type-B',
      children: [
        {
          id: 'D.0.0',
          _beagleType_: 'type-C',
          flex: {
            padding: {
              vertical: {
                value: 3.0,
                type: 'PERCENT'
              }
            }
          }
        },
      ]
    },
    {
      id: 'D.1',
      _beagleType_: 'type-D',
      flex: {
        padding: {
          top: {
            value: 16.0,
            type: 'REAL'
          },
          right: {
            value: 16.0,
            type: 'REAL'
          },
        }
      },
    },
  ],
  flex: {
    padding: {
      all: {
        value: 16.0,
        type: 'REAL'
      },
    }
  }
}

export const treePaddingParsed: IdentifiableBeagleUIElement = {
  id: 'F',
  _beagleType_: 'type-F',
  value: 'teste',
  children: [
    {
      id: 'D.0',
      _beagleType_: 'type-B',
      children: [
        {
          id: 'D.0.0',
          _beagleType_: 'type-C',
          flex: {
            padding: {
              vertical: {
                value: 3.0,
                type: 'PERCENT'
              }
            }
          },
          styleProperties: {
            padding: '3% 0'
          }
        },
      ]
    },
    {
      id: 'D.1',
      _beagleType_: 'type-D',
      flex: {
        padding: {
          top: {
            value: 16.0,
            type: 'REAL'
          },
          right: {
            value: 16.0,
            type: 'REAL'
          },
        }
      },
      styleProperties: {
        paddingTop: '16px',
        paddingRight: '16px'
      }
    },
  ],
  flex: {
    padding: {
      all: {
        value: 16.0,
        type: 'REAL'
      },
    }
  },
  styleProperties: {
    padding: '16px'
  }
}

export const treeColorSize: IdentifiableBeagleUIElement = {
  id: 'F',
  _beagleType_: 'type-F',
  value: 'teste',
  children: [
    {
      id: 'D.0',
      _beagleType_: 'type-B',
      children: [
        {
          id: 'D.0.0',
          _beagleType_: 'type-C',
          textColor: '#00c00c',
          backgroundColor: '#fafafa',
        },
      ]
    },
    {
      id: 'D.1',
      _beagleType_: 'type-D',
    },
  ],
  textColor: 'ffffff',
  backgroundColor: '000000',
}

export const treeColorSizeParsed: IdentifiableBeagleUIElement = {
  id: 'F',
  _beagleType_: 'type-F',
  value: 'teste',
  children: [
    {
      id: 'D.0',
      _beagleType_: 'type-B',
      children: [
        {
          id: 'D.0.0',
          _beagleType_: 'type-C',
          textColor: '#00c00c',
          backgroundColor: '#fafafa',
          styleProperties: {
            backgroundColor: '#fafafa',
            color: '#00c00c'
          }
        },
      ]
    },
    {
      id: 'D.1',
      _beagleType_: 'type-D',
    },
  ],
  textColor: 'ffffff',
  backgroundColor: '000000',
  styleProperties: {
    backgroundColor: '#000000',
    color: '#ffffff'
  }
}
