const EMAIL_HOST = 'https://staging-life-log-email-serv-cizi.encr.app/send'

const EMAIL_HOST_DEV = 'http://localhost:4000/send' // PRODUCTION:REMOVE

const getEmailServerUrl = () => {
  return EMAIL_HOST // PRODUCTION:UNCOMMENT
  // return EMAIL_HOST_DEV // PRODUCTION:REMOVE
}

export const sendCodeEMail = async (env: any, email: string, code: string) => {
  try {
    const data = {
      email_to: email,
      code,
      sending_site: env.SENDING_SITE,
    }

    const response = await fetch(getEmailServerUrl(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.MASTER_KEY}`,
      },
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    })

    const json = await response.json()

    console.log(`=======> sendCodeEMail send got response json`, json)
  } catch (err) {
    console.log(`=======> sendCodeEMail caught error`, err)
  }
}
