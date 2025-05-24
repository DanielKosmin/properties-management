import axios from "axios";
import { useEffect, useState } from "react";
import "../styles/styles.css";
import PropertiesViewer from "./PropertiesViewer";

interface UpdatePropertyPayload {
  fileName: string;
  propertyKey: string;
  newValue: string;
}

const PropertyEditor = () => {
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [fileContent, setFileContent] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [key, setKey] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const [status, setStatus] = useState<string | null>(null);
  const [showKeyToUpdate, setShowKeyToUpdate] = useState<boolean>(false);
  const [showValueToUpdate, setShowValueToUpdate] = useState<boolean>(false);

  // Retrieve dropdown options upon startup
  useEffect(() => {
    axios
      .get<string[]>("properties-config/v1/retrieve")
      .then((res) => {
        const filtered = res.data.filter((name) => !name.includes(".git"));
        setFileNames(filtered);
      })
      .catch((error) => {
        console.error("API Error ", error);
      });
  }, []);

  // retrieve .yml properties upon selecting a certain config
  const handleFileSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    const selectedFile = e.target.value;
    setFileName(selectedFile);

    axios
      .get<string[]>(
        `properties-config/v1/properties-content?fileName=${selectedFile}`
      )
      .then((res) => {
        setShowKeyToUpdate(true);
        setFileContent(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  // grab custom data prop from option to display corresponding key with value pair
  const handleKeySelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = e.target.selectedOptions[0];
    let correspondingValue =
      selectedOption.getAttribute("data-value")?.trim() ?? "";
    if (
      (correspondingValue.startsWith("'") &&
        correspondingValue.endsWith("'")) ||
      (correspondingValue.startsWith('"') && correspondingValue.endsWith('"'))
    ) {
      setValue(correspondingValue.substring(1, correspondingValue.length - 1));
    } else {
      setValue(correspondingValue);
    }
    setKey(e.target.value);
    setShowValueToUpdate(true);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload: UpdatePropertyPayload = {
      fileName,
      propertyKey: key,
      newValue: value,
    };

    axios
      .put("/properties-config/v1/update", payload)
      .then((res) => {
        setStatus("Updated successfully");
        setFileName("");
        setKey("");
        setValue("");
        setShowKeyToUpdate(false);
        setShowValueToUpdate(false);
        setFileContent([]);
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
        <label htmlFor="fileName">File Name:</label>
        <select
          id="fileName"
          className="input-field"
          value={fileName}
          onChange={handleFileSelection}
        >
          <option value="">-- Select a file --</option>
          {fileNames.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>

        <br />

        {showKeyToUpdate && (
          <>
            <label htmlFor="key">Key:</label>
            <select
              id="keySelection"
              className="input-field"
              value={key}
              onChange={handleKeySelection}
            >
              <option value="">-- Select a key --</option>
              {fileContent.map((line, index) => {
                const lineContent = line.split("=");
                const key = lineContent[0].trim();
                return (
                  <option
                    key={index}
                    value={key}
                    data-value={lineContent[1].trim()}
                  >
                    {key}
                  </option>
                );
              })}
            </select>
          </>
        )}

        <br />

        {showValueToUpdate && (
          <>
            <label htmlFor="value">Value:</label>
            <input
              id="value"
              className="input-field"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </>
        )}

        <br />

        {showKeyToUpdate && showValueToUpdate && (
          <button type="submit" className="submit-button">
            Update Property
          </button>
        )}
      </form>
      <PropertiesViewer fileContent={fileContent} />
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
