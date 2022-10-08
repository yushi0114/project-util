import path from 'path'
import dotenv from 'dotenv'
import {
  __dirname,
} from './util'

const envPrefixIndex = process.argv.indexOf('--env')
const envName = envPrefixIndex > -1 ? process.argv[envPrefixIndex + 1] : 'melib'

globalThis.console.log('[environment]:', `.env.${envName}`)

dotenv.config({
  path: path.resolve(__dirname(import.meta.url), `../.env.${envName}`),
})
