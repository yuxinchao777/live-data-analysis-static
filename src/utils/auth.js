import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken() {
  var cookie = Cookies.get(TokenKey)
  return cookie
}

export function setToken(token) {
  // var inFifteenMinutes = new Date(new Date().getTime() + 15 * 60 * 1000)
  return Cookies.set(TokenKey, token, {
    expires: 7
  })
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
