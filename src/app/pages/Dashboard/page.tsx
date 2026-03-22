'use client'
import { auth, db } from "@/lib/firebase"
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Logout from "../Logout/page";
import { collection, addDoc, serverTimestamp , query, where, getDocs } from "firebase/firestore";


export default function Dashboard() {
   const router = useRouter();
   const [loading, setLoading] = useState(true);
   const [user, setUser] = useState<User | null>(null);
   const [task, setTask] = useState("");
   const [tasks, setTasks] = useState<any[]>([]);


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







   return (

      <>
         <h1>Dashboard test</h1>
         <p>welcome {user.email}</p>
         <h3>{loading ? "Loading..." : "Dashboard Content"}</h3>
         <input
            type="text"
            placeholder="Enter a new task"
            value={task}
            onChange={(e) => setTask(e.target.value)}
         />
         {tasks.map((task) => (
            <div key={task.id}>
               <p>{task.title}</p>
            </div>
         ))}
         <button onClick={handleAddTask}>Add Task</button>
         <Logout />
      </>
   )
}