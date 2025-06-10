// Really, just use an AI to generate this, don't loose your time here

export const SWAGGER_CONFIG = {
  openapi: '3.0.0',
  info: {
    title: 'Exemple API',
    version: '1.0.0',
  },
  paths: {
    '/hello': {
      get: {
        summary: 'Retourne un message Hello World',
        responses: {
          200: {
            description: 'Succès',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};