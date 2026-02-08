import { useState } from "react";
import "./AboutMe.css";
import { Pencil, X } from "lucide-react";
import { useOutletContext } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

const AboutMe = () => {
  const { profile, me } = useOutletContext();
  const { token } = useSelector((state) => state.auth);
  const initialUserData = {
    ...profile,
    firstName: profile?.firstName,
    age: profile?.age || "",
    gender: profile?.gender || "Prefer not to say",
    bio: profile?.bio || "",
    hobbies: profile?.hobbies || [],
    favoriteBookTopics: profile?.favoriteBookTopics || [],
  };

  const [editMode, setEditMode] = useState(false);
  const [userData, setUserData] = useState(initialUserData);
  const [newHobby, setNewHobby] = useState("");
  const [newBook, setNewBook] = useState("");

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleAddHobby = () => {
    if (newHobby.trim()) {
      setUserData({
        ...userData,
        hobbies: [...userData.hobbies, newHobby.trim()],
      });
      setNewHobby("");
    }
  };

  const handleAddBook = () => {
    if (newBook.trim()) {
      setUserData({
        ...userData,
        favoriteBookTopics: [...userData.favoriteBookTopics, newBook.trim()],
      });
      setNewBook("");
    }
  };

  const handleRemoveHobby = (index) => {
    const updated = [...userData.hobbies];
    updated.splice(index, 1);
    setUserData({ ...userData, hobbies: updated });
  };

  const handleRemoveBook = (index) => {
    const updated = [...userData.favoriteBookTopics];
    updated.splice(index, 1);
    setUserData({ ...userData, favoriteBookTopics: updated });
  };
  async function handleSaveChanges() {
    try {
      const formData = new FormData();
      formData.append("Bio", userData.bio);
      formData.append("Hobbies", JSON.stringify(userData.hobbies));
      formData.append(
        "FavoriteBookTopics",
        JSON.stringify(userData.favoriteBookTopics)
      );

      const response = await axios.put(
        "https://localhost:7159/api/Profile",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEditMode(false);
      console.log(response);
    } catch (error) {
      console.log("🟩 error: ", error);
    }
  }

  return (
    <div className="about-card">
      <div className="about-header">
        <h2 className="about-title">About {userData.firstName}</h2>
        {me && (
          <button className="edit-btn" onClick={() => setEditMode(!editMode)}>
            <Pencil size={18} />
          </button>
        )}
      </div>

      {editMode ? (
        <>
          <input
            name="age"
            type="number"
            value={userData.age}
            onChange={handleChange}
            placeholder="Age"
          />
          <select name="gender" value={userData.gender} onChange={handleChange}>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
          <textarea
            name="bio"
            value={userData.bio}
            onChange={handleChange}
            placeholder="Bio"
          />

          <div className="add-input">
            <input
              value={newHobby}
              onChange={(e) => setNewHobby(e.target.value)}
              placeholder="Add hobby"
            />
            <button onClick={handleAddHobby}>Add Hobby</button>
          </div>

          <div className="add-input">
            <input
              value={newBook}
              onChange={(e) => setNewBook(e.target.value)}
              placeholder="Add book topic"
            />
            <button onClick={handleAddBook}>Add Book</button>
          </div>
        </>
      ) : (
        <>
          <div className="about-info">
            <p>
              <strong>Age:</strong> {userData.age || "Not specified"}
            </p>
            {userData.gender !== "Prefer not to say" && (
              <p>
                <strong>Gender:</strong> {userData.gender}
              </p>
            )}
          </div>

          <div className="about-section">
            <h4>Bio</h4>
            <p className="bio">{userData.bio}</p>
          </div>
        </>
      )}

      <div className="about-section">
        <h4>Hobbies</h4>
        <div className="badge-container">
          {userData.hobbies.map((hobby, i) => (
            <span key={i} className="badge">
              {hobby}
              {editMode && (
                <X
                  size={14}
                  className="remove-icon"
                  onClick={() => handleRemoveHobby(i)}
                />
              )}
            </span>
          ))}
        </div>
      </div>

      <div className="about-section">
        <h4>Favorite Book Topics</h4>
        <div className="badge-container">
          {userData.favoriteBookTopics.map((book, i) => (
            <span key={i} className="badge">
              {book}
              {editMode && (
                <X
                  size={14}
                  className="remove-icon"
                  onClick={() => handleRemoveBook(i)}
                />
              )}
            </span>
          ))}
        </div>
      </div>

      {editMode && (
        <button className="save-btn" onClick={() => handleSaveChanges()}>
          Save Changes
        </button>
      )}
    </div>
  );
};

export default AboutMe;
