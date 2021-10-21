import "../styles/Advertisement.css";

const Advertisement = (props) => {
  if (props.isLoggedIn) return null;

  return (
    <div>
      <div className="advertisement">
        <p>this is for advertisement</p>
      </div>
    </div>
  );
};

export default Advertisement;
