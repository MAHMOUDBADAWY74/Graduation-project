import "./AdminHeader.css";

const AdminHeader = () => {
  return (
    <div className="AdminNav">
      <div className="Adminlogo">
        <img src="/src/assets/Group 4.svg" alt="logo" />
      </div>
      <div className="adminProfile">
        <button>
          <img src="/src/assets/user.png" alt="profile" />
        </button>
        <ul>
          <li>hi ,admin</li>
          <li>logout</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminHeader;
