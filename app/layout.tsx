import type { Metadata } from "next";
import "./styles-1.css";
import "./styles-2.css";
import "./styles-3.css";
import "./styles-4.css";
import "./styles-5.css";
import "./styles-6.css";
import "./styles-7.css";
export const metadata:Metadata={title:"Master Drag Chile",description:"Plataforma oficial de competencia Master Drag Chile"};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="es"><body>{children}</body></html>}
