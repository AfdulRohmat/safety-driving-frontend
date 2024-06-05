
import Header from "@/components/header"
import Sidebar from "@/components/sidebar"


export default function Layout({ children }: {
    children: React.ReactNode,
}) {

    return (
        <div className="flex items-start justify-between ">
            <div className="hidden md:flex">
                <Sidebar />
            </div>
            <div className="w-full">
                <Header />
                <div className="overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    )
}
