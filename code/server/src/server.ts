// express for REST API, cors for server access, multer for file storage, path for file storage.
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const server = express();
const port = 5000;

// own functions for interacting with database and string manipulation.
import * as database from "./database";
import * as crypto from "./crypto";

// allow access from localhost:3000 which is where the front end is running
server.use(cors({ origin: "http://localhost:3000" }));
server.use(express.urlencoded({ extended: false }));
server.use(express.json());

// sets up multer middleware to store files with file names generated based on the input file name and the current time. Ensures all file names are unique.
const storage = multer.diskStorage({
  destination: (request: any, file: any, callback: any) => {
    callback(null, "./images");
  },
  filename: (request: any, file: any, callback: any) => {
    console.log(file);
    callback(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// EXPLANATION OF ALL PROCEEDING METHODS =======================================================================================

// The database methods were made to not contain any website related logic such as token checking. All of those things are
// handled in these functions. Some of these functions just pass on infromation from the request to the database functions,
// while others perform hashing and checks.

// If there are any functions which require an id such as those to edit account information, the id must be resolved first.

// after each database function i check to see the outcome, if its as intended the response is set to 200 meaning OK, if
// something returns as null then the respone is set to 400 meaning the function ran fine, the input data was wrong. If something
// returns undefined the response is 500 meaning there was an error not at the fault of the provided data. A message explaining
// what failed is displayed in the console.

// Making these checks after every database call can create a fair few nested if statements like in login for example. It's not
// the best to read but is required in order to be specific as to exactly what operation failed.

// when checking if something is null strict equality (===) must be used in order to differenciate between null and undefined.
// Undefined doesnt get checked for specifially, if there is an else with no condition that is checking for undefined.

//==============================================================================================================================

// upload post, information is in request body
server.post(
  "/create/post",
  // call to upload image using multer
  upload.single("image"),
  async (request: any, response: any) => {
    const email: string = request.body.email;
    const image: string = request.file.filename;
    const caption: string = request.body.caption;
    const id: number | null | undefined =
      await database.resolveAccountIdUsingEmail(email);
    if (id) {
      const creationSuccess: boolean = await database.createPost(
        id,
        image,
        caption
      );
      if (creationSuccess) {
        const accountData: Record<string, any> | undefined =
          await database.getAccount(id);
        if (accountData) {
          // gets account data to find old score. Increments score by 1 meaning each post increases account score by 1.
          const oldScore: number = accountData.score;
          const newScore: number = oldScore + 1;
          const editSuccess: boolean = await database.editAccountScore(
            id,
            newScore
          );
          if (editSuccess) {
            response.status(200);
            response.send("Post creation successful.");
          } else {
            console.error("server: account score change failed.");
            response.status(500);
            response.send("Server error.");
          }
        } else {
          console.error("server: account data retrieval failed.");
          response.status(500);
          response.send("Server error.");
        }
      } else {
        console.error("server: post creation failed.");
        response.status(500);
        response.send("Server error.");
      }
    } else if (id === null) {
      response.status(400);
      response.send("Email not found.");
    } else {
      console.error("server: id retrieval using email failed.");
      response.status(500);
      response.send("Server error.");
    }
  }
);

// get feed. returns all posts in order.
server.get("/get/posts/all", async (request: any, response: any) => {
  const posts: Record<string, any>[] | undefined = await database.getAllPosts();
  if (posts) {
    response.status(200);
    response.send(posts);
  } else {
    console.error("server: post retrieval failed.");
    response.status(500);
    response.send("Server error.");
  }
});

// insert user. used for account creation. Default values are handled in the databse function.
server.post("/create/account", async (request: any, response: any) => {
  const email: string = request.body.email;
  const username: string = request.body.username;
  const plainPassword: string = request.body.password;
  const salt: string = crypto.randomString();
  const hashedPassword: string = crypto.hash(salt + plainPassword);
  // check to see if the email already exists. Tries to resolve the id of the email wanted by the user.
  // if an id comes back that means the email is in use and the user will have to find another.
  const conflictingAccountId: number | null | undefined =
    await database.resolveAccountIdUsingEmail(email);
  if (conflictingAccountId) {
    response.status(400);
    response.send("Email already exists.");
  } else if (conflictingAccountId === null) {
    const success: boolean = await database.createAccount(
      email,
      username,
      hashedPassword,
      salt
    );
    if (success) {
      response.status(200);
      response.send("Account creation successful.");
    } else {
      console.error("server: account creation failed.");
      response.status(500);
      response.send("Server error.");
    }
  } else {
    console.error("server: existing email check failed.");
    response.status(500);
    response.send("Server error.");
  }
});

// remove user. Not accessible from the front end.
server.delete("/delete/account", async (request: any, response: any) => {
  const id: number = request.body.id;
  const success: boolean = await database.deleteAccount(id);
  if (success) {
    response.status(200);
    response.send("Account deletion successful.");
  } else {
    console.error("server: account deletion failed.");
    response.status(400);
    response.send("Server error.");
  }
});

// validate user. Takes the user's token which was provided on login. Checks to see if there is an account using that token.
// if yes that means the account is still logged in. A new token is generated and returned so it can replace the old one.
// If the user is not logged in the front end code sends them back to the login page.
server.post("/refresh/token", async (request: any, response: any) => {
  const oldToken: string = request.body.token;
  const id: number | null | undefined =
    await database.resolveAccountIdUsingToken(oldToken);
  if (id) {
    let newToken: string = "";
    let conflictingAccountId: number | null | undefined = 0;
    // while loops generates new token and checks if its in use. If it is in use creates another until it finds one that is free.
    // This is needed to ensure only one account can ever be resolved using a certain token.
    while (conflictingAccountId != null && conflictingAccountId != undefined) {
      newToken = crypto.randomString();
      conflictingAccountId = await database.resolveAccountIdUsingToken(
        newToken
      );
    }
    if (conflictingAccountId === null && newToken != "") {
      const success: boolean = await database.editAccountToken(id, newToken);
      if (success) {
        response.status(200);
        response.send(newToken);
      } else {
        console.error("server: token edit failed.");
        response.status(500);
        response.send("Server error.");
      }
    } else {
      console.error("server: check for existing token failed.");
      response.status(500);
      response.send("Server error.");
    }
  } else if (id === null) {
    response.status(400);
    response.send("Token is invalid.");
  } else {
    console.error("server: Account id retrieval failed.");
    response.status(500);
    response.send("Server error.");
  }
});

// log in. Takes email and plain password. Resolved the id using the email, gets the user's hashed password and salt. Uses the salt
// to hash the plain password and check against the stored hashed password. If they match a session token is generated and returned
// to the user to be stored by thier browser.
server.post("/login", async (request: any, response: any) => {
  const email: string = request.body.email;
  const plainPassword: string = request.body.password;
  const id: number | null | undefined =
    await database.resolveAccountIdUsingEmail(email);
  if (id) {
    const accountInfo: Record<string, any> | undefined =
      await database.getAccount(id);
    if (accountInfo) {
      const hashedPassword: string = crypto.hash(
        accountInfo.salt + plainPassword
      );
      if (hashedPassword == accountInfo.password) {
        let token: string = "";
        let conflictingAccountId: number | null | undefined = 0;
        // while loops generates new token and checks if its in use. If it is in use creates another until it finds one that is free.
        // This is needed to ensure only one account can ever be resolved using a certain token.
        while (
          conflictingAccountId != null &&
          conflictingAccountId != undefined
        ) {
          token = crypto.randomString();
          conflictingAccountId = await database.resolveAccountIdUsingToken(
            token
          );
        }
        if (conflictingAccountId === null && token != "") {
          const success: boolean = await database.editAccountToken(id, token);
          if (success) {
            response.status(200);
            // sends back token username and pfp to store in browser.
            response.send({
              token: token,
              username: accountInfo.username,
              pfp: accountInfo.pfp,
            });
          } else {
            console.error("server: token edit failed.");
            response.status(500);
            response.send("Server Error.");
          }
        } else {
          console.error("server: check for existing token failed.");
          response.status(500);
          response.send("Server error.");
        }
      } else {
        response.status(400);
        response.send("Incorrect Password.");
      }
    } else {
      console.error("server: Account info retrieval failed.");
      response.status(500);
      response.send("Server error.");
    }
  } else if (id === null) {
    response.status(400);
    response.send("Email does not exist.");
  } else {
    console.error("server: Account id resolutoin failed.");
    response.stauts(500);
    response.send("Server error.");
  }
});

// get comments. Gets all comments on a specified post. The id of the post is not sensitive data so a get can be used
// and the id can be put in the request parameters.
server.get("/get/comments/:post", async (request: any, response: any) => {
  const id: number = request.params.post;
  const comments: Record<string, any>[] | undefined =
    await database.getCommentsOnPost(id);
  if (comments) {
    response.status(200);
    response.send(comments);
  } else {
    console.error("server: Comment retrieval for post failed.");
    response.status(500);
    response.send("Server error.");
  }
});

// creates comment. creates a new comment. Uses the stored email to resolve id so its known who made the post.
// the post id is send from the front end code.
server.post("/create/comment/", async (request: any, response: any) => {
  const text: string = request.body.text;
  const email: string = request.body.email;
  const postId: number = request.body.postId;
  const accountId: number | null | undefined =
    await database.resolveAccountIdUsingEmail(email);
  if (accountId) {
    const success: boolean = await database.createComment(
      accountId,
      postId,
      text
    );
    if (success) {
      response.status(200);
      response.send("Comment creation successful.");
    } else {
      console.error("server: comment creation failed");
      response.status(500);
      response.send("Server error.");
    }
  } else if (accountId === null) {
    response.status(400);
    response.send("Email not found.");
  } else {
    console.error("server: Id retrieval using email failed.");
    response.status(500);
    response.send("Server error.");
  }
});

// get leaderboard. Gets all accounts and the required info to be displayed on the leaderboard.
server.get("/leaderboard", async (request: any, response: any) => {
  const rankList: Record<string, any>[] | undefined =
    await database.getAllAccounts();
  if (rankList) {
    response.status(200);
    response.send(rankList);
  } else {
    console.error("server: leadboard retrieval failed.");
    response.status(500);
    response.send("Server error.");
  }
});

// get posts per user. Takes the user's email, resolves the id and sends back all posts which belong to the user.
// this is used for the user's profile so they can see all of the posts made by them.
server.get("/posts/:email", async (request: any, response: any) => {
  const email: string = request.params.email;
  const id: number | null | undefined =
    await database.resolveAccountIdUsingEmail(email);
  if (id) {
    const postList: Record<string, any>[] | undefined =
      await database.getPostsFromAccount(id);
    if (postList) {
      response.status(200);
      response.send(postList);
    } else {
      console.error("server: posts per account retrieval failed.");
      response.status(500);
      response.send("Server error.");
    }
  } else if (id === null) {
    response.status(400);
    response.send("Email does not exist.");
  } else {
    console.error("server: id resolution using email failed.");
    response.status(500);
    response.send("Server error.");
  }
});

// get images. Simple function to allow images to be retreived from the server's storage. This function is called
// using an images src rather than axios.
server.get("/get/:image", (request: any, response: any) => {
  const image: string = request.params.image;
  const imagesDirectory = path.resolve(__dirname, "../images");
  server.use("/images", express.static(imagesDirectory));
  response.sendFile(path.join(imagesDirectory, image));
});

// edit account. Takes all account info able to be edited. If you do not want to edit something it is left as null.
// for each thing that is set to be edited it calls the corresponding database function and returns the new values
// so they can be stored in the browser.
server.post(
  "/edit/account",
  upload.single("pfp"),
  async (request: any, response: any) => {
    const emailOld: string = request.body.emailOld;
    const emailNew: string | null = request.body.emailNew;
    const username: string | null = request.body.username;
    const passwordPlain: string | null = request.body.password;
    let pfp: string | null = null;
    if (request.file) {
      pfp = request.file.filename;
    }
    const id: number | null | undefined =
      await database.resolveAccountIdUsingEmail(emailOld);

    if (id) {
      response.status(200);
      let newData: Record<string, any> = {
        email: null,
        username: null,
        pfp: null,
      };

      if (emailNew) {
        const success: boolean = await database.editAccountEmail(id, emailNew);
        if (success) {
          newData.email = emailNew;
        } else {
          console.error("server: failed to edit email.");
          response.status(500);
          response.send("Server error.");
        }
      }

      if (username) {
        const success: boolean = await database.editAccountUsername(
          id,
          username
        );
        if (success) {
          newData.username = username;
        } else {
          console.error("server: failed to edit email.");
          response.status(500);
          response.send("Server error.");
        }
      }

      if (passwordPlain) {
        const accountInfo: Record<string, any> | undefined =
          await database.getAccount(id);
        if (accountInfo) {
          const passwordHashed = crypto.hash(accountInfo.salt + passwordPlain);
          const success: boolean = await database.editAccountPassword(
            id,
            passwordHashed
          );
          if (!success) {
            console.error("server: failed to edit email.");
            response.status(500);
            response.send("Server error.");
          }
        } else {
          console.error("server: failed to get account.");
          response.status(500);
          response.send("Server error.");
        }
      }

      if (pfp) {
        const success: boolean = await database.editAccountPfp(id, pfp);
        if (success) {
          newData.pfp = pfp;
        } else {
          console.error("server: failed to edit email.");
          response.status(500);
          response.send("Server error.");
        }
      }

      response.send(newData);
    } else if (id === null) {
      response.status(400);
      response.send("Email does not exist.");
    } else {
      console.error("server: failed to resolve id using email.");
      response.status(500);
      response.send("Server error.");
    }
  }
);

// sets up the server to listen for requests on port 5000
server.listen(port, () => {
  console.error("server listening on port " + port);
});
