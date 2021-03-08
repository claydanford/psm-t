import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult
} from 'aws-lambda'
import { KMSClient, EncryptCommand } from '@aws-sdk/client-kms'
import * as random from 'crypto-random-string'
import 'source-map-support/register'
import { Base64 } from 'js-base64'

const length = process.env.GENERATOR_LENGTH
  ? Number(process.env.GENERATOR_LENGTH)
  : 15
const KeyId = process.env.KMS_KEY
const region = process.env.AWS_REGION

const errors = {
  noBodyPostMethod: 'Err: No secret supplied with POST method.'
}

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
) => {
  const secret = await getInput(event.httpMethod, event.body)

  if (secret === null) {
    throw new Error(errors.noBodyPostMethod)
    // return response(400, errors.noBodyPostMethod)
  }

  const cipher = await encryptSecret(secret)

  return response(200, cipher)
}

export const getInput = async (
  httpMethod: string,
  body: string
): Promise<string> => {
  let secret: string

  if (httpMethod === 'POST') secret = body
  if (httpMethod === 'GET') secret = random({ length })

  return secret
}

export const response = (
  statusCode: number,
  message: string
): APIGatewayProxyResult => ({
  statusCode,
  body: JSON.stringify({ message })
})

export const encryptSecret = async (secret: string): Promise<string> => {
  console.log(`KMS Key: ${KeyId}`)

  const kms = new KMSClient({ region })
  const command = new EncryptCommand({
    KeyId,
    Plaintext: Base64.toUint8Array(secret)
  })

  const { CiphertextBlob } = await kms.send(command)

  return `cipher: ${Base64.fromUint8Array(CiphertextBlob)}`
}
