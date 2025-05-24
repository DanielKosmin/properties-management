import axios from "axios";
import { useEffect, useState } from "react";
import "../styles/properties-editor.css";

const PropertiesEdit = () => {
  const [propertiesNames, setPropertiesNames] = useState<string[]>([]);
  const [selectedPropertiesFile, setSelectedPropertiesFile] = useState("");
  const [propertiesContent, setPropertiesContent] = useState<string[]>([]);

  // Retrieve dropdown options upon startup
  useEffect(() => {
    axios
      .get<string[]>("properties-config/v1/retrieve")
      .then((res) => {
        const filtered = res.data.filter((name) => !name.includes(".git"));
        setPropertiesNames(filtered);
      })
      .catch((error) => {
        console.error("API Error ", error);
      });
  }, []);

  // retrieve .yml properties upon selecting a certain config
  const handleFileSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    const selectedFile = e.target.value;
    setSelectedPropertiesFile(selectedFile);

    axios
      .get<string[]>(
        `properties-config/v1/properties-content?fileName=${selectedFile}`
      )
      .then((res) => {
        console.log(res.data);
        setPropertiesContent(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div>
      <form>
        <div className="properties-editor-container">
          <label htmlFor="fileName">File Name:</label>
          <select
            id="fileName"
            className="input-field"
            value={selectedPropertiesFile}
            onChange={handleFileSelection}
          >
            <option value="">-- Select a file --</option>
            {propertiesNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <br />

        {selectedPropertiesFile && (
          <div className="properties-editor-container">
            <div className="side-by-side-inputs">
              <label style={{ textAlign: "center", width: "550px" }}>
                Keys
              </label>
              <label style={{ textAlign: "center", width: "550px" }}>
                Values
              </label>
            </div>

            {propertiesContent.map((line, index) => {
              const [rawKey, rawValue] = line.split("=");
              const key = rawKey?.trim() ?? "";
              let value = rawValue?.trim() ?? "";
              if (value.startsWith("'") && value.endsWith("'")) {
                value = value.substring(1, value.length - 1);
              }
              if (value.startsWith('"') && value.endsWith('"')) {
                value = value.substring(1, value.length - 1);
              }

              if (!key) return null;

              return (
                <div key={index} className="side-by-side-inputs">
                  <input value={key} className="input-field" />
                  <input value={value} className="input-field" />
                </div>
              );
            })}
          </div>
        )}
      </form>
    </div>
  );
};

export default PropertiesEdit;
