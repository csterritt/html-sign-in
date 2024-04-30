### This project is a website to:

- Let users sign in, sign out, and optionally sign up
    - If you can't sign up, an admin will have to add users directly to a database
- They sign in/up via a one-time code emailed to them, so there are no passwords.
- There are pages that you can access only if you're signed in

It is built using:

- Typescript
- Cloudflare pages and page functions
- Cloudflare D1 database
- An SMTP-capable email sending service (e.g., Purelymail.com)
- The session is just a single random-text cookie, so you can sign in on multiple devices
- There is no JavaScript on the pages themselves, it's pure HTML forms
    - Optionally, there could be JavaScript to (e.g.) prevent form submission without required fields
