import { QuiltPage } from "./_lib/quilt/QuiltPage"
import { initialTitle, randomTitle } from "./_lib/page/Titles"

export default function Home() {
    return (
        // h-screen grid place-content-center gap-3
        <main className="h-screen w-screen flex flex-col">
            <QuiltPage initialTitle={initialTitle} />
        </main>
    )
}
