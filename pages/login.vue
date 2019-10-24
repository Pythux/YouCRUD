<template>
  <login-sign-in
    action="login"
    login-label="Email"
    other-action-path="/signIn"
    :login-rules="emailRules"
    @credential="login"
  />
</template>

<script>
import LoginSignIn from '@/components/LoginSignIn'
export default {
    components: {
        LoginSignIn,
    },
    data() {
        return {
            emailRules: [value => !!value || 'Required.'],
        }
    },
    methods: {
        login(credential) {
            this.$http.post(`${process.env.identitytoolkit}/accounts:signInWithPassword?key=${process.env.API_KEY}`,
                {
                    email: credential.login,
                    password: credential.password,
                    returnSecureToken: true,
                }
            ).then(response => {
                console.log(response)
                const d = response.data
                this.$store.login.dispatch('login',
                    { idToken: d.idToken, expiresIn: d.expiresIn, refreshToken: d.refreshToken })
            }).catch(error => {
                const email = credential.login
                const errorMsg = error.response.data.error.message
                this.emailRules.push(v => v !== email || errorMsg)
            })
        },
    },
}
</script>
