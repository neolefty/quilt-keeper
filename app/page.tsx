import { PodgePage } from "./_lib/color/components/PodgePage"

export default function Home() {
    return (
        <main className="h-screen grid place-content-center gap-3">
            <h1 className="text-3xl font-bold text-center">Quilt Keeper</h1>
            <PodgePage />
        </main>
    )
}
