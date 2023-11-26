// From https://chat.openai.com/share/e6f2f6b5-6d26-4264-8703-0f48da1976a3
import { numberRange } from "./_lib/quilt/quiltFunctions"

const titles = {
    PatchPerfect: 6, // weight my faves
    SquareScape: 6,
    QuiltQuest: 4,
    PlayPatch: 3,
    // PatchPlayground: 2, // too long
    CozyCraft: 2,
    GridGroove: 2,
    MosaicMaker: 2,
    PatternPal: 2,
    QuiltCanvas: 2,
    PatchPalette: 2,
    FabricFiesta: 2,
    QuiltThing: 1,
    Cookie: 1,
    Marshmallow: 1,
}
const titlesArray = Object.entries(titles)
    .map(([title, weight]) => numberRange(weight).map(() => title))
    .flat()
export const initialTitle = titlesArray[0]
export const randomTitle = (butNotThisOne?: string): string => {
    let result = butNotThisOne
    while (result === butNotThisOne || !result)
        result = titlesArray[Math.floor(Math.random() * titlesArray.length)]
    return result
}
