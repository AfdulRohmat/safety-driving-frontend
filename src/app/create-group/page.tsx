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

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            icon_group: "",
            nama_group: "",
            description: "",
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {

        const { status } = await fetchApi("/groups/", {
            method: "POST",
            body: data
        })

        if (status === 200) {
            toast({
                title: "Group berhasil dibuat",
            })

            router.back()
        }

    }

    return (
        <div className="flex min-h-screen items-center justify-center">
            <Card className="w-[500px]">
                <CardHeader>
                    <CardTitle>Membuat Grup</CardTitle>
                    <CardDescription>Masukan semua data grup yang dibutuhkan</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="icon_group"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Icon Group</FormLabel>
                                        <FormControl>
                                            <Input id="picture" type="file"  {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Masukan icon grup yang ingin anda buat
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="nama_group"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nama Group</FormLabel>
                                        <FormControl>
                                            <Input type="text" placeholder="nama grup" {...field} />
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
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description Group</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Type your message here."  {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Masukan Deskripsi grup yang ingin anda buat
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit">Buat Group</Button>
                        </form>
                    </Form>
                </CardContent>

            </Card>
        </div>
    )
}
