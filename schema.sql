DROP TABLE IF EXISTS HSICounts;
PRAGMA foreign_keys = ON;

DROP TABLE IF EXISTS HSIPeople;
CREATE TABLE HSIPeople (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Email TEXT NOT NULL,
    IsVerified INTEGER NOT NULL,
    AddedTimestamp TEXT NOT NULL);
DROP INDEX IF EXISTS idx_hsipeople_email;
CREATE UNIQUE INDEX idx_hsipeople_email ON HSIPeople(Email);

DROP TABLE IF EXISTS HSISession;
CREATE TABLE HSISession (
        Id INTEGER PRIMARY KEY AUTOINCREMENT,
        PersonId INTEGER NOT NULL,
        Session TEXT NOT NULL,
        Timestamp TEXT NOT NULL,
        SignedIn INTEGER NOT NULL,
        Content TEXT NOT NULL);
DROP INDEX IF EXISTS idx_hsisession_session;
CREATE UNIQUE INDEX idx_hsisession_session ON HSISession(Session);

DROP TABLE IF EXISTS HSISignUpCodes;
CREATE TABLE HSISignUpCodes (
        Code TEXT PRIMARY KEY,
        Email Text NOT NULL);

INSERT INTO HSIPeople (Id, Email, IsVerified, AddedTimestamp) values
    (1, 'fredfred@team439980.testinator.com', 1, '2023-11-25T16:28:15.310Z');
INSERT INTO HSIPeople (Id, Email, IsVerified, AddedTimestamp) values
    (2, 'csterritt@gmail.com', 1, '2023-11-25T16:28:15.310Z');
INSERT INTO HSISignUpCodes (Code, Email) values ('asdfasdf', 'not an email');
