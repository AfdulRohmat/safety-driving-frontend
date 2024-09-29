'use client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    LogOut,
    Menu
} from "lucide-react"
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react"
import { fetchApi } from "@/utils/api"
import Sidebar from "./sidebar"

interface DataUserProps {
    username: string,
    email: string,
}


export default function Header() {
    const [dataUser, setDataUser] = useState<DataUserProps | any>(null);
    const [loading, setLoading] = useState(false)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false); // Manage drawer state

    const router = useRouter()

    async function getUserData() {
        setLoading(true);
        const { data } = await fetchApi("/users/info")
        if (data) setDataUser(data);
        setLoading(false);
    }

    async function doLogout() {
        setLoading(true);
        Cookies.remove('token')
        await new Promise((resolve) => setTimeout(resolve, 3000));
        setLoading(false);
        router.push('/login');
    }

    useEffect(() => {
        getUserData();
    }, [])

    function toggleDrawer() {
        setIsDrawerOpen(!isDrawerOpen);
    }

    if (loading) return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="flex flex-col items-center">
                <svg aria-hidden="true" className="w-10 h-10  animate-spin mr-2 fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                </svg>
            </div>
        </div>
    )

    return (
        <div className="flex py-4 w-full border-b">
            <div className="container flex justify-between items-center">

                {/* Hamburber menu on mobile */}
                <div className="md:hidden cursor-pointer" onClick={toggleDrawer}>
                    <Menu />
                </div>

                {/* Drawer overlay for mobile */}
                {isDrawerOpen && (
                    <div className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={toggleDrawer}></div>
                )}

                {/* Drawer Sidebar for mobile */}
                <div className={`md:hidden fixed inset-y-0 left-0 z-50 w-[300px] bg-white transition-transform transform ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <Sidebar /> {/* Show Sidebar in drawer */}
                </div>

                {/* SEARCH */}
                <div className="hidden md:w-2/3 md:flex gap-2 justify-center px-2">
                    {/* <Input type="text" placeholder="Cari sesuatu disini ..." />
                    <Button type="submit">Cari</Button> */}
                </div>

                {/* AFAVATR */}
                {loading ? <p>Loading</p> : (
                    <>
                        <Popover>
                            <PopoverTrigger asChild>
                                <div className="w-fit flex gap-2 justify-end items-center px-2 cursor-pointer ">
                                    <p className="font-semibold">{dataUser?.username}</p>
                                    <Avatar>
                                        {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
                                        <AvatarFallback>{dataUser?.username.slice(0, 2)}</AvatarFallback>
                                    </Avatar>
                                </div>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-0">
                                <div className="flex gap-4 cursor-pointer px-2 py-3 text-base" onClick={() => doLogout()}>
                                    <LogOut />
                                    <p className="text-sm font-semibold">Logout</p>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </>
                )}
            </div>
        </div>
    )
}
