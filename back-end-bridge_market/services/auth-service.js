class AuthService {
  constructor() {
    this.isAuthenticated = false
    this.user = null
    this.token = null
  }

  login(username, password) {
    // Simulate an API call to authenticate the user
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (username === "user" && password === "password") {
          this.isAuthenticated = true
          this.user = { username: "user", email: "user@example.com" }
          this.token = "fake_jwt_token"
          localStorage.setItem("token", this.token)
          resolve(this.user)
        } else {
          reject(new Error("Invalid credentials"))
        }
      }, 500)
    })
  }

  logout() {
    this.isAuthenticated = false
    this.user = null
    this.token = null
    localStorage.removeItem("token")
    // Remove the window.location.href = "/login"
  }

  getToken() {
    return localStorage.getItem("token")
  }

  isAuthenticatedUser() {
    return !!localStorage.getItem("token")
  }
}

export default new AuthService()