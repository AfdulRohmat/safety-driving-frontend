"use client"

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
import { useRouter, usePathname } from 'next/navigation'
import { login } from '../../../services/auth'
import { useEffect, useState } from "react"
import { fetchApi } from "@/utils/api"
import Cookies from 'js-cookie';

const FormSchema = z.object({
    email: z.string().min(2, {
        message: "Email must be at least 2 characters.",
    }),

    password: z.string().min(2, {
        message: "Password must be at least 2 characters.",
    }),
})

export default function Login() {
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const pathname = usePathname()

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        setLoading(true)
        const { data: dataResponse, } = await login(data.email, data.password);

        if (dataResponse) {
            setLoading(false)
            toast({
                title: "Login berhasil",
            })

            router.push('/')
        } else {
            setLoading(false)
            toast({
                title: "Login Gagal.",
                description: "Pastikan email dan password sudah sesuai"
            })
        }
    }

    useEffect(() => {
        const token = Cookies.get('token');
        if (token) router.push('/');

    }, [pathname])


    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <Card className="w-[500px]">
                <CardHeader>
                    <CardTitle>Login</CardTitle>
                    <CardDescription>Silahkan login terlebih dahulu untuk masuk ke dalam dashboard</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="nama@email.com" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Masukan email yang sudah anda daftarkan
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="password123@" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Masukan password
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className={`${loading ? 'block' : ''}`}>Login</Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="flex flex-row gap-1">
                    <p>Belum punya akun ? </p>

                    <Link href="/register" className="font-semibold"> Register</Link>
                </CardFooter>
            </Card>
        </div>
    )
}
