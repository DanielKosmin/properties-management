import axios from "axios";
import { useEffect, useState } from "react";
import "../styles/styles.css";

const PropertyEditor = () => {
  const [fileNames, setFileNames] = useState([]);
  const [fileName, setFileName] = useState("");
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [status, setStatus] = useState(null);

  useEffect(() => {
    axios
      .get("properties-config/v1/retrieve")
      .then((res) => {
        const filtered = res.data.filter((name) => !name.includes(".git"));
        setFileNames(filtered);
      })
      .catch((error) => {
        console.error("API Error ", error);
      });
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .put("/properties-config/v1/update", {
        fileName,
        propertyKey: key,
        newValue: value,
      })
      .then((res) => {
        setStatus("Updated successfully");
        setFileName("");
        setKey("");
        setValue("");
        console.log(res.data);
        setTimeout(() => {
          setStatus(null);
        }, 3000);
      })
      .catch((err) => {
        setStatus("Update failed");
        console.error(err);
      });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          File Name:
          <select
            className="input-field"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
          >
            <option value="">-- Select a file --</option>
            {fileNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Key:
          <input
            className="input-field"
            value={key}
            onChange={(e) => setKey(e.target.value)}
          />
        </label>
        <br />
        <label>
          Value:
          <input
            className="input-field"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Update Property</button>
      </form>
      {status && (
        <p
          className={
            status === "Updated successfully"
              ? "status-success"
              : "status-error"
          }
        >
          {status}
        </p>
      )}{" "}
    </div>
  );
};

export default PropertyEditor;
