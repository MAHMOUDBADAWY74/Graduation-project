import { Link, useNavigate } from "react-router-dom";
import "./styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons";
const p1 = `Every book is a new world.`;
const p2 = `Escape. Learn. Feel.`;
const p3 = `Discover stories that stay with you — forever.`;
export default function Landing() {
  const navigate = useNavigate();
  return (
    <div className="landing" data-aos="fade-down">
      <div className="bg bg1"></div>
      <div className="bg bg2"></div>
      <div className="text">
        <p>{p1}</p>
        <p>{p2}</p>
        <p>{p3}</p>
        <div
          className="container-arrow-right"
          onClick={() => navigate("/books")}
        >
          <Link to={"/books"}>To Start</Link>
          <FontAwesomeIcon className="arrow-right" icon={faArrowRightLong} />
        </div>
      </div>
    </div>
  );
}
// Reading is more than a hobby — it's a journey into countless worlds.
// Within the pages of a book, you can escape, explore, and experience life through new eyes.
// Whether you're seeking knowledge, inspiration, or simply a quiet moment of peace, books are your perfect companion.
// Start your reading adventure with us — every story is a new beginning.
