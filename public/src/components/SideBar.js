import axios from "axios";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Button, Dropdown } from "react-bootstrap";
import Logo from "../assets/logo.png";
import Menu from "../assets/three_dots.png";
import { getCurrentUserRoute, logoutRoute } from "../utils/APIRoutes";
import { useNavigate } from "react-router-dom";

export default function SideBar({ contacts, changeChat }) {
  const navigate = useNavigate();

  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);

  useEffect(async () => {
    const userData = await JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY));
    setCurrentUserName(userData.displayName);

    const { data } = await axios.get(`${getCurrentUserRoute}/${userData._id}`);
    setCurrentUserImage(data.avatarImage);
  }, []);
  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    changeChat(contact);
  };

  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <a
      href=""
      ref={ref}
      onClick={e => {
        e.preventDefault();
        onClick(e);
      }}
    >
      {children}
      <img className="three-dots" src={Menu} />
    </a>
  ));

  const logout = async () => {
    const id = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    )._id;
    const data = await axios.get(`${logoutRoute}/${id}`);
    if (data.status === 200) {
      localStorage.clear();
      window.location.reload();
    }
  };
  return (
    <>
      {currentUserImage && (
        <Container>
          <div className="container">
            <div className="small-profile">
              <img className="avatar" src={currentUserImage} alt="avatar" />
              <div className="username">
                <h3>{currentUserName}</h3>
              </div>
            </div>
            <Dropdown>
              <Dropdown.Toggle as={CustomToggle} />
              <Dropdown.Menu size="sm">
                <Dropdown.Item onClick={() => { navigate("/edit-profile") }}>Edit Profile</Dropdown.Item>
                <Dropdown.Item onClick={() => { logout() }} >Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>

          <div className="contacts">
            {contacts.map((contact, index) => {
              return (
                <div
                  key={contact._id}
                  className={`contact ${index === currentSelected ? "selected" : ""
                    }`}
                  onClick={() => changeCurrentChat(index, contact)}>
                  <div className="contact-avatar">
                    <img src={contact.avatarImage} alt="avatarImage" />
                  </div>
                  <div className="username">
                    <h3>{contact.displayName}</h3>
                  </div>
                </div>
              );
            })}
          </div>
          {/* <div className="brand">
            <img src={Logo} alt="logo" />
            <h3>ChatUp</h3>
          </div> */}
        </Container>
      )}
    </>
  );
}
const Container = styled.div`
  display: grid;
  grid-template-rows: 10% 75% 15%;
  overflow: hidden;
  background-color: #080420;
  .brand {
    display: flex;
    align-items: center;
    gap: .5rem;
    justify-content: center;
    img {
      height: 2.5rem;
    }
    h3 {
      color: white;
    }
  }
  .contacts {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    gap: 0.1rem;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .contact {
      background-color: #ffffff34;
      min-height: 5rem;
      cursor: pointer;
      width: 98%;
      border-radius: 0.2rem;
      padding: 0.4rem;
      display: flex;
      gap: .5rem;
      align-items: center;
      transition: 0.5s ease-in-out;
      .contact-avatar {
        img {
          object-fit: cover;
          height: 3.5rem;
          width: 3.5rem;
          align-self: center;
          border-radius: 5rem;
          /* border: 0.2rem solid #4e0eff; */
        }
      }
      .username {
        h3 {
          font-size: 1.5rem;
          color: white;
        }
      }
    }
    .selected {
      background-color: #9a86f3;
    }
  }

  .container {
    background-color: #080420;
    display: flex;
    align-items: center;
    gap: .5rem;
    justify-content: space-between;
    .small-profile {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 5px;
    }
    .avatar {
        object-fit: cover;
        height: 3.5rem;
        width: 3.5rem;
        align-self: center;
        border-radius: 5rem;
        /* border: 0.2rem solid #4e0eff; */
      }
    .username {
      h3 {
        color: white;
      }
    }
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      gap: 0.5rem;
      .username {
        h3 {
          font-size: 1rem;
        }
      }
    }
  }

  .three-dots{
    width: .4rem;
    filter: invert(100%);
    &:hover {
      filter: invert(80%);
    }
  }
`;
