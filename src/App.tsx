import Router from './components/Router';
import { useState } from "react";
import { app } from "firebaseApp";
import { getAuth } from "firebase/auth";

function App() {
  const auth = getAuth(app);
  console.log(auth);
  const [isAuthenticated, setisAuthenticated] = useState<boolean>(
    !!auth?.currentUser
  );
  
  return (
    <>
      <Router isAuthenticated={isAuthenticated} />
    </>
  );
}

export default App;
