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

import { IdentifiableBeagleUIElement } from 'beagle-tree/types'

export const treeSize: IdentifiableBeagleUIElement = {
  id: 'Size',
  _beagleComponent_: 'type-Size',
  value: 'testing',
  children: [
    {
      id: 'D.0',
      _beagleComponent_: 'type-B',
      children: [
        {
          id: 'D.0.0',
          _beagleComponent_: 'type-C',
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
      _beagleComponent_: 'type-D',
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
      _beagleComponent_: 'type-D',
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
  _beagleComponent_: 'type-Size',
  value: 'testing',
  children: [
    {
      id: 'D.0',
      _beagleComponent_: 'type-B',
      children: [
        {
          id: 'D.0.0',
          _beagleComponent_: 'type-C',
          style: {
            height: "300px",
            width: "300px"
          }
        },
      ]
    },
    {
      id: 'D.1',
      _beagleComponent_: 'type-D',
      style: {
        maxWidth: "50%",
        maxHeight: "50%"
      },
    },
    {
      id: 'D.2',
      _beagleComponent_: 'type-D',
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


export const treeAspectRatio: IdentifiableBeagleUIElement = {
  id: 'AspectRatio',
  _beagleComponent_: 'type-AspectRatio',
  value: 'testing',
  children: [
    {
      id: 'D.0.0',
      _beagleComponent_: 'type-C',
      style: {
        size: {
          height: {
            value: 50.0,
            type: "PERCENT"
          },
          aspectRatio: 2
        }
      }
    },
  ],
  style: {
    size: {
      height: {
        value: 300.0,
        type: "REAL"
      },
      aspectRatio: 0.5
    }
  }
}

export const treeAspectRatioParsed: IdentifiableBeagleUIElement = {
  id: 'AspectRatio',
  _beagleComponent_: 'type-AspectRatio',
  value: 'testing',
  children: [
    {
      id: 'D.0.0',
      _beagleComponent_: 'type-C',
      style: {
        height: '50%',
        width: '100%'
      }
    },
  ],
  style: {
    height: '300px',
    width: '150px'
  }
}

export const treePosition: IdentifiableBeagleUIElement = {
  id: 'Position',
  _beagleComponent_: 'type-Position',
  value: 'testing',
  children: [
    {
      id: 'D.0',
      _beagleComponent_: 'type-B',
      children: [
        {
          id: 'D.0.0',
          _beagleComponent_: 'type-C',
          style: {
            position: {
              top: {
                value: 10.0,
                type: "REAL"
              },
              left: {
                value: 10.0,
                type: "REAL"
              },

            }
          }
        },
      ]
    },
    {
      id: 'D.1',
      _beagleComponent_: 'type-D',
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
      _beagleComponent_: 'type-E',
      style: {
        position: {
          left: {
            value: 10.0,
            type: "REAL"
          },
          right: {
            value: 15.0,
            type: "REAL"
          }
        }
      },
    },
    {
      id: 'F.1',
      _beagleComponent_: 'type-F',
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
      _beagleComponent_: 'type-G',
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
  _beagleComponent_: 'type-Position',
  value: 'testing',
  children: [
    {
      id: 'D.0',
      _beagleComponent_: 'type-B',
      children: [
        {
          id: 'D.0.0',
          _beagleComponent_: 'type-C',
          style: {
            top: '10px',
            left: '10px',
            position: 'relative'
          }
        },
      ]
    },
    {
      id: 'D.1',
      _beagleComponent_: 'type-D',
      style: {
        bottom: '10%',
        right: '10%',
        position: 'relative'
      },
    },
    {
      id: 'E.1',
      _beagleComponent_: 'type-E',
      style: {
        left: '10px',
        right: '15px',
        position: 'relative'
      },
    },
    {
      id: 'F.1',
      _beagleComponent_: 'type-F',
      style: {
        left: '10px',
        right: '10px',
        position: 'relative'
      }
    },
    {
      id: 'G.1',
      _beagleComponent_: 'type-G',
      style: {
        top: '15px',
        bottom: '15px',
        position: 'relative'
      }
    }
  ],
  style: {
    left: '10px',
    right: '10px',
    top: '10px',
    bottom: '10px',
    position: 'relative'
  }
}

export const treeFlex: IdentifiableBeagleUIElement = {
  id: 'Flex',
  _beagleComponent_: 'type-Flex',
  value: 'testing',
  children: [
    {
      id: 'D.0',
      _beagleComponent_: 'type-B',
      children: [
        {
          id: 'D.0.0',
          _beagleComponent_: 'type-C',
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
      _beagleComponent_: 'type-D',
      style: {
        flex: {
          alignContent: 'SPACE_AROUND',
          grow: 2.0,
          shrink: 2.0,
          flexWrap: 'NO_WRAP',
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
  _beagleComponent_: 'type-Flex',
  value: 'testing',
  children: [
    {
      id: 'D.0',
      _beagleComponent_: 'type-B',
      children: [
        {
          id: 'D.0.0',
          _beagleComponent_: 'type-C',
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
      _beagleComponent_: 'type-D',
      style: {
        alignContent: 'space-around',
        flexGrow: 2,
        flexShrink: 2,
        flexWrap: 'nowrap',
        flexBasis: '50px'
      },
    }
  ]
}

export const treeMargin: IdentifiableBeagleUIElement = {
  id: 'F',
  _beagleComponent_: 'type-F',
  value: 'teste',
  children: [
    {
      id: 'D.0',
      _beagleComponent_: 'type-B',
      children: [
        {
          id: 'D.0.0',
          _beagleComponent_: 'type-D',
          style: {
            margin: {
              all: {
                value: 8.0,
                type: 'REAL'
              }
            }
          }
        },
        {
          id: 'D.0.1',
          _beagleComponent_: 'type-D',
          style: {
            margin: {
              top: {
                value: 5.0,
                type: 'PERCENT'
              },
              left: {
                value: 10.0,
                type: 'AUTO'
              }
            }
          }
        },
      ],
      style: {
        margin: {
          vertical: {
            value: 20.0,
            type: 'REAL'
          },
        }
      }
    },
    {
      id: 'D.1',
      _beagleComponent_: 'type-D',
      children: [
        {
          id: 'D.0.0',
          _beagleComponent_: 'type-D',
          style: {
            margin: {
              left: {
                value: 8.0,
                type: 'REAL'
              }
            }
          }
        },
        {
          id: 'D.0.1',
          _beagleComponent_: 'type-D',
          style: {
            margin: {
              right: {
                value: 12.0,
                type: 'REAL'
              }
            }
          }
        },
      ],
      style: {
        margin: {
          right: {
            value: 16.0,
            type: 'REAL'
          },
          bottom: {
            value: 15.0,
            type: 'REAL'
          }
        }
      },
    },
  ],
  style: {
    margin: {
      horizontal: {
        value: 20.0,
        type: 'REAL'
      },
      top: {
        value: 5.0,
        type: 'REAL'
      },
    }
  }
}

export const treeMarginParsed: IdentifiableBeagleUIElement = {
  id: 'F',
  _beagleComponent_: 'type-F',
  value: 'teste',
  children: [
    {
      id: 'D.0',
      _beagleComponent_: 'type-B',
      children: [
        {
          id: 'D.0.0',
          _beagleComponent_: 'type-D',
          style: {
            margin: '8px'
          }
        },
        {
          id: 'D.0.1',
          _beagleComponent_: 'type-D',
          style: {
            marginTop: '5%',
            marginLeft: 'auto'
          }
        },
      ],
      style: {
        marginTop: '20px',
        marginBottom: '20px'
      }
    },
    {
      id: 'D.1',
      _beagleComponent_: 'type-D',
      children: [
        {
          id: 'D.0.0',
          _beagleComponent_: 'type-D',
          style: {
            marginLeft: '8px'
          }
        },
        {
          id: 'D.0.1',
          _beagleComponent_: 'type-D',
          style: {
            marginRight: '12px'
          }
        },
      ],
      style: {
        marginRight: '16px',
        marginBottom: '15px'
      },
    },
  ],
  style: {
    marginRight: '20px',
    marginLeft: '20px',
    marginTop: '5px'
  }
}

export const treePadding: IdentifiableBeagleUIElement = {
  id: 'F',
  _beagleComponent_: 'type-F',
  value: 'teste',
  children: [
    {
      id: 'D.0',
      _beagleComponent_: 'type-B',
      children: [
        {
          id: 'D.0.0',
          _beagleComponent_: 'type-C',
          style: {
            padding: {
              vertical: {
                value: 3.0,
                type: 'PERCENT'
              }
            }
          }
        }
      ],
      style: {
        padding: {
          left: {
            value: 5.0,
            type: 'REAL'
          },
          bottom: {
            value: 10.0,
            type: 'REAL'
          }
        }
      }
    },
    {
      id: 'D.1',
      _beagleComponent_: 'type-D',
      children: [
        {
          id: 'D.1.0',
          _beagleComponent_: 'type-C',
          style: {
            padding: {
              horizontal: {
                value: 3.0,
                type: 'PERCENT'
              }
            }
          }
        }
      ],
      style: {
        padding: {
          top: {
            value: 16.0,
            type: 'REAL'
          },
          right: {
            value: 20.0,
            type: 'AUTO'
          },
        }
      },
    },
    {
      id: 'D.2',
      _beagleComponent_: 'type-D',
      children: [
        {
          id: 'D.2.0',
          _beagleComponent_: 'type-C',
          style: {
            padding: {
              left: {
                value: 3.0,
                type: 'REAL'
              },
              right: {
                value: 5.0,
                type: 'PERCENT'
              }
            }
          }
        }
      ],
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
  _beagleComponent_: 'type-F',
  value: 'teste',
  children: [
    {
      id: 'D.0',
      _beagleComponent_: 'type-B',
      children: [
        {
          id: 'D.0.0',
          _beagleComponent_: 'type-C',
          style: {
            paddingTop: '3%',
            paddingBottom: '3%'
          }
        }
      ],
      style: {
        paddingLeft: '5px',
        paddingBottom: '10px'
      }
    },
    {
      id: 'D.1',
      _beagleComponent_: 'type-D',
      children: [
        {
          id: 'D.1.0',
          _beagleComponent_: 'type-C',
          style: {
            paddingLeft: '3%',
            paddingRight: '3%'
          }
        }
      ],
      style: {
        paddingTop: '16px',
        paddingRight: 'auto'
      },
    },
    {
      id: 'D.2',
      _beagleComponent_: 'type-D',
      children: [
        {
          id: 'D.2.0',
          _beagleComponent_: 'type-C',
          style: {
            paddingLeft: '3px',
            paddingRight: '5%'
          }
        }
      ],
    },
  ],
  style: {
    padding: '16px'
  }
}

export const treeAttributesToKeepName: IdentifiableBeagleUIElement = {
  id: 'KeepAttributes',
  _beagleComponent_: 'type-KeepAttributes',
  value: 'testing',
  children: [
    {
      id: 'D.0',
      _beagleComponent_: 'type-B',
      style: {
        display: 'FLEX',
        backgroundColor: '#FFFFFF'
      }
    }
  ],
  style: {
    positionType: 'ABSOLUTE'
  }
}

export const treeAttributesToKeepNameParsed: IdentifiableBeagleUIElement = {
  id: 'KeepAttributes',
  _beagleComponent_: 'type-KeepAttributes',
  value: 'testing',
  children: [
    {
      id: 'D.0',
      _beagleComponent_: 'type-B',
      style: {
        display: 'flex',
        backgroundColor: '#ffffff'
      }
    }
  ],
  style: {
    position: 'absolute'
  }
}

export const treeWithoutStyle: IdentifiableBeagleUIElement = {
  id: 'WithoutStyle',
  _beagleComponent_: 'type-WithoutStyle',
  value: 'testing',
  children: [
    {
      id: 'D.0',
      _beagleComponent_: 'type-B',
      children: [
        {
          id: 'C.0',
          _beagleComponent_: 'type-C'
        }
      ]
    }
  ]
}

export const treeMixStyle: IdentifiableBeagleUIElement = {
  _beagleComponent_: "beagle:container",
  id: 'testing',
  children: [
    {
      _beagleComponent_: "beagle:image",
      name: "img.jpg",
      id: 'testing-2',
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
        },
        margin: {
          all: {
            value: 0,
            type: "AUTO"
          }
        }
      }
    }
  ],
  style: {
    display: "FLEX",
    positionType: 'RELATIVE',
    flex: {
      flexDirection: "COLUMN",
      alignItems: "CENTER",
      justifyContent: "CENTER"
    },
    margin: {
      top: {
        value: 10,
        type: "AUTO"
      }
    },
    padding: {
      right: {
        value: 10,
        type: "REAL"
      }
    }
  }
}

export const treeMixStyleParsed: IdentifiableBeagleUIElement = {
  _beagleComponent_: "beagle:container",
  id: 'testing',
  children: [
    {
      _beagleComponent_: "beagle:image",
      name: "img.jpg",
      id: 'testing-2',
      style: {
        height: '300px',
        width: '300px',
        margin: 'auto'
      }
    }
  ],
  style: {
    display: "flex",
    position: 'relative',
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 'auto',
    paddingRight: '10px'
  }
}

export const treeContextValue: IdentifiableBeagleUIElement = {
  _beagleComponent_: "beagle:container",
  id: 'testing',
  style: {
    position: {
      left: {
        value: '10',
        type: "REAL"
      },
      top: {
        value: '10',
        type: "REAL"
      },
      bottom: {
        value: '10',
        type: "REAL"
      },
      right: {
        value: '10',
        type: "REAL"
      },
    },
  },
  children: [
    {
      id: 'D.0.0',
      _beagleComponent_: 'type-C',
      style: {
        positionType: 'absolute',
        position: {
          top: {
            value: '10',
            type: "REAL"
          },
        },
      }
    },
  ],
}

export const treeContextValueParsed: IdentifiableBeagleUIElement = {
  _beagleComponent_: "beagle:container",
  id: 'testing',
  style: {
    top: '10px',
    bottom: '10px',
    left: '10px',
    right: '10px',
    position: 'relative'
  },
  children: [
    {
      id: 'D.0.0',
      _beagleComponent_: 'type-C',
      style: {
        top: '10px',
        position: 'absolute'
      }
    },
  ]
}

export const treeE: IdentifiableBeagleUIElement = {
  id: 'E',
  _beagleComponent_: 'type-E',
  value: 'teste',
  children: [
    {
      id: 'D.0',
      _beagleComponent_: 'type-B',
      children: [
        {
          id: 'D.0.0',
          _beagleComponent_: 'type-C',
          styleId: 'Style.TestChildren.MockStyle'
        },
      ]
    },
    {
      id: 'D.1',
      _beagleComponent_: 'type-D',
      styleId: 'Design.StyleChildren.MockStyle'
    },
  ],
  styleId: 'Design.TextStyle.MockStyle'
}


export const treeEWithoutStyleIds: IdentifiableBeagleUIElement = {
  id: 'E',
  _beagleComponent_: 'type-E',
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
      ]
    },
    {
      id: 'D.1',
      _beagleComponent_: 'type-D',
    },
  ],
}

export const treeEParsed: IdentifiableBeagleUIElement = {
  id: 'E',
  _beagleComponent_: 'type-E',
  value: 'teste',
  children: [
    {
      id: 'D.0',
      _beagleComponent_: 'type-B',
      children: [
        {
          id: 'D.0.0',
          _beagleComponent_: 'type-C',
          styleId: 'style-test-children-mock-style'
        },
      ]
    },
    {
      id: 'D.1',
      _beagleComponent_: 'type-D',
      styleId: 'design-style-children-mock-style'
    },
  ],
  styleId: 'design-text-style-mock-style'
}

export const treeStartEndEdgeValue = {
  id: 'E.1',
  _beagleComponent_: 'type-E',
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
    },
    margin: {
      start: {
        value: 10.0,
        type: "REAL"
      },
      end: {
        value: 15.0,
        type: "REAL"
      }
    },
    padding: {
      start: {
        value: 10.0,
        type: "REAL"
      },
      end: {
        value: 15.0,
        type: "REAL"
      }
    }
  }
}

export const treeStartEndEdgeValueParsed = {
  id: 'E.1',
  _beagleComponent_: 'type-E',
  style: {
    start: '10px',
    end: '15px',
    marginStart: '10px',
    marginEnd: '15px',
    paddingStart: '10px',
    paddingEnd: '15px',
    position: "relative"
  }
}

export const treeStyleOrderAll: IdentifiableBeagleUIElement = {
  "_beagleComponent_": "beagle:container",
  "id": "testing",
  "style": {
    "flex": {
      "alignItems": "CENTER",
      "justifyContent": "CENTER"
    },
    "margin": {
      "vertical": {
        "value": 40,
        "type": "REAL"
      },
      "right": {
        "value": 60,
        "type": "REAL"
      },
      "top": {
        "value": 20,
        "type": "REAL"
      },
      "all": {
        "value": 75,
        "type": "REAL"
      },
      "bottom": {
        "value": 30,
        "type": "REAL"
      },
      "horizontal": {
        "value": 10,
        "type": "REAL"
      },
      "left": {
        "value": 100,
        "type": "REAL"
      }
    },
    "backgroundColor": "red"
  }
}

export const treeStyleOrderAllParsed: IdentifiableBeagleUIElement = {
  "_beagleComponent_": "beagle:container",
  "id": "testing",
  "style": {
    "alignItems": "center",
    "justifyContent": "center",
    "margin": "75px",
    "marginTop": "20px",
    "marginBottom": "30px",
    "marginRight": "60px",
    "marginLeft": "100px",
    "backgroundColor": "red"
  }
}

export const treeStyleOrder: IdentifiableBeagleUIElement = {
  "_beagleComponent_": "beagle:container",
  "id": "testing",
  "style": {
    "flex": {
      "alignItems": "CENTER",
      "justifyContent": "CENTER"
    },
    "padding": {
      "vertical": {
        "value": 40,
        "type": "REAL"
      },
      "all": {
        "value": 75,
        "type": "REAL"
      },
      "horizontal": {
        "value": 10,
        "type": "REAL"

      },
    },
    "backgroundColor": "red"
  }
}

export const treeStyleOrderParsed: IdentifiableBeagleUIElement = {
  "_beagleComponent_": "beagle:container",
  "id": "testing",
  "style": {
    "alignItems": "center",
    "justifyContent": "center",
    "padding": "75px",
    "paddingTop": "40px",
    "paddingBottom": "40px",
    "paddingRight": "10px",
    "paddingLeft": "10px",
    "backgroundColor": "red"
  }
}

export const treeOrderPosition: IdentifiableBeagleUIElement = {
  id: 'Position',
  _beagleComponent_: 'type-Position',
  value: 'testing',
  style: {
    position: {
      vertical: {
        value: 25.0,
        type: "REAL"
      },
      bottom: {
        value: 8.0,
        type: "PERCENT"
      },
      all: {
        value: 9.0,
        type: "REAL"
      },
      horizontal: {
        value: 5.0,
        type: "REAL"
      },
      right: {
        value: 18.0,
        type: "REAL"
      },
      top: {
        value: 22.0,
        type: "REAL"
      },
      left: {
        value: 12.0,
        type: "REAL"
      },
    }
  }
}

export const treeOrderPositionParsed: IdentifiableBeagleUIElement = {
  id: 'Position',
  _beagleComponent_: 'type-Position',
  value: 'testing',
  style: {
    top: '25px',
    bottom: '25px',
    left: '5px',
    right: '5px',    
    position: 'relative'
  }
}

export const treeWithCornerRadius = {
  id: 'G.1',
  _beagleComponent_: 'type-G',
  style: {
    backgroundColor: "#0f4c81",
    cornerRadius: {
      radius: 10
    }
  }
}

export const treeWithCornerRadiusParsed = {
  id: 'G.1',
  _beagleComponent_: 'type-G',
  style: {
    backgroundColor: "#0f4c81",
    borderRadius: '10px'
  }
}
