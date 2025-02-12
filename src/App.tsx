import { useEffect } from "react";
import { useState } from "react";

interface IUser {
  _id: string;
  name: string;
}

function AddUser(props: { loadUsers: () => void }) {
  const [userName, setUserName] = useState("");

  async function createUser() {
    await fetch(`https://api.mamaco.work/add_user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: userName,
      }),
    });
  }

  return (
    <div className="flex flex-row mt-[20px]">
      <input
        className="border mr-[10px]"
        value={userName}
        onChange={(e) => {
          setUserName(e.target.value);
        }}
        placeholder="User name"
      ></input>
      <button
        className="bg-slate-400 cursor-pointer"
        onClick={async () => {
          await createUser();
          await props.loadUsers();
        }}
      >
        Create User
      </button>
    </div>
  );
}

function UserList(props: {
  users: IUser[];
  counter: number;
  setCounter: (counter: number) => void;
  deleteUser: (userId: string) => void;
}) {
  return (
    <div className="mt-[20px]">
      <ul>
        {props.users.map((u) => {
          return (
            <li>
              (id: #{u._id}) {u.name}{" "}
              <button
                className="text-red-500 cursor-pointer"
                onClick={() => {
                  props.deleteUser(u._id);
                }}
              >
                delete user
              </button>
            </li>
          );
        })}
      </ul>

      <button
        className="bg-slate-400 cursor-pointer"
        onClick={() => {
          props.setCounter(props.counter + 1);
        }}
      >
        Reload Users
      </button>
    </div>
  );
}

function App() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [counter, setCounter] = useState(0);

  async function loadUsers() {
    console.log(`Loading users... ${counter}`);
    const response = await fetch("https://api.mamaco.work/users");
    const responseJSON = (await response.json()) as { allUsers: IUser[] };

    setUsers(responseJSON.allUsers);
  }

  async function deleteSingleUser(userId: string) {
    await fetch("https://api.mamaco.work/user", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
      }),
    });
  }

  useEffect(() => {
    loadUsers();
  }, [counter]);

  return (
    <div className="w-full h-full p-4">
      <UserList
        users={users}
        counter={counter}
        setCounter={(counter) => {
          setCounter(counter + 1);
        }}
        deleteUser={async (userId) => {
          await deleteSingleUser(userId);
          await loadUsers();
        }}
      />
      <AddUser loadUsers={loadUsers} />
    </div>
  );
}

export default App;
