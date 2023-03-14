import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Profile from "./Pages/Profile";
import Wrapper from "./layout/Wrapper";
import WritePost from "./Pages/WritePost";
import PostDetails from "./Pages/PostDetails";
import UsernameModal from "./components/UsernameModal";
import ProtectedRoute from "./components/ProtectedRoute";
import RedirectedRoute from "./components/RedirectedRoute";

import { createPortal } from "react-dom";
import { useAuth } from "../firebase/Authentication";
import { usePosts } from "./Store/Store";
import { Routes, Route } from "react-router-dom";
import EditPost from "./Pages/EditPost";

function App() {
  const { user } = useAuth();
  const isModalOn = usePosts(({ userModal }) => userModal);

  return (
    <>
      {isModalOn &&
        user &&
        !user.displayName &&
        createPortal(
          <UsernameModal user={user} />,
          document.getElementById("modal")
        )}
      <Routes>
        <Route element={<RedirectedRoute user={user} />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>
        <Route
          path="/"
          element={
            <Wrapper>
              <Home user={user} />
            </Wrapper>
          }
        />
        <Route
          element={
            <Wrapper>
              <ProtectedRoute user={user} />
            </Wrapper>
          }
        >
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route
          path="/yourself"
          element={
            <Wrapper>
              <WritePost user={user} />
            </Wrapper>
          }
        />
        <Route
          path="/yourself/:name"
          element={
            <Wrapper>
              <EditPost />
            </Wrapper>
          }
        />
        <Route
          path="/:name/:id"
          element={
            <Wrapper>
              <PostDetails user={user} />
            </Wrapper>
          }
        />
        <Route
          path="/:name"
          element={
            <Wrapper>
              <Profile />
            </Wrapper>
          }
        />
      </Routes>
    </>
  );
}

export default App;
