'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from "next/link";
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react';
import { dataGroupColums, Member } from "./dataGroupColums";
import { DataTable } from "../../../../../components/data-table";
import { useEffect, useState } from "react";
import { fetchApi } from "@/utils/api";
import { useGroupIdStore } from "@/lib/store";
import Cookies from 'js-cookie';
import { customJwtDecode } from "@/services/jwt-decode";

export default function DataGroup() {
  const [roles, setRoles] = useState<string[] | null>([])
  const [dataGroup, setdataGroup] = useState<any>({})
  const [members, setMembers] = useState<Member[] | []>([])
  const [loading, setLoading] = useState(false)
  const groupId = Cookies.get('groupId')

  async function getGroupInformation() {
    setLoading(true);
    const { data } = await fetchApi("/groups/detail", {
      method: "POST",
      body: {
        "group_id": groupId
      }
    })
    if (data) {
      setdataGroup(data);
      setMembers(data.members)

      const dataUser: any = customJwtDecode();
      const member = data.members.find((member: any) => member.user.email === dataUser?.username);
      setRoles(member ? member.role : null);
    }
    setLoading(false);
  }


  useEffect(() => {
    getGroupInformation()



  }, [])



  return (
    <div className="container flex flex-col gap-6 py-4">
      {/* Nama Menu */}
      <h1 className="text-xl font-semibold">Data Group</h1>

      {/* Nama Grup + role inside this grup */}
      <h1 className="text-lg font-semibold">{dataGroup.name}</h1>
      {/* <div>
        <h1 className="text-md font-normal">{dataGroup.description}</h1>
      </div> */}

      <div className="flex justify-start items-center gap-4">
        <h1 className="text-sm font-semibold">Role anda :</h1>
        {
          roles?.map((role) => (
            <Card className="p-1.5 border-green-400 bg-green-50">
              <p className="font-semibold text-sm text-green-400">{role}</p>
            </Card>
          ))
        }

      </div>

      {/* DATA TABLE ANGGOTA GRUP */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h1 className="text-base font-semibold">Data Anggota Grup</h1>
          <Link href={groupId ? `/dashboard/${groupId}/data-group/add-group-member` : '/dashboard'}>
            <Button variant="outline" className="flex gap-2">
              <Plus size={20} />
              <p>Tambah Anggota Grup</p>
            </Button>
          </Link>
        </div>

        {/* DATA TABLE */}
        <div >
          <DataTable columns={dataGroupColums} data={members} />
        </div>

      </div>

    </div>
  )
}
