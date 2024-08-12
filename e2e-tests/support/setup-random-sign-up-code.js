import * as fs from 'fs'
import { exec } from 'child_process'

const getRandomInt = (max) => Math.floor(Math.random() * max)

const letters = [
  '3',
  '4',
  '7',
  'A',
  'C',
  'E',
  'H',
  'K',
  'L',
  'M',
  'N',
  'P',
  'R',
  'T',
  'W',
  'X',
  'Y',
]
export const buildSignUpCode = () => {
  let res = ''
  for (let i = 0; i < 8; i += 1) {
    res += letters[getRandomInt(letters.length)]
  }

  return res
}

const main = async (forProduction) => {
  const randomCode = buildSignUpCode()
  console.log(randomCode)
  const content = `INSERT INTO HSISignUpCodes (Code, Email) values ('${randomCode}', 'not an email');`
  const fileName = `/tmp/db-script-${randomCode}`

  fs.writeFileSync(fileName, content)
  let localOnly = '--local'
  if (forProduction) {
    localOnly = ''
  }
  exec(
    `wrangler d1 execute html-sign-in-db ${localOnly} --file=${fileName}`,
    (error) => {
      if (error != null) {
        console.log(`wrangler exec caught error`, error)
      }

      fs.unlinkSync(fileName)
    }
  )
}

main(process.argv[2] === 'prod').then(() => {})
