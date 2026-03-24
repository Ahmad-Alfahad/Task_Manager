'use client'
import { auth, db } from "@/lib/firebase"
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Logout from "../Logout/page";
import { collection, addDoc, serverTimestamp, query, where, getDocs, deleteDoc, updateDoc, doc } from "firebase/firestore";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";

export default function Dashboard() {
   const router = useRouter();
   const [loading, setLoading] = useState(true);
   const [user, setUser] = useState<User | null>(null);
   const [task, setTask] = useState("");
   const [tasks, setTasks] = useState<any[]>([]);
   const [filter, setFilter] = useState("all");
   const [search, setSearch] = useState("");
   const [sort, setSort] = useState("newest");

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
      if (filter === "complete") return task.complete;
      return true;
   }).filter((task) => task.title.toLowerCase().includes(search.toLowerCase()));

   const sortedTasks = [...filteredTasks].sort((a, b) => {
      if (sort === "newest") {
         return b.createdAt?.seconds - a.createdAt?.seconds;
      } else {
         return a.createdAt?.seconds - b.createdAt?.seconds;
      }
   });

   const total = tasks.length;
   const completed = tasks.filter(t => t.complete).length;
   const progress = total === 0 ? 0 : (completed / total) * 100;

   let color = "bg-red-500";

   if (progress > 70) color = "bg-green-500";
   else if (progress > 30) color = "bg-yellow-500";

   return (


      <div className="min-h-screen  bg-gray-100 w-full">
         <div className="m-8 bg-gray-200 relative rounded-lg shadow p-6">
            <div className="flex justify-between items-center p-2 ">
               <h1 className="text-xl font-bold">Task Manager</h1>

               <Logout />
            </div>


            <div bg-rounded-lg p-7 className="flex gap-4 m-4 ">
               <input
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                  placeholder="Add new task..."
                  className="flex-1 border rounded px-3 py-2"
               />
               <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddTask}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
               >
                  Add
               </motion.button>
            </div>


            <div className="flex justify-between items-center p-4">

               <div className="flex gap-2">
                  <motion.button
                     whileHover={{ scale: 1.05 }}
                     whileTap={{ scale: 0.95 }}
                     onClick={() => setFilter("all")}
                     className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                     All
                  </motion.button>
                  <motion.button
                     whileHover={{ scale: 1.05 }}
                     whileTap={{ scale: 0.95 }}
                     onClick={() => setFilter("active")}
                     className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                     Active
                  </motion.button>
                  <motion.button
                     whileHover={{ scale: 1.05 }}
                     whileTap={{ scale: 0.95 }}
                     onClick={() => setFilter("complete")}
                     className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                     Done
                  </motion.button>
               </div>
               <div className="flex gap-2 bg-gray-200 p-1 rounded-lg w-fit relative">

                  <motion.div
                     layout
                     className="absolute bg-white rounded-md shadow h-full"
                     style={{
                        width: sort === "newest" ? "90px" : "90px",
                        left: sort === "newest" ? 0 : "95px"
                     }}
                  />

                  <button
                     onClick={() => setSort("newest")}
                     className="px-3 py-1 text-sm relative z-10"
                  >
                     ⬇Newest
                  </button>

                  <button
                     onClick={() => setSort("oldest")}
                     className="px-3 py-1 text-sm relative z-10"
                  >
                     ⬆Oldest
                  </button>

               </div>
               <input
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border px-3 py-1 rounded"
               />


            </div>





            <div className="p-4 space-y-2 max-h-[290px] overflow-y-auto">
               <AnimatePresence>
                  {sortedTasks.map((task) => (
                     <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className=" flex items-center justify-between p-2 bg-white rounded shadow hover:shadow-lg transition duration-200"
                     >
                        <div className="flex items-center gap-2">
                           <motion.input
                              type="checkbox"
                              checked={task.complete}
                              onChange={() => handleToggleComplete(task)}
                              whileTap={{ scale: 1.2 }}
                           />

                           <span
                              className={`${task.complete ? " text-gray-400" : ""
                                 }`}
                           >
                              {task.title}
                           </span>
                        </div>

                        <motion.button
                           whileHover={{ scale: 1.05 }}
                           whileTap={{ scale: 0.95 }}
                           onClick={() => handleDelete(task.id)}
                           className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                           Delete
                        </motion.button>
                     </motion.div>

                  ))

                  }</AnimatePresence>


            </div>



            <motion.span

               initial={{ scale: 0.8, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               className="px-3 py-1 bg-gray-200 rounded-full text-sm absolute bottom-0 left-0"
            >
               Total tasks: {sortedTasks.length}
            </motion.span>


            <div className={`w-full bg-red-200 mb-4 rounded-full h-2 ${color} relative`}>
               <motion.div
                  className="bg-green-500 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.4 }}
               />
            </div>
         </div>
      </div>
   )
}