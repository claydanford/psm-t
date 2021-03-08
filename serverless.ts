import type { Serverless } from 'serverless/aws'

const serverlessConfiguration: Serverless = {
  service: 'psm-t',

  frameworkVersion: '^2.12.0',

  custom: {
    region: "${opt:region, 'us-west-2'}",
    stage: "${opt:stage, 'dev'}",

    kmsKey: 'alias/${self:service}-${self:provider.stage}',
    metadataAsParam: "${opt:metadataAsParam, 'true'}",

    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
    }
  },

  plugins: [
    'serverless-webpack',
    'serverless-iam-roles-per-function',
    'serverless-pseudo-parameters'
  ],

  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    stage: '${self:custom.stage}',
    region: '${self:custom.region}',

    apiGateway: {
      minimumCompressionSize: 1024
    },

    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: 1,
      GENERATOR_LENGTH: 15,
      KMS_KEY: '${self:custom.kmsKey}',
      REGION: '${self:custom.region}',
      METADATA_AS_PARAM: '${self:custom.metadataAsParam}'
    },

    tags: {
      Application: '${self:service}',
      Owner: 'clay.danford',
      Environment: '${self:custom.stage}'
    },

    apiKeys: ['${self:service}-key-${self:custom.stage}']
  },

  functions: {
    encrypt: {
      handler: 'src/encrypt.handler',
      events: [
        {
          http: {
            method: 'post',
            path: 'encrypt',
            private: true
          }
        },
        {
          http: {
            method: 'get',
            path: 'encrypt',
            private: true
          }
        }
      ],
      iamRoleStatements: [
        {
          Effect: 'Allow',
          Action: ['kms:Encrypt'],
          Resource: [
            'arn:aws:kms:${self:custom.region}:#{AWS::AccountId}:${self:custom.kmsKey}'
          ]
        }
      ]
    }
  },

  resources: ['${file(resources/KMSKey.yml)}']
} as any // Use as any for properties that are not in the @types/serverless definition

module.exports = serverlessConfiguration
