import Navbar from '../Navbar/Navbar'

interface LayoutProps {
    children: any
}

function Layout({ children }: LayoutProps) {
    return (
        <>
            <Navbar />
            <main>{children}</main>
        </>
    )
}

export default Layout