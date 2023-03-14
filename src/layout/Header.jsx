import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../firebase/Authentication";
import img from "../assets/images.jpg";
import BurgerMenu from "../assets/BurgerMenu.svg";
import Close from "../assets/Close.svg";
import { usePosts } from "../Store/Store";
import { useEffect, useState } from "react";

const Header = () => {
  const param = useParams();
  const navigator = useNavigate();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const setModal = usePosts(({ setModal }) => setModal);
  const handleMenuStatus = () => {
    setIsOpen((e) => !e);
  };
  const CloseMenu = () => {
    setIsOpen(false);
  };
  useEffect(() => {
    CloseMenu();
    window.addEventListener("resize", CloseMenu);
    return () => {
      window.removeEventListener("resize", CloseMenu);
    };
  }, [param]);
  return (
    <header className="bg-white p-4 shadow-md">
      <div className="container  mx-auto flex justify-between">
        <Link
          to="/"
          className="self-start rounded bg-Logo py-2 px-4 text-xl font-bold text-white"
        >
          SuKaar
        </Link>
        {!user && (
          <Link
            to="/login"
            className="rounded bg-BtnBg py-2 px-6 font-bold capitalize text-white"
          >
            log in
          </Link>
        )}
        {user && (
          <>
            <img
              onClick={handleMenuStatus}
              src={!isOpen ? BurgerMenu : Close}
              className="w-10 cursor-pointer sm:hidden"
              alt="Navbar Menu Icon"
            />
            <div
              className={`absolute right-0 top-[80px] z-50 ml-auto flex duration-500 ${
                isOpen ? "max-h-[500px] p-4" : "max-h-0 p-0 "
              } w-full flex-col justify-end gap-4  overflow-hidden bg-white transition-all sm:static sm:flex sm:max-h-[500px] sm:flex-row sm:items-center sm:p-0`}
            >
              <button
                onClick={() => {
                  navigator("/");
                  logout();
                  setModal(true);
                }}
                className="rounded-md bg-grayishBtn py-2 px-6 capitalize text-Logo"
              >
                sign out
              </button>
              {user.displayName && (
                <Link
                  onClick={CloseMenu}
                  to="/yourself"
                  className="rounded-md bg-BtnBg py-2 px-6 text-center capitalize text-white"
                >
                  Write post
                </Link>
              )}
              <Link
                onClick={CloseMenu}
                className="-order-1 self-center sm:order-1"
                to={`/${user?.displayName}`}
              >
                <img src={img} alt="" className="w-10 rounded-full" />
              </Link>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
