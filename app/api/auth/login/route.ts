import prisma from "@/shared/lib/prisma"
import bcrypt from "bcryptjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(req:Request){

  try{

    const body=await req.json()

    const user=

    await prisma.user.findUnique({

      where:{

        email:body.email.toLowerCase()

      }

    })

    if(!user){

      return NextResponse.json(

        {

          error:"User not found"

        },

        {

          status:401

        }

      )

    }

    const valid=

    await bcrypt.compare(

      body.password,

      user.passwordHash

    )

    if(!valid){

      return NextResponse.json(

        {

          error:"Wrong password"

        },

        {

          status:401

        }

      )

    }

    const store=await cookies()

    store.set(

      "token",

      user.email,

      {

        httpOnly:true,

        path:"/",

        secure:true,

        sameSite:"lax"

      }

    )

    console.log(

      "LOGIN SUCCESS",

      user.email,

      user.role

    )

    let redirect="/dashboard"

    if(

      user.role==="super_admin"

    ){

      redirect="/admin/dashboard"

    }

    return NextResponse.json({

      success:true,

      role:user.role,

      redirect

    })

  }

  catch(err){

    console.log(err)

    return NextResponse.json(

      {

        error:"Server error"

      },

      {

        status:500

      }

    )

  }

}