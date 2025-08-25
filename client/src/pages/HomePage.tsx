import illustration from "@/assets/illustration.svg"
import FormComponent from "@/components/forms/FormComponent"
// import Footer from "@/components/common/Footer";
import { useAuth } from "@/context/AuthContext"
import { useEffect, useState } from "react"
import backendApi from "@/api/backendApi"
import { Link } from "react-router-dom"

function HomePage() {
    const { user } = useAuth()
    const [rooms, setRooms] = useState<string[]>([])

    useEffect(() => {
        let cancelled = false
        async function loadRooms() {
            if (!user) {
                setRooms([])
                return
            }
            try {
                const res = await backendApi.get("/user/me/rooms")
                if (!cancelled) setRooms(res.data.rooms || [])
            } catch {
                if (!cancelled) setRooms([])
            }
        }
        loadRooms()
        return () => {
            cancelled = true
        }
    }, [user])

    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-16">
            <div className="my-12 flex h-full min-w-full flex-col items-center justify-evenly sm:flex-row sm:pt-0">
                <div className="flex w-full animate-up-down justify-center sm:w-1/2 sm:pl-4">
                    <img
                        src={illustration}
                        alt="Code Sync Illustration"
                        className="mx-auto w-[250px] sm:w-[400px]"
                    />
                </div>
                <div className="flex w-full items-center justify-center sm:w-1/2">
                    <FormComponent />
                </div>
            </div>
            {user && rooms.length > 0 && (
                <div className="w-full max-w-[500px] p-4">
                    <h2 className="mb-2 text-lg font-semibold">Your recent rooms</h2>
                    <ul className="list-disc space-y-2 pl-5">
                        {rooms.map((r) => (
                            <li key={r}>
                                <Link className="underline" to={`/editor/${r}`}>{r}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {/* <Footer /> */}
        </div>
    )
}

export default HomePage
