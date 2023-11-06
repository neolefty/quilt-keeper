import Image from "next/image"
import { ColorPodge } from "./_lib/color/ColorPodge"
import { ShowPodge } from "./_components/ShowPodge"

export default function Home() {
    return (
        <main className="h-screen grid place-content-center gap-3">
            <h1 className="text-3xl font-bold text-center">Quilt Keeper</h1>
            <ShowPodge />
        </main>
    )
}
