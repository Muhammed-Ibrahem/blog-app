import Header from "./Header";

const Wrapper = ({ children }) => {
  return (
    <>
      <Header />
      {children}
    </>
  );
};

export default Wrapper;
