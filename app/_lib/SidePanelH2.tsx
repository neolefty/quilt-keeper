import clsx from "clsx"
import { PropsWithChildren } from "react"

export const SidePanelH2 = ({
    children,
    className,
}: PropsWithChildren<{ className?: string }>) => (
    <h2 className={clsx("text-center font-bold text-xl -my-2", className)}>
        {children}
    </h2>
)
