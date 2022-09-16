import { exec } from 'child_process'
import { mkdir, writeFile } from 'fs/promises'
import { promisify } from 'util'
import path from 'path'
import { copy, remove } from 'fs-extra'
import './config'
import { genDateString, identity, zipDir } from './util'

const removeAsync = promisify(remove)
const execAsync = promisify(exec)

const dateString = genDateString()

const PROJECT_DIR = process.env.PROJECT_DIR as string
const BUNDLE_DIR = process.env.BUNDLE_DIR as string

const ZIP_DIRS = (process.env.ZIP_PROJECTS_DIRS || '').split(',').filter(identity)
const BUILD_ZIP_DIRS = (process.env.BUILD_ZIP_PROJECTS_DIRS || '').split(',').filter(identity)

// 重新生成打包目录
await removeAsync(BUNDLE_DIR)
await mkdir(BUNDLE_DIR)

// zip *.service
const zipPromises = ZIP_DIRS.map(async (dir) => {
  const from = path.join(PROJECT_DIR, dir)
  const to = path.join(BUNDLE_DIR, dir)
  await copy(from, to)
  await removeAsync(path.join(to, './.git'))
  await zipDir(to, `${to}.${dateString}.zip`)
  await removeAsync(to)
})

// zip *.web
const buildZipPromises = BUILD_ZIP_DIRS.map(async (dir) => {
  const from = path.join(PROJECT_DIR, dir)

  await execAsync(`cd ${from} & npm run build`)

  const fromDist = path.join(PROJECT_DIR, dir, dir)
  const toDist = path.join(BUNDLE_DIR, dir)

  await zipDir(fromDist, `${toDist}.${dateString}.zip`)
})

// 生成服务端执行脚本
function genShellPromise() {
  const serviceUnmountStr = !ZIP_DIRS.length
    ? ''
    : `
pm2 stop ${ZIP_DIRS.join(' ')}
rm -rf ${ZIP_DIRS.join(' ')}
    `
  const webHandleStr = !BUILD_ZIP_DIRS.length
    ? ''
    : `
rm -rf ${BUILD_ZIP_DIRS.join(' ')}
    `

  const unzipHandleStr = [...BUILD_ZIP_DIRS, ...ZIP_DIRS].reduce((str: string, dir: string) => {
    return `
${str}
unzip ${dir}.${dateString}.zip
`
  }, '')

  const serviceMountStr = !ZIP_DIRS.length
    ? ''
    : ZIP_DIRS.reduce((str, dir) => {
      return `
${str}

cd ${process.env.SSH_REMOTE_DIR}/${dir}
npm run pm2:test
`
    }, '')

  const shell = `
#!/bin/bash

echo "Hi!"
    
${serviceUnmountStr}

${webHandleStr}

${unzipHandleStr}
    
${serviceMountStr}
`

  return writeFile(path.join(BUNDLE_DIR, './go.sh'), shell, { encoding: 'utf-8' })
}

await Promise.all([
  ...zipPromises,
  ...buildZipPromises,
  genShellPromise(),
])

// await zipDir(BUNDLE_DIR, `${BUNDLE_DIR}.zip`)
// await move(`${BUNDLE_DIR}.zip`, `${BUNDLE_DIR}/${BUNDLE_DIR}.zip`)
