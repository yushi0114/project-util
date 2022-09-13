import { exec } from 'child_process'
import { mkdir, unlink } from 'fs/promises'
import path from 'path'
import { copyDir, copyFile, deldir, genDateString, zipDir } from './util'

const PROJECT_DIR = '../melib'
const BUNDLE_DIRNAME = 'build'
const ZIP_DIRS = [
  'melib-product-service',
  'melib-req-service',
  'melib-sys-service',
]

const BUILD_ZIP_DIR = [
  'melib-web',
]

const BUNDLE_DIR = `${PROJECT_DIR}/${BUNDLE_DIRNAME}`
const dateString = genDateString()

await deldir(BUNDLE_DIR)
await mkdir(BUNDLE_DIR)
const zipPromises = ZIP_DIRS.map((dir) => {
  const from = path.join(PROJECT_DIR, dir)
  const to = path.join(BUNDLE_DIR, `${dir}.${dateString}.zip`)

  return deldir(`${from}_tmp`)
    // .then(() => copyDir(from, `${from}_tmp`))
    // .then(() => deldir(path.join(`${from}_tmp`, '/.git')))
    .then(() => zipDir(from, to))
})

const buildZipPromises = BUILD_ZIP_DIR.map((dir) => {
  const from = path.join(PROJECT_DIR, dir)

  const buildPromise = new Promise((resolve, reject) => {
    exec(`cd ${from} && npm run build`, (err, stdout) => {
      if (err) {
        reject(err)
      }
      else {
        globalThis.console.log(stdout)
        resolve(stdout)
      }
    })
  })

  return buildPromise.then(() => {
    const from = path.join(PROJECT_DIR, dir, dir)
    const to = path.join(BUNDLE_DIR, `${dir}.${dateString}.zip`)
    return zipDir(from, to)
      .then(() => copyFile(`${from}.zip`, to))
      .then(() => unlink(`${from}.zip`))
  })
})

const moveShellPromise = copyFile(path.join(PROJECT_DIR, './go.sh'), path.join(BUNDLE_DIR, './go.sh'))

await Promise.all([
  ...zipPromises,
  ...buildZipPromises,
  moveShellPromise,
])
