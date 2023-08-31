import { useDispatch, useSelector } from "react-redux";
import { GoogleLogin, GoogleLogout } from "react-google-login";
import {
  handleLogin,
  handleLogout,
  handleErrors,
} from "../../lib/redux/reducers/user";

const styles = {
  img: {
    borderRadius: "50%",
    width: "32px",
    height: "32px",
    border: "2px solid #bdc3c7",
  },
  dropdown: {
    background: "transparent",
    borderColor: "transparent",
  },
};

const GoogleBtn = () => {
  const CLIENT_ID =
    "64712721746-s3pnm79t8ltv8h9i7gu6422vt21pthmv.apps.googleusercontent.com";
  const dispatch = useDispatch();
  const {current} = useSelector((state) => state.user);

  const handleLoginSuccess = (response) => {
    dispatch(handleLogin(response.profileObj));
    console.log(response);
  };

  const handleLogoutSuccess = () => dispatch(handleLogout());

  const handleLoginFailure = (response) =>
    dispatch(handleErrors({ ...response.error, ...response.details }));
  const handleLogoutFailure = (response) =>
    dispatch(handleErrors({ ...response.error, ...response.details }));
  return (
    <>
      {current ? (
        <>
          <div className="dropdown">
            <button
              className="btn btn-secondary dropdown-toggle"
              type="button"
              id="dropdownMenuButton2"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img
                width="32"
                height="32"
                src={current?.imageUrl}
                style={styles.img}
                alt="profile"
              />
            </button>
            <ul
              style={styles.dropdown}
              className="dropdown-menu dropdown-menu-dark"
              aria-labelledby="dropdownMenuButton2"
            >
              <li>
                <GoogleLogout
                  clientId={CLIENT_ID}
                  buttonText="Logout"
                  onLogoutSuccess={handleLogoutSuccess}
                  onFailure={handleLogoutFailure}
                />
              </li>
            </ul>
          </div>
        </>
      ) : (
        <GoogleLogin
          clientId={CLIENT_ID}
          buttonText="Login"
          onSuccess={handleLoginSuccess}
          onFailure={handleLoginFailure}
          cookiePolicy={"single_host_origin"}
          responseType="code,token"
          isSignedIn={true}
        />
      )}
    </>
  );
};
export default GoogleBtn;
