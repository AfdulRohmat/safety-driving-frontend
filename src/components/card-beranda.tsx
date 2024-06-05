'use client'

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

interface CardBerandaProps {
    title: string,
    desc: string;
}

export const CardBeranda: React.FC<CardBerandaProps> = ({ title, desc }) => {
    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">{title}</CardTitle>
                    <CardDescription>{desc}</CardDescription>
                </CardHeader>
            </Card>
        </div>
    )
}
