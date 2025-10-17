export const config = {
  version: '1.0',
  metadata: {
    atlasId: 'france',
    atlasName: 'France',
    exportDate: '2025-10-17T19:22:35.492Z',
    createdWith: 'Atlas composer v1.0',
  },
  pattern: 'single-focus',
  referenceScale: 2700,
  canvasDimensions: {
    width: 960,
    height: 500,
  },
  territories: [
    {
      code: 'FR-MET',
      name: 'France Métropolitaine',
      role: 'primary',
      projection: {
        id: 'conic-conformal',
        family: 'CONIC',
        parameters: {
          rotate: [
            -3,
            -46.2,
            0,
          ],
          parallels: [
            0,
            60,
          ],
          scaleMultiplier: 1,
          projectionId: 'conic-conformal',
        },
      },
      layout: {
        translateOffset: [
          0,
          0,
        ],
        pixelClipExtent: [
          -268.92,
          -245.16,
          260.99,
          324,
        ],
      },
      bounds: [
        [
          -6.5,
          41,
        ],
        [
          10,
          51,
        ],
      ],
    },
    {
      code: 'FR-GP',
      name: 'Guadeloupe',
      role: 'secondary',
      projection: {
        id: 'mercator',
        family: 'CYLINDRICAL',
        parameters: {
          center: [
            -61.46,
            16.14,
          ],
          scaleMultiplier: 1.4,
          projectionId: 'mercator',
        },
      },
      layout: {
        translateOffset: [
          -324,
          -38,
        ],
        pixelClipExtent: [
          -54,
          -48,
          55,
          38,
        ],
      },
      bounds: [
        [
          -61.81,
          15.83,
        ],
        [
          -61,
          16.52,
        ],
      ],
    },
    {
      code: 'FR-MQ',
      name: 'Martinique',
      role: 'secondary',
      projection: {
        id: 'mercator',
        family: 'CYLINDRICAL',
        parameters: {
          center: [
            -61.03,
            14.67,
          ],
          scaleMultiplier: 1.6,
          projectionId: 'mercator',
        },
      },
      layout: {
        translateOffset: [
          -324,
          35,
        ],
        pixelClipExtent: [
          -54,
          -35,
          55,
          43,
        ],
      },
      bounds: [
        [
          -61.23,
          14.39,
        ],
        [
          -60.81,
          14.88,
        ],
      ],
    },
    {
      code: 'FR-GF',
      name: 'Guyane',
      role: 'secondary',
      projection: {
        id: 'mercator',
        family: 'CYLINDRICAL',
        parameters: {
          center: [
            -53.2,
            3.9,
          ],
          scaleMultiplier: 0.6,
          projectionId: 'mercator',
        },
      },
      layout: {
        translateOffset: [
          -324,
          155,
        ],
        pixelClipExtent: [
          -54,
          -76.7,
          55.08,
          78.28,
        ],
      },
      bounds: [
        [
          -54.6,
          2.1,
        ],
        [
          -51.6,
          5.8,
        ],
      ],
    },
    {
      code: 'FR-RE',
      name: 'La Réunion',
      role: 'secondary',
      projection: {
        id: 'mercator',
        family: 'CYLINDRICAL',
        parameters: {
          center: [
            55.52,
            -21.13,
          ],
          scaleMultiplier: 1.2,
          projectionId: 'mercator',
        },
      },
      layout: {
        translateOffset: [
          313,
          -96,
        ],
        pixelClipExtent: [
          -52,
          -44,
          57,
          42,
        ],
      },
      bounds: [
        [
          55.22,
          -21.39,
        ],
        [
          55.84,
          -20.87,
        ],
      ],
    },
    {
      code: 'FR-YT',
      name: 'Mayotte',
      role: 'secondary',
      projection: {
        id: 'mercator',
        family: 'CYLINDRICAL',
        parameters: {
          center: [
            45.16,
            -12.8,
          ],
          scaleMultiplier: 1.6,
          projectionId: 'mercator',
        },
      },
      layout: {
        translateOffset: [
          316,
          -173,
        ],
        pixelClipExtent: [
          -54.91,
          -32.2,
          54.17,
          32.6,
        ],
      },
      bounds: [
        [
          44.98,
          -13,
        ],
        [
          45.3,
          -12.64,
        ],
      ],
    },
    {
      code: 'FR-BL',
      name: 'Saint-Barthélemy',
      role: 'secondary',
      projection: {
        id: 'mercator',
        family: 'CYLINDRICAL',
        parameters: {
          center: [
            -62.85,
            17.92,
          ],
          scaleMultiplier: 1,
          projectionId: 'mercator',
        },
      },
      layout: {
        translateOffset: [
          -324,
          -119,
        ],
        pixelClipExtent: [
          -378,
          -140.4,
          -269.016,
          -86.4,
        ],
      },
      bounds: [
        [
          -62.95,
          17.85,
        ],
        [
          -62.75,
          17.95,
        ],
      ],
    },
    {
      code: 'FR-MF',
      name: 'Saint-Martin',
      role: 'secondary',
      projection: {
        id: 'mercator',
        family: 'CYLINDRICAL',
        parameters: {
          center: [
            -63.082,
            18.067,
          ],
          scaleMultiplier: 5,
          projectionId: 'mercator',
        },
      },
      layout: {
        translateOffset: [
          -324,
          -119,
        ],
        pixelClipExtent: [
          -54,
          -21,
          55,
          33,
        ],
      },
      bounds: [
        [
          -63.15,
          18.04,
        ],
        [
          -63,
          18.13,
        ],
      ],
    },
    {
      code: 'FR-PM',
      name: 'Saint-Pierre-et-Miquelon',
      role: 'secondary',
      projection: {
        id: 'mercator',
        family: 'CYLINDRICAL',
        parameters: {
          center: [
            -56.23,
            46.93,
          ],
          scaleMultiplier: 1.3,
          projectionId: 'mercator',
        },
      },
      layout: {
        translateOffset: [
          -324,
          -176,
        ],
        pixelClipExtent: [
          -54,
          -29,
          55,
          36,
        ],
      },
      bounds: [
        [
          -56.42,
          46.75,
        ],
        [
          -56.13,
          47.15,
        ],
      ],
    },
    {
      code: 'FR-WF',
      name: 'Wallis-et-Futuna',
      role: 'secondary',
      projection: {
        id: 'mercator',
        family: 'CYLINDRICAL',
        parameters: {
          center: [
            -178.1,
            -14.3,
          ],
          scaleMultiplier: 2.7,
          projectionId: 'mercator',
        },
      },
      layout: {
        translateOffset: [
          313,
          59,
        ],
        pixelClipExtent: [
          -52,
          -27,
          57,
          30,
        ],
      },
      bounds: [
        [
          -178.2,
          -14.4,
        ],
        [
          -176.1,
          -13.2,
        ],
      ],
    },
    {
      code: 'FR-PF',
      name: 'Polynésie française',
      role: 'secondary',
      projection: {
        id: 'mercator',
        family: 'CYLINDRICAL',
        parameters: {
          center: [
            -150.55,
            -17.11,
          ],
          scaleMultiplier: 0.5,
          projectionId: 'mercator',
        },
      },
      layout: {
        translateOffset: [
          311,
          203,
        ],
        pixelClipExtent: [
          -50,
          -41,
          59,
          30,
        ],
      },
      bounds: [
        [
          -154,
          -28,
        ],
        [
          -134,
          -7,
        ],
      ],
    },
    {
      code: 'FR-PF-2',
      name: 'Polynésie française (îles éloignées)',
      role: 'secondary',
      projection: {
        id: 'mercator',
        family: 'CYLINDRICAL',
        parameters: {
          center: [
            -150.55,
            -17.11,
          ],
          scaleMultiplier: 0.06,
          projectionId: 'mercator',
        },
      },
      layout: {
        translateOffset: [
          297,
          122,
        ],
        pixelClipExtent: [
          -36,
          -33,
          73,
          40,
        ],
      },
      bounds: [
        [
          -154,
          -28,
        ],
        [
          -134,
          -7,
        ],
      ],
    },
    {
      code: 'FR-NC',
      name: 'Nouvelle-Calédonie',
      role: 'secondary',
      projection: {
        id: 'mercator',
        family: 'CYLINDRICAL',
        parameters: {
          center: [
            165.8,
            -21.07,
          ],
          scaleMultiplier: 0.3,
          projectionId: 'mercator',
        },
      },
      layout: {
        translateOffset: [
          313,
          -13,
        ],
        pixelClipExtent: [
          -52,
          -41,
          57,
          45.4,
        ],
      },
      bounds: [
        [
          163,
          -22.7,
        ],
        [
          168,
          -19.5,
        ],
      ],
    },
    {
      code: 'FR-TF',
      name: 'Terres australes et antarctiques françaises',
      role: 'secondary',
      projection: {
        id: 'mercator',
        family: 'CYLINDRICAL',
        parameters: {
          center: [
            69.348,
            -49.28,
          ],
          scaleMultiplier: 1,
          projectionId: 'mercator',
        },
      },
      layout: {
        translateOffset: [
          0,
          250,
        ],
        pixelClipExtent: [
          0,
          -250,
          0,
          -250,
        ],
      },
      bounds: [
        [
          39,
          -50,
        ],
        [
          77,
          -37,
        ],
      ],
    },
  ],
}
