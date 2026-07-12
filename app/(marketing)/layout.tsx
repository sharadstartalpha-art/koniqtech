import Navbar from "@/components/Marketing/Navbar"
import Footer from "@/components/Marketing/Footer"

export default function MarketingLayout({
children
}:{
children:React.ReactNode
}){

return(

<div className="min-h-screen bg-white text-slate-900">

    <Navbar />

    {children}

    <Footer />

</div>

)

}