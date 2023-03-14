import { useEffect } from "react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";
import CustomResets from "../CustomCss/CustomsReset.module.css";
import { useAuth } from "../../firebase/Authentication";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ifPostExists,
  EditUserPost,
  deletePost,
} from "../../firebase/firebase";
import Popup from "../components/Popup";

const initialValue = {
  txtArea: "",
  live: true,
};
const EditPost = () => {
  const params = useParams();
  const navigator = useNavigate();
  const { user } = useAuth();
  const [PostData, editPostData] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(true);
  const [notfound, setNotFound] = useState(false);
  const [post, setPost] = useState(null);
  const [PrevMode, setPrevMode] = useState(false);
  const [PopUp, setPopUp] = useState({
    update: false,
    delete: false,
  });
  if (!user) {
    return <p className="p-4">You must be signed-in</p>;
  }
  if (user && !user.displayName) {
    return <p className="p-4">You must have a username</p>;
  }

  const handleState = (e) => {
    const { name, value } = e.target;
    editPostData((prev) => ({
      ...prev,
      [name]: name === "live" ? !prev.live : value,
    }));
  };

  const handlePopUp = (type) => {
    setPopUp((prev) => ({
      ...prev,
      [type]: true,
    }));
    setTimeout(() => {
      setPopUp({
        update: false,
        delete: false,
      });
    }, 2000);
  };
  const handleEdits = async (e) => {
    e.preventDefault();
    const data = {
      body: PostData.txtArea,
      live: PostData.live,
      author: user.displayName,
      postId: post.postId,
    };
    try {
      await EditUserPost(data);
      console.log("Updated");
      handlePopUp("update");
    } catch (err) {
      console.log(err);
    }
  };
  const removePost = async () => {
    try {
      await deletePost({
        author: user.displayName,
        postId: post.postId,
      });
      handlePopUp("delete");
      setTimeout(() => {
        navigator("/yourself");
      }, 1000);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    ifPostExists(`${user.displayName}-${params.name}`)
      .then((snapshot) => {
        if (snapshot.exists()) {
          setPost(snapshot.val());
          editPostData({
            txtArea: snapshot.val().body,
            live: snapshot.val().live,
          });
          setIsLoading(false);
        }
        if (!snapshot.exists()) {
          setNotFound(true);
        }
      })
      .catch((err) => console.log(err));

    const winFn = () => {
      setPrevMode(false);
    };
    window.addEventListener("resize", winFn);
    return () => {
      window.removeEventListener("resize", winFn);
    };
  }, []);

  return (
    <>
      {PopUp.update && (
        <Popup extra="whitespace-nowrap text-sm bg-success text-white py-2 px-6 gap-4">
          Post Updated Succesfully
        </Popup>
      )}
      {PopUp.delete && (
        <Popup extra="whitespace-nowrap text-sm bg-red-500 text-white py-2 px-6 gap-4">
          Deleted Successfuly
        </Popup>
      )}
      {notfound && (
        <p className="p-4">
          Sorry, There is no post with such ID of <b>{params.name}</b>
        </p>
      )}
      {!isLoading && (
        <main className="container mx-auto p-4 ">
          <Link
            to={`/${post.author}/${post.postId}`}
            className="mb-4 block text-3xl font-bold tracking-wide"
          >
            {post.title}
          </Link>
          <div className="flex items-center justify-between">
            <p className="font-medium text-Logo">ID: {post.postId}</p>
            <div className="flex flex-col gap-1 text-left xl:hidden">
              <button
                onClick={() => {
                  setPrevMode((e) => !e);
                }}
                className="cursor-pointer rounded bg-grayishBtn py-1 px-6 text-Logo"
              >
                {PrevMode ? "Edit Mode" : "Preview"}
              </button>
              <Link
                to={`/${post.author}/${post.postId}`}
                className="rounded bg-BtnBg py-1 px-6 text-white"
              >
                Live Preview
              </Link>
            </div>
          </div>
          <form onSubmit={handleEdits} className="mt-4 xl:mt-2">
            <div className="flex gap-4">
              <textarea
                className={`${
                  PrevMode ? "hidden" : "block"
                } min-h-[50vh] w-full resize-none rounded p-4 xl:block xl:w-1/2`}
                name="txtArea"
                onChange={handleState}
                value={PostData.txtArea}
              />
              <div
                className={`relative ${
                  PrevMode ? "block w-full" : "hidden"
                } xl:block xl:w-1/2`}
              >
                <span className="absolute bottom-full left-0 font-bold tracking-widest text-Logo">
                  Live Preview
                </span>
                <ReactMarkdown
                  className={`${CustomResets.CustomResets} min-h-[50vh] w-full rounded bg-white p-4`}
                  children={PostData.txtArea}
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
              </div>
            </div>
            <label className="my-4 flex gap-1">
              <input
                type="checkbox"
                name="live"
                checked={PostData.live}
                onChange={handleState}
              />
              <span className="font-medium uppercase tracking-wide">live</span>
            </label>
            <div className="flex flex-col items-center gap-4 sm:flex-row md:w-1/2">
              <button className="w-full rounded-md bg-success py-2 font-semibold text-white">
                Save Changes
              </button>
              <button
                onClick={removePost}
                type="button"
                className="w-full rounded-md bg-red-500 py-2 font-semibold text-white"
              >
                Delete
              </button>
            </div>
          </form>
        </main>
      )}
    </>
  );
};

export default EditPost;
