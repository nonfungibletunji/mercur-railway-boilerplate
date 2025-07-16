import { Container, Heading, Text } from "@medusajs/ui"
import { SingleColumnPage } from "../../../components/layout/pages"
import { useDashboardExtension } from "../../../extensions"
import { RequestListTable } from "./components/request-list-table"

export const RequestOrdersList = () => {
  const { getWidgets } = useDashboardExtension()

  return (
    <SingleColumnPage
      widgets={{
        after: getWidgets("customer.list.after"),
        before: getWidgets("customer.list.before"),
      }}
    >
      <Container className="divided-y p-0">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <Heading>Orders Cancellation Requests</Heading>
            <Text className="text-ui-fg-subtle" size="small">
              Your requests to cancel an order
            </Text>
          </div>
        </div>
        <div className="px-6 py-4">
          <RequestListTable request_type="orders" />
        </div>
      </Container>
    </SingleColumnPage>
  )
}
