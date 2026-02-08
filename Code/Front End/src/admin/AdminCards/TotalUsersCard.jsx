import CountUp from "react-countup";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./TotalUsersCard.css";
import PropTypes from "prop-types";

const TotalUsersCard = ({ count }) => {
  const navigate = useNavigate();

  const goToManageUsers = () => {
    navigate("/admin/manageusers");
  };

  return (
    <div className="usersCard" onClick={goToManageUsers}>
      <h4>
        <FaUser /> Total users
      </h4>
      <div className="usersCount">
        <CountUp end={count} duration={2} />
      </div>
    </div>
  );
};

TotalUsersCard.propTypes = {
  count: PropTypes.number.isRequired,
};

export default TotalUsersCard;
