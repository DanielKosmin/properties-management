const MessageDisplay = ({ loading, error, message }) => {
  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  return <p>{message}</p>;
};

export default MessageDisplay;
