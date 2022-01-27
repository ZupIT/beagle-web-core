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

import { BeagleUIElement } from "beagle-tree/types";

export const treeAWithNull: BeagleUIElement =
{
  "_beagleComponent_": "beagle:text",
  "text": "hello world with multiple null",
  "styleId": null,
  "textColor": null,
  "alignment": null,
  "id": null,
  "accessibility": null
}

export const cleanedTreeA: BeagleUIElement =
{
  "_beagleComponent_": "beagle:text",
  "text": "hello world with multiple null"
}

export const treeBWithNull: BeagleUIElement = {
  "_beagleComponent_": "beagle:text",
  "text": "hello world without style",
  "styleId": null,
  "textColor": null,
  "alignment": null,
  "id": null,
  "style": {
    "backgroundColor": null,
    "cornerRadius": null,
    "size": null,
    "margin": {
      "left": {
        "value": 16,
        "type": "REAL"
      },
      "top": {
        "value": 16,
        "type": "REAL"
      },
      "right": {
        "value": 16,
        "type": "REAL"
      },
      "bottom": null,
      "horizontal": null,
      "vertical": null,
      "all": null
    },
    "padding": null,
    "position": null,
    "flex": null,
    "positionType": null,
    "display": null
  },
  "accessibility": null
}

export const cleanedTreeB: BeagleUIElement = {
  "_beagleComponent_": "beagle:text",
  "text": "hello world without style",
  "style": {
    "margin": {
      "left": {
        "value": 16,
        "type": "REAL"
      },
      "top": {
        "value": 16,
        "type": "REAL"
      },
      "right": {
        "value": 16,
        "type": "REAL"
      }
    }
  }
}

export const treeCWithNull: BeagleUIElement = {
  "_beagleComponent_": "beagle:container",
  "children": [
    {
      "_beagleComponent_": "beagle:text",
      "text": "hello world without style",
      "styleId": null,
      "textColor": null,
      "alignment": null,
      "id": null,
      "style": {
        "backgroundColor": null,
        "cornerRadius": null,
        "size": null,
        "margin": {
          "left": {
            "value": 16,
            "type": "REAL"
          },
          "top": {
            "value": 16,
            "type": "REAL"
          },
          "right": {
            "value": 16,
            "type": "REAL"
          },
          "bottom": null,
          "horizontal": null,
          "vertical": null,
          "all": null
        },
        "padding": null,
        "position": null,
        "flex": null,
        "positionType": null,
        "display": null
      },
      "accessibility": null
    },
    {
      "_beagleComponent_": "beagle:text",
      "text": "hello world with style",
      "styleId": "DesignSystem.Text.helloWord",
      "textColor": null,
      "alignment": null,
      "id": null,
      "style": {
        "backgroundColor": null,
        "cornerRadius": null,
        "size": null,
        "margin": {
          "left": {
            "value": 16,
            "type": "REAL"
          },
          "top": {
            "value": 16,
            "type": "REAL"
          },
          "right": {
            "value": 16,
            "type": "REAL"
          },
          "bottom": null,
          "horizontal": null,
          "vertical": null,
          "all": null
        },
        "padding": null,
        "position": null,
        "flex": null,
        "positionType": null,
        "display": null
      },
      "accessibility": null
    },
    {
      "_beagleComponent_": "beagle:text",
      "text": "hello world with Appearance",
      "styleId": null,
      "textColor": null,
      "alignment": null,
      "id": null,
      "style": {
        "backgroundColor": "#4682b4",
        "cornerRadius": null,
        "size": null,
        "margin": {
          "left": {
            "value": 16,
            "type": "REAL"
          },
          "top": {
            "value": 16,
            "type": "REAL"
          },
          "right": {
            "value": 16,
            "type": "REAL"
          },
          "bottom": null,
          "horizontal": null,
          "vertical": null,
          "all": null
        },
        "padding": null,
        "position": null,
        "flex": null,
        "positionType": null,
        "display": null
      },
      "accessibility": null
    }
  ]
}

export const cleanedTreeC: BeagleUIElement = {
  "_beagleComponent_": "beagle:container",
  "children": [
    {
      "_beagleComponent_": "beagle:text",
      "text": "hello world without style",
      "style": {
        "margin": {
          "left": {
            "value": 16,
            "type": "REAL"
          },
          "top": {
            "value": 16,
            "type": "REAL"
          },
          "right": {
            "value": 16,
            "type": "REAL"
          }
        }
      }
    },
    {
      "_beagleComponent_": "beagle:text",
      "text": "hello world with style",
      "styleId": "DesignSystem.Text.helloWord",
      "style": {
        "margin": {
          "left": {
            "value": 16,
            "type": "REAL"
          },
          "top": {
            "value": 16,
            "type": "REAL"
          },
          "right": {
            "value": 16,
            "type": "REAL"
          }
        }
      }
    },
    {
      "_beagleComponent_": "beagle:text",
      "text": "hello world with Appearance",
      "style": {
        "backgroundColor": "#4682b4",
        "margin": {
          "left": {
            "value": 16,
            "type": "REAL"
          },
          "top": {
            "value": 16,
            "type": "REAL"
          },
          "right": {
            "value": 16,
            "type": "REAL"
          }
        }
      }
    }
  ]
}

export const treeDWithNull: BeagleUIElement = {
  "_beagleComponent_": "beagle:screenComponent",
  "id": null,
  "safeArea": null,
  "navigationBar": {
    "title": "Beagle Text",
    "showBackButton": true,
    "styleId": null,
    "navigationBarItems": [
      {
        "_beagleComponent_": "beagle:navigationBarItem",
        "text": "",
        "image": {
          "_beagleImagePath_": "local",
          "mobileId": "informationImage",
          "url": null
        },
        "action": {
          "_beagleAction_": "beagle:alert",
          "title": "Text",
          "message": "This widget will define a text view natively using the server driven information received through Beagle.",
          "onPressOk": null,
          "labelOk": "OK"
        },
        "accessibility": null,
        "id": null
      }
    ],
    "backButtonAccessibility": null
  },
  "child": {
    "_beagleComponent_": "beagle:container",
    "context": null,
    "onInit": null,
    "id": null,
    "style": null,
    "accessibility": null
  },
  // @ts-ignore
  "style": null,
  // @ts-ignore
  "screenAnalyticsEvent": null,
  // @ts-ignore
  "context": null,
}

export const cleanedTreeD: BeagleUIElement = {
  "_beagleComponent_": "beagle:screenComponent",
  "navigationBar": {
    "title": "Beagle Text",
    "showBackButton": true,
    "navigationBarItems": [
      {
        "_beagleComponent_": "beagle:navigationBarItem",
        "text": "",
        "image": {
          "_beagleImagePath_": "local",
          "mobileId": "informationImage"
        },
        "action": {
          "_beagleAction_": "beagle:alert",
          "title": "Text",
          "message": "This widget will define a text view natively using the server driven information received through Beagle.",
          "labelOk": "OK"
        }
      }
    ]
  },
  "child": {
    "_beagleComponent_": "beagle:container"
  }
}

export const treeEWithNull: BeagleUIElement = {
  "_beagleComponent_": "beagle:screenComponent",
  "id": null,
  "safeArea": null,
  "navigationBar": {
    "title": "Beagle Text",
    "showBackButton": true,
    "styleId": null,
    "navigationBarItems": [
      {
        "_beagleComponent_": "beagle:navigationBarItem",
        "text": "",
        "image": {
          "_beagleImagePath_": "local",
          "mobileId": "informationImage",
          "url": null
        },
        "action": {
          "_beagleAction_": "beagle:alert",
          "title": "Text",
          "message": "This widget will define a text view natively using the server driven information received through Beagle.",
          "onPressOk": null,
          "labelOk": "OK"
        },
        "accessibility": null,
        "id": null
      }
    ],
    "backButtonAccessibility": null
  },
  "child": {
    "_beagleComponent_": "beagle:container",
    "children": [
      {
        "_beagleComponent_": "beagle:text",
        "text": "hello world without style",
        "styleId": null,
        "textColor": null,
        "alignment": null,
        "id": null,
        "style": {
          "backgroundColor": null,
          "cornerRadius": null,
          "size": null,
          "margin": {
            "left": {
              "value": 16,
              "type": "REAL"
            },
            "top": {
              "value": 16,
              "type": "REAL"
            },
            "right": {
              "value": 16,
              "type": "REAL"
            },
            "bottom": null,
            "horizontal": null,
            "vertical": null,
            "all": null
          },
          "padding": null,
          "position": null,
          "flex": null,
          "positionType": null,
          "display": null
        },
        "accessibility": null
      },
      {
        "_beagleComponent_": "beagle:text",
        "text": "hello world with style",
        "styleId": "DesignSystem.Text.helloWord",
        "textColor": null,
        "alignment": null,
        "id": null,
        "style": {
          "backgroundColor": null,
          "cornerRadius": null,
          "size": null,
          "margin": {
            "left": {
              "value": 16,
              "type": "REAL"
            },
            "top": {
              "value": 16,
              "type": "REAL"
            },
            "right": {
              "value": 16,
              "type": "REAL"
            },
            "bottom": null,
            "horizontal": null,
            "vertical": null,
            "all": null
          },
          "padding": null,
          "position": null,
          "flex": null,
          "positionType": null,
          "display": null
        },
        "accessibility": null
      },
      {
        "_beagleComponent_": "beagle:text",
        "text": "hello world with Appearance",
        "styleId": null,
        "textColor": null,
        "alignment": null,
        "id": null,
        "style": {
          "backgroundColor": "#4682b4",
          "cornerRadius": null,
          "size": null,
          "margin": {
            "left": {
              "value": 16,
              "type": "REAL"
            },
            "top": {
              "value": 16,
              "type": "REAL"
            },
            "right": {
              "value": 16,
              "type": "REAL"
            },
            "bottom": null,
            "horizontal": null,
            "vertical": null,
            "all": null
          },
          "padding": null,
          "position": null,
          "flex": null,
          "positionType": null,
          "display": null
        },
        "accessibility": null
      },
      {
        "_beagleComponent_": "beagle:text",
        "text": "hello world with style and Appearance",
        "styleId": "DesignSystem.Text.helloWord",
        "textColor": null,
        "alignment": null,
        "id": null,
        "style": {
          "backgroundColor": "#4682b4",
          "cornerRadius": null,
          "size": null,
          "margin": {
            "left": {
              "value": 16,
              "type": "REAL"
            },
            "top": {
              "value": 16,
              "type": "REAL"
            },
            "right": {
              "value": 16,
              "type": "REAL"
            },
            "bottom": null,
            "horizontal": null,
            "vertical": null,
            "all": null
          },
          "padding": null,
          "position": null,
          "flex": null,
          "positionType": null,
          "display": null
        },
        "accessibility": null
      }
    ],
    "context": null,
    "onInit": null,
    "id": null,
    "style": null,
    "accessibility": null
  },
  // @ts-ignore
  "style": null,
  "screenAnalyticsEvent": null,
  // @ts-ignore
  "context": null,
}

export const cleanedTreeE: BeagleUIElement = {
  "_beagleComponent_": "beagle:screenComponent",
  "navigationBar": {
    "title": "Beagle Text",
    "showBackButton": true,
    "navigationBarItems": [
      {
        "_beagleComponent_": "beagle:navigationBarItem",
        "text": "",
        "image": {
          "_beagleImagePath_": "local",
          "mobileId": "informationImage"
        },
        "action": {
          "_beagleAction_": "beagle:alert",
          "title": "Text",
          "message": "This widget will define a text view natively using the server driven information received through Beagle.",
          "labelOk": "OK"
        }
      }
    ]
  },
  "child": {
    "_beagleComponent_": "beagle:container",
    "children": [
      {
        "_beagleComponent_": "beagle:text",
        "text": "hello world without style",
        "style": {
          "margin": {
            "left": {
              "value": 16,
              "type": "REAL"
            },
            "top": {
              "value": 16,
              "type": "REAL"
            },
            "right": {
              "value": 16,
              "type": "REAL"
            }
          }
        }
      },
      {
        "_beagleComponent_": "beagle:text",
        "text": "hello world with style",
        "styleId": "DesignSystem.Text.helloWord",
        "style": {
          "margin": {
            "left": {
              "value": 16,
              "type": "REAL"
            },
            "top": {
              "value": 16,
              "type": "REAL"
            },
            "right": {
              "value": 16,
              "type": "REAL"
            }
          }
        }
      },
      {
        "_beagleComponent_": "beagle:text",
        "text": "hello world with Appearance",
        "style": {
          "backgroundColor": "#4682b4",
          "margin": {
            "left": {
              "value": 16,
              "type": "REAL"
            },
            "top": {
              "value": 16,
              "type": "REAL"
            },
            "right": {
              "value": 16,
              "type": "REAL"
            }
          }
        }
      },
      {
        "_beagleComponent_": "beagle:text",
        "text": "hello world with style and Appearance",
        "styleId": "DesignSystem.Text.helloWord",
        "style": {
          "backgroundColor": "#4682b4",
          "margin": {
            "left": {
              "value": 16,
              "type": "REAL"
            },
            "top": {
              "value": 16,
              "type": "REAL"
            },
            "right": {
              "value": 16,
              "type": "REAL"
            }
          }
        }
      }
    ]
  }
}
