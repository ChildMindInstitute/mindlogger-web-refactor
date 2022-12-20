import httpService, { Http } from "~/utils/httpService"
import { encryptBASE64 } from "~/utils/encryption/encryptBASE64"
import { TSignupForm } from "~/pages/Signup/model/signup.schema"

export class AuthorizationService {
  constructor(private httpService: Http) {}

  public login(email: string, password: string) {
    const encryptedUserInfo = encryptBASE64(`${email}:${password}`)

    const headers = {
      "Girder-Authorization": `Basic ${encryptedUserInfo}`,
    }

    return this.httpService.GET("/user/authentication", { headers })
  }

  public logout(token: string) {
    const headers = {
      "Girder-Token": token,
    }

    return this.httpService.DELETE("/user/authentication", { headers })
  }

  public signup(user: TSignupForm) {
    const { confirmPassword, ...rest } = user

    const params = {
      ...rest,
      admin: true, // Ask backend why we should set it to true
    }

    return this.httpService.POST("/user", null, { params })
  }
}

const authorizationService = new AuthorizationService(httpService)
export default authorizationService
