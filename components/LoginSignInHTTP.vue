<template>
  <login-sign-in
    :action="action"
    login-label="Email"
    :other-action-path="otherActionPath"
    @credential="withCredential"
  />
</template>

<script>
import VueNotifications from 'vue-notifications'
import LoginSignIn from '@/components/LoginSignIn'

export default {
    components: {
        LoginSignIn,
    },
    props: {
        action: {
            type: String,
            required: true,
            default: 'login',
            validator(value) { // this function is not run on --production mode
                const valideVal = ['login', 'signIn']
                if (!valideVal.includes(value)) {
                    // eslint-disable-next-line
                    console.error(`"${value}" is not a valide action`)
                    // eslint-disable-next-line
                    console.warn(`valide action are in ${valideVal}`)
                    return false
                }
                return true
            },
        },
        actionPath: { // login path and signIn path
            type: Array,
            required: false,
            default: () => ['/login', '/signIn'],
            validator(value) {
                return value.length === 2
            },
        },
    },
    computed: {
        otherActionPath() { return this.actionPath[this.action === 'login' ? 1 : 0] },
    },
    notifications: {
        showErrorMsg: {
            type: VueNotifications.types.error,
            title: `Error on Login:`,
        },
    },
    methods: {
        withCredential(credential) {
            let request = 'signInWithPassword' // login
            if (this.action === 'signIn') {
                request = 'signUp' // signIn
            }
            this.$http.post(`${process.env.identitytoolkit}/accounts:${request}?key=${process.env.API_KEY}`,
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
                this.showErrorMsg({ message: error.response.data.error.message })
            })
        },
    },
}
</script>
