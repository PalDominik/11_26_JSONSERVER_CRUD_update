import { useEffect, useState } from "react";
import type { User } from "../type/types";

function UserList() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch("http://localhost:3000/users");
        const data: User[] = await response.json();
        setUsers(data);
      } catch (err: any) {
        console.log("hiba történt:" + err.message);
      }
    }
    fetchUsers();
  }, []);

  return (
    <>
      <h2>User List</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Class</th>
            <th>Credit</th>
            <th>Compulsory-school-age</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.nev}</td>
              <td>{user.osztaly}</td>
              <td>{user.kredit}</td>
              <td>
                {(!user.tankoteles) ? "No Compulsory ❌" : "Compulsory ✅"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
export default UserList;
