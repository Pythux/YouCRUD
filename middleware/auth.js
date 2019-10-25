export default async function(context) {
    if (process.client) {
        const to = context.route
        const store = context.store
        // const redirect = context.redirect
        const router = context.app.router

        let isAuth = store.state.auth.idToken
        if ((!isAuth) && localStorage.getItem('auth/refreshToken')) {
            await store.dispatch('auth/check_stored_login')
        }
        isAuth = store.state.auth.idToken
        const goAuth = to.name === 'login'
        const redirectTo = to.query.redirect || { name: 'index' }
        if (isAuth && goAuth) {
            router.push(redirectTo)
            return
        }
        if (!isAuth && !goAuth) {
            router.push({ path: '/login', query: { redirect: to.fullPath } })
        }
    }
}

// http://localhost:8080/login?redirect=%2Fyo-lo%2F4%3Faction%3Dreaction
