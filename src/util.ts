import { createReadStream, createWriteStream, existsSync, readFileSync, writeFileSync } from 'fs'
import { mkdir, readdir, rmdir, stat, unlink } from 'fs/promises'
import path from 'path'
import { zip } from 'compressing'

export function deldir(url: string): Promise<any> {
  if (existsSync(url)) {
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

  return Promise.resolve('url not exist')
}

export function zipDir(path: string, to?: string) {
  return zip.compressDir(path, to || `${path}.zip`)
}

export function copyFile(from: string, to: string) {
  return new Promise((resolve, reject) => {
    const readStream = createReadStream(from)
    const writeStream = createWriteStream(to)

    readStream.pipe(writeStream)
    readStream.on('end', resolve)
    readStream.on('error', reject)

    writeStream.on('error', reject)
  })
}

export async function copyDir(from: string, to: string) {
  if (existsSync(to))
    await deldir(to)

  await mkdir(to)

  const paths = await readdir(from)
  paths.forEach(async (p) => {
    const _from = `${from}/${p}`
    const _to = `${to}/${p}`

    const st = await stat(_from)
    if (st.isFile())
      await writeFileSync(_to, readFileSync(_from))
    else if (st.isDirectory())
      await copyDir(_from, _to)
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
