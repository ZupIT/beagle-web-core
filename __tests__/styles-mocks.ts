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

export const treeSize: IdentifiableBeagleUIElement = {
  id: 'Size',
  _beagleType_: 'type-Size',
  value: 'testing',
  children: [
    {
      id: 'D.0',
      _beagleType_: 'type-B',
      children: [
        {
          id: 'D.0.0',
          _beagleType_: 'type-C',
          style: {
            size: {
              height: {
                value: 300.0,
                type: "REAL"
              },
              width: {
                value: 300.0,
                type: "REAL"
              }
            }
          }
        },
      ]
    },
    {
      id: 'D.1',
      _beagleType_: 'type-D',
      style: {
        size: {
          maxWidth: {
            value: 50.0,
            type: "PERCENT"
          },
          maxHeight: {
            value: 50.0,
            type: "PERCENT"
          }
        }
      },
    },
    {
      id: 'D.2',
      _beagleType_: 'type-D',
      style: {
        size: {
          width: {
            value: 50.0,
            type: "AUTO"
          },
          height: {
            value: 0.0,
            type: "AUTO"
          }
        }
      },
    },
  ],
  style: {
    size: {
      minWidth: {
        value: 300.0,
        type: "REAL"
      },
      minHeight: {
        value: 300.0,
        type: "REAL"
      }
    }
  }
}

export const treeSizeParsed: IdentifiableBeagleUIElement = {
  id: 'Size',
  _beagleType_: 'type-Size',
  value: 'testing',
  children: [
    {
      id: 'D.0',
      _beagleType_: 'type-B',
      children: [
        {
          id: 'D.0.0',
          _beagleType_: 'type-C',
          style: {
            height: "300px",
            width: "300px"
          }
        },
      ]
    },
    {
      id: 'D.1',
      _beagleType_: 'type-D',
      style: {
        maxWidth: "50%",
        maxHeight: "50%"
      },
    },
    {
      id: 'D.2',
      _beagleType_: 'type-D',
      style: {
        width: 'auto',
        height: 'auto'
      },
    },
  ],
  style: {
    minWidth: "300px",
    minHeight: "300px"
  }
}

export const treePosition: IdentifiableBeagleUIElement = {
  id: 'Position',
  _beagleType_: 'type-Position',
  value: 'testing',
  children: [
    {
      id: 'D.0',
      _beagleType_: 'type-B',
      children: [
        {
          id: 'D.0.0',
          _beagleType_: 'type-C',
          style: {
            position: {
              top: {
                value: 10.0,
                type: "REAL"
              },
              left: {
                value: 10.0,
                type: "REAL"
              }
            }
          }
        },
      ]
    },
    {
      id: 'D.1',
      _beagleType_: 'type-D',
      style: {
        position: {
          bottom: {
            value: 10.0,
            type: "PERCENT"
          },
          right: {
            value: 10.0,
            type: "PERCENT"
          }
        }
      },
    },
    {
      id: 'E.1',
      _beagleType_: 'type-E',
      style: {
        position: {
          start: {
            value: 10.0,
            type: "REAL"
          },
          end: {
            value: 15.0,
            type: "REAL"
          }
        }
      },
    },
    {
      id: 'F.1',
      _beagleType_: 'type-F',
      style: {
        position: {
          horizontal: {
            value: 10.0,
            type: "REAL"
          }
        }
      },
    },
    {
      id: 'G.1',
      _beagleType_: 'type-G',
      style: {
        position: {
          vertical: {
            value: 15.0,
            type: "REAL"
          }
        }
      }
    }
  ],
  style: {
    position: {
      all: {
        value: 10.0,
        type: "REAL"
      }
    }
  }
}

export const treePositionParsed: IdentifiableBeagleUIElement = {
  id: 'Position',
  _beagleType_: 'type-Position',
  value: 'testing',
  children: [
    {
      id: 'D.0',
      _beagleType_: 'type-B',
      children: [
        {
          id: 'D.0.0',
          _beagleType_: 'type-C',
          style: {
            top: '10px',
            left: '10px'
          }
        },
      ]
    },
    {
      id: 'D.1',
      _beagleType_: 'type-D',
      style: {
        bottom: '10%',
        right: '10%'
      },
    },
    {
      id: 'E.1',
      _beagleType_: 'type-E',
      style: {
        left: '10px',
        right: '15px'
      },
    },
    {
      id: 'F.1',
      _beagleType_: 'type-F',
      style: {
        left: '10px',
        right: '10px'
      }
    },
    {
      id: 'G.1',
      _beagleType_: 'type-G',
      style: {
        top: '15px',
        bottom: '15px'
      }
    }
  ],
  style: {
    left: '10px',
    right: '10px',
    top: '10px',
    bottom: '10px'
  }
}

export const treeFlex: IdentifiableBeagleUIElement = {
  id: 'Flex',
  _beagleType_: 'type-Flex',
  value: 'testing',
  children: [
    {
      id: 'D.0',
      _beagleType_: 'type-B',
      children: [
        {
          id: 'D.0.0',
          _beagleType_: 'type-C',
          style: {
            flex: {
              flexDirection: 'COLUMN',
              flexWrap: 'WRAP',
              justifyContent: 'FLEX_START',
              alignItems: 'SPACE_BETWEEN',
              alignSelf: 'CENTER'
            }
          }
        },
      ]
    },
    {
      id: 'D.1',
      _beagleType_: 'type-D',
      style: {
        flex: {
          alignContent: 'SPACE_AROUND',
          grow: 2.0,
          shrink: 2.0,
          basis: {
            value: 50.0,
            type: "REAL"
          }
        }
      },
    }
  ]
}

export const treeFlexParsed: IdentifiableBeagleUIElement = {
  id: 'Flex',
  _beagleType_: 'type-Flex',
  value: 'testing',
  children: [
    {
      id: 'D.0',
      _beagleType_: 'type-B',
      children: [
        {
          id: 'D.0.0',
          _beagleType_: 'type-C',
          style: {
            flexDirection: 'column',
            flexWrap: 'wrap',
            justifyContent: 'flex-start',
            alignItems: 'space-between',
            alignSelf: 'center'
          }
        },
      ]
    },
    {
      id: 'D.1',
      _beagleType_: 'type-D',
      style: {
        alignContent: 'space-around',
        flexGrow: 2,
        flexShrink: 2,
        flexBasis: '50px'
      },
    }
  ]
}

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
          styleId: 'Style.TestChildren.MockStyle'
        },
      ]
    },
    {
      id: 'D.1',
      _beagleType_: 'type-D',
      styleId: 'Design.StyleChildren.MockStyle'
    },
  ],
  styleId: 'Design.TextStyle.MockStyle'
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
          styleId: 'style-test-children-mock-style'
        },
      ]
    },
    {
      id: 'D.1',
      _beagleType_: 'type-D',
      styleId: 'design-style-children-mock-style'
    },
  ],
  styleId: 'design-text-style-mock-style'
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
          style: {
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
      style: {
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
  style: {
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
          style: {
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
      style: {
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
  style: {
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
          style: {
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
      style: {
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
  style: {
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
          style: {
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
      style: {
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
  style: {
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
