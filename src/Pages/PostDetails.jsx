import { useEffect, useState } from "react";
import { getPost } from "../../firebase/firebase";
import { Link, useParams } from "react-router-dom";
import { Hearting, ifUserAlreadyHearted } from "../../firebase/firebase";
import { onChildChanged, onValue, ref } from "firebase/database";
import { db } from "../../firebase/Config";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";
import CustomResets from "../CustomCss/CustomsReset.module.css";
const PostDetails = ({ user }) => {
  const { name, id } = useParams();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reRender, setReRender] = useState(false);
  const [notfound, setNotFound] = useState(false);

  const heartButton = async () => {
    const HearterData = {
      author: post.author,
      postId: post.postId,
      heartCount: post.heartCount,
      user: user.displayName,
    };
    try {
      const res = await ifUserAlreadyHearted(HearterData);
      if (res.exists()) {
        await Hearting(HearterData, true); // True here for removing the heart reaction user made
      }
      if (!res.exists()) {
        await Hearting(HearterData);
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    const postRef = ref(db, `users/${name}/${id}`);
    onValue(postRef, (snapshot) => {
      setPost(snapshot.val());
    });
    getPost(`${name}/${id}`).then((data) => {
      if (data.exists()) {
        setPost(data.val());
        setIsLoading(false);
      }
      if (!data.exists()) {
        setNotFound(true);
      }
    });
  }, []);
  return (
    <>
      {notfound && <p className="p-4">Sorry, there is no post with such ID</p>}
      {!isLoading && (
        <main className="container relative mx-auto mt-8 mb-[66px] flex flex-col gap-4 p-4  md:flex-row">
          <section className="w-full space-y-4 rounded-md bg-white p-4 shadow-sm">
            <h1 className="font-bold tracking-wide">{post.title}</h1>
            <p className="text-xs">
              Written by{" "}
              <Link to={`/${name}`} className="font-bold text-BtnBg">
                @{post?.author}
              </Link>{" "}
              on {new Date(post.time).toString().slice(0, 33)}
            </p>
            {/* <p>{post.body}</p> */}
            <ReactMarkdown
              className={`${CustomResets.CustomResets} min-h-[200px] w-full rounded bg-white p-4 `}
              children={post.body}
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  return !inline && match ? (
                    <SyntaxHighlighter
                      children={String(children).replace(/\n$/, "")}
                      style={dark}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    />
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            />
          </section>
          <aside className="fixed left-0 bottom-0 -order-1 flex  w-full flex-row items-center justify-between gap-4 self-start rounded-md bg-white p-4 shadow-lg sm:order-1 md:sticky md:top-2 md:w-auto md:flex-col">
            {user && user.displayName && (
              <>
                <span>{post.heartCount} ❤</span>
                <button
                  onClick={heartButton}
                  className="rounded border bg-grayishBtn py-1 px-4 shadow"
                >
                  {post?.hearts && post?.hearts[user?.displayName] ? "❤" : "🤍"}
                </button>
                {post.author === user.displayName && (
                  <Link
                    to={`/yourself/${post.postId}`}
                    className="rounded bg-BtnBg py-2 px-4 text-sm font-semibold text-white"
                  >
                    Edit
                  </Link>
                )}
              </>
            )}
            {user && !user.displayName && <span>{post.heartCount} ❤</span>}
            {!user && (
              <>
                <span>{post.heartCount} ❤</span>
                <Link
                  to="/login"
                  className="rounded bg-BtnBg py-2 px-4 font-bold capitalize text-white"
                >
                  Log in
                </Link>
                <span className="text-xs">to heart this post</span>
              </>
            )}
          </aside>
        </main>
      )}
    </>
  );
};

export default PostDetails;
