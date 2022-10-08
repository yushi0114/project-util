import path from 'path'
import { NodeSSH } from 'node-ssh'
import './config'

// const bundleFile = `${process.env.BUNDLE_DIR}.zip` as string
const ssh = new NodeSSH()

function connect() {
  return ssh.connect({
    host: process.env.SSH_REMOTE_HOST,
    username: process.env.SSH_REMOTE_USER,
    privateKeyPath: process.env.SSH_PRIVATEKEY,
  })
}

async function upload() {
  await ssh.execCommand('rm -rf ./*.*.zip', { cwd: process.env.SSH_REMOTE_DIR })
  return ssh.putDirectory(
    path.join(process.env.BUNDLE_DIR as string),
    path.join(process.env.SSH_REMOTE_DIR as string),
    { recursive: true, concurrency: 10 },
  )
}

function execShell() {
  return ssh.execCommand('chmod a+x ./go.sh & sh ./go.sh', { cwd: process.env.SSH_REMOTE_DIR })
}

function deploy() {
  connect()
    .catch((e) => {
      globalThis.console.log('ssh login failed.', e)
      return Promise.reject(new Error('ssh upload failed: login failed'))
    })
    .then(() => {
      globalThis.console.log('ssh login succeed.')
      return upload()
    })
    .catch((e) => {
      globalThis.console.log('upload failed.', e)
      return Promise.reject(e)
    })
    .then(() => {
      globalThis.console.log('upload succeed.')
      return execShell()
    })
    .catch((e) => {
      globalThis.console.log('exec shell failed.', e)
      return Promise.reject(e)
    })
    .then(() => {
      globalThis.console.log('exec shell succeed.')
      globalThis.console.log('deploy succeed.')
    })
    .finally(() => {
      process.exit(0)
    })
}

deploy()

