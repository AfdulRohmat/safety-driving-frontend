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

export type Perjalanan = {
    id: string,
    alamatAwal: string,
    latitudeAwal: string,
    longitudeAwal: string,
    alamatTujuan: string,
    latitudeTujuan: string,
    longitudeTujuan: string,
    namaKendaraan: string,
    noPolisi: string,
    status: string,
    driver: User,
}

export const perjalananColumns: ColumnDef<Perjalanan>[] = [
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

            function goToMonitoring() {
                router.push(`/dashboard/1/perjalanan/${row.getValue("tripToken")}`)
            }

            return (
                <div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" >
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            <DropdownMenuItem className="p-4" onClick={() => setOpen(true)}>
                                Mulai Perjalanan
                                {/* <Link href={`/dashboard/1/perjalanan/${row.getValue("tripToken")}`}>
                                </Link> */}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-400 focus:text-red-400 p-4" >
                                Hapus Perjalanan
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <AlertDialog open={open}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Mulai Monitoring Perjalanan</AlertDialogTitle>
                                <AlertDialogDescription>
                                    <div className="flex flex-col gap-2">
                                        <span>Token : {row.getValue("tripToken")}</span>
                                        <span>
                                            Ketika proses monitoring dimulai, driver akan menerima token. Harap pastikan token didaftarkan ke dalam sistem modul
                                        </span>
                                    </div>

                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setOpen(false)}>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => goToMonitoring()}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            )
        },
    },
];