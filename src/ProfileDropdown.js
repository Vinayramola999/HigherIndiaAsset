import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const profileItems = [
  { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/a407c21bbddbba8e9f32540c38b89b1bc9feea9abe41dade9b0eb372ade13f3c?placeholderIfAbsent=true&apiKey=f4328c4a551b4b9fa165bba17dc932db", text: "View profile" },
  // { icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/4e697dfb4708fba0a1adef55465a1c49196148cf688834f2180cba100c9fe003?placeholderIfAbsent=true&apiKey=f4328c4a551b4b9fa165bba17dc932db", text: "Settings And Privacy" }
];

function ProfileItem({ icon, text, navigate }) {
  const handleClick = () => {
    if (text === "View profile") {
      navigate('/UserProfile');
    }
  };

  return (
    <button onClick={handleClick} className="flex gap-2.5 mt-4 text-xs text-neutral-600 w-full">
      <img loading="lazy" src={icon} alt="" className="object-contain shrink-0 w-6 aspect-square" />
      <span className="my-auto">{text}</span>
    </button>
  );
}

function LogoutButton() {
  const navigate = useNavigate();

  const Logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    navigate('/');
  };
  return (
    <button className="flex gap-2.5 self-stretch px-2.5 py-2 mt-40 text-xs text-red-400 rounded-lg bg-zinc-300 bg-opacity-50 w-full"
      onClick={Logout}>
      <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/342bb2da21789f81ffbfd2d7b23f61fcc6c937b98e58d57453a75ada6e36e758?placeholderIfAbsent=true&apiKey=f4328c4a551b4b9fa165bba17dc932db" alt="" className="object-contain shrink-0 w-6 aspect-square" />
      <span className="grow shrink my-auto w-[179px]">Log Out</span>
    </button>
  );
}

function ProfileDropdown() {
  const userId = localStorage.getItem('userId');
  const [userData, setUserData] = useState(null);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const verifyToken = async () => {
    if (!token) {
      navigate('/');
      return;
    }
    try {
      const response = await axios.post('http://higherindia.net:3006/verify-token', {
        token: token
      });
      console.log('Token is valid:', response.data);
      navigate('/ProfileDropDown');
    } catch (error) {
      console.error('Token verification failed:', error.response ? error.response.data : error.message);
      localStorage.removeItem('token');
      localStorage.removeItem('tokenExpiry');
      navigate('/');
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://higherindia.net:3006/users/id_user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const user = response.data[0];
        setUserData(user);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    if (userId) {
      fetchUserData();
    }
  }, [userId], token);

  return (
    <section className="flex overflow-hidden flex-col items-start px-4 py-3.5 bg-white rounded-lg border border-solid border-zinc-500 w-[295px]">
      <header className="flex gap-3.5">
        <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/8839e5a86c91c744ae902ecbb75ae11121a15ba11a67d20ec56f825e116dd9ef?placeholderIfAbsent=true&apiKey=f4328c4a551b4b9fa165bba17dc932db" alt="" className="object-contain shrink-0 aspect-square w-[45px]" />
        <div className="flex flex-col my-auto">
          <p className="text-xs text-neutral-600"></p>
          {userData && (
            <div className="ml-auto flex items-center gap-4">
              <div className="bg-white rounded-3xl p-2 flex items-center">
                <div className="flex flex-col">
                  <h3 className=" font-semibold text-custome-black text-[14px]">
                    {userData.first_name} {userData.last_name}<br />
                    {userData.email}
                  </h3>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
      <hr className="shrink-0 self-stretch mt-3.5 h-0 border border-solid border-zinc-400" />
      {/* <nav className="w-full">
        {profileItems.map((item, index) => (
          <ProfileItem key={index} icon={item.icon} text={item.text} />
        ))}
      </nav> */}
      <nav className="w-full">
        {profileItems.map((item, index) => (
          <ProfileItem key={index} icon={item.icon} text={item.text}
            navigate={navigate}
          />
        ))}
      </nav>

      <LogoutButton />
    </section>
  );
}
export default ProfileDropdown;