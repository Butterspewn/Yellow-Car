import { describe, expect, test, afterAll } from "@jest/globals";
import * as database from "../src/database";
import * as crypto from "../src/crypto";

const totalAccounts: number = 10;
const postsPerUser: number = 5;
const totalPosts: number = totalAccounts * postsPerUser;
const commentsPerPost: number = totalAccounts;
const totalComments: number = totalPosts * commentsPerPost;
const maxRandomScore: number = 99;
const defaultImage: string = crypto.padString("default", ".png", 17);
const testImage: string = crypto.padString("test", ".jpg", 17);

test("reset the database", async () => {
  expect(await database.resetDatabase()).toBe(true);
});

test("create set of users", async () => {
  for (let i = 1; i <= totalAccounts; i++) {
    expect(
      await database.createAccount(
        `user${i}@email.com`,
        `User ${i}`,
        crypto.padString(`password${i}`, "", 64),
        crypto.padString(`salt${i}`, "", 64)
      )
    ).toBe(true);
  }
});

test("get all accounts individually and check if they have the correct initial data", async () => {
  for (let i = 1; i <= totalAccounts; i++) {
    const queryResponse: any = await database.getAccount(i);
    expect(queryResponse.email).toBe(`user${i}@email.com`);
    expect(queryResponse.username).toBe(`User ${i}`);
    expect(queryResponse.pfp).toBe(defaultImage);
    expect(queryResponse.score).toBe(0);
    expect(queryResponse.password).toBe(
      crypto.padString(`password${i}`, "", 64)
    );
    expect(queryResponse.salt).toBe(crypto.padString(`salt${i}`, "", 64));
    expect(queryResponse.token).toBe(null);
  }
});

test("edit all users data", async () => {
  for (let i = 1; i <= totalAccounts; i++) {
    expect(await database.editAccountEmail(i, `editedUser${i}@email.com`)).toBe(
      true
    );
    expect(await database.editAccountUsername(i, `Edited User ${i}`)).toBe(
      true
    );
    expect(
      await database.editAccountPfp(i, crypto.padString("test", ".jpg", 17))
    ).toBe(true);
    expect(
      await database.editAccountScore(
        i,
        Math.floor(Math.random() * maxRandomScore) + 1
      )
    ).toBe(true);
    expect(
      await database.editAccountPassword(
        i,
        crypto.padString(`editedPassword${i}`, "", 64)
      )
    ).toBe(true);
    expect(
      await database.editAccountToken(i, crypto.padString(`token${i}`, "", 64))
    ).toBe(true);
  }
});

test("get all accounts individually and check if they have the correct edited data", async () => {
  for (let i = 1; i <= totalAccounts; i++) {
    const queryResponse: any = await database.getAccount(i);
    expect(queryResponse.email).toBe(`editedUser${i}@email.com`);
    expect(queryResponse.username).toBe(`Edited User ${i}`);
    expect(queryResponse.pfp).toBe(testImage);
    expect(queryResponse.score).toBeGreaterThan(0);
    expect(queryResponse.password).toBe(
      crypto.padString(`editedPassword${i}`, "", 64)
    );
    expect(queryResponse.token).toBe(crypto.padString(`token${i}`, "", 64));
  }
});

test("get all users at once and check if they are ordered by score and have the correct edited data", async () => {
  const queryResponse: any = await database.getAllAccounts();
  expect(queryResponse.length).toBe(totalAccounts);
  let previousScore: number = maxRandomScore + 1;
  for (let i = 0; i < totalAccounts; i++) {
    expect(queryResponse[i].score).toBeLessThanOrEqual(previousScore);
    previousScore = queryResponse[i].score;
  }
});

test("resolve each accounts id using its token", async () => {
  for (let i = 1; i <= totalAccounts; i++) {
    const queryResponse: any = await database.resolveAccountIdUsingToken(
      crypto.padString(`token${i}`, "", 64)
    );
    expect(queryResponse).toBe(i);
  }
});

test("resolve each accounts id using its email", async () => {
  for (let i = 1; i <= totalAccounts; i++) {
    const queryResponse: any = await database.resolveAccountIdUsingEmail(
      `editedUser${i}@email.com`
    );
    expect(queryResponse).toBe(i);
  }
});

test("create set of posts", async () => {
  for (let i = 1; i <= totalAccounts; i++) {
    for (let j = 0; j < postsPerUser; j++) {
      expect(
        await database.createPost(
          i,
          testImage,
          "This is a test caption describing a test image."
        )
      ).toBe(true);
    }
  }
});

test("get all posts at once and check if they are ordered by id", async () => {
  const queryResponse: any = await database.getAllPosts();
  expect(queryResponse.length).toBe(totalPosts);
  let previousId: number = totalPosts + 1;
  for (let i = 0; i < totalPosts; i++) {
    expect(queryResponse[i].id).toBeLessThan(previousId);
  }
});

test("get all posts on a per account basis and check if they are ordered by id", async () => {
  for (let i = 1; i <= totalAccounts; i++) {
    const queryResponse: any = await database.getPostsFromAccount(i);
    expect(queryResponse.length).toBe(postsPerUser);
    let previousId: number = totalPosts + 1;
    for (let j = 0; j < postsPerUser; j++) {
      expect(queryResponse[j].id).toBeLessThan(previousId);
    }
  }
});

test("edit all post captions", async () => {
  for (let i = 1; i <= totalPosts; i++) {
    expect(
      await database.editPostCaption(
        i,
        "This is an edited caption describing a test image."
      )
    ).toBe(true);
  }
});

test("create set of comments", async () => {
  for (let i = 1; i <= totalPosts; i++) {
    for (let j = 1; j <= totalAccounts; j++) {
      expect(
        await database.createComment(
          j,
          i,
          "This is a test comment replying to a test post."
        )
      ).toBe(true);
    }
  }
});

test("get all comments on a per post basis and check if they are ordered by id", async () => {
  for (let i = 1; i <= totalPosts; i++) {
    const queryResponse: any = await database.getCommentsOnPost(i);
    expect(queryResponse.length).toBe(commentsPerPost);
    let previousCommentId: number = totalComments + 1;
    for (let j = 0; j < commentsPerPost; j++) {
      expect(queryResponse[j].id).toBeLessThan(previousCommentId);
    }
  }
});

test("edit all comment text", async () => {
  for (let i = 1; i <= totalComments; i++) {
    expect(
      await database.editCommentText(
        i,
        "This is an edited comment replying to a test post."
      )
    ).toBe(true);
  }
});

test("delete all users, posts, and comments", async () => {
  for (let i = 1; i <= totalComments; i++) {
    expect(await database.deleteComment(i)).toBe(true);
  }
  for (let i = 1; i <= totalPosts; i++) {
    expect(await database.deletePost(i)).toBe(true);
  }
  for (let i = 1; i <= totalAccounts; i++) {
    expect(await database.deleteAccount(i)).toBe(true);
  }
});

afterAll(async () => {
  await database.disconnect();
});
