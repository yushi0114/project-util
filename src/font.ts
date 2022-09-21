import { readFile } from 'fs/promises'
import path from 'path'
import Fontmin from 'fontmin'
import {
  __dirname,
  mkdir,
} from './util'

function resolveCurPath(url: string) {
  return path.resolve(__dirname(import.meta.url), url)
}

const destDir = resolveCurPath('../dist')

await mkdir(destDir)
const text = await readFile(resolveCurPath('./font-collection.txt'), { encoding: 'utf-8' })

const fontmin = new Fontmin()

fontmin
  .src(resolveCurPath('./assets/douyuFont-2.ttf'))
  .use(Fontmin.glyph({
    text,
  }))
  .dest(destDir)
  .run((err: Error, files) => {
    if (err)
      throw err

    globalThis.console.log(files[0])
  })
