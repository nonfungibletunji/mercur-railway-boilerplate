import { useParams } from "react-router-dom"
import { RouteModalProvider } from "../../../components/modals/route-modal-provider"
import { ReviewReportForm } from "./components/review-report-form"

export const ReviewReport = () => {
  const { id } = useParams()

  return (
    <RouteModalProvider prev={`/reviews/${id}`}>
      <ReviewReportForm />
    </RouteModalProvider>
  )
}
