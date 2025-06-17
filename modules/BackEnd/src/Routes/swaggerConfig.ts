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
              required: ['message'],
              properties: {
                message: {
                  type: 'string',
                  example: 'Bonjour, qui es-tu ?',
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
  },
};
