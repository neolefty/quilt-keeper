import { useSearchParams } from "next/navigation"

export const defaultSize = [4, 4]
export const useSizeFromUrlParams = (override?: [number, number]) => {
    const sizeParam = useSearchParams().get("size")
    if (override) return override
    else if (sizeParam && sizeParam.match(/^\d+x\d+$/)) {
        try {
            const [width, height] = sizeParam.split("x").map(Number)
            return [
                Math.abs(width) || defaultSize[0],
                Math.abs(height) || defaultSize[1],
            ]
        } catch (e) {
            console.error(e)
            return defaultSize
        }
    } else return defaultSize
}
