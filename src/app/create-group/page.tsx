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
import { Button } from "@/components/ui/button"
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
import { customJwtDecode } from "@/services/jwt-decode"
import { fetchApi } from "@/utils/api"
import { useState } from "react"

const FormSchema = z.object({
    icon_group: z.string(),

    nama_group: z.string().min(2, {
        message: "Nama Group must be at least 2 characters.",
    }),

    description: z.string().min(5, {
        message: "Description must be at least 2 characters.",
    }),
})

export default function CreateGroup() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            icon_group: "",
            nama_group: "",
            description: "",
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        setLoading(true)
        const { status } = await fetchApi("/groups/", {
            method: "POST",
            body: data
        })

        if (status === 200) {
            setLoading(false)
            toast({
                title: "group berhasil dibuat",
            })

            router.back()
        } else {
            setLoading(false)
            toast({
                title: "Gagal membuat group",
                description: "Gagal membuat group. Mohon coba lagi"
            })
        }

    }

    return (
        <div className="flex min-h-screen items-center justify-center">
            <Card className="w-[500px]">
                <CardHeader>
                    <CardTitle>Membuat group</CardTitle>
                    <CardDescription>Masukan semua data group yang dibutuhkan</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            {/* <FormField
                                control={form.control}
                                name="icon_group"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Icon Group</FormLabel>
                                        <FormControl>
                                            <Input id="picture" type="file"  {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Masukan icon group yang ingin anda buat
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            /> */}

                            <FormField
                                control={form.control}
                                name="nama_group"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nama Group</FormLabel>
                                        <FormControl>
                                            <Input type="text" placeholder="nama group" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Masukan nama group yang ingin anda buat
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description Group</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Type your message here."  {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Masukan Deskripsi group yang ingin anda buat
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
                                    'Buat group'
                                )}
                            </Button>
                        </form>
                    </Form>
                </CardContent>

            </Card>
        </div>
    )
}
