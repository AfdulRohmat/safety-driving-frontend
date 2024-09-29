"use client"

import { Suspense, useState } from "react"
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
import { fetchApi } from "@/utils/api"

const FormSchema = z.object({
    otp: z.string().min(6, {
        message: "Email must be at least 6 characters.",
    }),
})

function AktivasiAkunContent() {
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
                                    'Submit'
                                )}
                            </Button>

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

export default function AktivasiAkun() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AktivasiAkunContent />
        </Suspense>
    )
}
