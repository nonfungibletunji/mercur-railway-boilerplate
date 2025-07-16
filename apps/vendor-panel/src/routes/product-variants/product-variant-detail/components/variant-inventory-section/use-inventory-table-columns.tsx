import { ProductVariantDTO } from "@medusajs/types"

import { PlaceholderCell } from "../../../../../components/table/table-cells/common/placeholder-cell"
import { createColumnHelper } from "@tanstack/react-table"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"

export interface ExtendedInventoryItem {
  required_quantity: number
  variant: ProductVariantDTO[] & {
    inventory_items: any[]
    id: string
  }
}

const columnHelper = createColumnHelper<ExtendedInventoryItem>()

export const useInventoryTableColumns = () => {
  const { t } = useTranslation()

  return useMemo(
    () => [
      columnHelper.accessor("variant.title", {
        header: t("fields.title"),
        cell: ({ getValue }) => {
          const title = getValue() as string

          if (!title) {
            return <PlaceholderCell />
          }

          return (
            <div className="flex size-full items-center overflow-hidden">
              <span className="truncate">{title}</span>
            </div>
          )
        },
      }),
      columnHelper.accessor("variant.sku", {
        header: t("fields.sku"),
        cell: ({ getValue }) => {
          const sku = getValue() as string

          if (!sku) {
            return <PlaceholderCell />
          }

          return (
            <div className="flex size-full items-center overflow-hidden">
              <span className="truncate">{sku}</span>
            </div>
          )
        },
      }),
    ],
    [t]
  )
}
