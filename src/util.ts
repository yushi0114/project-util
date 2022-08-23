import { createReadStream, createWriteStream, existsSync } from 'fs'
import { readdir, rmdir, stat, unlink } from 'fs/promises'
import path from 'path'
import { zip } from 'compressing'

export function deldir(url: string) {
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

export function zipDir(path: string) {
  return zip.compressDir(path, `${path}.zip`)
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
