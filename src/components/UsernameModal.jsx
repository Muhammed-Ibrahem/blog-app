import { useEffect, useState } from "react";
import { ifUsernameExists, setUsername } from "../../firebase/firebase";
import slugify from "react-slugify";
import { updateProfile } from "firebase/auth";
import { usePosts } from "../Store/Store";
import { useAuth } from "../../firebase/Authentication";
let myPointer;
const UsernameModal = () => {
  const { user, logout } = useAuth();
  const setModal = usePosts(({ setModal }) => setModal);
  const [username, setUName] = useState("");
  const [exists, setExists] = useState(false);
  const handleUsername = (e) => {
    const { value } = e.target;
    setUName(value);
  };
  const onFormSubmit = async (e) => {
    e.preventDefault();
    if (exists) return;
    try {
      await setUsername(username);
      await updateProfile(user, { displayName: slugify(username) });
      setModal(false);
    } catch (err) {
      console.log(err);
    }
    setUName("");
  };

  useEffect(() => {
    setExists(false);
    const checkName = async () => {
      const res = await ifUsernameExists(username.toLowerCase());
      if (res.exists()) {
        setExists(true);
      }
    };
    myPointer = setTimeout(() => {
      if (username.trim()) {
        checkName();
      }
    }, 100);
    return () => {
      clearTimeout(myPointer);
    };
  }, [username]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-[400px] space-y-2 rounded border bg-white p-4">
        <form className="w-full" onSubmit={onFormSubmit}>
          <input
            type="text"
            placeholder="Choose your username"
            value={username.toLowerCase()}
            name="username"
            onChange={handleUsername}
            className="w-full rounded border-borders bg-grayishBtn py-2 px-4 text-white shadow-sm outline-none placeholder:text-white"
          />
          <p>
            Name:
            <span
              className={`ml-2 ${exists ? "text-red-500" : "text-green-500"}`}
            >
              {slugify(username.toLowerCase())}
            </span>
          </p>
          <button
            disabled={exists}
            className=" w-full rounded bg-BtnBg py-2 text-center text-white disabled:opacity-50"
          >
            Choose
          </button>
        </form>
        <button
          onClick={() => {
            logout();
          }}
          className="block w-full rounded bg-red-500 py-2 text-white"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default UsernameModal;
