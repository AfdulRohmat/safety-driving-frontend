'use client'

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus } from "lucide-react"
import Link from "next/link"
import Cookies from 'js-cookie';
import { useEffect, useState } from "react"
import { fetchApi } from "@/utils/api"
import { perjalananColumns } from "./(dataTable)/perjalananColumns"
import { PerjalananTable } from "./(dataTable)/perjalananTable"
import { customJwtDecode } from "@/services/jwt-decode"

const rolesCanAddTrip = [
    'ROLE_ADMIN_GROUP',
    'ROLE_DRIVER',
    'ROLE_COMPANY'
]

export default function Perjalanan() {
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
                "groupId": groupId
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

    const columns = perjalananColumns(userJoinedGrup)

    return (
        <div className="container flex flex-col gap-6 py-4">
            {/* Nama Menu */}
            <h1 className="text-xl font-semibold">Data Group</h1>

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

            {/* DATA TABLE ANGGOTA GRUP */}
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-base font-semibold">Data Perjalanan</h1>


                    {rolesCanAddTrip.includes(role) ? <div>
                        <Link href={groupId ? `/dashboard/${groupId}/perjalanan/tambah-perjalanan` : '/dashboard'}>
                            <Button variant="outline" className="flex gap-2">
                                <Plus size={20} />
                                <p>Tambah Perjalanan</p>
                            </Button>
                        </Link>
                    </div> : <div></div>}

                </div>

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
