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
    LogOut
} from "lucide-react"
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react"
import { fetchApi } from "@/utils/api"

interface DataUserProps {
    username: string,
    email: string,
}


export default function Header() {
    const [dataUser, setDataUser] = useState<DataUserProps | any>(null);
    const [loading, setLoading] = useState(false)

    const router = useRouter()

    async function getUserData() {
        setLoading(true);
        const { data } = await fetchApi("/users/info")
        if (data) setDataUser(data);
        setLoading(false);
    }

    async function doLogout() {
        Cookies.remove('token')
        router.push('/login')
    }

    useEffect(() => {
        getUserData();
    }, [])

    return (
        <div className="flex py-4 w-full border-b">
            <div className="container flex ">
                {/* SEARCH */}
                <div className="hidden md:w-2/3 md:flex gap-2 justify-center px-2">
                    <Input type="text" placeholder="Cari sesuatu disini ..." />
                    <Button type="submit">Cari</Button>
                </div>

                {/* AFAVATR */}
                {loading ? <p>Loading</p> : (
                    <>
                        <Popover>
                            <PopoverTrigger asChild>
                                <div className="w-full md:w-1/3 flex gap-2 justify-end items-center px-2 cursor-pointer">
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
