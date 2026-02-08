import CountUp from "react-countup";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import "./TotalPostsCard.css";

const TotalPostsCard = ({ counts }) => {
  const navigate = useNavigate();

  const goToManageUsers = () => {
    navigate("/admin/manageposts");
  };

  return (
    <div className="postsCard" onClick={goToManageUsers}>
      <h4>Total Posts</h4>
      <div className="postsCount">
        <CountUp end={counts} duration={2} />
      </div>
    </div>
  );
};

TotalPostsCard.propTypes = {
  counts: PropTypes.number.isRequired,
};

export default TotalPostsCard;
