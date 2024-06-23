"use client"

import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, CalendarIcon, MoreHorizontal, Trash2 } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { User } from "@/utils/globalInterface"
import { useEffect, useState } from "react"
import { fetchApi } from "@/utils/api"
import { toast } from "@/components/ui/use-toast"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useRouter } from "next/navigation"
import Cookies from 'js-cookie';

export type Member = {
    id: number;
    role: string;
    createdAt: string;
    updatedAt: string;
    user: User;
}

const FormSchema = z.object({
    nama_depan: z.string().min(2, {
        message: "nama_depan must be at least 2 characters.",
    }),


    nama_belakang: z.string().min(2, {
        message: "nama_belakang must be at least 2 characters.",
    }),


    no_telepon: z.string().min(2, {
        message: "no_telepon must be at least 2 characters.",
    }),


    jenis_kelamin: z.string().min(1, {
        message: "jenis_kelamin must be at least 1 characters.",
    }),


    tempat_lahir: z.string().min(2, {
        message: "tempat_lahir must be at least 2 characters.",
    }),


    tanggal_lahir: z.date({
        required_error: "tanggal_lahir is required.",
    }),

})

export const dataGroupColums = (members: any[], userJoinedGrup: any): ColumnDef<Member>[] => [
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
        accessorFn: (row) => row.role,
        id: 'role',
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const member = row.original; // Access the full row data
            const [openDialogDetailUser, setOpenDialogDetailUser] = useState(false)
            const [openDialogRemoveUser, setOpenDialogRemoveUser] = useState(false)
            const [loading, setLoading] = useState(false)
            const router = useRouter()

            const form = useForm<z.infer<typeof FormSchema>>({
                resolver: zodResolver(FormSchema),
            })

            async function getDetailUser() {
                setLoading(true)
                const { data: dataResponse, errorResponse } = await fetchApi("/users/get-detail-user", {
                    method: 'POST',
                    body: {
                        'email': member.user.email,
                    }
                })

                if (dataResponse) {
                    setLoading(false)
                    if (dataResponse.detailUser !== null) {
                        const detailUser = dataResponse.detailUser
                        form.setValue('nama_depan', detailUser.namaDepan)
                        form.setValue('nama_belakang', detailUser.namaBelakang)
                        form.setValue('no_telepon', detailUser.noTelepon)
                        form.setValue('jenis_kelamin', detailUser.jenisKelamin)
                        form.setValue('tempat_lahir', detailUser.tempatLahir)
                        form.setValue('tanggal_lahir', detailUser.tanggalLahir)
                    }

                    setOpenDialogDetailUser(true);
                } else {
                    setLoading(false)
                    toast({
                        title: "Gagal ambil data User",
                        description: "Gagal ambil data User"
                    })
                }

            }

            async function onSubmit(data: z.infer<typeof FormSchema>) {
                setLoading(true)

                const { data: dataResponse, errorResponse } = await fetchApi("/users/detail-user", {
                    method: 'POST',
                    body: {
                        'nama_depan': data.nama_depan,
                        'nama_belakang': data.nama_belakang,
                        'jenis_kelamin': data.jenis_kelamin,
                        'no_telepon': data.no_telepon,
                        'tempat_lahir': data.tempat_lahir,
                        'tanggal_lahir': data.tanggal_lahir,
                        'email': member.user.email,
                    }
                })

                if (dataResponse) {
                    setLoading(false)
                    toast({
                        title: "Data User berhasil disimpan",
                    })

                    router.refresh()

                } else {
                    setLoading(false)
                    toast({
                        title: "Data User Gagal disimpan.",
                        description: "Data User Gagal disimpan."
                    })
                }
            }

            async function removeUserFromGroup() {
                const groupId = Cookies.get('groupId')

                setLoading(true)
                const { data: dataResponse, errorResponse } = await fetchApi("/groups/remove-user", {
                    method: 'POST',
                    body: {
                        'user_id': member.id,
                        'group_id': groupId,
                    }
                })

                if (dataResponse) {
                    setLoading(false)
                    toast({
                        title: "Berhasil mengeluarkan user dari group",
                    })

                    router.refresh()

                } else {
                    setLoading(false)
                    toast({
                        title: "Gagal mengeluarkan user dari group",
                    })
                }
            }

            return (
                <div>
                    <DropdownMenu>
                        {userJoinedGrup.user.email === member.user.email || userJoinedGrup.role === 'ROLE_ADMIN_GROUP' ?
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger> :
                            <div></div>}

                        <DropdownMenuContent align="end" >
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            <DropdownMenuItem className="p-4" onClick={() => getDetailUser()}>Edit Data Anggota</DropdownMenuItem>

                            <DropdownMenuItem className="text-red-400 focus:text-red-400 p-4" onClick={() => setOpenDialogRemoveUser(true)}>
                                Keluarkan Anggota
                            </DropdownMenuItem>

                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* DIALOG REMOVE USER */}
                    < AlertDialog open={openDialogRemoveUser} >
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Mengeluarkan User dari grup</AlertDialogTitle>
                                <AlertDialogDescription>
                                    <div className="flex flex-col gap-2">
                                        <span>User : {row.getValue("email")}</span>
                                        <span>
                                            Apakah anda yakin mengeluarkan user tersebut
                                        </span>
                                    </div>

                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setOpenDialogRemoveUser(false)}>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => removeUserFromGroup()}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </ AlertDialog>

                    {/* DIALOG FORM DETAIL USER */}
                    <AlertDialog open={openDialogDetailUser}  >
                        <AlertDialogContent className="h-screen overflow-y-auto">
                            <AlertDialogHeader>
                                <AlertDialogTitle>Data User</AlertDialogTitle>
                                <AlertDialogDescription>
                                    <Form {...form}>
                                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                            <FormField
                                                control={form.control}
                                                name="nama_depan"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Nama Depan</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Sita" {...field} />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Masukan Nama Depan anda
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="nama_belakang"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Nama Belakang</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Nuria" {...field} />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Masukan Nama Belakang anda
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="jenis_kelamin"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Jenis Kelamin</FormLabel>
                                                        <FormControl>
                                                            {/* <Input placeholder="" {...field} /> */}
                                                            <Select
                                                                onValueChange={field.onChange}
                                                                value={field.value}
                                                            >
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Jenis Kelamin" {...field} />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="Laki-Laki">Laki Laki</SelectItem>
                                                                    <SelectItem value="Perempuan">Perempuan</SelectItem>
                                                                </SelectContent>
                                                            </Select>


                                                        </FormControl>
                                                        <FormDescription>
                                                            Masukan Jenis Kelamin anda
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="no_telepon"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>No Telepon</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="085123456789" {...field} />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Masukan No Telepon anda
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="tempat_lahir"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Tempat Lahir</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Jakarta" {...field} />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Masukan Tempat Lahir anda
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="tanggal_lahir"
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-col">
                                                        <FormLabel>Tanggal Lahir</FormLabel>
                                                        <FormControl>
                                                            <Popover>
                                                                <PopoverTrigger asChild>
                                                                    {/* <Input type="date" placeholder="Jakarta" {...field} /> */}
                                                                    <Button
                                                                        variant={"outline"}
                                                                    >
                                                                        {field.value ? (
                                                                            format(field.value, "PPP")
                                                                        ) : (
                                                                            <span>Pick a date</span>
                                                                        )}
                                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                                    </Button>
                                                                </PopoverTrigger>
                                                                <PopoverContent className="w-auto p-0">
                                                                    <Calendar
                                                                        mode="single"
                                                                        selected={field.value}
                                                                        onSelect={field.onChange}
                                                                        initialFocus
                                                                    />
                                                                </PopoverContent>
                                                            </Popover>

                                                        </FormControl>
                                                        <FormDescription>
                                                            Masukan Tanggal Lahir anda
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <Button type="submit">Simpan</Button>
                                        </form>
                                    </Form>

                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setOpenDialogDetailUser(false)}>Kembali</AlertDialogCancel>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog >
                </div >

            )
        },
    },
];