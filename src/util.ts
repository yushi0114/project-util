import { createReadStream, createWriteStream, existsSync } from 'fs'
import { mkdir as mkDir, readdir, rmdir, stat, unlink } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { zip } from 'compressing'

export const __filename = (metaurl: string) => fileURLToPath(metaurl)
export const __dirname = (metaurl: string) => path.dirname(__filename(metaurl))

export function mkdir(url: string) {
  if (!existsSync(url))
    return mkDir(url)
  return Promise.resolve()
}

export function deldir(url: string) {
  if (!existsSync(url))
    return Promise.resolve('url not exist')

  return readdir(url)
    .then((items) => {
      const itemPromises: Promise<any>[] = items.map((item) => {
        const itemPath = path.join(url, item)
        return stat(itemPath)
          .then<any>((st) => {
            return st.isDirectory()
              ? deldir(itemPath)
              : unlink(itemPath)
          })
      })

      return Promise.all(itemPromises)
    })
    .then(() => rmdir(url))
}

export async function copyDir(from: string, to: string) {
  if (!existsSync(from))
    return Promise.resolve('url not exist')

  if (existsSync(to))
    await deldir(to)

  await mkDir(to)

  const items = await readdir(from)
  items.forEach(async (item) => {
    const fromUrl = path.join(from, item)
    const toUrl = path.join(to, item)
    const st = await stat(fromUrl)
    if (st.isDirectory())
      await moveFile(fromUrl, toUrl)
    else
      await copyDir(fromUrl, toUrl)
  })
}

export function zipDir(path: string, to?: string) {
  to = to || `${path}.zip`
  return zip.compressDir(path, to)
}

export function moveFile(from: string, to: string) {
  return new Promise((resolve, reject) => {
    const readStream = createReadStream(from)
    const writeStream = createWriteStream(to)

    readStream.pipe(writeStream)
    readStream.on('end', resolve)
    readStream.on('error', reject)

    writeStream.on('error', reject)
  })
}

export function toDouble(n: any) {
  const num = parseInt(n)
  return isNaN(num) || num >= 10 ? `${num}` : `0${num}`
}

export function genDateString() {
  const d = new Date()
  const dbl = toDouble
  return `${dbl(d.getMonth() + 1)}${dbl(d.getDate())}-${dbl(d.getHours())}${dbl(d.getMinutes())}`
}

export function identity(o: any) {
  return !!o
}

