import axios from "axios";
import { use, useEffect, useState } from "react";

const PropertiesComponent = () => {
  const [availableFiles, setAvailableFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFiles = () => {
    setLoading(true);
    setError(null);

    axios
      .get("properties-config/v1/retrieve")
      .then((res) => {
        setAvailableFiles(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("API Error ", error);
        setLoading(false);
        setError(error);
      });
  };

  return (
    <div>
      <button onClick={fetchFiles}>Load Config Files</button>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error: {error.message}</p>}

      <ul>
        {availableFiles.map((file) => (
          <li key={file}>{file}</li>
        ))}
      </ul>
    </div>
  );
};

export default PropertiesComponent;
