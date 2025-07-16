import { Star, StarSolid } from "@medusajs/icons"

export const StarsRating = ({ rate }: { rate: number }) => {
  return (
    <div className="flex gap-1">
      {[
        ...Array(5)
          .keys()
          .map((key: number) => {
            return key < rate ? <StarSolid key={key} /> : <Star key={key} />
          }),
      ]}
    </div>
  )
}
