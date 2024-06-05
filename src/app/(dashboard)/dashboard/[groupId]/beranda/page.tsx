'use client'

import { CardBeranda } from "@/components/card-beranda"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export default function Beranda() {
    return (
        <div className="container flex flex-col gap-6 py-4">
            {/* Nama Menu */}
            <h1 className="text-xl font-semibold">Beranda</h1>

            {/* Nama Grup + role inside this grup */}
            <div className="flex justify-start items-center gap-4">
                <h1 className="text-lg font-semibold">PT Cybernetics</h1>
                <Card className="p-2 border-green-400 bg-green-50">
                    <p className="font-semibold text-sm text-green-400">Driver</p>
                </Card>
            </div>

            {/* Card Total Informasi */}
            <div className="w-full grid grid-rows-1 grid-cols-1 md:grid-rows-3 md:grid-cols-3 gap-4">
                <CardBeranda title="Total KM Perjalanan" desc="20 KM" />
                <CardBeranda title="Total Jam Perjalanan Dilakukan" desc="24 Jam" />
                <CardBeranda title="Total Perjalanan Dilakukan" desc="2 Perjalanan" />
            </div>


        </div>
    )
}
