import { useEffect, useState } from "react"
import { SvgIconButton } from "../color/components/SvgIconButton"
import { randomTitle } from "./Titles"

export const AppTitle = ({ initialTitle }: { initialTitle: string }) => {
    const [title, setTitle] = useState(initialTitle)
    const updateTitle = (newTitle: string) => {
        setTitle(newTitle)
        const titleElement = (document.getElementsByTagName(
            "title",
        )[0].innerText = newTitle)
    }
    useEffect(() => updateTitle(initialTitle), [initialTitle])
    return (
        <h1 className="text-3xl font-bold pt-2">
            {title}
            <SvgIconButton
                title="Change title"
                className="btn btn-ghost btn-sm px-0 ml-1"
                onClick={() => updateTitle(randomTitle(title))}
                icon="d6"
                color="#888"
            />
        </h1>
    )
}
