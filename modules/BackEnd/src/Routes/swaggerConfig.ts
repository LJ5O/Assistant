import { SwaggerOptions } from 'swagger-ui-express';

export const SWAGGER_CONFIG: SwaggerOptions = {
  swagger: '2.0',
  info: {
    title: 'API Express + Swagger',
    version: '1.0.0',
    description: 'Une API de démonstration avec Express, TypeScript et Swagger',
  },
  basePath: '/',
  securityDefinitions: {
    Bearer: {
      type: 'apiKey',
      name: 'authorization',
      in: 'header',
      description: 'JWT Token, inserted directly',
    },
  },
  security: [
    {
      Bearer: [],
    },
  ],
  paths: {
    '/hello': {
      get: {
        summary: 'Hello World',
        security: [{ Bearer: [] }],
        responses: {
          200: {
            description: 'Message de bienvenue',
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Hello World',
                },
              },
            },
          },
        },
      },
    },
    '/login': {
      post: {
        summary: 'Login utilisateur',
        parameters: [
          {
            name: 'body',
            in: 'body',
            required: true,
            schema: {
              type: 'object',
              required: ['username', 'password'],
              properties: {
                username: { type: 'string', example: 'admin' },
                password: { type: 'string', example: 'admin' },
              },
            },
          },
        ],
        responses: {
          200: {
            description: 'Token JWT',
            schema: {
              type: 'object',
              properties: {
                token: { type: 'string' },
              },
            },
          },
          401: {
            description: 'Identifiants invalides',
          },
        },
      },
    },
    '/ask': {
      post: {
        summary: 'Envoie un message à BrainManager',
        description: 'Envoie un message texte à l’IA et reçoit une réponse générée.',
        security: [{ Bearer: [] }],
        parameters: [
          {
            name: 'body',
            in: 'body',
            required: true,
            schema: {
              type: 'object',
              required: ['conversation', 'message'],
              properties: {
                conversation: {
                  type: 'string',
                  example: '74985',
                },
                message: {
                  type: 'string',
                  example: 'What\' 2*2 ?',
                },
              },
            },
          },
        ],
        responses: {
          200: {
            description: 'Réponse de l’IA',
            schema: {
              type: 'object',
              properties: {
                type: { type: 'string', example: 'UserAnswer' },
                fields: {
                  type: 'object',
                  properties: {
                    output: { type: 'string', example: 'Je suis une IA.' },
                    // Ajoute d'autres champs si présents
                  },
                },
              },
            },
          },
          422: {
            description: 'Requête invalide (ex: pas de message)',
          },
          504: {
            description: 'Pas de réponse de l’IA (timeout)',
          },
        },
      },
    },
    '/history': {
      get: {
        summary: 'Récupère l’historique des échanges',
        description: 'Retourne l’historique des messages entre l’utilisateur et le cerveau IA.',
        security: [{ Bearer: [] }],
        parameters: [
          {
            name: 'conversation',
            in: 'query',
            required: true,
            schema: {
              type: 'string',
              example: '7589464',
            },
          },
        ],
        responses: {
          200: {
            description: 'Historique des messages',
            schema: {
              type: 'object',
              properties: {
                type: { type: 'string', example: 'History' },
                thread_id: { type: 'string', example: 'user@example.com' },
                messages: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      type: { type: 'string', example: 'HumanMessage' },
                      content: { type: 'string', example: 'Hello, who are you?' },
                      name: { type: 'string', example: 'user', nullable: true },
                      tool_call_id: { type: 'string', nullable: true },
                      tool_call_type: { type: 'string', nullable: true },
                      tool_call_args: {
                        type: 'object',
                        nullable: true,
                        additionalProperties: true
                      }
                    }
                  }
                }
              }
            }
          },
          422: {
            description: 'Utilisateur non authentifié ou identifiant manquant',
            schema: {
              type: 'object',
              properties: {
                error: { type: 'string', example: 'Missing or invalid fields in body.' }
              }
            }
          },
          504: {
            description: 'Pas de réponse (timeout)',
            schema: {
              type: 'object',
              properties: {
                error: { type: 'string', example: 'Timeout.' }
              }
            }
          }
        }
      }
    },
    '/conversations': {
      get: {
        summary: 'Get all availables conversations you started with the Agent',
        description: 'Returns every available conversation you started with the AI',
        security: [{ Bearer: [] }],
        responses: {
          200: {
            description: 'Availables conversations',
            schema: {
              type: 'object',
              properties: {
                type: { type: 'string', example: 'AvailableConversations' },
                user_id: { type: 'string', example: 'user1234' },
                threads: {
                  type: 'array',
                  items: {
                    type: 'string',
                    example: 'user1234.conv13554'
                  }
                }
              }
            }
          },
          422: {
            description: 'Utilisateur non authentifié ou identifiant manquant',
            schema: {
              type: 'object',
              properties: {
                error: { type: 'string', example: 'Missing or invalid fields in body.' }
              }
            }
          },
          504: {
            description: 'Pas de réponse (timeout)',
            schema: {
              type: 'object',
              properties: {
                error: { type: 'string', example: 'Timeout.' }
              }
            }
          }
        }
      }
    },
  },
};
