import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import spinner from "../../assets/gg.gif";
import "./avatar.css";
import { Button } from "react-bootstrap";
import { setAvatarAPI } from "../../utils/ApiRequest.js";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

const {
  uniqueNamesGenerator,
  colors,
  animals,
  countries,
  names,
  languages,
} = require("unique-names-generator");

const SetAvatar = () => {
  const navigate = useNavigate();

  const sprites = [
    "adventurer",
    "micah",
    "avataaars",
    "bottts",
    "initials",
    "adventurer-neutral",
    "big-ears",
    "big-ears-neutral",
    "big-smile",
    "croodles",
    "identicon",
    "miniavs",
    "open-peeps",
    "personas",
    "pixel-art",
    "pixel-art-neutral",
  ];

  const [selectedAvatar, setSelectedAvatar] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [selectedSprite, setSelectedSprite] = useState(sprites[0]);
  const [imgURL, setImgURL] = useState([]);

  const toastOptions = {
    position: "bottom-right",
    autoClose: 2000,
    theme: "dark",
  };

  // ✅ Redirect if not logged in
  useEffect(() => {
    if (!localStorage.getItem("user")) {
      navigate("/login");
    }
  }, [navigate]);

  // ✅ Random seed generator for avatars
  const randomName = () =>
    uniqueNamesGenerator({
      dictionaries: [animals, colors, countries, names, languages],
      length: 2,
    });

  // ✅ Generate 4 avatars for current sprite
  const generateAvatars = (sprite) => {
    const imgData = [];
    for (let i = 0; i < 4; i++) {
      imgData.push(
        `https://api.dicebear.com/7.x/${sprite}/svg?seed=${randomName()}`
      );
    }
    setImgURL(imgData);
    setSelectedAvatar(undefined);
  };

  // ✅ Load avatars on mount & when sprite changes
  useEffect(() => {
    setLoading(true);
    generateAvatars(selectedSprite);
    setLoading(false);
  }, [selectedSprite]);

  const handleSpriteChange = (e) => {
    setSelectedSprite(e.target.value);
  };

  // ✅ Save selected avatar to backend
  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Please select an avatar", toastOptions);
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    try {
      const { data } = await axios.post(`${setAvatarAPI}/${user._id}`, {
        image: imgURL[selectedAvatar],
      });

      if (data?.isSet) {
        user.isAvatarImageSet = true;
        user.avatarImage = data.image;
        localStorage.setItem("user", JSON.stringify(user));
        toast.success("Avatar selected successfully", toastOptions);
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        toast.error("Error setting avatar, please try again", toastOptions);
      }
    } catch (err) {
      toast.error("Server error while setting avatar", toastOptions);
    }
  };

  // ✅ Particles background
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);
  const particlesLoaded = useCallback(async () => {}, []);

  return (
    <div style={{ position: "relative", overflow: "hidden" }}>
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          background: { color: { value: "#000" } },
          fpsLimit: 60,
          particles: {
            number: { value: 200, density: { enable: true, value_area: 800 } },
            color: { value: "#ffcc00" },
            shape: { type: "circle" },
            opacity: { value: 0.5, random: true },
            size: { value: 3, random: { enable: true, minimumValue: 1 } },
            links: { enable: false },
            move: { enable: true, speed: 2 },
          },
          detectRetina: true,
        }}
      />

      {loading ? (
        <div className="container containerBox">
          <div className="avatarBox">
            <img src={spinner} alt="Loading" />
          </div>
        </div>
      ) : (
        <div className="container containerBox">
          <div className="avatarBox">
            <h1 className="text-center text-white mt-5">Choose Your Avatar</h1>

            <div className="container">
              <div className="row">
                {imgURL.map((image, index) => (
                  <div key={index} className="col-lg-3 col-md-6 col-6">
                    <img
                      src={image}
                      alt={`avatar-${index}`}
                      className={`avatar ${
                        selectedAvatar === index ? "selected" : ""
                      } img-circle imgAvatar mt-5`}
                      onClick={() => setSelectedAvatar(index)}
                      style={{
                        cursor: "pointer",
                        width: "100%",
                        height: "auto",
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Sprite Selection Dropdown */}
            <select
              onChange={handleSpriteChange}
              value={selectedSprite}
              className="form-select mt-5"
            >
              {sprites.map((sprite, index) => (
                <option value={sprite} key={index}>
                  {sprite}
                </option>
              ))}
            </select>

            <Button onClick={setProfilePicture} type="submit" className="mt-5">
              Set as Profile Picture
            </Button>
          </div>

          <ToastContainer />
        </div>
      )}
    </div>
  );
};

export default SetAvatar;
