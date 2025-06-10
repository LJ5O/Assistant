// Really, just use an AI to generate this, don't loose your time here
import { SwaggerOptions } from 'swagger-ui-express';

export const SWAGGER_CONFIG: SwaggerOptions = {
  swagger: '2.0',
  info: {
    title: 'API Express + Swagger',
    version: '1.0.0',
    description: 'Une API de démonstration avec Express, TypeScript et Swagger',
  },
  basePath: '/',
  paths: {
    '/hello': {
      get: {
        summary: 'Hello World',
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
  },
};