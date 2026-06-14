import prisma from "@/shared/lib/prisma"
import { revalidatePath } from "next/cache"

export default async function Page({
  params
}:{
  params:Promise<{id:string}>
}){

  const { id } = await params

  const closeout =
    await prisma.closeoutPackage.findFirst({
      where:{ jobId:id }
    })

  async function save(
    formData:FormData
  ){

    "use server"

    const data = {

      notes:String(
        formData.get("notes") || ""
      ),

      finalInspectionPassed:
        formData.get("finalInspectionPassed")
        === "on",

      customerSignOff:
        formData.get("customerSignOff")
        === "on",

      warrantyUploaded:
        formData.get("warrantyUploaded")
        === "on",

      photosUploaded:
        formData.get("photosUploaded")
        === "on",

      invoicePaid:
        formData.get("invoicePaid")
        === "on",

      completionCertificate:
        formData.get("completionCertificate")
        === "on",

      crewSignOff:
        formData.get("crewSignOff")
        === "on",

      completionDate:
        formData.get("completionDate")
        ? new Date(
            String(
              formData.get(
                "completionDate"
              )
            )
          )
        : null
    }

    const existing =
      await prisma.closeoutPackage.findFirst({
        where:{ jobId:id }
      })

    const completed =
      data.finalInspectionPassed &&
      data.customerSignOff &&
      data.warrantyUploaded &&
      data.photosUploaded &&
      data.invoicePaid &&
      data.completionCertificate &&
      data.crewSignOff

    if(existing){

      await prisma.closeoutPackage.update({

        where:{
          id:existing.id
        },

        data:{
          ...data,
          completed
        }

      })

    }else{

      await prisma.closeoutPackage.create({

        data:{
          jobId:id,
          ...data,
          completed
        }

      })

    }

    revalidatePath(
      `/jobs/${id}/closeout`
    )
  }

  return(

    <div className="space-y-8">

      <h1 className="text-5xl font-bold">
        Job Closeout
      </h1>

      <form
        action={save}
        className="
        bg-white
        border
        rounded-3xl
        p-8
        space-y-6
        "
      >

        <textarea
          name="notes"
          rows={5}
          defaultValue={
            closeout?.notes || ""
          }
          placeholder="Closeout Notes"
          className="
          w-full
          border
          rounded-2xl
          p-4
          "
        />

        <div className="grid md:grid-cols-2 gap-4">

          <label className="flex gap-3">
            <input
              type="checkbox"
              name="finalInspectionPassed"
              defaultChecked={
                closeout?.finalInspectionPassed
              }
            />
            Final Inspection Passed
          </label>

          <label className="flex gap-3">
            <input
              type="checkbox"
              name="customerSignOff"
              defaultChecked={
                closeout?.customerSignOff
              }
            />
            Customer Sign-Off
          </label>

          <label className="flex gap-3">
            <input
              type="checkbox"
              name="warrantyUploaded"
              defaultChecked={
                closeout?.warrantyUploaded
              }
            />
            Warranty Uploaded
          </label>

          <label className="flex gap-3">
            <input
              type="checkbox"
              name="photosUploaded"
              defaultChecked={
                closeout?.photosUploaded
              }
            />
            Photos Uploaded
          </label>

          <label className="flex gap-3">
            <input
              type="checkbox"
              name="invoicePaid"
              defaultChecked={
                closeout?.invoicePaid
              }
            />
            Invoice Paid
          </label>

          <label className="flex gap-3">
            <input
              type="checkbox"
              name="completionCertificate"
              defaultChecked={
                closeout?.completionCertificate
              }
            />
            Completion Certificate
          </label>

          <label className="flex gap-3">
            <input
              type="checkbox"
              name="crewSignOff"
              defaultChecked={
                closeout?.crewSignOff
              }
            />
            Crew Sign-Off
          </label>

        </div>

        <div>

          <label className="block mb-2">
            Completion Date
          </label>

          <input
            type="date"
            name="completionDate"
            defaultValue={
              closeout?.completionDate
              ? closeout.completionDate
                  .toISOString()
                  .split("T")[0]
              : ""
            }
            className="
            h-14
            border
            rounded-2xl
            px-4
            "
          />

        </div>

        <button
          className="
          px-8
          py-4
          bg-blue-600
          text-white
          rounded-2xl
          "
        >
          Save Closeout
        </button>

      </form>

      <div className="
      bg-white
      border
      rounded-3xl
      p-6
      ">

        <p className="text-slate-500">
          Closeout Status
        </p>

        <h2 className="text-3xl font-bold mt-3">

          {
            closeout?.completed
            ? "Completed ✅"
            : "Pending ⏳"
          }

        </h2>

      </div>

    </div>

  )

}