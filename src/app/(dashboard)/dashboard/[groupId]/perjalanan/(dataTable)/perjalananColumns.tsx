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
    jadwalPerjalanan: string,
    alamatAwal: string,
    latitudeAwal: string,
    longitudeAwal: string,
    alamatTujuan: string,
    latitudeTujuan: string,
    longitudeTujuan: string,
    namaKendaraan: string,
    noPolisi: string,
    status: string,
    dimulaiPada: string,
    diakhiriPada: string,
    durasiPerjalanan: string
    driver: User,
}

const formatDate = (dateString: string) => {
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

export const perjalananColumns = (userJoinedGrup: any): ColumnDef<Perjalanan>[] => [
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
        accessorFn: (row) => formatDate(row.jadwalPerjalanan),
        id: 'jadwalPerjalanan',
    },
    {
        header: 'Alamat Awal',
        accessorFn: (row) => row.alamatAwal,
        id: 'alamatAwal',
    },
    {
        header: 'Alamat Tujuan',
        accessorFn: (row) => row.alamatTujuan,
        id: 'alamatTujuan',
    },
    {
        header: 'Nama Kendaraan',
        accessorFn: (row) => row.namaKendaraan,
        id: 'namaKendaraan',
    },
    {
        header: 'No Polisi',
        accessorFn: (row) => row.noPolisi,
        id: 'noPolisi',
    },
    {
        header: 'Status',
        accessorFn: (row) => row.status,
        id: 'status',
    },
    {
        id: "tripToken",
        accessorKey: "tripToken",
        header: '',
        cell: ({ row }) => {
            const [open, setOpen] = useState(false)
            const router = useRouter()

            async function goToMonitoring() {
                // Change Status
                const { data } = await fetchApi("/trips/change-status", {
                    method: "POST",
                    body: {
                        "tripToken": row.getValue("tripToken"),
                        "status": ProsesPerjalananEnum.DALAM_PERJALANAN
                    }
                })
                if (data) {
                    router.push(`/dashboard/1/perjalanan/${row.getValue("tripToken")}`)
                }
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
                                <DropdownMenuItem className="p-4" onClick={() => setOpen(true)}>
                                    Mulai Perjalanan
                                </DropdownMenuItem>
                            }

                            {userJoinedGrup.role === 'ROLE_ADMIN_GROUP' ?
                                <DropdownMenuItem className="text-red-400 focus:text-red-400 p-4" >
                                    Hapus Perjalanan
                                </DropdownMenuItem> :
                                <div></div>
                            }

                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* DIALOG PROCESS PERJALANAN */}
                    <AlertDialog open={open}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Mulai Monitoring Perjalanan</AlertDialogTitle>
                                <AlertDialogDescription>
                                    <div className="flex flex-col gap-2">
                                        <span>Trip Token : {row.getValue("tripToken")}</span>
                                        <span>
                                            Ketika proses monitoring dimulai, driver akan menerima token. Harap pastikan token didaftarkan ke dalam sistem modul
                                        </span>
                                    </div>

                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setOpen(false)}>kembali</AlertDialogCancel>
                                <AlertDialogAction onClick={() => goToMonitoring()}>Lanjutkan</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            )
        },
    },
];