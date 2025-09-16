import React, { useState } from "react";
import axios from "axios";

function GenerateCode() {
  const [code, setCode] = useState(""); // stores the response from backend

  // function to call backend
  const generateCode = async () => {
    try {
      const response = await axios.post("http://localhost:3001/generate-code", {
        prompt: "Write React code for a button"
      });
      setCode(response.data); // save response in state
    } catch (error) {
      console.error("Error calling backend:", error);
    }
  };

  return (
    <div>
      <button onClick={generateCode}>Generate Code</button>
      <pre>{code}</pre>
    </div>
  );
}

export default GenerateCode;
