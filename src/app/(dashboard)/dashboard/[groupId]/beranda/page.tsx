'use client'

import { CardBeranda } from "@/components/card-beranda"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { fetchApi } from "@/utils/api"
import { useEffect, useState } from "react"
import Cookies from 'js-cookie';
import { customJwtDecode } from "@/services/jwt-decode"

export default function Beranda() {
    const [role, setRoles] = useState<string | null>("")
    const [dataGroup, setdataGroup] = useState<any>({})
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

            const dataUser: any = customJwtDecode();
            const member = data.members.find((member: any) => member.user.email === dataUser?.username);
            setRoles(member ? member.role : null);
        }
        setLoading(false);
    }

    useEffect(() => {
        getGroupInformation()
    }, [])

    if (loading) return (
        <div>Mohon tunggu ...</div>
    )

    return (
        <div className="container flex flex-col gap-6 py-4">
            {/* Nama Menu */}
            <h1 className="text-xl font-semibold">Beranda</h1>

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

            {/* Card Total Informasi */}
            <div className="w-full grid grid-rows-1 grid-cols-1 md:grid-rows-3 md:grid-cols-3 gap-4">
                <CardBeranda title="Total KM Perjalanan" desc="11 KM" />
                <CardBeranda title="Total Jam Perjalanan Dilakukan" desc="30 Menit" />
                <CardBeranda title="Total Perjalanan Dilakukan" desc="1 Perjalanan" />
            </div>


        </div>
    )
}
