"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Page() {

  const router = useRouter()

  const [customerId,setCustomerId]=useState("")

  const [items,setItems]=useState([
    {
      name:"",
      price:""
    }
  ])

  async function createQuote(){

    const subtotal =
      items.reduce(
        (a,b)=>
          a + Number(b.price || 0),
        0
      )

    const tax =
      subtotal * 0.18

    const total =
      subtotal + tax

    const res =
      await fetch(
        "/api/quotes",
        {
          method:"POST",

          headers:{
            "Content-Type":
            "application/json"
          },

          body:JSON.stringify({

            customerId,

            subtotal,

            tax,

            total,

            items

          })
        }
      )

    const quote =
      await res.json()

    router.push(
      `/quotes/${quote.id}`
    )

  }

  return(

    <div className="space-y-8">

      <h1 className="text-5xl font-bold">
        Create Quote
      </h1>

      <div className="bg-white rounded-3xl p-10 space-y-5">

        <input
          value={customerId}
          onChange={e=>
            setCustomerId(
              e.target.value
            )
          }
          placeholder="Customer Id"
          className="
          w-full
          border
          p-5
          rounded-xl
          "
        />

        {

          items.map((item,index)=>(

            <div
              key={index}
              className="
              grid
              grid-cols-2
              gap-4
              "
            >

              <input

                value={item.name}

                onChange={e=>{

                  const copy=[...items]

                  copy[index].name =
                    e.target.value

                  setItems(copy)

                }}

                placeholder="Item"

                className="
                border
                p-4
                rounded-xl
                "
              />

              <input

                value={item.price}

                onChange={e=>{

                  const copy=[...items]

                  copy[index].price =
                    e.target.value

                  setItems(copy)

                }}

                placeholder="Price"

                className="
                border
                p-4
                rounded-xl
                "
              />

            </div>

          ))

        }

        <button

          onClick={()=>

            setItems([
              ...items,
              {
                name:"",
                price:""
              }
            ])

          }

          className="
          bg-slate-100
          px-6
          py-3
          rounded-xl
          "

        >

          Add Item

        </button>

        <div>

          <button

            onClick={createQuote}

            className="
            bg-blue-600
            text-white
            px-8
            py-4
            rounded-xl
            "

          >

            Create Quote

          </button>

        </div>

      </div>

    </div>

  )

}