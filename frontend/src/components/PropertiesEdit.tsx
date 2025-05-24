import axios from "axios";
import { useEffect, useState } from "react";
import "../styles/properties-editor.css";

const PropertiesEdit = () => {
  const [propertiesNames, setPropertiesNames] = useState<string[]>([]);
  const [selectedPropertiesFile, setSelectedPropertiesFile] = useState("");
  const [propertiesContent, setPropertiesContent] = useState<string[]>([]);
  const [editedValues, setEditedValues] = useState<{ [key: string]: string }>(
    {}
  );
  const [originalValues, setOriginalValues] = useState<{
    [key: string]: string;
  }>({});

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
        const object: { [key: string]: string } = {};
        res.data.forEach((line) => {
          const [rawKey, rawValue] = line.split("=");
          const key = rawKey?.trim();
          let value = rawValue?.trim() ?? "";
          if (value.startsWith("'") && value.endsWith("'")) {
            value = value.slice(1, -1);
          } else if (value.startsWith('"') && value.endsWith('"')) {
            value = value.slice(1, -1);
          }
          if (key) object[key] = value;
        });
        setPropertiesContent(res.data);
        setOriginalValues(object);
        setEditedValues(object);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleSubmit = () => {
    const changes: { [key: string]: string } = {};

    Object.entries(editedValues).forEach(([key, newValue]) => {
      if (newValue !== originalValues[key]) {
        changes[key] = newValue;
      }
    });

    if (Object.keys(changes).length === 0) {
      alert("No changes to submit.");
      return;
    }

    alert("TODO: adding support for multiple updates");

    // axios
    //   .put("/properties-config/v1/update", {
    //     fileName: selectedPropertiesFile,
    //     updatedProperties: changes,
    //   })
    //   .then(() => {
    //     alert("Properties updated successfully.");
    //     setOriginalValues({ ...editedValues }); // sync original to new
    //   })
    //   .catch((err) => {
    //     console.error("Update failed", err);
    //     alert("Failed to update properties.");
    //   });
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

            {Object.entries(editedValues).map(([key, value], index) => (
              <div key={index} className="side-by-side-inputs">
                <input value={key} readOnly className="input-field" />
                <input
                  value={value}
                  className="input-field"
                  onChange={(e) =>
                    setEditedValues((prev) => ({
                      ...prev,
                      [key]: e.target.value,
                    }))
                  }
                />
              </div>
            ))}

            <button
              type="button"
              className="submit-button"
              onClick={() => handleSubmit()}
            >
              Submit Changes
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default PropertiesEdit;
