'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { toast } from "@/components/ui/use-toast"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Textarea } from "@/components/ui/textarea"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useEffect, useState } from "react"
import { CommandList } from "cmdk"
import Cookies from 'js-cookie';
import { fetchApi } from "@/utils/api"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const FormSchema = z.object({
    user: z.string().min(1, {
        message: "Nama User must be at least 2 characters.",
    }),

    role: z.string().min(1, {
        message: "Role must be at least 2 characters.",
    }),
})

interface User {
    id: number;
    username: string;
    email: string;
}

export default function AddGroupMember() {
    const [loading, setLoading] = useState(false)
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUserId, setSelectedUserId] = useState(0)
    const groupId = Cookies.get('groupId')

    const router = useRouter()

    const groupRoles = [
        { label: "Driver", value: "ROLE_DRIVER" },
        { label: "Company", value: "ROLE_COMPANY" },
        { label: "Family", value: "ROLE_FAMILY" },
        { label: "Medical Party", value: "ROLE_MEDIC" },
        { label: "KNKT", value: "ROLE_KNKT" },
        { label: "Admin", value: "ROLE_ADMIN_GROUP" },
    ];

    const searchUsers = async (query: string) => {
        setLoading(true);
        const { data } = await fetchApi(`/users/all-users?search=${query}`)
        if (data) setUsers(data);
        setLoading(false);
    }

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            user: "",
            role: ""
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {

        const { status, data: dataResponse, error } = await fetchApi("/groups/adding-user", {
            method: "POST",
            body: {
                user_id: selectedUserId,
                group_id: groupId,
                role: data.role
            }
        })

        if (dataResponse) {
            toast({
                title: "User berhasil ditambahkan",
            })

            router.back()
        } else {
            toast({
                title: "Proses gagal",
                description: error
            })
        }
    }

    useEffect(() => {
        setTimeout(() => {
            const watchUser = form.watch("user");
            searchUsers(watchUser);
        }, 5000);

        console.log(users)
    }, [form.watch("user")]);

    return (
        <div className="container py-4">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Tambahkan Anggota Grup</CardTitle>
                    <CardDescription>Cari user yang sudah terdaftar dan tentukan role user tersebut</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="user"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email User</FormLabel>
                                        <FormControl>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Input type="email" placeholder="Cari User Berdasarkan email" {...field} />
                                                </PopoverTrigger>

                                                <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height]">
                                                    <Command>
                                                        <CommandEmpty>Tidak ada user</CommandEmpty>
                                                        <CommandGroup>
                                                            {loading ? <div>loading..</div> :
                                                                (
                                                                    <CommandList>
                                                                        {users.map((user) => (
                                                                            <CommandItem
                                                                                value={user.email}
                                                                                key={user.id}
                                                                                onSelect={() => {
                                                                                    form.setValue("user", user.email)
                                                                                    setSelectedUserId(user.id)
                                                                                }}
                                                                            >
                                                                                <div className="flex justify-start gap-2">
                                                                                    {/* avatara */}
                                                                                    <Avatar>
                                                                                        {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
                                                                                        <AvatarFallback>{user?.username.slice(0, 2)}</AvatarFallback>
                                                                                    </Avatar>
                                                                                    <div className="flex flex-col">
                                                                                        <div className="font-semibold">{user.username}</div>
                                                                                        <div className="text-sm">{user.email}</div>
                                                                                    </div>

                                                                                </div>

                                                                            </CommandItem>
                                                                        ))}
                                                                    </CommandList>
                                                                )
                                                            }

                                                        </CommandGroup>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>

                                        </FormControl>
                                        <FormDescription>
                                            Masukan nama grup yang ingin anda buat
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem >
                                        <FormLabel>Role</FormLabel>
                                        <FormControl>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant="outline"
                                                            role="combobox"
                                                            className={cn(
                                                                "w-full justify-between",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value
                                                                ? groupRoles.find(
                                                                    (role) => role.value === field.value
                                                                )?.label
                                                                : "Pilih Role"}
                                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height]">
                                                    <Command>
                                                        <CommandInput placeholder="Cari Role..." />
                                                        <CommandEmpty>No language found.</CommandEmpty>
                                                        <CommandGroup>
                                                            <CommandList>
                                                                {groupRoles.map((role) => (
                                                                    <CommandItem
                                                                        value={role.label}
                                                                        key={role.value}
                                                                        onSelect={() => {
                                                                            form.setValue("role", role.value)
                                                                        }}
                                                                    >
                                                                        <Check
                                                                            className={cn(
                                                                                "mr-2 h-4 w-4",
                                                                                role.value === field.value
                                                                                    ? "opacity-100"
                                                                                    : "opacity-0"
                                                                            )}
                                                                        />
                                                                        {role.label}
                                                                    </CommandItem>
                                                                ))}
                                                            </CommandList>
                                                        </CommandGroup>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                        </FormControl>


                                        <FormDescription>
                                            Masukan role untuk user yang dipilih
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                disabled={loading}
                                className={`flex items-center justify-center w-full ${loading ? 'bg-gray-950 cursor-not-allowed' : ''}`}
                            >
                                {loading ? (
                                    <>
                                        <svg aria-hidden="true" className="w-5 h-5  animate-spin mr-2 fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                        </svg>
                                        Loading...
                                    </>
                                ) : (
                                    'Tambahkan Anggota'
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>

            </Card>
        </div>
    )
}
