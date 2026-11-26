import { useState } from "react";
import UserList from "./compontents/UserList";
import UserAdmin from "./compontents/UserAdmin";
import UserUpdate from "./compontents/UserUpdate";

function App() {
  const [role, setRole] = useState("user")

  return (
    <>
      <div>
        <h1>Users</h1>

        <a href="#" onClick={() => {setRole("user")}}>User</a>{" "} <br />
        <a href="#" onClick={() => {setRole("moderator")}}>Moderátor</a><br />
        <a href="#" onClick={() => {setRole("admin")}}>Admin</a><br />
        <a href="#" onClick={() => {setRole("update")}}>Update</a><br />

        {role === "user" && <UserList></UserList>}
        {role === "admin" && <UserAdmin></UserAdmin>}
        {role === "update" && <UserUpdate></UserUpdate>}
      </div>
    </>
  );
}

// npm install json-server -D

export default App;
