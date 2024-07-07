export const runDatabaseAction = async (
  context: any,
  statement: string,
  ...args: any[]
) =>
  context.env.HTML_SIGN_IN_DB.prepare(statement)
    .bind(...args)
    .all()
