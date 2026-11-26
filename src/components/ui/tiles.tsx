"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface TilesProps {
  className?: string
  rows?: number
  cols?: number
  tileClassName?: string
  tileSize?: "sm" | "md" | "lg"
}

const tileSizes = {
  sm: "w-8 h-8",
  md: "w-9 h-9 md:w-12 md:h-12",
  lg: "w-12 h-12 md:w-16 md:h-16",
}

export function Tiles({
  className,
  rows = 100,
  cols = 10,
  tileClassName,
  tileSize = "md",
}: TilesProps) {
  const rowsArray = new Array(rows).fill(1)
  const colsArray = new Array(cols).fill(1)

  return (
    <div 
      className={cn(
        "relative z-0 flex w-full h-full justify-center",
        className
      )}
    >
      {rowsArray.map((_, i) => (
        <div
          key={`row-${i}`}
          className={cn(
            tileSizes[tileSize],
            "border-l dark:border-neutral-900 border-neutral-200 relative",
            tileClassName
          )}
        >
          {/* Le survol n'est plus animé ici mais en CSS, sur un pseudo-élément
              de la case (voir « Le survol d'une case » dans index.css).
              L'ancienne version passait par framer-motion : l'allumage était
              instantané, et l'extinction prévue en 2 s ne s'appliquait pas —
              `animate` ne portait qu'une transition, sans valeur cible, et le
              retour retombait sur la durée par défaut, ~250 ms. La case
              clignotait au lieu de s'éteindre, et chaque survol animait une
              couleur en JavaScript, image par image. */}
          {colsArray.map((_, j) => (
            <div
              key={`col-${j}`}
              className={cn(
                tileSizes[tileSize],
                "border-r border-t dark:border-neutral-900 border-neutral-200 relative",
                tileClassName
              )}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
