import { Outlet, useParams } from "react-router-dom";
import HeaderProfile from "../components/common/profile/headerprofile/HeaderProfile";
import useProfile from "../hooks/useProfile";
import { useSelector } from "react-redux";
import Loader from "../components/common/loader/Loader";

export default function Profile() {
  const { Userid } = useParams();
  const { id } = useSelector((state) => state.auth);

  const { profile, loading } = useProfile(Userid);
  if (loading) {
    return <Loader />;
  }
  const me = id === profile?.userId ? true : false;
  return (
    <div>
      <HeaderProfile profile={profile} me={me} />
      <main className="container">
        <Outlet context={{ profile, me }} />
      </main>
    </div>
  );
}
