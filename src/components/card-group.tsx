'use client'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Cookies from 'js-cookie';
import { Button } from "./ui/button"
import { string } from "zod"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useGroupIdStore } from "@/lib/store"

interface CardGrupProps {
    title: string,
    desc: string,
    groupId: string
}

export const CardGrup: React.FC<CardGrupProps> = ({ title, desc, groupId }) => {

    function doSaveGroupId(groupId: string) {
        Cookies.set('groupId', groupId,);
    }

    return (
        <div>
            <Card onClick={() => doSaveGroupId(groupId)}>
                <CardHeader>
                    <Avatar>
                        {/* <AvatarImage src={avatar_url} /> */}
                        <AvatarFallback>{title.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <CardTitle className="overflow-hidden text-lg line-clamp-1">{title}</CardTitle>
                    <CardDescription className="line-clamp-3">{desc}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild>
                        <Link href={`/dashboard/${groupId}/beranda`}>Buka</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
