import type { PropsWithChildren } from "react"
import Header from "./Header"

export interface LayoutProps extends PropsWithChildren {

}

export default function Layout({ children }: LayoutProps) {
    return (
        <>
        <Header/>
        <main className="main">
            {children}
        </main>
        </>
    )
}