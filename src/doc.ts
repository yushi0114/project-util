import { writeFileSync } from 'fs'
import jsdoc2md from 'jsdoc-to-markdown'
const PROJECT_DIR = '../melib'

const services = [
  'melib-product-service',
  // 'melib-req-service',
  // 'melib-sys-service',

]

function genDoc() {
  services.forEach(async (s) => {
    const doc = jsdoc2md.renderSync({
      files: `${PROJECT_DIR}/${s}/routes/*-route.js`,
    })
    const docFileName = `${PROJECT_DIR}/build/${s}.md`
    writeFileSync(docFileName, doc)
  })
}

// const PROJECT_DIR = '../melib/*-service/routes/*-route.js'
// const PROJECT_DIR = '../melib/melib-product-service/routes/product-req-route.js'

genDoc()

