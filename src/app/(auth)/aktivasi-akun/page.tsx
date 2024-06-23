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
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"
import { useSearchParams, useRouter } from 'next/navigation'
import { useState } from "react"
import { fetchApi } from "@/utils/api"


const FormSchema = z.object({
    otp: z.string().min(6, {
        message: "Email must be at least 6 characters.",
    }),
})


export default function AktivasiAkun() {
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams();
    const email = searchParams.get('email');

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            otp: "",
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        setLoading(true)
        const { data: dataResponse, errorResponse } = await fetchApi("/auth/activate-account", {
            method: 'POST',
            body: {
                'email': email,
                'activationCode': data.otp
            }
        })

        if (dataResponse) {
            setLoading(false)
            toast({
                title: "Aktivasi Akun berhasil. Silahkan Login",
            })

            router.push('/login')
        } else {
            setLoading(false)
            toast({
                title: "Aktivasi Akun Gagal.",
                description: "Email sudah terdaftar atau kode aktivasi tidak valid."
            })
        }
    }

    async function doResendActivationCode() {
        setLoading(true)
        const { data: dataResponse, errorResponse } = await fetchApi("/auth/resend-activation-code", {
            method: 'POST',
            body: {
                'email': email,
            }
        })

        if (dataResponse) {
            setLoading(false)
            toast({
                title: "Kode Aktivasi Akun berhasil dikrim ulang. Silahkan cek email anda",
            })
            
        } else {
            setLoading(false)
            toast({
                title: "Kode Aktivasi Akun gagal dikrim ulang",
                description: "Email sudah terdaftar atau email tidak valid."
            })
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <Card className="w-[500px]">
                <CardHeader>
                    <CardTitle>Aktivasi Akun</CardTitle>
                    <CardDescription>Aktivasi akun anda melalui kode OTP yang sudah kami kirimkan</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="otp"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Kode OTP</FormLabel>
                                        <FormControl>
                                            <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS_AND_CHARS} {...field}>
                                                <InputOTPGroup>
                                                    <InputOTPSlot index={0} />
                                                    <InputOTPSlot index={1} />
                                                    <InputOTPSlot index={2} />
                                                    <InputOTPSlot index={3} />
                                                    <InputOTPSlot index={4} />
                                                    <InputOTPSlot index={5} />
                                                </InputOTPGroup>
                                            </InputOTP>
                                        </FormControl>
                                        <FormDescription>
                                            Kami telah mengirim kode OTP ke email anda. Mohon cek email anda
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" disabled={loading}>Submit</Button>

                            <p onClick={() => doResendActivationCode()} className="font-semibold hover:cursor-pointer hover:underline">
                                Kirim ulang kode aktivasi
                            </p>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
