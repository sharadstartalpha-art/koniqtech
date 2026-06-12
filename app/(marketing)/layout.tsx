import Navbar from "@/components/Marketing/Navbar"
import Footer from "@/components/Marketing/Footer"

export default function MarketingLayout({
children
}:{
children:React.ReactNode
}){

return(

<div className="
min-h-screen
bg-slate-950
text-white
">

<Navbar/>

<main>

{children}

</main>

<Footer/>

</div>

)

}