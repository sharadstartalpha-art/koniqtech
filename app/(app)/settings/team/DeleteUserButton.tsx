"use client"

export default function DeleteUserButton({
  id,
  action
}:{
  id:string
  action:(formData:FormData)=>Promise<void>
}){

  return (

    <button
      type="submit"
      onClick={(e)=>{

        if(
          !window.confirm(
            "Delete this user?"
          )
        ){
          e.preventDefault()
        }

      }}
      className="
      px-3
      py-1
      text-sm
      rounded-lg
      bg-red-100
      text-red-700
      "
    >
      Delete
    </button>

  )

}