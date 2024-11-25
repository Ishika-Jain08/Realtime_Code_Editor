import { useEffect, useRef } from "react";
import "codemirror/mode/javascript/javascript";
import "codemirror/theme/ayu-dark.css";
import "codemirror/lib/codemirror.css";
import Codemirror from "codemirror";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import { ACTIONS } from "../Actions";

const Editor = ({ socketRef, roomId ,onCodeChange}) => {
  const editorRef = useRef();

  useEffect(() => {
    async function init() {
      editorRef.current = Codemirror.fromTextArea(
        document.getElementById("realtimeEditor"),
        {
          mode: { name: "javascript", json: true },
          theme: "ayu-dark",
          autoCloseTags: true,
          autoCloseBrackets: true,
          lineNumbers: true,
        }
      );

      editorRef.current.on("change", (instance, changes) => {
        console.log(changes);
        const { origin } = changes;
        const code = instance.getValue();
        onCodeChange(code);
        if (origin !== "setValue") {
          socketRef.current.emit(ACTIONS.CODE_CHANGE, {
            roomId,
            code,
          });
        }
      });
      
    }
    init();
  }, []);
  useEffect(()=>{
    if (socketRef.current) {
      socketRef.current.on(ACTIONS.CODE_CHANGE,({code})=>{
        if(code!==null){
          editorRef.current.setValue(code);
        }
      })
    }

    return()=>{
      socketRef.current.off(ACTIONS.CODE_CHANGE)
    }
  },[socketRef.current])
  return (
    <>
      <textarea id="realtimeEditor"></textarea>
    </>
  );
};

export default Editor;
