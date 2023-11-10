import { QuiltPage } from "./_lib/quilt/QuiltPage"

export default function Home() {
    return (
        // h-screen grid place-content-center gap-3
        <main className="h-screen w-screen flex flex-col">
            <h1 className="text-3xl font-bold p-3 bg-base-200">Quilt Keeper</h1>
            <QuiltPage />
        </main>
    )
}
