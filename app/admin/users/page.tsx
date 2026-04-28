"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function UsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get("/api/admin/users").then((res) => {
      setUsers(res.data);
    });
  }, []);

  const giveAccess = async (userId: string) => {
    await axios.post("/api/admin/give-access", {
      userId,
      productId: "invoice-recovery",
    });

    alert("Access granted");
  };

  return (
    <div className="p-6">
      <h1 className="text-xl mb-4">Users</h1>

      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u: any) => (
            <tr key={u.id}>
              <td>{u.email}</td>
              <td>
                <button
                  onClick={() => giveAccess(u.id)}
                  className="bg-green-500 text-white px-3 py-1"
                >
                  Give Access
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}