import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../firebase/Authentication";
import useFormData from "../../hooks/useFormData";
const Login = () => {
  const { login } = useAuth();
  const { user, userForm } = useFormData();
  const navigator = useNavigate();
  const handleLoginData = (e) => {
    userForm(e);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    login(user.email, user.password)
      .then(() => {
        navigator("/");
      })
      .catch((err) => console.log(err.message));
  };
  return (
    <main className="mx-auto flex  h-screen max-w-[400px] flex-col items-center justify-center gap-4 p-4 text-center">
      <h1 className="text-2xl font-bold tracking-wider">Login, to continue</h1>
      <form onSubmit={handleSubmit} className=" flex w-full flex-col gap-4">
        <input
          className="rounded-md py-2 px-4 shadow-sm"
          type="email"
          placeholder="Enter your email"
          name="email"
          value={user.email}
          onChange={handleLoginData}
        />
        <input
          className="rounded-md py-2 px-4 shadow-sm"
          type="password"
          placeholder="Enter your password"
          name="password"
          value={user.password}
          onChange={handleLoginData}
        />
        <button className="rounded-md bg-BtnBg py-2 font-bold capitalize text-white">
          log in
        </button>
      </form>
      <div>
        <span>Don't Have an account?</span>
        <Link className="ml-1 text-BtnBg underline" to="/signup">
          Sign-up now
        </Link>
      </div>
    </main>
  );
};

export default Login;
