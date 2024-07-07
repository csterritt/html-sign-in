import { runDatabaseAction } from './run-db-action'

export const getUserLogLines = async (context: any, personId: number) => {
  const sql = `
    select lineId as Id, content as Content, group_concat(t.Tag || '/' || t.Id, ',') as Tags
      from (
        select l.Id as lineId, l.Content as content, j.TagId as tagsId
        from LogLines l
          left join LLTagLine j
              on l.Id = j.LogLineId
          where l.PersonId = ?
      )
      left join LLTag t
        on tagsId = t.Id
      group by lineId
  ;
  `
  return runDatabaseAction(context, sql, personId)
}
