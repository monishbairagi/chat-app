import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import ChatInput from "./ChatInput";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { sendMessageRoute, recieveMessageRoute } from "../utils/APIRoutes";

export default function ChatContainer({ currentChat, socket }) {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef();
  const [arrivalMessage, setArrivalMessage] = useState(null);

  useEffect(async () => {
    const data = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
    const response = await axios.post(recieveMessageRoute, {
      from: data._id,
      to: currentChat._id,
    });
    setMessages(response.data);
  }, [currentChat]);

  useEffect(() => {
    const getCurrentChat = async () => {
      if (currentChat) {
        await JSON.parse(
          localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
        )._id;
      }
    };
    getCurrentChat();
  }, [currentChat]);

  const handleSendMsg = async (msg) => {
    const data = await JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
    );
    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: data._id,
      msg,
    });
    await axios.post(sendMessageRoute, {
      from: data._id,
      to: currentChat._id,
      message: msg,
    });

    const msgs = [...messages];
    msgs.push({ fromSelf: true, message: msg });
    setMessages(msgs);
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
  }, []);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getFullDate = (date) => {
    const d = (date) ? new Date(date) : new Date();;
    const myDate = [d.getDate(), d.getMonth() + 1, d.getFullYear()].join('/');
    var myTime = [d.getHours(), d.getMinutes(), d.getSeconds()].join(':');

    myTime = myTime.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [myTime];

    if (myTime.length > 1) { // If time format correct
      myTime = myTime.slice(1);  // Remove full string match value
      myTime[5] = +myTime[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
      myTime[0] = +myTime[0] % 12 || 12; // Adjust hours
    }
    myTime = myTime.join('');
    return myDate + " " + myTime;
  }

  return (
    <MyContainer>
      <div className="chat-header">
        <div className="user-details">
          <div className="avatar">
            <img src={currentChat.avatarImage} alt="avatarImage" />
          </div>
          <div className="username">
            <h3>{currentChat.displayName}</h3>
          </div>
        </div>
      </div>
      <div className="chat-messages">
        {messages.map((message) => {
          return (
            <div ref={scrollRef} key={uuidv4()}>
              <div
                className={`message ${message.fromSelf ? "sended" : "recieved"}`
                }>
                <div className="messages">
                  <p>{message.message}</p>
                  <p className="time">{getFullDate(message.createdAt)}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <ChatInput handleSendMsg={handleSendMsg} />
    </MyContainer>
  );
}

const MyContainer = styled.div`
  display: grid;
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
  /* @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  } */
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    background-color: black;
    .user-details {
      display: flex;
      align-items: center;
      gap: .5rem;
      .avatar {
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
          color: white;
        }
      }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .messages {
        min-width: 20%;
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        padding-bottom: 5px;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: white;
        box-shadow: 0 19px 38px rgba(0, 0, 0, 0.5);
        p {
          margin: 0;
          padding: 0;
        }
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
      .time {
        font-size: 10px;
        color: white;
        margin: 0;
        padding: 0;
        text-align: right;
      }
    }
    .sended {
      justify-content: flex-end;
      .messages {
        background: linear-gradient(165deg, rgba(59,0,96,1) 41%, rgba(14,38,237,1) 100%);
      }
    }
    .recieved {
      justify-content: flex-start;
      .messages {
        background: linear-gradient(165deg, rgba(123,177,0,1) 0%, rgba(0,108,88,1) 100%);
      }
    }
  }
`;
