import swaggerJsdoc from 'swagger-jsdoc';
import { version } from '../../package.json';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'O2NL Dashboard API Documentation',
      version,
      description: 'API documentation for the O2NL Dashboard backend services',
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: '/api',
        description: 'Development API Server',
      },
      {
        url: 'https://api.o2nl-dashboard.com/api',
        description: 'Production API Server',
      },
    ],
    components: {
      schemas: {
        ParticleSizeResult: {
          type: 'object',
          properties: {
            sieve_size_mm: {
              type: 'number',
              description: 'Sieve size in millimeters',
            },
            percent_passing: {
              type: 'number',
              description: 'Percentage of material passing through the sieve',
            },
          },
        },
        PSDTest: {
          type: 'object',
          properties: {
            sample_unique_id: {
              type: 'string',
              description: 'Unique identifier for the sample',
            },
            sample_reference: {
              type: 'string',
              description: 'Reference code for the sample',
            },
            adit_id: {
              type: 'string',
              description: 'Adit identifier',
            },
            location_id: {
              type: 'string',
              description: 'Location identifier',
            },
            depth_to: {
              type: 'number',
              description: 'Sample depth in meters',
            },
            average_water_content: {
              type: 'number',
              description: 'Average water content percentage',
            },
            sample_type: {
              type: 'string',
              description: 'Type of sample collected',
            },
            construction_subzone: {
              type: 'string',
              description: 'Construction subzone where sample was collected',
            },
            particle_size_result: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/ParticleSizeResult',
              },
              description: 'Particle size distribution results',
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'string',
              example: 'Error message details',
            },
          },
        },
      },
      responses: {
        BadRequest: {
          description: 'Bad request',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
            },
          },
        },
        NotFound: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
            },
          },
        },
        InternalServerError: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
            },
          },
        },
      },
    },
  },
  apis: ['./src/api/**/*.ts'], // Path to the API routes
};

const specs = swaggerJsdoc(options);

export default specs;
