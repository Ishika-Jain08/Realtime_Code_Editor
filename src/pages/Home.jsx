import React, { useState } from "react";
import { v4 as uuidV4 } from "uuid";
import toast from 'react-hot-toast'
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [roomId, setRoomId] = useState("");
  const [username ,setUsername] = useState(''); 
  const navigate = useNavigate();

  //! random new id generated
  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidV4();
    setRoomId(id);
    toast.success('Created a new room');
    // console.log(id);
  };
  //! join room with authentication
  const joinRoom=()=>{
    if (!roomId || !username) {
        toast.error('ROOM ID & username is required');
        return;
    }
// redirect
navigate(`/editor/${roomId}`,{
    state:{
        username, 
    }
})
  }

  //! press enter and switch the editor page
  const handleInputEnter=(e)=>{
    if (e.code === 'Enter') {
        joinRoom();
    }
  }
  return (
    <>
      <div className="homePageWrapper">
        <div className="formWrapper">
          <img src="/code-sync.png" alt="code-sync-logo" />
          <h4 className="mainLabel">Paste invitation ROOM ID</h4>
          <div className="inputGroup">
            <input type="text" className="inputBox" placeholder="ROOM ID"  value={roomId} onChange={(e)=>setRoomId(e.target.value)} onKeyUp={handleInputEnter}/>
            <input type="text" className="inputBox" placeholder="USERNAME" onChange={(e)=>setUsername(e.target.value)} value={username} onKeyUp={handleInputEnter} />
            <button className="btn joinBtn" onClick={joinRoom}>Join</button>
            <span className="createInfo">
              If you don't have an invite then create &nbsp;
              <a href="" className="createNewBtn" onClick={createNewRoom}>
                new roomID
              </a>
            </span>
          </div>
        </div>
        <footer>
          <h4>
            Built with 🩵 by <a href="">Ishika Jain</a>
          </h4>
        </footer>
      </div>
    </>
  );
};

export default Home;
