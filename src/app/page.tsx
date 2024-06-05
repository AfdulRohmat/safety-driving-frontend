"use client"

import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react';
import { CardGrup } from "@/components/card-group";
import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchApi } from '../utils/api'
import {
  LogOut
} from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useRouter } from "next/navigation";
import Cookies from 'js-cookie';

interface DataUserProps {
  username: string,
  email: string,
}

export default function Home() {
  const [dataUser, setDataUser] = useState<DataUserProps | any>(null);
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function getUserData() {
    setLoading(true);
    const { data } = await fetchApi("/users/info")
    if (data) setDataUser(data);
    setLoading(false);
  }

  async function getGroups() {
    setLoading(true);
    const { data } = await fetchApi("/groups/")
    if (data) setGroups(data);
    setLoading(false);
  }

  async function doLogout() {
    Cookies.remove('token')
    router.push('/login')
  }

  useEffect(() => {
    getUserData();
    getGroups();
  }, [])

  return (
    <main className="container flex flex-col gap-8 ">
      {/* Header */}
      <div className="flex py-4 w-full border-b">
        {/* Titel */}
        <div className="w-1/2 flex justify-start">
          <div className="font-bold text-2xl">Safety Driving</div>
        </div>

        {/* AAVATR */}
        <div className="w-1/2 flex gap-2 justify-end items-center px-2 cursor-pointer">
          {loading ? <p>Loading</p> : (
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
          )}
        </div>

      </div>

      {/* Search Grup */}
      <div className="flex justify-center items-center gap-2 ">
        <div className="md:w-1/2 flex gap-2">
          <Input type="text" placeholder="Cari Grup ..." />
          <Button type="submit">Cari</Button>
        </div>
      </div>

      {/* Buat grup */}
      <div className="flex flex-col gap-2 w-full justify-start items-start ">
        <p className="font-semibold">Tambahkan Grup</p>
        <Link href="/create-group">
          <Button variant="outline" className="flex gap-2">
            <Plus size={20} />
            <p>Buat Grup</p>
          </Button>
        </Link>

      </div>

      {/* Daftar Grup */}
      <div className="flex flex-col gap-2 w-full justify-start items-start ">
        <p className="font-semibold">Daftar Grup Anda</p>
        <div className="w-full  grid grid-rows-1 grid-cols-1 md:grid-rows-3 md:grid-cols-3 lg:grid-rows-4 lg:grid-cols-4 gap-4">
          {
            groups.map((data: any, key: number) =>
              <CardGrup
                key={key}
                title={data.group.name}
                desc={data.group.description}
                groupId={data.group.id}
              />)
          }
        </div>

      </div>
    </main>
  );
}


