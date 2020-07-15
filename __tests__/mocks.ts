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

import { IdentifiableBeagleUIElement, BeagleUIElement, DefaultSchema, BeagleConfig } from '../src/types'

export const treeA: IdentifiableBeagleUIElement = {
  id: 'A',
  _beagleComponent_: 'type-A',
  children: [
    {
      id: 'A.0',
      _beagleComponent_: 'type-B',
      styleId: 'style-testing-1',
      style: {
        margin: {
          all: {
            value: 10.0,
            type: 'REAL'
          }
        }
      },
      children: [
        {
          id: 'A.0.0',
          _beagleComponent_: 'type-D',
        },
      ],
    },
    {
      id: 'A.1',
      _beagleComponent_: 'type-B',
      children: [
        {
          id: 'A.1.0',
          _beagleComponent_: 'type-D',
        },
        {
          id: 'A.1.1',
          _beagleComponent_: 'type-E',
          children: [
            {
              id: 'A.1.1.0',
              _beagleComponent_: 'type-F',
              style: {
                margin: {
                  all: {
                    value: 10.0,
                    type: 'REAL'
                  }
                }
              },
              styleId: 'style-testing-2'
            },
            {
              id: 'A.1.1.1',
              _beagleComponent_: 'type-F',
            },
            {
              id: 'A.1.1.2',
              _beagleComponent_: 'type-F',
              styleId: 'style-testing-3',
              style: {
                margin: {
                  all: {
                    value: 10.0,
                    type: 'REAL'
                  }
                }
              }
            },
            {
              id: 'A.1.1.3',
              _beagleComponent_: 'type-F',
            },
          ],
        },
      ],
    },
    {
      id: 'A.2',
      _beagleComponent_: 'type-C',
      styleId: 'style-testing-1',
      style: {
        margin: {
          all: {
            value: 20.0,
            type: 'REAL'
          }
        }
      }
    },
  ],
}

export const treeB: IdentifiableBeagleUIElement = {
  id: 'B',
  _beagleComponent_: 'type-A',
  value: 'teste',
  children: [
    {
      id: 'B.0',
      _beagleComponent_: 'type-B',
      children: [
        {
          id: 'B.0.0',
          _beagleComponent_: 'type-C',
        },
      ],
    },
    {
      id: 'B.1',
      _beagleComponent_: 'type-C',
    },
  ],
}

export const treeC: IdentifiableBeagleUIElement = {
  id: 'C',
  _beagleComponent_: 'type-A',
  value: 'teste',
  children: [
    {
      id: 'C.0',
      _beagleComponent_: 'type-B',
      children: [
        {
          id: 'C.0.0',
          _beagleComponent_: 'type-C',
        },
      ],
    },
    {
      id: 'C.1',
      _beagleComponent_: 'type-D',
    },
  ],
}

export const treeD: IdentifiableBeagleUIElement = {
  id: 'D',
  _beagleComponent_: 'type-A',
  value: 'teste',
  children: [
    {
      id: 'D.0',
      _beagleComponent_: 'type-B',
      children: [
        {
          id: 'D.0.0',
          _beagleComponent_: 'type-C',
        },
      ],
    },
    {
      id: 'D.1',
      _beagleComponent_: 'type-D',
    },
  ],
}

export const treeF = {
  _beagleComponent_: 'type-A',
  children: [
    {
      _beagleComponent_: 'type-B',
      style: {
        margin: {
          all: {
            value: 10.0,
            type: 'REAL'
          }
        }
      },
      children: [
        {
          _beagleComponent_: 'type-D',
        },
      ],
    },
    {
      _beagleComponent_: 'type-B',
      children: [
        {
          _beagleComponent_: 'type-D',
        },
        {
          _beagleComponent_: 'beagle:tabview',
          children: [
            {
              title: 'A.1.1.0',
              child: {
                _beagleComponent_: 'type-A-1',
                style: {
                  margin: {
                    all: {
                      value: 10.0,
                      type: 'REAL'
                    }
                  }
                }
              }
            },
            {
              title: 'A.1.1.1',
              icon: 'icon',
              child: {
                _beagleComponent_: 'type-A-1',
                style: {
                  margin: {
                    all: {
                      value: 20.0,
                      type: 'REAL'
                    }
                  }
                }
              }
            },
            {
              child: {
                _beagleComponent_: 'type-A-1',
                style: {
                  margin: {
                    all: {
                      value: 20.0,
                      type: 'REAL'
                    }
                  }
                }
              }
            },
          ],
        },
      ],
    },
    {
      _beagleComponent_: 'type-C',
      style: {
        margin: {
          all: {
            value: 20.0,
            type: 'REAL'
          }
        }
      }
    },
  ],
}

export const treeFParsed: BeagleUIElement = {
  _beagleComponent_: 'type-A',
  children: [
    {
      _beagleComponent_: 'type-B',
      style: {
        margin: {
          all: {
            value: 10.0,
            type: 'REAL'
          }
        }
      },
      children: [
        {
          _beagleComponent_: 'type-D',
        },
      ],
    },
    {
      _beagleComponent_: 'type-B',
      children: [
        {
          _beagleComponent_: 'type-D',
        },
        {
          _beagleComponent_: 'beagle:tabview',
          children: [
            {
              _beagleComponent_: 'beagle:tabitem',
              title: 'A.1.1.0',
              children: [
                {
                  _beagleComponent_: 'type-A-1',
                  style: {
                    margin: {
                      all: {
                        value: 10.0,
                        type: 'REAL'
                      }
                    }
                  }
                }]
            },
            {
              _beagleComponent_: 'beagle:tabitem',
              title: 'A.1.1.1',
              icon: 'icon',
              children: [
                {
                  _beagleComponent_: 'type-A-1',
                  style: {
                    margin: {
                      all: {
                        value: 20.0,
                        type: 'REAL'
                      }
                    }
                  }
                }
              ]
            },
            {
              _beagleComponent_: 'beagle:tabitem',
              children: [
                {
                  _beagleComponent_: 'type-A-1',
                  style: {
                    margin: {
                      all: {
                        value: 20.0,
                        type: 'REAL'
                      }
                    }
                  }
                }
              ]
            },
          ],
        },
      ],
    },
    {
      _beagleComponent_: 'type-C',
      style: {
        margin: {
          all: {
            value: 20.0,
            type: 'REAL'
          }
        }
      }
    },
  ],
}

export const treeG = {
  _beagleComponent_: 'type-G',
  children: [
    {
      _beagleComponent_: 'type-B',
      style: {
        margin: {
          all: {
            value: 10.0,
            type: 'REAL'
          }
        }
      },
      children: [
        {
          _beagleComponent_: 'type-D',
        },
      ],
    },
    {
      _beagleComponent_: 'type-B',
      children: [
        {
          _beagleComponent_: 'type-D',
        },
        {
          _beagleComponent_: 'beagle:tabview',
          children: [
            {
              title: 'G.1.1.0',
              child: {
                _beagleComponent_: 'beagle:tabview',
                children: [
                  {
                    title: 'G.1.1.0',
                    child: {
                      _beagleComponent_: 'type-B-0'
                    }
                  }
                ]
              }
            },
            {
              title: 'H.1.1.1',
              icon: 'icon',
              child: {
                _beagleComponent_: 'type-H-1',
                style: {
                  margin: {
                    all: {
                      value: 20.0,
                      type: 'REAL'
                    }
                  }
                },
                children: [
                  {
                    _beagleComponent_: 'type-H-1',
                  }
                ]
              }
            },
          ],
        },
      ],
    },
    {
      _beagleComponent_: 'type-C',
      style: {
        margin: {
          all: {
            value: 20.0,
            type: 'REAL'
          }
        }
      }
    },
  ],
}


export const treeGParsed: BeagleUIElement = {
  _beagleComponent_: 'type-G',
  children: [
    {
      _beagleComponent_: 'type-B',
      style: {
        margin: {
          all: {
            value: 10.0,
            type: 'REAL'
          }
        }
      },
      children: [
        {
          _beagleComponent_: 'type-D',
        },
      ],
    },
    {
      _beagleComponent_: 'type-B',
      children: [
        {
          _beagleComponent_: 'type-D',
        },
        {
          _beagleComponent_: 'beagle:tabview',
          children: [
            {
              _beagleComponent_: 'beagle:tabitem',
              title: 'G.1.1.0',
              children: [
                {
                  _beagleComponent_: 'beagle:tabview',
                  children: [
                    {
                      _beagleComponent_: 'beagle:tabitem',
                      title: 'G.1.1.0',
                      children: [{
                        _beagleComponent_: 'type-B-0'
                      }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              _beagleComponent_: 'beagle:tabitem',
              title: 'H.1.1.1',
              icon: 'icon',
              children: [{
                _beagleComponent_: 'type-H-1',
                style: {
                  margin: {
                    all: {
                      value: 20.0,
                      type: 'REAL'
                    }
                  }
                },
                children: [
                  {
                    _beagleComponent_: 'type-H-1',
                  }
                ]
              }]
            },
          ],
        },
      ],
    },
    {
      _beagleComponent_: 'type-C',
      style: {
        margin: {
          all: {
            value: 20.0,
            type: 'REAL'
          }
        }
      }
    },
  ],
}


export const treeH = {
  _beagleComponent_: 'type-H',
  children: [
    {
      _beagleComponent_: 'type-B',
      style: {
        margin: {
          all: {
            value: 10.0,
            type: 'REAL'
          }
        }
      },
      children: [
        {
          _beagleComponent_: 'type-D',
        },
      ],
    },
    {
      _beagleComponent_: 'type-B',
      children: [
        {
          _beagleComponent_: 'type-D',
        },
        {
          _beagleComponent_: 'beagle:tabview',
          children: [
            {
              title: 'H.1.1.0',
              child: {
                _beagleComponent_: 'type-H-0',
                style: {
                  margin: {
                    all: {
                      value: 10.0,
                      type: 'REAL'
                    }
                  }
                },
                children: [
                  {
                    _beagleComponent_: 'type-H-0',
                  }
                ]
              }
            },
            {
              title: 'H.1.1.1',
              icon: 'icon',
              child: {
                _beagleComponent_: 'type-H-1',
                style: {
                  margin: {
                    all: {
                      value: 20.0,
                      type: 'REAL'
                    }
                  }
                },
                children: [
                  {
                    _beagleComponent_: 'type-H-1',
                  }
                ]
              }
            },
          ],
        },
      ],
    },
    {
      _beagleComponent_: 'type-C',
      style: {
        margin: {
          all: {
            value: 20.0,
            type: 'REAL'
          }
        }
      }
    },
  ],
}


export const treeHParsed: BeagleUIElement = {
  _beagleComponent_: 'type-H',
  children: [
    {
      _beagleComponent_: 'type-B',
      style: {
        margin: {
          all: {
            value: 10.0,
            type: 'REAL'
          }
        }
      },
      children: [
        {
          _beagleComponent_: 'type-D',
        },
      ],
    },
    {
      _beagleComponent_: 'type-B',
      children: [
        {
          _beagleComponent_: 'type-D',
        },
        {
          _beagleComponent_: 'beagle:tabview',
          children: [
            {
              _beagleComponent_: 'beagle:tabitem',
              title: 'H.1.1.0',
              children: [{
                _beagleComponent_: 'type-H-0',
                style: {
                  margin: {
                    all: {
                      value: 10.0,
                      type: 'REAL'
                    }
                  }
                },
                children: [
                  {
                    _beagleComponent_: 'type-H-0',
                  }
                ]
              }]
            },
            {
              _beagleComponent_: 'beagle:tabitem',
              title: 'H.1.1.1',
              icon: 'icon',
              children: [{
                _beagleComponent_: 'type-H-1',
                style: {
                  margin: {
                    all: {
                      value: 20.0,
                      type: 'REAL'
                    }
                  }
                },
                children: [
                  {
                    _beagleComponent_: 'type-H-1',
                  }
                ]
              }
              ]
            },
          ],
        },
      ],
    },
    {
      _beagleComponent_: 'type-C',
      style: {
        margin: {
          all: {
            value: 20.0,
            type: 'REAL'
          }
        }
      }
    },
  ],
}

export const simpleTab = {
  _beagleComponent_: 'beagle:tabview',
  children: [
    {
      title: 'Container1',
      child: {
        _beagleComponent_: 'beagle:container'
      }
    },
    {
      title: 'Container2',
      child: {
        _beagleComponent_: 'beagle:container',
        child: {
          _beagleComponent_: "text",
          value: "Texto"
        }
      }
    }
  ]
}

export const simpleTabParsed: BeagleUIElement = {
  _beagleComponent_: 'beagle:tabview',
  children: [
    {
      _beagleComponent_: 'beagle:tabitem',
      title: 'Container1',
      children: [{
        _beagleComponent_: 'beagle:container'
      }]
    },
    {
      _beagleComponent_: 'beagle:tabitem',
      title: 'Container2',
      children: [{
        _beagleComponent_: 'beagle:container',
        children: [{ _beagleComponent_: "text", value: "Texto" }]
      }]
    }
  ]
}

export const treeTestChild: IdentifiableBeagleUIElement = {
  id: 'A',
  _beagleComponent_: 'type-A',
  children: [
    {
      id: 'A.0',
      _beagleComponent_: 'type-B',
      children: [
        {
          id: 'A.0.0',
          _beagleComponent_: 'type-D',
        },
      ],
    },
  ],
}

export const treeWithChild: IdentifiableBeagleUIElement = {
  id: 'A',
  _beagleComponent_: 'type-A',
  child: {
    id: 'A.0',
    _beagleComponent_: 'type-B',
    child: {
      id: 'A.0.0',
      _beagleComponent_: 'type-D',
    },
  },
}

export const treeWithChildAndChildren: IdentifiableBeagleUIElement = {
  id: 'A',
  _beagleComponent_: 'type-A',
  child: {
    id: 'A.0',
    _beagleComponent_: 'type-B',
    child: {
      id: 'A.0.0',
      _beagleComponent_: 'type-D',
    },
  },
  children: [],
}

export const treeWithLazyComponent: IdentifiableBeagleUIElement = {
  id: 'A',
  _beagleComponent_: 'beagle:lazycomponent',
  initialState: {
    id: 'A.0',
    _beagleComponent_: 'type-B',
    children: [
      {
        id: 'A.0.0',
        _beagleComponent_: 'type-D',
      }
    ]
  },
}

export const treeWithLazyComponentParsed: IdentifiableBeagleUIElement = {
  id: 'A',
  _beagleComponent_: 'beagle:lazycomponent',
  children: [
    {
      id: 'A.0',
      _beagleComponent_: 'type-B',
      children: [
        {
          id: 'A.0.0',
          _beagleComponent_: 'type-D',
        }
      ]
    }
  ]
}

export const treeWithLazyComponentAndChild: IdentifiableBeagleUIElement = {
  id: 'A',
  _beagleComponent_: 'beagle:lazycomponent',
  initialState: {
    id: 'A.0',
    _beagleComponent_: 'type-B',
    child: {
      id: 'A.0.0',
      _beagleComponent_: 'type-D',
      children: [
        {
          id: 'A.0.0.0',
          _beagleComponent_: 'type-D',
        }
      ]
    }
  },
}

export const treeWithLazyComponentAndChildParsed: IdentifiableBeagleUIElement = {
  id: 'A',
  _beagleComponent_: 'beagle:lazycomponent',
  children: [
    {
      id: 'A.0',
      _beagleComponent_: 'type-B',
      children: [
        {
          id: 'A.0.0',
          _beagleComponent_: 'type-D',
          children: [
            {
              id: 'A.0.0.0',
              _beagleComponent_: 'type-D',
            }
          ]
        }
      ]
    }
  ]
}

export const tabViewWithCaseInsensitive = {
  _beagleComponent_: 'beagle:taBView',
  children: [
    {
      title: 'Container1',
      child: {
        _beagleComponent_: 'beagle:container'
      }
    },
  ]
}

export const parsedTabViewWithCaseInsensitive: BeagleUIElement = {
  _beagleComponent_: 'beagle:taBView',
  children: [
    {
      _beagleComponent_: 'beagle:tabitem',
      title: 'Container1',
      children: [{
        _beagleComponent_: 'beagle:container'
      }]
    },
  ]
}

export const lazyComponentWithCaseInsensitive: IdentifiableBeagleUIElement = {
  id: 'A',
  _beagleComponent_: 'beagle:lazYComponent',
  initialState: {
    id: 'A.0',
    _beagleComponent_: 'type-B',
  },
}

export const parsedlazyComponentWithCaseInsensitive: IdentifiableBeagleUIElement = {
  id: 'A',
  _beagleComponent_: 'beagle:lazYComponent',
  children: [{
    id: 'A.0',
    _beagleComponent_: 'type-B',
  }],
}

export const configComponentsWrong: BeagleConfig<DefaultSchema>['components'] = {
  'beagle:button': 'Teste',
  'button': 'Teste'
}
