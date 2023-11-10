import { useColorPodge } from "../state/WithColorPodge"

export const PodgeControls = () => {
    const { setPodge, podge, sortPodge } = useColorPodge()
    return (
        <div className="grid grid-cols-2 gap-3">
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
    )
}
