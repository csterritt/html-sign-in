const EMAIL_HOST = 'https://staging-life-log-email-serv-cizi.encr.app/send'


const getEmailServerUrl = () => {
  return EMAIL_HOST // PRODUCTION:UNCOMMENT
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
