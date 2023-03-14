import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../firebase/Authentication";
import useFormData from "../../hooks/useFormData";
import { validateEmail, validatePassword } from "../../Functions/Validations";
import { ifEmailExists, setEmails } from "../../firebase/firebase";
import slugify from "react-slugify";
let timeOutPointer;
const Signup = () => {
  const { SignUp } = useAuth();
  const { user, userForm } = useFormData();
  const [exists, setExists] = useState(false);
  const handleSignUp = (e) => {
    userForm(e);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const mail = validateEmail(user.email);
    const pass = validatePassword(user.password);
    if (!mail || !pass) return;
    try {
      await setEmails(slugify(user.email));
      await SignUp(user.email, user.password);
      console.log("Signed-Up 📣 ");
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    const checkEmailExistance = async () => {
      const res = await ifEmailExists(slugify(user.email));
      if (res.exists()) {
        setExists(true);
      }
      if (!res.exists()) {
        setExists(false);
      }
    };
    timeOutPointer = setTimeout(() => {
      if (user.email) {
        checkEmailExistance();
      }
    }, 100);
    return () => {
      clearTimeout(timeOutPointer);
    };
  }, [user.email]);
  return (
    <main className="mx-auto flex h-screen w-full max-w-[400px] flex-col items-center justify-center gap-4 p-4 text-center">
      <p className="w-full  rounded bg-orange-400 p-2 text-sm text-white">
        No validations are required, Only correct look email test@test.com, and
        atleast 6 digits password 123456
      </p>
      <h1 className="w-full text-2xl font-bold tracking-wider">
        Sign-up, to continue
      </h1>
      <form onSubmit={handleSubmit} className=" flex w-full flex-col gap-4">
        <input
          className={`rounded-md border py-2 px-4 shadow-sm outline-none ${
            !exists && validateEmail(user.email)
              ? "border-success"
              : "border-red-500"
          }`}
          type="email"
          placeholder="Enter your email"
          name="email"
          value={user.email}
          onChange={handleSignUp}
        />
        <input
          className={`rounded-md border py-2 px-4 shadow-sm outline-none ${
            validatePassword(user.password)
              ? "border-success"
              : "border-red-500"
          }`}
          type="password"
          placeholder="Enter your password"
          name="password"
          value={user.password}
          onChange={handleSignUp}
        />
        <button
          disabled={exists.email || !validatePassword(user.password)}
          className={`rounded-md bg-BtnBg py-2 font-bold capitalize text-white disabled:opacity-50`}
        >
          sign up
        </button>
      </form>
      <div className="w-full">
        <span>Already Have an account?</span>
        <Link className="ml-1 text-BtnBg underline" to="/login">
          Log-in instead
        </Link>
      </div>
    </main>
  );
};

export default Signup;
