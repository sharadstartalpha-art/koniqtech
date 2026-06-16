export default function EmailTemplatesPage() {

  return (

    <div className="max-w-6xl space-y-8">

      <div>

        <h1 className="text-4xl font-bold">
          Email Templates
        </h1>

        <p className="text-slate-500 mt-2">
          Customize customer communications.
        </p>

      </div>

      <div className="grid gap-6">

        <TemplateCard
          title="Welcome Email"
        />

        <TemplateCard
          title="Quote Sent"
        />

        <TemplateCard
          title="Invoice Sent"
        />

        <TemplateCard
          title="Job Completed"
        />

      </div>

    </div>

  )

}

function TemplateCard({
  title
}:{
  title:string
}){

  return(

    <div className="
    bg-white
    border
    rounded-3xl
    p-6
    ">

      <div className="
      flex
      items-center
      justify-between
      ">

        <div>

          <h2 className="font-semibold">
            {title}
          </h2>

        </div>

        <button
          className="
          px-4
          py-2
          border
          rounded-xl
          "
        >
          Edit
        </button>

      </div>

    </div>

  )

}