const Popup = ({ children, extra, when }) => {
  return (
    <div
      className={`fixed 
      left-1/2 z-[999] -translate-x-1/2 rounded ${extra} animate-slideIn `}
    >
      {children}
    </div>
  );
};

export default Popup;
