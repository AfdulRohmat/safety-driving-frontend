"use client"

import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Trash2 } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User } from "@/utils/globalInterface"



export type Member = {
    id: number;
    role: string[];
    createdAt: string;
    updatedAt: string;
    user: User;
}

export const dataGroupColums: ColumnDef<Member>[] = [
    // {
    //     header: 'ID',
    //     accessorKey: 'id',
    // },
    {
        header: 'No.',
        accessorFn: (_row, i) => i + 1, // Index column
        id: 'index',
    },
    {
        header: 'Username',
        accessorFn: (row) => row.user.username,
        id: 'username',
    },
    {
        header: 'Email',
        accessorFn: (row) => row.user.email,
        id: 'email',
    },
    {
        header: 'Role',
        accessorFn: (row) => row.role.join(', '),
        id: 'role',
    },
    {
        id: "actions",
        cell: ({ row }) => {
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" >
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Edit Data Anggota</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-400 focus:text-red-400">
                            Keluarkan Anggota
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
];











// export type Payment = {
//     id: string
//     amount: number
//     status: "pending" | "processing" | "success" | "failed"
//     email: string
// }


// export const columns: ColumnDef<Payment>[] = [
//     {
//         accessorKey: "status",
//         header: "Status",
//     },
//     {
//         accessorKey: "email",
//         header: ({ column }) => {
//             return (
//                 <Button
//                     variant="ghost"
//                     onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//                 >
//                     Email
//                     <ArrowUpDown className="ml-2 h-4 w-4" />
//                 </Button>
//             )
//         },
//     },
//     {
//         accessorKey: "amount",
//         header: "Amount",
//     },
//     {
//         id: "actions",
//         cell: ({ row }) => {
//             const payment = row.original

//             return (
//                 <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                         <Button variant="ghost" className="h-8 w-8 p-0">
//                             <span className="sr-only">Open menu</span>
//                             <MoreHorizontal className="h-4 w-4" />
//                         </Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent align="end" >
//                         <DropdownMenuLabel>Actions</DropdownMenuLabel>
//                         <DropdownMenuSeparator />
//                         <DropdownMenuItem>Edit Data Anggota</DropdownMenuItem>
//                         <DropdownMenuItem className="text-red-400 focus:text-red-400">
//                             Keluarkan Anggota
//                         </DropdownMenuItem>
//                     </DropdownMenuContent>
//                 </DropdownMenu>
//             )
//         },
//     },
// ]