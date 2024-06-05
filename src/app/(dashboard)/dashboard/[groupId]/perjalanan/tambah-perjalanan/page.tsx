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
import { useState, useEffect } from "react"
import { CommandList } from "cmdk"
import { fetchApi } from "@/utils/api"
import Cookies from 'js-cookie';
import { Member } from "../../data-group/dataGroupColums"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const FormSchema = z.object({
    driver: z.string().min(1, {
        message: "Nama driver must be at least 1 characters.",
    }),

    alamat_awal: z.string().min(1, {
        message: "alamat_awal must be at least 1 characters.",
    }),

    latitude_awal: z.string().min(1, {
        message: "Nama latitude_awal must be at least 1 characters.",
    }),

    longitude_awal: z.string().min(1, {
        message: "longitude_awal must be at least 1 characters.",
    }),

    alamat_tujuan: z.string().min(1, {
        message: "Nama alamat_tujuan must be at least 1 characters.",
    }),

    latitude_tujuan: z.string().min(1, {
        message: "latitude_tujuan must be at least 1 characters.",
    }),

    longitude_tujuan: z.string().min(1, {
        message: "Nama longitude_tujuan must be at least 1 characters.",
    }),

    nama_kendaraan: z.string().min(1, {
        message: "Nama nama_kendaraan must be at least 1 characters.",
    }),

    no_polisi: z.string().min(1, {
        message: "Nama no_polisi must be at least 1 characters.",
    }),

})

export default function TambahPerjalanan() {
    const groupId = Cookies.get('groupId')
    const [members, setMembers] = useState<Member[] | []>([])
    const [loading, setLoading] = useState(false)
    const [selectedUserId, setSelectedUserId] = useState(0)

    const router = useRouter()

    async function getGroupInformation() {
        setLoading(true);
        const { data } = await fetchApi("/groups/detail", {
            method: "POST",
            body: {
                "group_id": groupId
            }
        })
        if (data) {
            setMembers(data.members)
        }
        setLoading(false);
    }

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            driver: "",
            alamat_awal: "",
            latitude_awal: "",
            longitude_awal: "",
            alamat_tujuan: "",
            latitude_tujuan: "",
            longitude_tujuan: "",
            nama_kendaraan: "",
            no_polisi: "",
        },
    })

    useEffect(() => {
        getGroupInformation()
    }, [])

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        const { data: dataResponse, error } = await fetchApi("/trips/add-trip", {
            method: "POST",
            body: {
                alamatAwal: data.alamat_awal,
                latitudeAwal: data.latitude_awal,
                longitudeAwal: data.longitude_awal,
                alamatTujuan: data.alamat_tujuan,
                latitudeTujuan: data.latitude_tujuan,
                longitudeTujuan: data.longitude_tujuan,
                groupId: groupId,
                driverId: selectedUserId,
                namaKendaraan: data.nama_kendaraan,
                noPolisi: data.no_polisi,
            }
        })

        if (dataResponse) {
            toast({
                title: "Data perjalanan berhasil ditambahkan",
            })

            router.back()
        } else {
            toast({
                title: "Proses gagal",
                description: error
            })
        }
    }

    return (
        <div className="container py-4">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Buat Perjalanan Baru</CardTitle>
                    <CardDescription>Tambahkan data data berikut untuk memulai perjalanan baru</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="driver"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tentukan Driver</FormLabel>

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
                                                                ? members.find(
                                                                    (member) => member.user.email === field.value
                                                                )?.user.email
                                                                : "Pilih Driver"}
                                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height]">
                                                    <Command>
                                                        <CommandInput placeholder="Cari Driver..." />
                                                        <CommandEmpty>No language found.</CommandEmpty>
                                                        <CommandGroup>
                                                            <CommandList>
                                                                {members.map((member) => (
                                                                    <CommandItem
                                                                        value={member.user.email}
                                                                        key={member.user.id}
                                                                        onSelect={() => {
                                                                            form.setValue("driver", member.user.email)
                                                                            setSelectedUserId(member.user.id)
                                                                        }}
                                                                    >
                                                                        <div className="flex justify-start gap-2">
                                                                            {/* avatara */}
                                                                            <Avatar>
                                                                                {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
                                                                                <AvatarFallback>{member.user?.username.slice(0, 2)}</AvatarFallback>
                                                                            </Avatar>
                                                                            <div className="flex flex-col">
                                                                                <div className="font-semibold">{member.user.username}</div>
                                                                                <div className="text-sm">{member.user.email}</div>
                                                                            </div>

                                                                        </div>

                                                                    </CommandItem>
                                                                ))}
                                                            </CommandList>
                                                        </CommandGroup>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                        </FormControl>

                                        <FormDescription>
                                            Tentukan Driver di dalam group ini
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="alamat_awal"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Alamat Awal</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Tentukan alamat awal" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Tentukan alamat awal
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Lat Long Awal */}
                            <div className="flex gap-4 w-full justify-between">

                                <FormField
                                    control={form.control}
                                    name="latitude_awal"
                                    render={({ field }) => (
                                        <FormItem className="w-1/2">
                                            <FormLabel>Latitude Awal</FormLabel>
                                            <FormControl>
                                                <Input type="text" placeholder="Tentukan latitude awal" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Masukan koordinat latitude titik awal
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="longitude_awal"
                                    render={({ field }) => (
                                        <FormItem className="w-1/2">
                                            <FormLabel>Longitude Awal</FormLabel>
                                            <FormControl>
                                                <Input type="text" placeholder="Tentukan Longitude awal" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Masukan koordinat Longitude titik awal
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="alamat_tujuan"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Alamat Tujuan</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Tentukan alamat tujuan perjalanan" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Tentukan alamat tujuan perjalanan
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Lat Long Awal */}
                            <div className="flex gap-4 w-full justify-between">

                                <FormField
                                    control={form.control}
                                    name="latitude_tujuan"
                                    render={({ field }) => (
                                        <FormItem className="w-1/2">
                                            <FormLabel>Latitude Tujuan</FormLabel>
                                            <FormControl>
                                                <Input type="text" placeholder="Tentukan latitude tujuan" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Masukan koordinat latitude titik tujuan
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="longitude_tujuan"
                                    render={({ field }) => (
                                        <FormItem className="w-1/2">
                                            <FormLabel>Longitude Tujuan</FormLabel>
                                            <FormControl>
                                                <Input type="text" placeholder="Tentukan Longitude tujuan" {...field} />
                                            </FormControl>
                                            <FormDescription>
                                                Masukan koordinat Longitude titik tujuan
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Nama Kendaraan */}
                            <FormField
                                control={form.control}
                                name="nama_kendaraan"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nama Kendaraan</FormLabel>
                                        <FormControl>
                                            <Input type="text" placeholder="Masukan Nama Kendaraan" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Masukan Nama Kendaraan
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* No Polisi */}
                            <FormField
                                control={form.control}
                                name="no_polisi"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nomor Polisi</FormLabel>
                                        <FormControl>
                                            <Input type="text" placeholder="Masukan Nomor Polisi" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Masukan Nomor Polisi
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Kotak Maps previre */}

                            <Button type="submit">Tambahkan Perjalanan</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
