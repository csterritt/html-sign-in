import fs from 'fs'
import { globby } from 'globby'

const distFilenameMatcher = /dist\/(.*?)XXXXXX(.*?)$/

const buildPairs = (paths) => {
  const renamePairs = []

  paths.forEach((path) => {
    const match = distFilenameMatcher.exec(path)
    const prefix = match[1]
    const suffix = match[2]
    const now = new Date().getTime()
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

let paths = await globby(['dist/**/*'])

const pairs = buildPairs(
  paths.filter((filename) => filename.indexOf('XXXXXX') !== -1)
)

paths = await globby(['dist/**/*'])
fixFiles(paths, pairs)
