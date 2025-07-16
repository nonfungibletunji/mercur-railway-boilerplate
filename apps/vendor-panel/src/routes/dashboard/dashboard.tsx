import { useEffect, useState } from "react"
import { useOnboarding } from "../../hooks/api"
import { DashboardCharts } from "./components/dashboard-charts"
import { DashboardOnboarding } from "./components/dashboard-onboarding"
import { ChartSkeleton } from "./components/chart-skeleton"

export const Dashboard = () => {
  const [isClient, setIsClient] = useState(false)
  useEffect(() => setIsClient(true), [])

  const { onboarding, isError, error, isPending } = useOnboarding()

  if (!isClient) return null

  if (isPending) {
    return (
      <div>
        <ChartSkeleton />
      </div>
    )
  }

  if (isError) {
    throw error
  }

  if (
    !onboarding?.products ||
    !onboarding?.locations_shipping ||
    !onboarding?.store_information
    // !onboarding?.stripe_connect
  )
    return (
      <DashboardOnboarding
        products={onboarding?.products}
        locations_shipping={onboarding?.locations_shipping}
        store_information={onboarding?.store_information}
        stripe_connect={onboarding?.stripe_connect}
      />
    )

  return <DashboardCharts />
}
