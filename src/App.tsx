import { useContext, useEffect, useState } from "react";
import { app, db } from "firebaseApp";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Router from './components/Router';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "components/Loader";
import ThemeContext from "context/ThemeContext";

function App() {
  const context = useContext(ThemeContext);
  const auth = getAuth(app);
  // console.log(auth);
  // console.log(db);
  
  // auth를 체크하기 전에 (initialize 전)에는 loader를 듸워주는 용도
  const [init, setInit] = useState<boolean>(false);
  // auth의 currentUser가 있으면 authenticated로 변경
  const [isAuthenticated, setisAuthenticated] = useState<boolean>(
    !!auth?.currentUser
  );

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setisAuthenticated(true);
      } else {
        setisAuthenticated(false);
      }
      setInit(true);
    });
  }, [auth] );
  
  return (
    <div className={context.theme === "light" ? "white" : "dark"}>
      <ToastContainer />
      {init ? <Router isAuthenticated={isAuthenticated} /> : <Loader />}
    </div>
  );
}

export default App;
