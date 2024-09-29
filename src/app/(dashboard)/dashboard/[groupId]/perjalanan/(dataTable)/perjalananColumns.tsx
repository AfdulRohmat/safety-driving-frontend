"use client"

import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Trash2 } from "lucide-react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User } from "@/utils/globalInterface"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { fetchApi } from "@/utils/api"
import { ProsesPerjalananEnum } from "@/utils/perjalananEnum"

export type Perjalanan = {
    id: string,
    jadwal_perjalanan: string,
    alamat_awal: string,
    latitude_awal: string,
    longitude_awal: string,
    alamat_tujuan: string,
    latitude_tujuan: string,
    longitude_tujuan: string,
    nama_kendaraan: string,
    no_polisi: string,
    status: string,
    dimulai_pada: string,
    diakhiri_pada: string,
    durasi_perjalanan: string
    driver: User,
}

const formatDate = (dateString: string,) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};

const rolesCanStartMonitoring = [
    'ROLE_ADMIN_GROUP',
    'ROLE_DRIVER',
    'ROLE_COMPANY'
]

export const perjalananColumns = (userJoinedGrup: any, refreshData: () => void): ColumnDef<Perjalanan>[] => [
    {
        header: 'No.',
        accessorFn: (_row, i) => i + 1, // Index column
        id: 'index',
    },
    {
        header: 'Driver',
        accessorFn: (row) => row.driver.username,
        id: 'username',
    },
    {
        header: 'Jadwal Perjalanan',
        accessorFn: (row) => formatDate(row.jadwal_perjalanan),
        id: 'jadwalPerjalanan',
    },
    {
        header: 'Alamat Awal',
        accessorFn: (row) => row.alamat_awal,
        id: 'alamatAwal',
    },
    {
        header: 'Alamat Tujuan',
        accessorFn: (row) => row.alamat_tujuan,
        id: 'alamatTujuan',
    },
    {
        header: 'Nama Kendaraan',
        accessorFn: (row) => row.nama_kendaraan,
        id: 'namaKendaraan',
    },
    {
        header: 'No Polisi',
        accessorFn: (row) => row.no_polisi,
        id: 'noPolisi',
    },
    {
        header: 'Status',
        accessorFn: (row) => row.status,
        id: 'status',
    },
    {
        id: "trip_token",
        accessorKey: "trip_token",
        header: '',
        cell: ({ row }) => {
            const [openMulaiPerjalananDialog, setOpenMulaiPerjalananDialog] = useState(false)
            const [openHapusPerjalananDialog, setOpenHapusPerjalananDialog] = useState(false)
            const [loading, setLoading] = useState(false)
            const router = useRouter()

            async function goToMonitoring() {
                // Change Status
                setLoading(true)
                const { data } = await fetchApi("/trips/change-status", {
                    method: "POST",
                    body: {
                        "tripToken": row.getValue("trip_token"),
                        "status": ProsesPerjalananEnum.DALAM_PERJALANAN
                    }
                })
                if (data) {
                    router.push(`/dashboard/1/perjalanan/${row.getValue("trip_token")}`)
                }
                setLoading(false)
            }

            async function deleteTripByToken() {
                setLoading(true)
                const { status } = await fetchApi("/trips/delete-trip", {
                    method: "POST",
                    body: {
                        "tripToken": row.getValue("trip_token"),
                    }
                })

                if (status == 200) {
                    refreshData()
                }
                setOpenHapusPerjalananDialog(false)
                setLoading(false)
            }

            return (
                <div>
                    <DropdownMenu>
                        {rolesCanStartMonitoring.includes(userJoinedGrup.role) ?
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger> :
                            <div></div>}

                        <DropdownMenuContent align="end" >
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {row.getValue("status") === 'Selesai' ?
                                <div></div> :
                                <DropdownMenuItem className="p-4" onClick={() => setOpenMulaiPerjalananDialog(true)}>
                                    Mulai Perjalanan
                                </DropdownMenuItem>
                            }

                            {userJoinedGrup.role === 'ROLE_ADMIN_GROUP' ?
                                <DropdownMenuItem className="text-red-400 focus:text-red-400 p-4" onClick={() => setOpenHapusPerjalananDialog(true)} >
                                    Hapus Perjalanan
                                </DropdownMenuItem> :
                                <div></div>
                            }

                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* DIALOG PROCESS PERJALANAN */}
                    <AlertDialog open={openMulaiPerjalananDialog}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Mulai Monitoring Perjalanan</AlertDialogTitle>
                                <AlertDialogDescription>
                                    <div className="flex flex-col gap-2">
                                        <div>
                                            <h1>Trip Token : {row.getValue("trip_token")}</h1>
                                        </div>
                                        <div>
                                            <p>
                                                Ketika proses monitoring dimulai, driver akan menerima token. Harap pastikan token didaftarkan ke dalam sistem modul
                                            </p>
                                        </div>
                                    </div>

                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setOpenMulaiPerjalananDialog(false)}>kembali</AlertDialogCancel>
                                <AlertDialogAction onClick={() => goToMonitoring()}>Lanjutkan</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    {/* Allert dialog delete trip */}
                    <AlertDialog open={openHapusPerjalananDialog}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Mulai Monitoring Perjalanan</AlertDialogTitle>
                                <AlertDialogDescription>
                                    <div className="flex flex-col gap-2">
                                        <div>
                                            <h1>Trip Token : {row.getValue("trip_token")}</h1>
                                        </div>
                                        <div>
                                            <p>
                                                Anda yakin menghapus data perjalanan ini
                                            </p>
                                        </div>
                                    </div>

                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel disabled={loading} onClick={() => setOpenHapusPerjalananDialog(false)}>kembali</AlertDialogCancel>
                                <AlertDialogAction disabled={loading} onClick={() => deleteTripByToken()}> {loading ? (
                                    <>
                                        <svg aria-hidden="true" className="w-5 h-5  animate-spin mr-2 fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                        </svg>
                                        Loading...
                                    </>
                                ) : (
                                    'Hapus perjalanan'
                                )}</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            )
        },
    },
];