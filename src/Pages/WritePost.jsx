import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import slugify from "react-slugify";
import {
  setNewPost,
  ifPostExists,
  getUserPosts,
} from "../../firebase/firebase";
import { convertPostsToAnArray } from "../../Functions/Helpers";
import Post from "../components/Post";

const WritePost = ({ user }) => {
  const [articleName, setArticleName] = useState("");
  const [userPosts, setUserPosts] = useState(null);
  const navigator = useNavigate();
  if (!user) {
    return <p className="p-4">You must be signed-in</p>;
  }
  if (user && !user.displayName) {
    return <p className="p-4">You must have Username</p>;
  }
  const handleState = (e) => {
    setArticleName(e.target.value);
  };
  const handlePostCreation = async (e) => {
    e.preventDefault();
    if (!slugify(articleName.trim())) return;
    const postData = {
      uid: user.uid,
      author: user.displayName,
      title: articleName,
      body: "# Hello World",
      postId: slugify(articleName),
    };
    try {
      const res = await ifPostExists(
        `${user.displayName}-${slugify(articleName)}`
      );
      if (res.exists()) {
        navigator(`/yourself/${slugify(articleName)}`);
      }
      if (!res.exists()) {
        await setNewPost(postData);
        navigator(`/yourself/${postData.postId}`);
        console.log("added new post");
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    const asy = async () => {
      try {
        const res = await getUserPosts(user.displayName);
        if (res.exists()) {
          setUserPosts(convertPostsToAnArray(res.val()));
        }
      } catch (err) {}
    };
    if (user) {
      asy();
    }
  }, []);
  return (
    <main className="container mx-auto space-y-4 p-4">
      {user && user.displayName && (
        <>
          <h1 className="text-xl font-bold tracking-wider">
            Manage your posts
          </h1>
          <form onSubmit={handlePostCreation} className="space-y-4">
            <input
              type="text"
              placeholder="Article Name"
              className="w-full rounded-md py-2 px-4"
              value={articleName}
              onChange={handleState}
              name="Slugifying"
            />
            <span className="block text-success">
              ID : {slugify(articleName)}
            </span>
            <button
              disabled={articleName.trim().length < 4}
              className="rounded bg-success py-2 px-4 capitalize text-white disabled:opacity-50"
            >
              create new post
            </button>
          </form>
          {userPosts && (
            <section className="space-y-4">
              {userPosts.map((e) => {
                return (
                  <div
                    className="space-y-4 rounded-lg bg-white p-6"
                    key={e.time}
                  >
                    <Post {...e} rm />

                    <Link
                      to={`/yourself/${e.postId}`}
                      className="block w-fit rounded bg-BtnBg py-1 px-8 text-white"
                    >
                      Edit
                    </Link>
                    <span
                      className={`block w-fit font-medium tracking-wide ${
                        e.live ? "text-success" : "text-red-500"
                      }`}
                    >
                      {e.live ? "Live" : "Unpublished"}
                    </span>
                  </div>
                );
              })}
            </section>
          )}
        </>
      )}
    </main>
  );
};

export default WritePost;
