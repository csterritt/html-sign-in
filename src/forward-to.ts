import { StatusCodes } from 'http-status-codes'

import { ForwardOptions, LocalContext } from './bindings'

export const forwardTo = (
  c: LocalContext,
  path: string,
  options?: ForwardOptions
) => {
  const headers: any = {
    status: StatusCodes.SEE_OTHER.toString(),
    Location: path,
    Refresh: `0; url=${path}`,
  }

  return c.newResponse(null, StatusCodes.SEE_OTHER, headers)
}
