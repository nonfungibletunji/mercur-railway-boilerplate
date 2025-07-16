import { HttpTypes } from "@medusajs/types"

export function isReturnOption(shippingOption: HttpTypes.AdminShippingOption) {
  return !!shippingOption.rules?.find((r) => r.attribute === "is_return")
}

export function isOptionEnabledInStore(
  shippingOption: HttpTypes.AdminShippingOption
) {
  return !!shippingOption.rules?.find(
    (r) =>
      r.attribute === "enabled_in_store" &&
      r.value === "true" &&
      r.operator === "eq"
  )
}

export function getShippingProfileName(name: string) {
  return name.split(":")[1]
}
