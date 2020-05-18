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

import { IdentifiableBeagleUIElement, BeagleUIElement } from '../src/types'

export const treeA: IdentifiableBeagleUIElement = {
  id: 'A',
  _beagleType_: 'type-A',
  children: [
    {
      id: 'A.0',
      _beagleType_: 'type-B',
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
          _beagleType_: 'type-D',
        },
      ],
    },
    {
      id: 'A.1',
      _beagleType_: 'type-B',
      children: [
        {
          id: 'A.1.0',
          _beagleType_: 'type-D',
        },
        {
          id: 'A.1.1',
          _beagleType_: 'type-E',
          children: [
            {
              id: 'A.1.1.0',
              _beagleType_: 'type-F',
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
              _beagleType_: 'type-F',
            },
            {
              id: 'A.1.1.2',
              _beagleType_: 'type-F',
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
              _beagleType_: 'type-F',
            },
          ],
        },
      ],
    },
    {
      id: 'A.2',
      _beagleType_: 'type-C',
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
  _beagleType_: 'type-A',
  value: 'teste',
  children: [
    {
      id: 'B.0',
      _beagleType_: 'type-B',
      children: [
        {
          id: 'B.0.0',
          _beagleType_: 'type-C',
        },
      ],
    },
    {
      id: 'B.1',
      _beagleType_: 'type-C',
    },
  ],
}

export const treeC: IdentifiableBeagleUIElement = {
  id: 'C',
  _beagleType_: 'type-A',
  value: 'teste',
  children: [
    {
      id: 'C.0',
      _beagleType_: 'type-B',
      children: [
        {
          id: 'C.0.0',
          _beagleType_: 'type-C',
        },
      ],
    },
    {
      id: 'C.1',
      _beagleType_: 'type-D',
    },
  ],
}

export const treeD: IdentifiableBeagleUIElement = {
  id: 'D',
  _beagleType_: 'type-A',
  value: 'teste',
  children: [
    {
      id: 'D.0',
      _beagleType_: 'type-B',
      children: [
        {
          id: 'D.0.0',
          _beagleType_: 'type-C',
        },
      ],
    },
    {
      id: 'D.1',
      _beagleType_: 'type-D',
    },
  ],
}

export const treeF: BeagleUIElement = {
  _beagleType_: 'type-A',
  children: [
    {
      _beagleType_: 'type-B',
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
          _beagleType_: 'type-D',
        },
      ],
    },
    {
      _beagleType_: 'type-B',
      children: [
        {
          _beagleType_: 'type-D',
        },
        {
          _beagleType_: 'beagle:component:tabview',
          tabItems: [
            {
              title: 'A.1.1.0',
              child: {
                _beagleType_: 'type-A-1',
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
                _beagleType_: 'type-A-1',
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
                _beagleType_: 'type-A-1',
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
      _beagleType_: 'type-C',
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
  _beagleType_: 'type-A',
  children: [
    {
      _beagleType_: 'type-B',
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
          _beagleType_: 'type-D',
        },
      ],
    },
    {
      _beagleType_: 'type-B',
      children: [
        {
          _beagleType_: 'type-D',
        },
        {
          _beagleType_: 'beagle:component:tabview',
          children: [
            {
              _beagleType_: 'beagle:component:tabitem',
              title: 'A.1.1.0',
              children: [
                {
                  _beagleType_: 'type-A-1',
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
              _beagleType_: 'beagle:component:tabitem',
              title: 'A.1.1.1',
              icon: 'icon',
              children: [
                {
                  _beagleType_: 'type-A-1',
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
              _beagleType_: 'beagle:component:tabitem',
              children: [
                {
                  _beagleType_: 'type-A-1',
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
      _beagleType_: 'type-C',
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

export const treeG: BeagleUIElement = {
  _beagleType_: 'type-G',
  children: [
    {
      _beagleType_: 'type-B',
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
          _beagleType_: 'type-D',
        },
      ],
    },
    {
      _beagleType_: 'type-B',
      children: [
        {
          _beagleType_: 'type-D',
        },
        {
          _beagleType_: 'beagle:component:tabview',
          tabItems: [
            {
              title: 'G.1.1.0',
              child: {
                _beagleType_: 'beagle:component:tabview',
                tabItems: [
                  {
                    title: 'G.1.1.0',
                    child: {
                      _beagleType_: 'type-B-0'
                    }
                  }
                ]
              }
            },
            {
              title: 'H.1.1.1',
              icon: 'icon',
              child: {
                _beagleType_: 'type-H-1',
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
                    _beagleType_: 'type-H-1',
                  }
                ]
              }
            },
          ],
        },
      ],
    },
    {
      _beagleType_: 'type-C',
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
  _beagleType_: 'type-G',
  children: [
    {
      _beagleType_: 'type-B',
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
          _beagleType_: 'type-D',
        },
      ],
    },
    {
      _beagleType_: 'type-B',
      children: [
        {
          _beagleType_: 'type-D',
        },
        {
          _beagleType_: 'beagle:component:tabview',
          children: [
            {
              _beagleType_: 'beagle:component:tabitem',
              title: 'G.1.1.0',
              children: [
                {
                  _beagleType_: 'beagle:component:tabview',
                  children: [
                    {
                      _beagleType_: 'beagle:component:tabitem',
                      title: 'G.1.1.0',
                      children: [{
                        _beagleType_: 'type-B-0'
                      }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              _beagleType_: 'beagle:component:tabitem',
              title: 'H.1.1.1',
              icon: 'icon',
              children: [{
                _beagleType_: 'type-H-1',
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
                    _beagleType_: 'type-H-1',
                  }
                ]
              }]
            },
          ],
        },
      ],
    },
    {
      _beagleType_: 'type-C',
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


export const treeH: BeagleUIElement = {
  _beagleType_: 'type-H',
  children: [
    {
      _beagleType_: 'type-B',
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
          _beagleType_: 'type-D',
        },
      ],
    },
    {
      _beagleType_: 'type-B',
      children: [
        {
          _beagleType_: 'type-D',
        },
        {
          _beagleType_: 'beagle:component:tabview',
          tabItems: [
            {
              title: 'H.1.1.0',
              child: {
                _beagleType_: 'type-H-0',
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
                    _beagleType_: 'type-H-0',
                  }
                ]
              }
            },
            {
              title: 'H.1.1.1',
              icon: 'icon',
              child: {
                _beagleType_: 'type-H-1',
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
                    _beagleType_: 'type-H-1',
                  }
                ]
              }
            },
          ],
        },
      ],
    },
    {
      _beagleType_: 'type-C',
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
  _beagleType_: 'type-H',
  children: [
    {
      _beagleType_: 'type-B',
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
          _beagleType_: 'type-D',
        },
      ],
    },
    {
      _beagleType_: 'type-B',
      children: [
        {
          _beagleType_: 'type-D',
        },
        {
          _beagleType_: 'beagle:component:tabview',
          children: [
            {
              _beagleType_: 'beagle:component:tabitem',
              title: 'H.1.1.0',
              children: [{
                _beagleType_: 'type-H-0',
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
                    _beagleType_: 'type-H-0',
                  }
                ]
              }]
            },
            {
              _beagleType_: 'beagle:component:tabitem',
              title: 'H.1.1.1',
              icon: 'icon',
              children: [{
                _beagleType_: 'type-H-1',
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
                    _beagleType_: 'type-H-1',
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
      _beagleType_: 'type-C',
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

export const simpleTab: BeagleUIElement = {
  _beagleType_: 'beagle:component:tabview',
  tabItems: [
    {
      title: 'Container1',
      child: {
        _beagleType_: 'beagle:component:container'
      }
    },
    {
      title: 'Container2',
      child: {
        _beagleType_: 'beagle:component:container'
      }
    }
  ]
}

export const simpleTabParsed: BeagleUIElement = {
  _beagleType_: 'beagle:component:tabview',
  children: [
    {
      _beagleType_: 'beagle:component:tabitem',
      title: 'Container1',
      children: [{
        _beagleType_: 'beagle:component:container'
      }]
    },
    {
      _beagleType_: 'beagle:component:tabitem',
      title: 'Container2',
      children: [{
        _beagleType_: 'beagle:component:container'
      }]
    }
  ]
}