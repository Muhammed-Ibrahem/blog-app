import { Link } from "react-router-dom";
import slugify from "react-slugify";
const Post = ({ author, title, postId, body, heartCount, rm }) => {
  return (
    <div
      className={`space-y-4 ${
        !rm ? "rounded-lg border border-borders bg-white p-6" : ""
      }`}
    >
      <Link to={`/${author}`} className="block font-semibold tracking-wide">
        By @{author}
      </Link>
      <Link
        to={`/${author}/${postId}`}
        className="block font-bold tracking-wide"
      >
        {title}
      </Link>
      <footer className="flex items-center justify-between">
        <span>
          {slugify(body).split("-").length} words.{" "}
          {Math.ceil(slugify(body).split("-").length / 60)} minutes read
        </span>
        <span>💞 {heartCount} Hearts</span>
      </footer>
    </div>
  );
};

export default Post;
