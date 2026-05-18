"use server"

import bcrypt from "bcryptjs"

import prisma from "@/shared/lib/prisma"

export async function registerUser(
    data:any
){

    const hash =
        await bcrypt.hash(
            data.password,
            10
        )

    const org =
        await prisma.organization.create({

            data:{

                name:
                    data.company,

                slug:
                    data.company
                    .toLowerCase()
                    .replace(/\s/g,"-")
            }

        })

    await prisma.user.create({

        data:{

            orgId:
                org.id,

            name:
                data.name,

            email:
                data.email,

            passwordHash:
                hash,

            role:
                "owner"

        }

    })

}