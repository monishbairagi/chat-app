import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from "styled-components";
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import Logo from '../assets/logo.png';
import Camera from '../assets/camera.png';
import { getCurrentUserRoute, setAvatarRoute } from '../utils/APIRoutes';

const EditProfile = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [avatarImage, setAvatarImage] = useState("");

    useEffect(() => {
        async function fetchData() {
            const userData = JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY));
            if (!userData) {
                navigate("/login");
            } else {
                const { data } = await axios.get(`${getCurrentUserRoute}/${userData._id}`);
                setName(data.displayName);
                setAvatarImage(data.avatarImage);
            }
        }
        fetchData();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const toastOptions = {
        position: "bottom-center",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (handleValidation()) {
            const user = await JSON.parse(
                localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
            );

            const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
                name: name,
                image: avatarImage,
            });

            if (data.isSet) {
                user.isAvatarImageSet = data.isSet;
                user.displayName = data.displayName;
                localStorage.setItem(process.env.REACT_APP_LOCALHOST_KEY,
                    JSON.stringify(user));
                navigate("/");
            } else {
                toast.error("Error setting avatar. Please try again.", toastOptions);
            }
        }
    }

    const handleValidation = () => {
        if (name === "")
            toast.error("Name can't be empty.", toastOptions);
        return (name !== "") ? true : false;
    }

    const UploadImage = async (e) => {
        const file = e.target.files[0];
        const base64 = await convertBase64(file);
        setAvatarImage(base64);
    }
    const convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);

            fileReader.onload = () => {
                resolve(fileReader.result);
            };

            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };

    return (
        <>
            <FormContainer>
                <form onSubmit={(e) => handleSubmit(e)}>
                    <div className='brand'>
                        <img src={Logo} alt='logo' />
                        <h1>ChatsUp</h1>
                    </div>
                    <img className='avatar' src={avatarImage} alt='avatar' />
                    <div className="change-avatar">
                        <label htmlFor="file-input">
                            <img src={Camera} alt='camera' />
                        </label>
                        <input id="file-input" type="file" onChange={(e) => { UploadImage(e) }} />
                    </div>
                    <input type="text" placeholder="Name" name="name" value={name} onChange={(e) => { setName(e.target.value) }} />
                    <button type="submit">Save</button>
                </form>
            </FormContainer>
            <ToastContainer />
        </>
    )
}

const FormContainer = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
    align-items: center;
    background: linear-gradient(35deg, rgba(96,0,0,1) 10%, rgba(120,9,121,1) 60%, rgba(0,47,116,1) 100%);
    .brand {
        display: flex;
        align-items: center;
        gap: .5rem;
        justify-content: center;
        img {
        height: 2.5rem;
        }
        h1 {
        color: white;
        
        }
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        background-color: #00000076;
        border-radius: 2rem;
        padding: 3rem 5rem;
        box-shadow: 0 19px 38px rgba(0, 0, 0, 0.8);
    }
    input {
        background-color: transparent;
        padding: 1rem;
        border: 0.1rem solid #d400d4;
        border-radius: 0.4rem;
        color: white;
        width: 100%;
        font-size: 1rem;
        &:focus {
        border: 0.1rem solid #ff00ff;
        outline: none;
        }
    }
    button {
        background-color: #d400d4;
        color: white;
        padding: 1rem 2rem;
        border: none;
        font-weight: bold;
        cursor: pointer;
        border-radius: 0.4rem;
        font-size: 1rem;
        
        &:hover {
        background-color: #ff00ff;
        }
    }
    .avatar {
        object-fit: cover;
        height: 10rem;
        width: 10rem;
        align-self: center;
        border-radius: 5rem;
        /* border: 0.2rem solid #4e0eff; */
    }
    .change-avatar {
        align-self: center;
        margin-top: -70px;
        margin-right: -110px;
        label>img {
            width: 3rem;
            border-radius: 5rem;
        }
        input {
            display: none;
        }
    }
`;

export default EditProfile