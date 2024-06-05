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

export default function Perjalanan() {
    const [dataPerjalanan, setdataPerjalanan] = useState([])
    const [loading, setLoading] = useState(false)

    const groupId = Cookies.get('groupId')

    async function getGroupInformation() {
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
        getGroupInformation()

    }, [])

    return (
        <div className="container flex flex-col gap-6 py-4">
            {/* Nama Menu */}
            <h1 className="text-xl font-semibold">Data Group</h1>

            {/* Nama Grup + role inside this grup */}
            <div className="flex justify-start items-center gap-4">
                <h1 className="text-lg font-semibold">PT Cybernetics</h1>
                <Card className="p-2 border-green-400 bg-green-50">
                    <p className="font-semibold text-sm text-green-400">Driver</p>
                </Card>
            </div>

            {/* DATA TABLE ANGGOTA GRUP */}
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-base font-semibold">Data Perjalanan</h1>
                    <Link href={groupId ? `/dashboard/${groupId}/perjalanan/tambah-perjalanan` : '/dashboard'}>
                        <Button variant="outline" className="flex gap-2">
                            <Plus size={20} />
                            <p>Tambah Perjalanan</p>
                        </Button>
                    </Link>
                </div>

                {/* DATA TABLE */}
                {
                    loading ? <div>Loading ...</div> : (
                        <div>
                            <PerjalananTable columns={perjalananColumns} data={dataPerjalanan} />
                        </div>
                    )
                }

            </div>


        </div>
    )
}
