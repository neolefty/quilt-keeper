import { QuiltPage } from "./_lib/quilt/QuiltPage"
import { numberRange } from "./_lib/quilt/quiltFunctions"

// From https://chat.openai.com/share/e6f2f6b5-6d26-4264-8703-0f48da1976a3
const titles = {
    SquareScape: 3, // weight my faves
    PatchPerfect: 3,
    PlayPatch: 2,
    QuiltQuest: 2,
    // PatchPlayground: 1, // too long
    CozyCraft: 1,
    GridGroove: 1,
    MosaicMaker: 1,
    PatternPal: 1,
    QuiltCanvas: 1,
    PatchPalette: 1,
    FabricFiesta: 1,
}
const titlesArray = Object.entries(titles)
    .map(([title, weight]) => numberRange(weight).map(() => title))
    .flat()
const randomTitle = () =>
    titlesArray[Math.floor(Math.random() * titlesArray.length)]
let title = randomTitle()
const pickNewTitle = () => (title = randomTitle())

export default function Home() {
    return (
        // h-screen grid place-content-center gap-3
        <main className="h-screen w-screen flex flex-col">
            <h1 className="text-3xl font-bold p-3 bg-base-200">{title}</h1>
            <QuiltPage />
        </main>
    )
}
