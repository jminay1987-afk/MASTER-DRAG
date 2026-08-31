import type { Metadata } from "next";
import "./styles.css";
export const metadata:Metadata={title:"Master Drag Chile",description:"Plataforma oficial de competencia Master Drag Chile"};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="es"><body>{children}</body></html>}
