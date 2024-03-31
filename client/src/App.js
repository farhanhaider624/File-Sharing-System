import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import { uploadFile } from "./service/api";

function App() {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState("");
  const [expirationTime, setExpirationTime] = useState("");
  const [result, setResult] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const fileInputRef = useRef();

  useEffect(() => {
    const getImage = async () => {
      if (file) {
        try {
          setUploading(true);
          const data = new FormData();
          data.append("name", file.name);
          data.append("file", file);
          data.append("password", password); // Pass password to the backend
          data.append("expirationTime", expirationTime); // Pass expiration time to the backend
          const response = await uploadFile(data);
          setResult(response.path);
          setError(null);
        } catch (error) {
          setError("Failed to upload file. Please try again.");
        } finally {
          setUploading(false);
        }
      }
    };
    getImage();
  }, [file, password, expirationTime]);

  const onUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <div className="container">
      <div className="wrapper">
        <h1>Simple File Sharing!</h1>
        <p>Upload and share the download link.</p>

        <button onClick={() => onUploadClick()}>Upload</button>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={(e) => handleFileChange(e)}
        />

        {result && (
          <a href={result} target="_blank">
            {result}
          </a>
        )}
        {uploading && <p>Uploading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <label className="password_label">Password:</label>
        <input
          className="password-field"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label>Expiration Time (in minutes):</label>
        <input
          type="number"
          value={expirationTime}
          onChange={(e) => setExpirationTime(e.target.value)}
        />
      </div>
    </div>
  );
}

export default App;
