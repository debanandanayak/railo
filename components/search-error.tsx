"use client"
import { toast } from "./ui/toast"

export default function SearchError({ error }: { error: string | undefined }) {
  console.log(error)
  if (error!==undefined || error!=="") {
    toast.add({
      description:error
    })
  }
  return null
}
