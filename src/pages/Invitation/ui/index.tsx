import { useSearchParams } from "react-router-dom"

const InvitationPage = () => {
  const [searchParams] = useSearchParams()

  return <div>{searchParams.get("key")}</div>
}

export default InvitationPage
