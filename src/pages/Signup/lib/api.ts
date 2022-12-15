import { MutationOptions, useMutation } from "@tanstack/react-query"
import api from "~/utils/axios"
import { TSignupForm } from "../model/signup.schema"
import { ISignupResponseError } from "../model/types"

export const makeSignupRequest = async (data: TSignupForm) => {
  const response = await api.post("/user", null, { params: { ...data, admin: true } }) // Why admin is always true TODO: Ask backend
  return response
}

export const useFetchSignup = (options: MutationOptions<any, ISignupResponseError, TSignupForm>) => {
  const name = "signup"

  const fetcher = useMutation([name], (data: TSignupForm) => makeSignupRequest(data), options)

  return fetcher
}
