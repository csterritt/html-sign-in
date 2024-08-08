import * as fs from 'fs'
import { exec } from 'child_process'

export const getOneUseCode = async () => {
  return new Promise<string>((resolve) => {
    exec(
      '/usr/bin/env npm run setup-random-sign-up-code | /usr/bin/env tail -1',
      (err, stdout) => {
        if (err != null) {
          throw `getOneUseCode got error ${err.toString()}`
        }

        resolve(stdout)
      }
    )
  })
}

export const removeTemporaryUser = async (
  randomCode: string,
  emailAddress: string,
  isRemoteDb?: boolean
) => {
  return new Promise((resolve) => {
    const content = `
delete from HSIPeople where Email = '${emailAddress}';
delete from HSISignUpCodes where Email = '${emailAddress}';
`
    const fileName = `/tmp/db-script-${randomCode}`
    let localOnly = ''
    if (isRemoteDb === true) {
      localOnly = '--remote'
    }

    fs.writeFileSync(fileName, content)
    exec(
      `wrangler d1 execute html-sign-in-db ${localOnly} --file=${fileName}`,
      (error) => {
        if (error != null) {
          console.log(`wrangler exec caught error`, error)
        }

        fs.unlinkSync(fileName)
        resolve(true)
      }
    )
  })
}
