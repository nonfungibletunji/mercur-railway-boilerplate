import { Container, Heading, Text } from "@medusajs/ui"
import { Session, Inbox } from "@talkjs/react"
import { useCallback } from "react"
import Talk from "talkjs"
import { useMe } from "../../hooks/api"

export const Messages = () => {
  const { seller, isPending, error } = useMe()

  if (error) {
    return <div>Error: {error.message}</div>
  }

  const syncUser = useCallback(() => {
    return new Talk.User({
      id: seller?.id || "",
      name: seller?.name || "",
      email: seller?.email || null,
      photoUrl: seller?.photo || "/talkjs-placeholder.jpg",
    })
  }, [seller])

  if (isPending || !seller || !syncUser) {
    return <div>Loading...</div>
  }

  return (
    <Container className="divide-y p-0 min-h-[700px]">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <Heading>Messages</Heading>
        </div>
      </div>

      <div className="px-6 py-4 h-[655px]">
        {__TALK_JS_APP_ID__ ? (
          <Session appId={__TALK_JS_APP_ID__} syncUser={syncUser}>
            <Inbox className="h-full" />
          </Session>
        ) : (
          <div className="flex flex-col items-center w-full h-full justify-center">
            <Heading>No TalkJS App ID</Heading>
            <Text className="text-ui-fg-subtle mt-4" size="small">
              Connect TalkJS to manage your messages
            </Text>
          </div>
        )}
      </div>
    </Container>
  )
}
