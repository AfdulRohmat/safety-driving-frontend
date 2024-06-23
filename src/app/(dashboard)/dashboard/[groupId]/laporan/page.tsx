'use client'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie';
import { fetchApi } from '@/utils/api';
import { PerjalananTable } from "../perjalanan/(dataTable)/perjalananTable";
import { perjalananColumns } from "../perjalanan/(dataTable)/perjalananColumns";
import { customJwtDecode } from "@/services/jwt-decode";
import { laporanColumns } from "./(dataTable)/laporanColumns";
import { ProsesPerjalananEnum } from "@/utils/perjalananEnum";

export default function Laporan() {
    const [dataPerjalanan, setdataPerjalanan] = useState([])
    const [loading, setLoading] = useState(false)
    const [role, setRoles] = useState<string>("")
    const [userJoinedGrup, setuserJoinedGrup] = useState({})
    const [dataGroup, setdataGroup] = useState<any>({})

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

            const dataUser: any = customJwtDecode();
            const member = data.members.find((member: any) => member.user.email === dataUser?.username);
            setuserJoinedGrup(member)
            setRoles(member ? member.role : null);
        }
        setLoading(false);
    }

    async function getTripsInformation() {
        setLoading(true);
        const { data } = await fetchApi("/trips/", {
            method: "POST",
            body: {
                "groupId": groupId,
                "status": ProsesPerjalananEnum.SELESAI
            }
        })
        if (data) {
            setdataPerjalanan(data);
        }
        setLoading(false);
    }


    useEffect(() => {
        getTripsInformation()
        getGroupInformation()
    }, [])

    const columns = laporanColumns(userJoinedGrup);


    return (
        <div className="container flex flex-col gap-6 py-4">
            {/* Nama Menu */}
            <h1 className="text-xl font-semibold">Laporan Perjalanan</h1>

            {/* Nama Grup + role inside this grup */}
            <h1 className="text-lg font-semibold">{dataGroup.name}</h1>

            <div className="flex justify-start items-center gap-4">
                <h1 className="text-sm font-semibold">Role anda :</h1>
                {
                    <Card className="p-1.5 border-green-400 bg-green-50">
                        <p className="font-semibold text-sm text-green-400">{role}</p>
                    </Card>
                }
            </div>

            {/* Catatan */}
            <span className="text-sm font-semibold">Hanya data perjalanan dengan status Selesai yang akan muncul di tabel</span>

            {/* DATA TABLE ANGGOTA GRUP */}
            <div className="flex flex-col gap-4">

                {/* DATA TABLE */}
                {
                    loading ? <div>Loading ...</div> : (
                        <div>
                            <PerjalananTable columns={columns} data={dataPerjalanan} />
                        </div>
                    )
                }

            </div>
        </div>
    )
}
