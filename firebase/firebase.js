import { db } from "./Config";
import {
  get,
  ref,
  serverTimestamp,
  update,
  increment,
  set,
} from "firebase/database";

export const setNewPost = (newPost) => {
  const postData = {
    ...newPost,
    heartCount: 0,
    hearts: {},
    live: true,
    time: serverTimestamp(),
  };
  const updates = {};
  updates["/posts/" + `${newPost.author}-${newPost.postId}`] = postData;
  updates["/users/" + newPost.author + "/" + newPost.postId] = postData;

  return update(ref(db), updates);
};
export const ifPostExists = (postId) => {
  return get(ref(db, `posts/${postId}`));
};
export const ifEmailExists = (email) => {
  return get(ref(db, `emails/${email}`));
};
export const setEmails = (email) => {
  const updates = {};
  updates[`emails/${email}`] = true;
  return update(ref(db), updates);
};
export const setUsername = (username) => {
  const updates = {};
  updates[`usernames/${username}`] = true;
  return update(ref(db), updates);
};
export const ifUsernameExists = (username) => {
  return get(ref(db, `usernames/${username}`));
};
export const getPost = (path) => {
  return get(ref(db, `users/${path}`));
};
export const getUserPosts = (userId) => {
  return get(ref(db, `users/${userId}`));
};
export const Hearting = (
  { author, postId, heartCount, user },
  unHeart = false
) => {
  const updates = {};
  if (!unHeart) {
    updates[`posts/${author}-${postId}/hearts/${user}`] = true;
    updates[`posts/${author}-${postId}/heartCount`] = increment(1);
    updates[`users/${author}/${postId}/hearts/${user}`] = true;
    updates[`users/${author}/${postId}/heartCount`] = increment(1);
  }
  if (unHeart) {
    updates[`posts/${author}-${postId}/hearts/${user}`] = null;
    updates[`posts/${author}-${postId}/heartCount`] = heartCount - 1;
    updates[`users/${author}/${postId}/hearts/${user}`] = null;
    updates[`users/${author}/${postId}/heartCount`] = heartCount - 1;
  }
  return update(ref(db), updates);
};
export const ifUserAlreadyHearted = ({ user, author, postId }) => {
  return get(ref(db, `posts/${author}-${postId}/hearts/${user}`));
};
export const EditUserPost = ({ author, body, postId, live }) => {
  const updates = {};

  updates[`posts/${author}-${postId}/body`] = body;
  updates[`users/${author}/${postId}/body`] = body;
  updates[`posts/${author}-${postId}/live`] = live;
  updates[`users/${author}/${postId}/live`] = live;
  return update(ref(db), updates);
};
export const deletePost = ({ author, postId }) => {
  const updates = {};
  updates[`posts/${author}-${postId}`] = null;
  updates[`users/${author}/${postId}`] = null;

  return update(ref(db), updates);
};
