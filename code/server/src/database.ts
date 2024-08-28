const { Client } = require("pg");
import * as crypto from "./crypto"; // own set of functions for string manipulation and generation

// sets up connection to database using the correct port and password. query method is called from this object in order to pass sql queries on to the database
const pg = new Client({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "password",
  database: "postgres",
});

// connect to the database.
pg.connect();

export function disconnect() {
  pg.end();
}

// EXPLANATION OF ALL PROCEEDING METHODS =======================================================================================

// the pg.query method takes two parameters, text and values. text is a string containing the sql query. rather than inputting
// specific values, values are replaced with a dollar sign ($) followed by a number value. This value corresponds to the index
// of the values array. As stated, values is an array which containts the raw data you wish to insert into the query. The point
// of doing it this way rather than concatinating the values into the query is so the node-pg module can handle SQL injection
// attacks automatically.

// Some methods which do not return data such as those which edit account information will return a boolean to indicate if the
// query was successful, others which retrun records from the databse will return a Record<string, any> or undefined. The
// reccord is just a normal javascript object i.e. {key1: "value1", key2: "value2"}. If there was an error with the retrieval
// it will return undefined. For methods which resolve the account id using either an email or token they will return a number,
// null, or undefined. If its a number thats the id, if its null then the query was successful and there was no account found,
// if it returns undefined then there was an error with the query.

// Functions return promises because they are asyncronus as they need to wait for database query to be ran. When calling these
// functions you should use the await key word.

//==============================================================================================================================

// function sets up database by droping all old tables and creating them again. Not used by the end user, only the test file to frefresh the data.
export async function resetDatabase(): Promise<boolean> {
  try {
    const query: string =
      "drop table if exists post_comment;" +
      "drop table if exists post;" +
      "drop table if exists account;" +
      "create table account (id serial, email varchar(255), username varchar(255), pfp char(17), score int, password char(64), salt char(64), token char(64), primary key (id));" +
      "create table post (id serial, account_id int, image char(17), caption varchar(255), primary key(id), foreign key(account_id) references account(id));" +
      "create table post_comment (id serial, post_id int, account_id int, text varchar(255), primary key(id), foreign key(post_id) references post(id), foreign key(account_id) references account(id));";
    await pg.query(query);
    return true;
  } catch (error) {
    console.error("error at: database.ts, resetDatabase()\n " + error);
    return false;
  }
}

// called by the user when they want to create an account. The default values for profile picture and score are set here
export async function createAccount(
  // the data required from the user request in order to create an account.
  email: string,
  username: string,
  password: string,
  // the salt is generated in the server file, not given by user.
  salt: string
): Promise<boolean> {
  try {
    // default pfp should already exist in file system with the name "default------.png"
    // default score is 0
    // session is set to null to begin with, token will be generated when the user logs in
    const pfp: string = crypto.padString("default", ".png", 17);
    const score: number = 0;
    const session: null = null;
    const query: string =
      "insert into account (email, username, pfp, score, password, salt, token) values ($1, $2, $3, $4, $5, $6, $7);";
    const values: (string | number | null)[] = [
      email,
      username,
      pfp,
      score,
      password,
      salt,
      session,
    ];
    await pg.query(query, values);
    return true;
  } catch (error) {
    console.error(
      "error at: database.ts, createAccount(email: string, username: string, password: string, salt: string)\n " +
        error
    );
    return false;
  }
}

// retrieves all account information corresponding to account id. also retireves the password which is used for login checks
// by the server. Must be careful to not let the password out of the server therefore any data sent from the server must be
// specific.
export async function getAccount(
  // the id will not be provided by the user as they should not have access to it. rather is retrieved using a resolve method
  // and the user's email or token.
  id: number
): Promise<Record<string, any> | undefined> {
  try {
    const query: string = "select * from account where id = $1;";
    const values: number[] = [id];
    const output: Record<string, any> = await pg.query(query, values);
    return output.rows[0];
  } catch (error) {
    console.error("error at: database.ts, getAccount(id: number)\n " + error);
    return undefined;
  }
}

// retrieves the public information from all accounts for the purpose of the leaderboard. Sorts them in descending order by score
// for rankings. Does not send any private information.
export async function getAllAccounts(): Promise<
  Record<string, any>[] | undefined
> {
  try {
    const query: string =
      "select username, pfp, email, score from account order by score desc;";
    const output: Record<string, any> = await pg.query(query);
    return output.rows;
  } catch (error) {
    console.error("error at: database.ts, getAllAccounts()\n " + error);
    return undefined;
  }
}

// tries to use the input token to find the matching account id. Used for checking for session validity when returning to the site.
export async function resolveAccountIdUsingToken(
  // token is provided by the user and stored in thier browser local storage.
  token: string
): Promise<number | null | undefined> {
  try {
    const query: string = "select id from account where token = $1;";
    const values: string[] = [token];
    const output: Record<string, any> = await pg.query(query, values);
    if (output.rows.length > 0) {
      return output.rows[0].id;
    } else {
      return null;
    }
  } catch (error) {
    console.error(
      "error at: database.ts, resolveAccountIdUsingToken(token: string)\n " +
        error
    );
    return undefined;
  }
}

// same thing as above funciton however uses email instead to identify. Email is also stored in local storage
export async function resolveAccountIdUsingEmail(
  email: string
): Promise<number | null | undefined> {
  try {
    const query: string = "select id from account where email = $1;";
    const values: string[] = [email];
    const output: Record<string, any> = await pg.query(query, values);
    if (output.rows.length > 0) {
      return output.rows[0].id;
    } else {
      return null;
    }
  } catch (error) {
    console.error(
      "error at: database.ts, resolveAccountIdUsingEmail(email: string)\n " +
        error
    );
    return undefined;
  }
}

// changes the email for the account identified by id
export async function editAccountEmail(
  id: number,
  email: string
): Promise<boolean> {
  try {
    const query: string = "update account set email = $1 where id = $2;";
    const values: (string | number)[] = [email, id];
    await pg.query(query, values);
    return true;
  } catch (error) {
    console.error(
      "error at: database.ts, editAccountEmail(id: number, email: string)\n " +
        error
    );
    return false;
  }
}

// same as above for username
export async function editAccountUsername(
  id: number,
  username: string
): Promise<boolean> {
  try {
    const query: string = "update account set username = $1 where id = $2;";
    const values: (string | number)[] = [username, id];
    await pg.query(query, values);
    return true;
  } catch (error) {
    console.error(
      "error at: database.ts, editAccountUsername(id: number, username: string)\n " +
        error
    );
    return false;
  }
}

// same as above for pfp. The pfp is a string matching an image file name which is automatically generated in the server.
export async function editAccountPfp(
  id: number,
  pfp: string
): Promise<boolean> {
  try {
    const query: string = "update account set pfp = $1 where id = $2;";
    const values: (string | number)[] = [pfp, id];
    await pg.query(query, values);
    return true;
  } catch (error) {
    console.error(
      "error at: database.ts, editAccountPfp(id: number, pfp: string)\n " +
        error
    );
    return false;
  }
}

// same as above for password. Takes the hashed password which is generated in the server.
export async function editAccountPassword(
  id: number,
  password: string
): Promise<boolean> {
  try {
    const query: string = "update account set password = $1 where id = $2;";
    const values: (string | number)[] = [password, id];
    await pg.query(query, values);
    return true;
  } catch (error) {
    console.error(
      "error at: database.ts, editAccountPassword(id: number, password: string)\n " +
        error
    );
    return false;
  }
}

// same as above for score. The change of score relative to old score is handled in the server.
export async function editAccountScore(
  id: number,
  score: number
): Promise<boolean> {
  try {
    const query: string = "update account set score = $1 where id = $2;";
    const values: number[] = [score, id];
    await pg.query(query, values);
    return true;
  } catch (error) {
    console.error(
      "error at: database.ts, editAccountScore(id: number, score: number)\n " +
        error
    );
    return false;
  }
}

// same as above from token. Token generation is handled in the server.
export async function editAccountToken(
  id: number,
  token: string | null
): Promise<boolean> {
  try {
    const query: string = "update account set token = $1 where id = $2;";
    const values: (string | number | null)[] = [token, id];
    await pg.query(query, values);
    return true;
  } catch (error) {
    console.error(
      "error at: database.ts, editAccountToken(id: number, token: string | null)\n " +
        error
    );
    return false;
  }
}

// used to delete an account. not yet implemented in front end.
export async function deleteAccount(id: number): Promise<boolean> {
  try {
    const query: string = "delete from account where id = $1;";
    const values: number[] = [id];
    await pg.query(query, values);
    return true;
  } catch (error) {
    console.error(
      "error at: database.ts, deleteAccount(id: number)\n " + error
    );
    return false;
  }
}

// used to create a post. Requires the id of the user who is creaing the post so it can be bound to them.
export async function createPost(
  // account id is resolved in the server
  accountId: number,
  image: string,
  caption: string
): Promise<boolean> {
  try {
    const query: string =
      "insert into post (account_id, image, caption) values ($1, $2, $3);";
    const values: (string | number)[] = [accountId, image, caption];
    await pg.query(query, values);
    return true;
  } catch (error) {
    console.error(
      "error at: database.ts, createPost(accountId: number, image: string, caption: string)\n " +
        error
    );
    return false;
  }
}

// gets all posts tied to the specified account. This is why the account id is needed when creating a post otherwise
// there would be no wayto know what posts belong to you.
export async function getPostsFromAccount(
  // id resolved in server.
  id: number
): Promise<Record<string, any>[] | undefined> {
  try {
    const query: string =
      "select * from post where account_id = $1 order by id desc;";
    const values: number[] = [id];
    const output: Record<string, any> = await pg.query(query, values);
    return output.rows;
  } catch (error) {
    console.error(
      "error at: database.ts, getPostsFromAccount(id: number)\n " + error
    );
    return undefined;
  }
}

// gets all posts regardless of who posted them. Sorts them by newest first so they can be displayed in the user's feed.
export async function getAllPosts(): Promise<
  Record<string, any>[] | undefined
> {
  try {
    const query: string =
      "select post.id, image, caption, username, pfp from post left join account on account.id = post.account_id order by post.id desc;";
    const output: Record<string, any> = await pg.query(query);
    return output.rows;
  } catch (error) {
    console.error("error at: database.ts, getAllPosts()\n " + error);
    return undefined;
  }
}

// used the change the caption on the post. Not yet implemented in server or frontend.
export async function editPostCaption(
  id: number,
  caption: string
): Promise<boolean> {
  try {
    const query: string = "update post set caption = $1 where id = $2;";
    const values: (string | number)[] = [caption, id];
    await pg.query(query, values);
    return true;
  } catch (error) {
    console.error(
      "error at: database.ts, editPostCaption(id: number, caption: string)\n " +
        error
    );
    return false;
  }
}

// used to delete post, not yet implemented in server or frontend.
export async function deletePost(id: number): Promise<boolean> {
  try {
    const query: string = "delete from post where id = $1;";
    const values: number[] = [id];
    await pg.query(query, values);
    return true;
  } catch (error) {
    console.error("error at: database.ts, deletePost(id: number)\n " + error);
    return false;
  }
}

// used to create a comment. This time needs the id of the user creating the comment and the id of the post being commented on.
export async function createComment(
  // resolved in the server
  accountId: number,
  // provided by the front end code
  postId: number,
  text: string
): Promise<boolean> {
  try {
    const query: string =
      "insert into post_comment (post_id, account_id, text) values ($1, $2, $3);";
    const values: (string | number)[] = [postId, accountId, text];
    await pg.query(query, values);
    return true;
  } catch (error) {
    console.error(
      "error at: database.ts, createComment(accountId: number, postId: number, text: string)\n " +
        error
    );
    return false;
  }
}

// used to delete a comment. not yet implemented in server or front end.
export async function deleteComment(id: number): Promise<boolean> {
  try {
    const query: string = "delete from post_comment where id = $1;";
    const values: number[] = [id];
    await pg.query(query, values);
    return true;
  } catch (error) {
    console.error(
      "error at: database.ts, deleteComment(id: number)\n " + error
    );
    return false;
  }
}

// used to edit the text of a comment, not yet implemented in server or front end.
export async function editCommentText(
  id: number,
  text: string
): Promise<boolean> {
  try {
    const query: string = "update post_comment set text = $1 where id = $2;";
    const values: (string | number)[] = [text, id];
    await pg.query(query, values);
    return true;
  } catch (error) {
    console.error(
      "error at: database.ts, editCommentText(id: number, text: string)\n " +
        error
    );
    return false;
  }
}

// used to get all comments made on a specific post. sorts them with oldest first to look more like a thread.
export async function getCommentsOnPost(
  // provided by front end code.
  id: number
): Promise<Record<string, any>[] | undefined> {
  try {
    const query: string =
      "select post_comment.id, post_comment.text, account.username from post_comment left join account on post_comment.account_id = account.id where post_id = $1 order by post_comment.id asc;";
    const values: number[] = [id];
    const output: Record<string, any> = await pg.query(query, values);
    return output.rows;
  } catch (error) {
    console.error(
      "error at: database.ts, getCommentsOnPost(id: number)\n " + error
    );
    return undefined;
  }
}
