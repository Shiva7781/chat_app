import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home";
import Chat from "./components/Chat";
import { ChatState } from "./Context/ChatContextProvider";

function App() {
  let { user } = ChatState();
  const loggedIN = user || null;

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={!loggedIN ? <Home /> : <Navigate to="/chats" />}
        />
        <Route
          path="/chats"
          element={!loggedIN ? <Navigate to="/" /> : <Chat />}
        />
      </Routes>
    </div>
  );
}

export default App;
