import { resolve } from 'path'
import { config } from 'dotenv-safe'

// eslint-disable-next-line no-process-env
const NX_WORKSPACE_ROOT = process.env.NX_WORKSPACE_ROOT

config({
  example: NX_WORKSPACE_ROOT ? resolve(
    NX_WORKSPACE_ROOT,
    'apps/app/src',
    '.env.example'
  ) : resolve(__dirname, '.env.example'),
})
