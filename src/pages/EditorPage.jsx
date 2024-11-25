import { useEffect, useRef, useState } from "react";
import Clients from "../components/Clients";
import Editor from "../components/Editor";
import { initSocket } from "../socket";
import { ACTIONS } from "../Actions";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

const EditorPage = () => {
  const socketRef = useRef(null);
  const  codeRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));

      const handleErrors = (e) => {
        console.log("socket error", e);
        toast.error("Socket connection failed,try again later");
        navigate("/");
      };
      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username,
      });

      // listening for joined event
      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId }) => {
          if (username !== location.state?.username) {
            toast.success(`${username} joined the room`);
            console.log(`${username} joined the room`);
          }
          setClients(clients);
          socketRef.current.emit(ACTIONS.SYNC_CODE,{
            code:codeRef.current,
            socketId
          }    )
        }
      );

      //listening for disconnected event 
      socketRef.current.on(ACTIONS.DISCONNECTED,({socketId,username})=>{
        toast.success(`${username} left the room`);
        setClients((prev)=>{
          return prev.filter(client=>client.socketId!==socketId)
        })
      })
    };
    init();

    return ()=>{
      socketRef.current.disconnect();
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
    }
  },[]);
  
  const copyRoomId= async()=>{
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success('Room Id has been copied to your clipboard');
    } catch (err) {
      toast.error('Could not copy room Id')
    }
  }

  const leaveRoom = ()=>{
    navigate('/')
  }
  if (!location.state) {
    return navigate("/");
  }
  return (
    <>
      <div className="mainWrap">
        <div className="aside">
          <div className="asideInner">
            <div className="logo">
              <img className="logoImage" src="/code-sync.png" alt="logo" />
            </div>
            <h3>Connected</h3>
            <div className="clientsList">
              {clients.map((client) => (
                <Clients key={client.socketId} username={client.username} />
              ))}
            </div>
          </div>
          <button className="btn copyBtn" onClick={copyRoomId}>Copy ROOM ID</button>
          <button className="btn leaveBtn" onClick={leaveRoom}> Leave</button>
        </div>
        <div className="editorWrap">
          <Editor  socketRef={socketRef}
          roomId={roomId} onCodeChange={(code)=>{codeRef.current = code}}/>
        </div>
      </div>
    </>
  );
};

export default EditorPage;
