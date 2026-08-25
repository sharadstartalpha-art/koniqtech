"use client"

import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"

import { useRouter } from "next/navigation"
import { useTransition } from "react"

import { updateJobStatus } from "./actions"

interface Props {
  children: React.ReactNode
}

const VALID_STATUSES = [
  "scheduled",
  "in_progress",
  "completed",
  "cancelled",
] as const

type JobStatus = (typeof VALID_STATUSES)[number]

export default function DndProvider({
  children,
}: Props) {

  const router = useRouter()

  const [, startTransition] =
    useTransition()

  const sensors = useSensors(

    useSensor(PointerSensor, {

      activationConstraint: {

        distance: 8,

      },

    }),

    useSensor(TouchSensor, {

      activationConstraint: {

        delay: 150,

        tolerance: 5,

      },

    })

  )

  async function handleDragEnd(
    event: DragEndEvent
  ) {

    const {

      active,

      over,

    } = event

    if (!over) return

    const jobId =
      String(active.id)

    const newStatus =
      String(over.id)

    if (
      !VALID_STATUSES.includes(
        newStatus as JobStatus
      )
    ) {
      return
    }

    startTransition(async () => {

      const result =
        await updateJobStatus({

          jobId,

          status:
            newStatus as JobStatus,

        })

      if (!result.success) {

        alert(
          result.message ??
            "Unable to update job."
        )

        router.refresh()

        return

      }

      router.refresh()

    })

  }

  return (

    <DndContext

      sensors={sensors}

      onDragEnd={handleDragEnd}

    >

      {children}

    </DndContext>

  )

}