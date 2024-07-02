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

export const groupRoles = [
    { label: "Driver", value: "ROLE_DRIVER" },
    { label: "Company", value: "ROLE_COMPANY" },
    { label: "Family", value: "ROLE_FAMILY" },
    { label: "Medical Party", value: "ROLE_MEDIC" },
    { label: "KNKT", value: "ROLE_KNKT" },
    { label: "Admin", value: "ROLE_ADMIN_GROUP" },
];


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
                            <Button type="submit">Tambahkan Anggota</Button>
                        </form>
                    </Form>
                </CardContent>

            </Card>
        </div>
    )
}
