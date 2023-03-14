import Post from "../components/Post";
import { usePosts } from "../Store/Store";
import { v4 as uuid } from "uuid";

const Home = () => {
  const Posts = usePosts(({ Posts }) => Posts);

  return (
    <>
      <main className="container mx-auto space-y-4 p-4">
        <div className="space-y-4 rounded-lg bg-BtnBg p-8 text-white">
          <p>Welcome! This app is built with React.js and Firebase</p>
          <p>
            Sign up for an 👨‍🎤 account, ✍️ write posts, then 💞 heart content
            created by other users
          </p>
        </div>
        {Posts.map((e) => {
          if (!e.live) return;
          return <Post key={uuid()} {...e} />;
        })}
      </main>
    </>
  );
};

export default Home;
