'use client' ;

import { useRouter } from "next/navigation";
export default function Home() {
  const router = useRouter() ;
  //router.push("/pages/Login") ;
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
        Welcome to Task Manager App

      </h1>
      <button onClick={() => router.push("/pages/Login")}>
        Go to Login
      </button>
      <button onClick={() => router.push("/pages/Registeration")}>
        Go to Registeration
      </button>
    </div>
  );
}
