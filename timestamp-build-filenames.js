import fs from 'fs'
import { globby } from 'globby'

const distFilenameMatcher = /dist\/(.*?)XXXXXX(.*?)$/

const buildPairs = (paths) => {
  const renamePairs = []
  const now = new Date().getTime()

  paths.forEach((path) => {
    const match = distFilenameMatcher.exec(path)
    const prefix = match[1]
    const suffix = match[2]
    const renameTo = `${prefix}${now}${suffix}`
    fs.renameSync(path, 'dist/' + renameTo)
    renamePairs.push([`${prefix}XXXXXX${suffix}`, renameTo])
  })

  return renamePairs
}

const fixFiles = (paths, pairs) => {
  paths.forEach((path) => {
    let content = fs.readFileSync(path, 'utf8')
    let changed = false
    for (let pair of pairs) {
      while (content.indexOf(pair[0]) > -1) {
        changed = true
        content = content.replace(pair[0], pair[1])
      }
    }

    if (changed) {
      fs.writeFileSync(path, content)
    }
  })
}

console.log(`Entering timestamp-build-filenames.js`)
let paths = await globby(['dist/**/*'])
console.log(`... found ${paths.length} files in the project`)

const pairs = buildPairs(
  paths.filter((filename) => filename.indexOf('XXXXXX') !== -1)
)

console.log(`... found ${pairs.length} pairs to rename`)

paths = await globby(['dist/**/*'])
console.log(`... about to fix files`)
fixFiles(paths, pairs)
console.log(`... done!`)
