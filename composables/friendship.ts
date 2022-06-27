export const rejectFriendship = async (friend_id: string, call_refresh_data: () => void) => {
  const token = useCookie('token').value

  await $fetch('http://localhost:8080/api/user/reject-friendship', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token
    },
    body: { friend_id },
    async onResponse({ response }) {
      console.log(response._data)
      call_refresh_data()
    }
  })
}

export const acceptFriendship = async (friend_id: string, call_refresh_data: () => void) => {
  const token = useCookie('token').value

  await $fetch('http://localhost:8080/api/user/accept-friendship', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token
    },
    body: { friend_id },
    async onResponse({ response }) {
      console.log(response._data)
      call_refresh_data()
    }
  })
}