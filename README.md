## Allow sign up via email magic code, html forms only, as a base for projects

- Let users sign in, sign out, and optionally sign up
    - If you can't sign up, an admin will have to add users directly to a database
- They sign in/up via a one-time code emailed to them, so there are no passwords.
- There are pages that you can access only if you're signed in

It is built using:

- Typescript
- Cloudflare pages and page functions
- Hono
- Cloudflare D1 database
- An SMTP-capable email sending service (e.g., Purelymail.com)
- The session is just a single random-text cookie, so you can sign in on multiple devices
- There is no JavaScript on the pages themselves, it's pure HTML forms
    - Optionally, there could be JavaScript to (e.g.) prevent form submission without required fields

### To make it work:

1. Set up a database, e.g.:

```
   wrangler d1 create html-sign-in-db
```

This will produce lines of the form:

```
   [[d1_databases]]
   binding = "DB" # i.e. available in your Worker on env.DB
   database_name = "html-sign-in-db"
   database_id = "long-database-id-for-your-database"
```

2. Add those lines to the end of your `wrangler.toml` file
   (*note*: `wrangler.toml` doesn't have a newline at the end, make sure you add one before pasting)

3. Set up a `schema.sql` file (or whatever name you want), e.g.:

```
   DROP TABLE IF EXISTS Counts;
   CREATE TABLE HSICounts (
   UserId INTEGER PRIMARY KEY AUTOINCREMENT,
   Val INTEGER NOT NULL);

   INSERT INTO HSICounts (UserId, Val) values
   (1, 0);
```

4. Insert the schema into the local database (`html-sign-in-db` is the `database_name` referenced above):

```
   wrangler d1 execute html-sign-in-db --file=./schema.sql
```

Now you can run as usual, and the code will be able to read and write the database.
