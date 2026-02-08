import CountUp from "react-countup";
import { FaBook } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./TotalBooksCard.css";
import PropTypes from "prop-types";

const TotalBooksCard = ({ count }) => {
  const navigate = useNavigate();

  const goToManageBooks = () => {
    navigate("/admin/managebook");
  };

  return (
    <div className="booksCard" onClick={goToManageBooks}>
      <h4>
        <FaBook /> Total Books
      </h4>
      <div className="booksCount">
        <CountUp end={count} duration={2} />
      </div>
    </div>
  );
};

TotalBooksCard.propTypes = {
  count: PropTypes.number.isRequired,
};

export default TotalBooksCard;
