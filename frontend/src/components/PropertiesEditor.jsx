import axios from "axios";
import { useState } from "react";

const PropertyEditor = () => {
  const [fileName, setFileName] = useState("");
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [status, setStatus] = useState(null);

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
        console.log(res.data);
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
          <input
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
          />
        </label>
        <br />
        <label>
          Key:
          <input value={key} onChange={(e) => setKey(e.target.value)} />
        </label>
        <br />
        <label>
          Value:
          <input value={value} onChange={(e) => setValue(e.target.value)} />
        </label>
        <br />
        <button type="submit">Update Property</button>
      </form>

      {status && <p>{status}</p>}
    </div>
  );
};

export default PropertyEditor;
