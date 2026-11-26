import { useEffect, useState } from "react";
import type { User } from "../type/types";

function UserList() {
  const [users, setUsers] = useState<User[]>([]);

  const [username, setUsername] = useState<string>("");
  const [userclass, setUserclass] = useState<string>("");
  const [userCompulsorySchoolAge, setUserCompulsorySchoolAge] =
    useState<boolean>(true);

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

  async function addUser(e: any) {
    e.preventDefault();
    const newUser = {
      nev: username.trim(),
      osztaly: userclass.trim(),
      tankoteles: userCompulsorySchoolAge,
      kredit: 0
    };
    try {
      const valasz = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(newUser),
      });
      const ujFelhasznalo: User = await valasz.json();
      setUsers((elozo) => [...elozo, ujFelhasznalo]);
      setUsername("");
      setUserclass("");
      setUserCompulsorySchoolAge(false);

    } catch (err: any) {
      console.log("Hiba történt: " + err.message);
    }
  }

  async function handleDel(id: string) {
    if (!confirm("Are you sure you want to delete this user?")) {
      return;
    }

    try {
      const valasz = await fetch(`http://localhost:3000/users/${id}`, {
        method: "DELETE",
      });
      if (!valasz.ok) {
        throw new Error("A törlés nem sikerült!")
      }
      setUsers((last) => last.filter((user) => user.id.toString() !== id))
    } catch (err: any) {
      console.log("Hiba történt: " + err.message);
    }
  }

  async function handleUserCSA(user: User) {

    try {
      const valasz = await fetch(`http://localhost:3000/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          tankoteles: !user.tankoteles
        })
      });
      if (!valasz.ok) {
        throw new Error("A törlés nem sikerült!")
      }
      setUsers((last) =>
        last.map((u) =>
          u.id === user.id ? { ...u, tankoteles: !u.tankoteles } : u,
        ),
      );
    } catch (err: any) {
      console.log("Hiba történt: " + err.message);
    }
  }

  async function handleUserCreditUp(user: User, amount: number) {
    try {
      const valasz = await fetch(`http://localhost:3000/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          kredit: user.kredit + amount
        })
      });
      if (!valasz.ok) {
        throw new Error("A törlés nem sikerült!")
      }
      setUsers((last) =>
        last.map((u) =>
          u.id === user.id ? { ...u, kredit: u.kredit + amount } : u,
        ),
      );
    } catch (err: any) {
      console.log("Hiba történt: " + err.message);
    }
  }

  async function handleUserCreditDown(user: User, amount: number) {
    try {
      const valasz = await fetch(`http://localhost:3000/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          kredit: user.kredit - amount
        })
      });
      if (!valasz.ok) {
        throw new Error("A törlés nem sikerült!")
      }
      setUsers((last) =>
        last.map((u) =>
          u.id === user.id ? { ...u, kredit: u.kredit - amount } : u,
        ),
      );
    } catch (err: any) {
      console.log("Hiba történt: " + err.message);
    }
  }

  async function handleUserCreditNull(user: User) {
    try {
      const valasz = await fetch(`http://localhost:3000/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          kredit: 0
        })
      });
      if (!valasz.ok) {
        throw new Error("A törlés nem sikerült!")
      }
      setUsers((last) =>
        last.map((u) =>
          u.id === user.id ? { ...u, kredit: 0 } : u,
        ),
      );
    } catch (err: any) {
      console.log("Hiba történt: " + err.message);
    }
  }


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
            <th>Commands</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.nev}</td>
              <td>{user.osztaly}</td>
              <td>{user.kredit}</td>
              <td>
                <input
                  type="checkBox"
                  checked={user.tankoteles}
                  onChange={() => handleUserCSA(user)}
                />
                <label htmlFor="checkBox">{(!user.tankoteles) ? "No Compulsory" : "Compulsory"}</label>
              </td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDel(user.id.toString())}
                >
                  Delete User
                </button>

                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleUserCreditUp(user, 5)}
                >
                  ➕5️⃣
                </button>

                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleUserCreditUp(user, 10)}
                >
                  ➕🔟
                </button>

                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleUserCreditDown(user, 5)}
                >
                  ➖5️⃣
                </button>

                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleUserCreditDown(user, 10)}
                >
                  ➖🔟
                </button>

                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => handleUserCreditNull(user)}
                >
                  0️⃣
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>User Add</h2>
      <form onSubmit={addUser}>
        <label htmlFor="input_userName">
          Name: <br />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <br />
        <label htmlFor="input_userClass">
          Class: <br />
          <input
            type="text"
            value={userclass}
            onChange={(e) => setUserclass(e.target.value)}
          />
        </label>
        <br />
        <label htmlFor="input_userCompulsorySchoolAge">
          Compulsory school age: <br />
          <input
            type="checkbox"
            checked={userCompulsorySchoolAge}
            onChange={(e) => setUserCompulsorySchoolAge(e.target.checked)}
          />
        </label>
        <br />
        <button type="submit">Add User</button>
      </form>
    </>
  );
}
export default UserList;
