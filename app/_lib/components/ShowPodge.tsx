import { useColorPodge } from "../state/WithColorPodge"

export const ShowPodge = () => {
    const { podge, setPodge, sortPodge } = useColorPodge()
    return (
        <div className="grid gap-3">
            <div className="grid grid-cols-4 gap-3">
                <button
                    className="btn btn-primary"
                    onClick={() => sortPodge(podge.disperse(2))}
                >
                    Step 2
                </button>
                <button
                    className="btn btn-primary"
                    onClick={() => sortPodge(podge.disperse(5))}
                >
                    Step 5
                </button>
                <button
                    className="btn btn-primary"
                    onClick={() => sortPodge(podge.disperse(12))}
                >
                    Step 12
                </button>
                <button
                    className="btn btn-secondary"
                    onClick={() => setPodge(podge.addRandomColor())}
                >
                    Add
                </button>
            </div>
            <hr />
            {podge.driftColors.map((color, i) => (
                <div
                    className="card shadow-xl p-3 text-center"
                    key={i}
                    style={{
                        backgroundColor: color.hexString,
                        color: color.contrast().hexString,
                    }}
                    onClick={() => setPodge(podge.removeColor(i))}
                >
                    {color.hexString}
                </div>
            ))}
        </div>
    )
}
