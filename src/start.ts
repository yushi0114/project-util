import { exec } from 'child_process'
import path from 'path'
import './config'
import { identity } from './util'

const PROJECT_DIR = process.env.PROJECT_DIR as string
const SERVICE_DIRS = (process.env.ZIP_PROJECTS_DIRS || '').split(',').filter(identity)
const WEB_DIRS = (process.env.BUILD_ZIP_PROJECTS_DIRS || '').split(',').filter(identity)
const projectDirs = [...SERVICE_DIRS, ...WEB_DIRS]

projectDirs.forEach((dir) => {
  const projectPath = path.join(PROJECT_DIR, dir)
  exec(`cd ${projectPath} & npm run start`, (err, stdout, stderr) => {
    if (err)
      globalThis.console.error(err)

    if (stdout)
      globalThis.console.log(stdout)

    if (stderr)
      globalThis.console.error(stderr)
  })
})
