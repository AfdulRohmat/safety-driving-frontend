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
import { useRouter } from 'next/navigation'

const FormSchema = z.object({
    username: z.string().min(2, {
        message: "Email must be at least 2 characters.",
    }),

    email: z.string().min(2, {
        message: "Email must be at least 2 characters.",
    }),

    password: z.string().min(2, {
        message: "Password must be at least 2 characters.",
    }),
})

export default function Register() {
    const router = useRouter()

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        },
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {
        router.push('/aktivasi-akun')

    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <Card className="w-[500px]">
                <CardHeader>
                    <CardTitle>Register</CardTitle>
                    <CardDescription>Daftarkan akun anda untuk mengakses aplikasi</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Sita Nuria" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Masukan username anda
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

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
                                            Masukan email anda
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
                            <Button type="submit">Register</Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="flex flex-row gap-1">
                    <p>Sudah punya akun ? </p>

                    <Link href="/login" className="font-semibold">Login</Link>
                </CardFooter>
            </Card>
        </div>
    )
}
