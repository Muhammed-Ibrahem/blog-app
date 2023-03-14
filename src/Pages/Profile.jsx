import { useAuth } from "../../firebase/Authentication";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserPosts, ifUsernameExists } from "../../firebase/firebase";
import { convertPostsToAnArray } from "../../Functions/Helpers";
import img from "../assets/images.jpg";
import Post from "../components/Post";

const Profile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userPosts, setUserPosts] = useState(null);
  const [exist, setUserExist] = useState(false);
  const { name } = useParams();
  const { user } = useAuth();
  useEffect(() => {
    const checkers = async () => {
      try {
        const res = await ifUsernameExists(name);
        if (res.exists()) {
          const dataResponse = await getUserPosts(name);
          if (!dataResponse.exists()) {
            setUserExist(true);
            setUserPosts(null);
            setIsLoading(false);
          }
          if (dataResponse.exists()) {
            setUserPosts(convertPostsToAnArray(dataResponse.val()));
            setIsLoading(false);
            setUserExist(true);
          }
        }
      } catch (err) {
        console.log(err);
      }
    };
    checkers();
  }, [name]);
  return (
    <>
      {!exist && <p className="mt-8 text-center">No user found</p>}
      {exist && (
        <div className="mt-8 space-y-4">
          <img src={img} className="mx-auto w-20 rounded-full" alt="" />
          <span className="block text-center font-bold">@{name}</span>
        </div>
      )}
      {!isLoading && (
        <>
          <main className="container mx-auto mt-8 space-y-6 rounded-md p-6">
            {!userPosts && (
              <p className="text-center">This user has no posts</p>
            )}
            {userPosts && userPosts.map((e) => <Post key={e.time} {...e} />)}
          </main>
        </>
      )}
    </>
  );
};

export default Profile;
