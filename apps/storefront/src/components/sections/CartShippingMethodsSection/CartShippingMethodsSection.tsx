"use client"

import ErrorMessage from "@/components/molecules/ErrorMessage/ErrorMessage"
import { setShippingMethod } from "@/lib/data/cart"
import { calculatePriceForShippingOption } from "@/lib/data/fulfillment"
import { convertToLocale } from "@/lib/helpers/money"
import { CheckCircleSolid, Loader } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/atoms"
import { Modal } from "@/components/molecules"

// Extended cart item product type to include seller
type ExtendedStoreProduct = HttpTypes.StoreProduct & {
  seller?: {
    id: string
    name: string
  }
}

// Cart item type definition
type CartItem = {
  product?: ExtendedStoreProduct
  // Include other cart item properties as needed
}

export type StoreCardShippingMethod = HttpTypes.StoreCartShippingOption & {
  seller_id?: string
  service_zone?: {
    fulfillment_set: {
      type: string
    }
  }
}

type ShippingProps = {
  cart: Omit<HttpTypes.StoreCart, "items"> & {
    items?: CartItem[]
  }
  availableShippingMethods: StoreCardShippingMethod[] | null
}

const CartShippingMethodsSection: React.FC<ShippingProps> = ({
  cart,
  availableShippingMethods,
}) => {
  const [isLoadingPrices, setIsLoadingPrices] = useState(false)
  const [calculatedPricesMap, setCalculatedPricesMap] = useState<
    Record<string, number>
  >({})
  const [error, setError] = useState<string | null>(null)
  const [missingModal, setMissingModal] = useState(false)
  const [missingShippingSellers, setMissingShippingSellers] = useState<
    string[]
  >([])

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "delivery"

  const _shippingMethods = availableShippingMethods?.filter(
    (sm) => sm.service_zone?.fulfillment_set?.type !== "pickup"
  )

  useEffect(() => {
    const sellerSet = new Set<string>()
    cart.items?.forEach((item) => {
      if (item?.product?.seller?.id) {
        sellerSet.add(item.product.seller.id)
      }
    })

    const sellerMethods = _shippingMethods?.map(({ seller_id }) => seller_id) || []

    const missingSellerIds = [...sellerSet].filter(
      (sellerId) => !sellerMethods.includes(sellerId)
    )

    // Avoid unnecessary state updates
    setMissingShippingSellers((prev) => {
      const same =
        prev.length === missingSellerIds.length &&
        prev.every((id, idx) => id === missingSellerIds[idx])
      return same ? prev : missingSellerIds
    })

    setMissingModal((prev) => {
      const shouldShow = missingSellerIds.length > 0 && !cart.shipping_methods?.length
      return prev === shouldShow ? prev : shouldShow
    })
  }, [cart.items, cart.shipping_methods, _shippingMethods])

  useEffect(() => {
    if (_shippingMethods?.length) {
      const promises = _shippingMethods
        .filter((sm) => sm.price_type === "calculated")
        .map((sm) => calculatePriceForShippingOption(sm.id, cart.id))

      if (promises.length) {
        Promise.allSettled(promises).then((res) => {
          const pricesMap: Record<string, number> = {}
          res
            .filter((r) => r.status === "fulfilled")
            .forEach((p) => (pricesMap[p.value?.id || ""] = p.value?.amount!))

          setCalculatedPricesMap(pricesMap)
          setIsLoadingPrices(false)
        })
      }
    }
  }, [availableShippingMethods, _shippingMethods, cart.id])

  const handleSubmit = () => {
    router.push(pathname + "?step=payment", { scroll: false })
  }

  const handleSetShippingMethod = async (id: string | null) => {
    setIsLoadingPrices(true)
    setError(null)

    if (!id) {
      setIsLoadingPrices(false)
      return
    }

    await setShippingMethod({ cartId: cart.id, shippingMethodId: id }).catch(
      (err) => {
        setError(err.message)
      }
    )

    setIsLoadingPrices(false)
  }

  useEffect(() => {
    setError(null)
  }, [isOpen])

  const groupedBySellerId = _shippingMethods?.reduce((acc: any, method) => {
    const sellerId = method.seller_id!

    if (!acc[sellerId]) {
      acc[sellerId] = []
    }

    acc[sellerId].push(method)
    return acc
  }, {})

  const handleEdit = () => {
    router.replace(pathname + "?step=delivery")
  }

  const missingSellers = cart.items
    ?.filter((item) =>
      missingShippingSellers.includes(item.product?.seller?.id!)
    )
    .map((item) => item.product?.seller?.name)

  return (
    <div className="border p-4 rounded-sm bg-ui-bg-interactive">
      {missingModal && (
        <Modal
          heading="Missing seller shipping option"
          onClose={() => router.push("/cart")}
        >
          <div className="p-4">
            <h2 className="heading-sm">
              Some of the sellers in your cart do not have shipping options.
            </h2>

            <p className="text-md mt-3">
              Please remove the{" "}
              <span className="font-bold">
                {missingSellers?.map(
                  (seller, index) =>
                    `${seller}${index === missingSellers.length - 1 ? " " : ", "
                    }`
                )}
              </span>{" "}
              items or contact{" "}
              {missingSellers && missingSellers?.length > 1 ? "them" : "him"} to
              get the shipping options.
            </p>
          </div>
        </Modal>
      )}
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className="flex flex-row text-3xl-regular gap-x-2 items-baseline items-center"
        >
          {!isOpen && (cart.shipping_methods?.length ?? 0) > 0 && (
            <CheckCircleSolid />
          )}
          Delivery
        </Heading>
        {!isOpen && (
          <Text>
            <Button onClick={handleEdit} variant="tonal">
              Edit
            </Button>
          </Text>
        )}
      </div>
      {isOpen ? (
        <>
          <div className="grid">
            <div data-testid="delivery-options-container">
              <div className="pb-8 md:pt-0 pt-2">
                {Object.keys(groupedBySellerId).map((key) => {
                  return (
                    <div key={key}>
                      <Heading level="h3" className="mb-2">
                        {groupedBySellerId[key][0].seller_name}
                      </Heading>
                      <select
                        onChange={(e) =>
                          handleSetShippingMethod(e.target.value)
                        }
                        className="w-full border rounded-lg p-4"
                        defaultValue={""}
                      >
                        <option hidden value="">
                          Choose delivery option
                        </option>
                        {groupedBySellerId[key].map((option: any) => {
                          return (
                            <option key={option.id} value={option.id}>
                              {option.name}
                              {" - "}
                              {option.price_type === "flat" ? (
                                convertToLocale({
                                  amount: option.amount!,
                                  currency_code: cart?.currency_code,
                                })
                              ) : calculatedPricesMap[option.id] ? (
                                convertToLocale({
                                  amount: calculatedPricesMap[option.id],
                                  currency_code: cart?.currency_code,
                                })
                              ) : isLoadingPrices ? (
                                <Loader />
                              ) : (
                                "-"
                              )}
                            </option>
                          )
                        })}
                      </select>
                    </div>
                  )
                })}
                {cart && (cart.shipping_methods?.length ?? 0) > 0 && (
                  <div className="flex flex-col">
                    {cart.shipping_methods?.map((method) => (
                      <div
                        key={method.id}
                        className="mb-4 border rounded-md p-4"
                      >
                        <Text className="txt-medium-plus text-ui-fg-base mb-1">
                          Method
                        </Text>
                        <Text className="txt-medium text-ui-fg-subtle">
                          {method.name}{" "}
                          {convertToLocale({
                            amount: method.amount!,
                            currency_code: cart?.currency_code,
                          })}
                        </Text>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div>
            <ErrorMessage
              error={error}
              data-testid="delivery-option-error-message"
            />
            <Button
              onClick={handleSubmit}
              variant="tonal"
              disabled={!cart.shipping_methods?.[0]}
              loading={isLoadingPrices}
            >
              Continue to payment
            </Button>
          </div>
        </>
      ) : (
        <div>
          <div className="text-small-regular">
            {cart && (cart.shipping_methods?.length ?? 0) > 0 && (
              <div className="flex flex-col">
                {cart.shipping_methods?.map((method) => (
                  <div key={method.id} className="mb-4 border rounded-md p-4">
                    <Text className="txt-medium-plus text-ui-fg-base mb-1">
                      Method
                    </Text>
                    <Text className="txt-medium text-ui-fg-subtle">
                      {method.name}{" "}
                      {convertToLocale({
                        amount: method.amount!,
                        currency_code: cart?.currency_code,
                      })}
                    </Text>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default CartShippingMethodsSection
