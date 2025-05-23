import "../styles/styles.css";

type FileContentProps = {
  fileContent: string[];
};

const PropertiesViewer = ({ fileContent }: FileContentProps) => {
  const processValues = (value: string) => {
    if (value.startsWith("'") && value.endsWith("'")) {
      return value.substring(1, value.length - 1);
    } else if (value.startsWith('"') && value.endsWith('"')) {
      return value.substring(1, value.length - 1);
    } else {
      return value;
    }
  };

  return (
    <div>
      {fileContent.length > 0 && (
        <table className="properties-table">
          <thead>
            <tr>
              <th>Key</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {fileContent.map((line, index) => {
              const [key, ...rest] = line.split("=");
              const value = rest.join("=");
              return (
                <tr key={index}>
                  <td>{key}</td>
                  <td>{processValues(value)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PropertiesViewer;
