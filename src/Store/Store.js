import { create } from "zustand";
import {
  onValue,
  ref,
  query,
  orderByChild,
  limitToFirst,
} from "firebase/database";
import { db } from "../../firebase/Config";
import { convertPostsToAnArray } from "../../Functions/Helpers";

export const usePosts = create((set) => ({
  Posts: [],
  userModal: true,
  setLimit: 10,
  setModal: (status) => set(() => ({ userModal: status })),
}));
const postQuery = query(
  ref(db, "posts/"),
  orderByChild("time"),
  limitToFirst(usePosts.getState().setLimit)
);
onValue(postQuery, (snapshot) => {
  const data = convertPostsToAnArray(snapshot.val());
  usePosts.setState({
    Posts: data,
  });
});
