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
import { Input } from "@/components/ui/input"

const rolesCanAddTrip = [
    'ROLE_ADMIN_GROUP',
    'ROLE_DRIVER',
    'ROLE_COMPANY'
]

export default function Perjalanan() {
    const [dataPerjalanan, setdataPerjalanan] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingDataTable, setLoadingDataTable] = useState(false)
    const [role, setRoles] = useState<string>("")
    const [userJoinedGrup, setuserJoinedGrup] = useState({})
    const [dataGroup, setdataGroup] = useState<any>({})
    const [searchTerm, setSearchTerm] = useState<string>("") // Add state for search term

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

    async function getTripsInformation(search: string = "") {
        setLoadingDataTable(true)
        const { data } = await fetchApi("/trips/", {
            method: "POST",
            body: {
                "groupId": groupId,
                "search": search
            }
        })
        if (data) {
            setdataPerjalanan(data);
        }
        setLoadingDataTable(false)
    }

    useEffect(() => {
        getTripsInformation()
        getGroupInformation()
    }, [])

    // Handle the search input change
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value); // Update search term state
    }

    // Handle search button click
    const handleSearchClick = () => {
        getTripsInformation(searchTerm); // Call getTripsInformation with the search term
    }

    const columns = perjalananColumns(userJoinedGrup, getTripsInformation)

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

                {/* Search Perjalanan */}
                <div className="flex gap-2 justify-center items-center ">
                    <Input
                        type="text"
                        className="md:w-2/3"
                        placeholder="Cari perjalanan tertentu disini"
                        value={searchTerm} // Bind searchTerm state to the input value
                        onChange={handleSearchChange} // Call handleSearchChange on input change
                    />
                    <Button type="submit" onClick={handleSearchClick}>Cari</Button>
                </div>

                {/* DATA TABLE */}
                {
                    loadingDataTable ? <div className="flex flex-col items-center">
                        <svg aria-hidden="true" className="w-10 h-10  animate-spin mr-2 fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                        </svg>
                    </div> : (
                        <div>
                            <PerjalananTable columns={columns} data={dataPerjalanan} />
                        </div>
                    )
                }

            </div>
        </div>
    )
}
