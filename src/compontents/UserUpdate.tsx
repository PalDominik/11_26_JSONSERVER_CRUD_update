import { useEffect, useState } from "react";
import type { User } from "../type/types";






function UpdateList() {
  const [users, setUsers] = useState<User[]>([]);
  const [editId,setEditId] = useState<string | null>(null);
  const [nev,setNev] = useState<string>("");
  const [osztaly,setOsztaly] = useState<string>("");
  const [kredit,setKredit] = useState<number>(0);
  const [tankoteles,setTankoteles] = useState<boolean>(false)

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


    function editUser(user:User)
    {
      setEditId(user.id);
      setNev(user.nev);
      setOsztaly(user.osztaly)
      setKredit(user.kredit)
      setTankoteles(user.tankoteles);

    }


    async function updateUser() {
        if(editId === null) return;
        const updateUser : User = {
            id: editId,
            nev: nev,
            osztaly: osztaly,
            kredit: kredit,
            tankoteles: tankoteles
        };
        console.log(updateUser)
        try {
            const response = await fetch("http://localhost:3000/users/"+editId, {
                method: "PATCH",
                headers: {"Content-type": "application/json"},
                body: JSON.stringify(updateUser),
            });
            if(!response.ok)
            {
                throw new Error("A módosítás nem sikerült")
            }
            setUsers( (elozo) => elozo.map(
                        (user) => user.id === editId ? updateUser : user)
            );
        } catch (error) {
            console.log("Hiba:" +error.message)
        }
    }

    function cancelEdit(): void {
        setEditId(null);
        setNev("");
        setOsztaly("");
        setKredit(0);
        setTankoteles(false);
    }

  return (
    <>
      <h2>User Update</h2>
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
                {(!user.tankoteles) ? "No Compulsory ❌" : "Compulsory ✅"}
              </td>

              <td>
                <button className="btn btn-primary-outline"
                onClick={() => editUser(user)}
                >⚙️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    {editId !== null && (
        <div className="card p-3 mt-4">
          <h3>User Update</h3>

          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              className="form-control"
              type="text"
              value={nev}
              onChange={(e) => setNev(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Class</label>
            <input
              className="form-control"
              type="text"
              value={osztaly}
              onChange={(e) => setOsztaly(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Credit</label>
            <input
              className="form-control"
              type="number"
              value={kredit}
              onChange={(e) => setKredit(Number(e.target.value))}
            />
          </div>

          <div className="mb-3 form-check">
            <input
              className="form-check-input"
              type="checkbox"
              checked={tankoteles}
              onChange={(e) => setTankoteles(e.target.checked)}
            />
            <label className="form-check-label">
              Compulsory-school-age
            </label>
          </div>

          <button className="btn btn-success me-2" onClick={updateUser}>
            Mentés
          </button>

          <button className="btn btn-secondary" onClick={cancelEdit}>
            Mégse
          </button>
        </div>
        )}
    </>
  );
}


export default UpdateList;
