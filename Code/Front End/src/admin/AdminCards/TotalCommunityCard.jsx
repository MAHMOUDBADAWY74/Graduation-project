import CountUp from "react-countup";
import { FaUsers } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

import "./TotalCommunityCard.css";

const TotalCommunityCard = ({ count }) => {
  const navigate = useNavigate();

  const goToManageCommunity = () => {
    navigate("/admin/managecommunity");
  };

  return (
    <div className="totalcommunitiesCard" onClick={goToManageCommunity}>
      <h4>
        <FaUsers /> Total communities
      </h4>
      <div className="communitiesCount">
        <CountUp end={count} duration={2} />
      </div>
    </div>
  );
};
TotalCommunityCard.propTypes = {
  count: PropTypes.number.isRequired,
};
export default TotalCommunityCard;
