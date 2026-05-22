import prisma from "@/shared/lib/prisma"

import { LeadStatus } from "@prisma/client"

export async function getLeads(
  orgId:string
){

  return prisma.lead.findMany({

    where:{
      orgId
    },

    orderBy:{
      createdAt:"desc"
    }

  })

}

export async function getLead(
  id:string
){

  return prisma.lead.findUnique({

    where:{
      id
    }

  })

}

export async function updateLead(

  id:string,

  data:{

    orgId:string

    firstName?:string

    lastName?:string

    name?:string

    phone?:string | null

    email?:string | null

    status?:LeadStatus

    source?:string

  }

){

  return prisma.lead.update({

    where:{
      id
    },

    data:{

      firstName:

        data.firstName ||

        data.name ||

        "Lead",

      lastName:

        data.lastName ||

        "",

      phone:

        data.phone ||

        null,

      email:

        data.email ||

        null,

      status:

        data.status ||

        LeadStatus.new,

      source:

        data.source ||

        "website"

    }

  })

}

export async function deleteLead(
  id:string
){

  return prisma.lead.delete({

    where:{
      id
    }

  })

}