'use client'
import { auth, db } from "@/lib/firebase"
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Logout from "../Logout/page";
import { collection, addDoc, serverTimestamp, query, where, getDocs, deleteDoc, updateDoc, doc } from "firebase/firestore";


export default function Dashboard() {
   const router = useRouter();
   const [loading, setLoading] = useState(true);
   const [user, setUser] = useState<User | null>(null);
   const [task, setTask] = useState("");
   const [tasks, setTasks] = useState<any[]>([]);
   const [filter, setFilter] = useState("all");
   const [search, setSearch] = useState("");
   const [sort , setSort] = useState("newest");

   useEffect(() => {
      if (!user) return;

      const fetchTasks = async () => {
         try {
            const q = query(collection(db, "tasks"), where("userId", "==", user.uid));
            const querySnapshot = await getDocs(q);
            const tasksData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setTasks(tasksData);
         }
         catch (e) {
            console.error("Error fetching tasks: ", e);
            alert("Failed to fetch tasks. Please try again.");
         }
      }

      fetchTasks();
   }, [user]);


   useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
         if (!currentUser) {
            router.push("/pages/Login");
         }
         else {
            setUser(currentUser);
         }
         setLoading(false);
      });
      return () => unsubscribe();
   }, [router]);


   if (loading) {
      return <h1>Loading...</h1>
   }

   if (!user) {
      return <h1>No user found</h1>
   }


   const handleAddTask = async () => {
      if (!task) return;
      try {
         await addDoc(collection(db, "tasks"), {
            title: task,
            userId: user.uid,
            complite: false,
            createdAt: serverTimestamp(),
         });
         setTasks((prevTasks) => [...prevTasks, { id: "", title: task, userId: user.uid, complete: false, createdAt: serverTimestamp() }]);

         setTask("");
      } catch (e) {
         console.error("Error adding task: ", e);
         alert("Failed to add task. Please try again.");
      }
   }

   const handleDelete = async (userId) => {
      try {
         await deleteDoc(doc(db, "tasks", userId));
         setTasks((prevTasks) => prevTasks.filter((task) => task.id !== userId));
      }
      catch (e) {
         console.error("Error deleting task: ", e);
         alert("Failed to delete task. Please try again.");
      }
   }
   const handleToggleComplete = async (task: any) => {
      try {
         await updateDoc(doc(db, "tasks", task.id), { complete: !task.complete });
         setTasks((prevTasks) => prevTasks.map((t) => t.id === task.id ? { ...t, complete: !t.complete } : t));
      }
      catch (e) {
         console.error("Error updating task: ", e);
         alert("Failed to update task. Please try again.");
      }
   }



   const filteredTasks = tasks.filter((task) => {
      if (filter === "active") return !task.complete;
      if (filter === "completed") return task.complete;
      return true;
   }).filter((task) => task.title.toLowerCase().includes(search.toLowerCase()));

const sortedTasks = [...filteredTasks].sort((a, b) => {
  if (sort === "newest") {
    return b.createdAt?.seconds - a.createdAt?.seconds;
  } else {
    return a.createdAt?.seconds - b.createdAt?.seconds;
  }
});

   return (

      <>
         <h1>Dashboard test</h1>
         <p>welcome {user.email}</p>
         <select onChange={(e) => setSort(e.target.value)}>
  <option value="newest">Newest</option>
  <option value="oldest">Oldest</option>
</select>
         <input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
         />
         <button onClick={() => setFilter("all")}>All</button>
         <button onClick={() => setFilter("active")}>Active</button>
         <button onClick={() => setFilter("completed")}>Completed</button>
         <h3>{loading ? "Loading..." : "Dashboard Content"}</h3>
         <input
            type="text"
            placeholder="Enter a new task"
            value={task}
            onChange={(e) => setTask(e.target.value)}
         />
         {sortedTasks.map((task) => (
            <div key={task.id}>

               <input
                  type="checkbox"
                  checked={task.complete}
                  onChange={() => handleToggleComplete(task)}
               />

               <span style={{
                  textDecoration: task.complete ? "line-through" : "none"
               }}>
                  {task.title}
               </span>

               <button onClick={() => handleDelete(task.id)}>
                  Delete
               </button>

            </div>
         ))}
         <button onClick={handleAddTask}>Add Task</button>
         <Logout />
      </>
   )
}