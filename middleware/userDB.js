
export default async function({ store }) {
    if (process.client) {
        if (store.state.auth.idToken) {
            if (store.state.userDB.userDB === null) {
                await store.dispatch('userDB/getUserDB')
            }
        } else if (store.state.userDB.userDB !== null) {
            await store.commit('userDB/free_userDB')
        }
    }
}
