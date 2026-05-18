import {

PDFDocument

}

from "pdf-lib"

export async function buildQuotePdf(){

const pdf=

await PDFDocument.create()

pdf.addPage()

return pdf.save()

}