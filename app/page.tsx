import { QuiltPage } from "./_lib/quilt/QuiltPage"
import { randomTitle } from "./Titles"

const initialTitle = randomTitle()

export default function Home() {
    return (
        // h-screen grid place-content-center gap-3
        <main className="h-screen w-screen flex flex-col">
            <QuiltPage initialTitle={initialTitle} />
        </main>
    )
}
