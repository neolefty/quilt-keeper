// From https://chat.openai.com/share/e6f2f6b5-6d26-4264-8703-0f48da1976a3
import { numberRange } from "./_lib/quilt/quiltFunctions"

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
export const randomTitle = (butNotThisOne?: string): string => {
    let result = butNotThisOne
    while (result === butNotThisOne || !result)
        result = titlesArray[Math.floor(Math.random() * titlesArray.length)]
    return result
}
