const fs = require('fs-extra')

const { AWS_SECRET_ACCESS_KEY, AWS_ACCESS_KEY_ID, AWS_DEFAULT_REGION = 'eu-central-1' } = process.env

const logger = console

const AWS_CONFIG_DIR = `${process.env.HOME}/.aws`
const AWS_CONFIG_FILE_PATH = `${process.env.HOME}/.aws/config`
const AWS_CRED_FILE_PATH = `${process.env.HOME}/.aws/credentials`

fs.ensureDirSync(AWS_CONFIG_DIR)
fs.ensureFileSync(AWS_CRED_FILE_PATH)
fs.ensureFileSync(AWS_CONFIG_FILE_PATH)

const tmplConfigFile = (region = AWS_DEFAULT_REGION) => {
  return `
[default]
region=${region}
output=json
  `
}

const tmplCredsFile = (aws_access_key_id = AWS_ACCESS_KEY_ID, aws_secret_access_key = AWS_SECRET_ACCESS_KEY) => {
  return `
[default]
aws_access_key_id=${aws_access_key_id}
aws_secret_access_key=${aws_secret_access_key}
`
}

if (fs.readFileSync(AWS_CONFIG_FILE_PATH).length === 0) {
  fs.appendFileSync(AWS_CONFIG_FILE_PATH, tmplConfigFile(AWS_DEFAULT_REGION))
}

if (fs.readFileSync(AWS_CRED_FILE_PATH).length === 0 && AWS_ACCESS_KEY_ID && AWS_SECRET_ACCESS_KEY) {
  fs.appendFileSync(AWS_CRED_FILE_PATH, tmplCredsFile())
}
