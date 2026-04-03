export const getUserId = () => {
  let uid = localStorage.getItem('linkvault_uid')
  if (!uid) {
    uid = crypto.randomUUID()
    localStorage.setItem('linkvault_uid', uid)
  }
  return uid
}