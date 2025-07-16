import { useForm } from "react-hook-form"
import { Form } from "../../../../components/common/form"
import { RouteDrawer, useRouteModal } from "../../../../components/modals"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Heading, Select, Textarea, toast } from "@medusajs/ui"
import { useParams } from "react-router-dom"
import { useCreateVendorRequest } from "../../../../hooks/api"

const reasonList = [
  "The review comment is not true",
  "The review comment is insulting",
  "The review comment is offensive or vulgar",
  "Other",
]

const ReviewReplySchema = z.object({
  reason: z.string().min(1, { message: "Please select a reason" }),
  comment: z.string().optional(),
})

export const ReviewReportForm = () => {
  const { handleSuccess } = useRouteModal()
  const { id } = useParams()

  const form = useForm<z.infer<typeof ReviewReplySchema>>({
    defaultValues: {
      reason: "",
      comment: "",
    },
    resolver: zodResolver(ReviewReplySchema),
  })

  const { mutateAsync, isPending } = useCreateVendorRequest()

  const handleSubmit = form.handleSubmit(async (data) => {
    await mutateAsync(
      {
        request: {
          type: "review_remove",
          data: {
            review_id: id,
            reason: data.reason,
            comment: data.comment,
          },
        },
      },
      {
        onSuccess: () => {
          toast.success("Review is reported", {
            description: "Please wait for a response from the moderator.",
          })
          handleSuccess(`/reviews/${id}`)
        },
        onError: (error) => {
          toast.error(error.message)
        },
      }
    )
  })

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <RouteDrawer.Title asChild>
          <Heading>Report Review</Heading>
        </RouteDrawer.Title>
        <RouteDrawer.Description>
          Report review from customer.
        </RouteDrawer.Description>
      </RouteDrawer.Header>
      <RouteDrawer.Form form={form}>
        <RouteDrawer.Body>
          <Form.Field
            control={form.control}
            name="reason"
            render={({ field: { ref, onChange, ...field } }) => {
              return (
                <Form.Item className="mt-4">
                  <Form.Label>Reason</Form.Label>
                  <Form.Control>
                    <Select {...field} onValueChange={onChange}>
                      <Select.Trigger ref={ref}>
                        <Select.Value />
                      </Select.Trigger>
                      <Select.Content>
                        {reasonList.map((reason, index) => (
                          <Select.Item
                            key={`select-option-${index}`}
                            value={reason}
                          >
                            {reason}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select>
                  </Form.Control>
                  <Form.ErrorMessage />
                </Form.Item>
              )
            }}
          />
          <Form.Field
            control={form.control}
            name="comment"
            render={({ field }) => {
              return (
                <Form.Item className="mt-8">
                  <Form.Label>Comment</Form.Label>
                  <Form.Control>
                    <Textarea autoComplete="off" {...field} />
                  </Form.Control>
                  <Form.ErrorMessage />
                </Form.Item>
              )
            }}
          />
        </RouteDrawer.Body>
      </RouteDrawer.Form>
      <RouteDrawer.Footer>
        <Button onClick={handleSubmit} className="px-6" isLoading={isPending}>
          Report review
        </Button>
      </RouteDrawer.Footer>
    </RouteDrawer>
  )
}
