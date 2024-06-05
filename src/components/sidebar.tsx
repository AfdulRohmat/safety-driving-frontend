"use client"
import {
    Boxes,
    Bus,
    ClipboardList,
    Home,
    PanelTop
} from "lucide-react"

import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command"
import Link from "next/link"
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from "react"
import { useRouter } from "next/router"
import { useGroupIdStore } from "@/lib/store"
import Cookies from 'js-cookie';

export default function Sidebar() {
    const pathname = usePathname();
    const groupId = Cookies.get('groupId')
    // get groupId

    const menuList = [
        {
            group: "General",
            items: [
                {
                    link: `/dashboard/${groupId}/beranda`,
                    icon: <Home />,
                    text: "Beranda"
                },
                {
                    link: `/dashboard/${groupId}/data-group`,
                    icon: <Boxes />,
                    text: "Data Group"
                },
                {
                    link: `/dashboard/${groupId}/perjalanan`,
                    icon: <Bus />,
                    text: "Perjalanan"
                },
                {
                    link: `/dashboard/${groupId}/laporan`,
                    icon: <ClipboardList />,
                    text: "Laporan"
                },
            ]
        }
    ]

    return (
        <div className="flex flex-col w-[300px] border-r  p-4 h-screen">
            {/* TITLE */}
            <div className="font-bold text-2xl">Safety Driving</div>
            {/* <p>{groupId}</p> */}

            {/* MENU */}
            <div className="grow mt-4 ">
                <Command >
                    <CommandList>
                        {menuList.map((menu: any, key: number) => (
                            <CommandGroup key={key}>
                                {menu.items.map((option: any, optionKey: number) =>
                                    <CommandItem key={optionKey} >
                                        <Link href={option.link} className={`flex gap-4 cursor-pointer ${option.link === pathname ? 'font-bold' : 'font-normal'}`}>
                                            {option.icon}
                                            {option.text}
                                        </Link>
                                    </CommandItem>
                                )}
                            </CommandGroup>
                        ))}
                    </CommandList>
                </Command>
            </div>

            {/* SETTING */}
            {/* <div className="flex gap-4 cursor-pointer px-2 py-3 text-base">
                <PanelTop />
                <span>Kembali ke Menu Utama</span>
            </div> */}

        </div >
    )
}
