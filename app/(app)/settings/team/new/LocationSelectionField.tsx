
"use client"

import { useEffect, useState } from "react"

type Props = {
  multiple: boolean
}

export default function LocationSelectionField({
  multiple,
}: Props) {
  const [selected, setSelected] = useState<string[]>([])

  useEffect(() => {
    const inputs = Array.from(
      document.querySelectorAll<HTMLInputElement>(
        'input[name="locationSelect"]'
      )
    )

    const update = () => {
      const values = inputs
        .filter((input) => input.checked)
        .map((input) => input.value)

      setSelected(
        multiple
          ? [...new Set(values)]
          : values.slice(0, 1)
      )
    }

    inputs.forEach((input) => {
      input.addEventListener("change", update)
    })

    update()

    return () => {
      inputs.forEach((input) => {
        input.removeEventListener("change", update)
      })
    }
  }, [multiple])

  return (
    <input
      type="hidden"
      name="locationIds"
      value={JSON.stringify(selected)}
      readOnly
    />
  )
}

