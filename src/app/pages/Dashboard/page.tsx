'use client'
import { auth } from "@/lib/firebase"
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation"
import { useEffect , useState  } from "react"
import Logout from "../Logout/page";
export default function Dashboard(){
      const router = useRouter();
      const [loading , setLoading] = useState(true);
      const [user , setUser] = useState<User | null>(null);


      useEffect( ()=>{ 
         const unsubscribe = onAuthStateChanged(auth , (currentUser) =>{
            if(!currentUser) {
               router.push("/pages/Login");
            }
            else {
               setUser(currentUser);
            }
            setLoading(false);
         }) ;
         return () => unsubscribe();
       } , [router]) ;


       if(loading) {
         return <h1>Loading...</h1>
       }

       if(!user) {
         return <h1>No user found</h1>
       } 
 return (
       
    <>
        <h1>Dashboard test</h1>
        <p>welcome {user.email}</p>
        <h3>{ loading? "Loading..." : "Dashboard Content" }</h3>
        <Logout />
    </>
 )
}