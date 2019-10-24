<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>{{ actionTxt }}:</v-toolbar-title>
            <v-spacer />
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <nuxt-link :to="otherActionPath">
                  <v-btn large fab color="purple" v-on="on">
                    <UserPlusIcon v-if="isActionLogin" size="1.5x" />
                    <TerminalIcon v-else />
                  </v-btn>
                </nuxt-link>
              </template>
              <span>{{ otherActionTxt }}</span>
            </v-tooltip>
          </v-toolbar>
          <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="submit">
            <v-card-text>
              <v-text-field v-model="login" :label="loginLabel" name="login" :rules="loginRules" type="text">
                <template v-slot:prepend>
                  <user-icon />
                </template>
              </v-text-field>
              <v-text-field v-model="password" label="Password" name="password" type="password" :rules="passwordRules">
                <template v-slot:prepend>
                  <key-icon />
                </template>
              </v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn type="submit" :disabled="!valid" color="success" style="text-transform: none">
                {{ actionTxt }}
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
    props: {
        action: {
            type: String,
            required: true,
            default: 'signIn',
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
        otherActionPath: {
            type: String,
            required: true,
            default: '/login',
        },
        loginLabel: {
            type: String,
            required: false,
            default: 'Login',
        },
    },
    data() {
        return {
            valid: true,
            txt: { 'signIn': 'Sign In', 'login': 'Login' },
            login: '',
            password: '',
            validTouch: true,
            loginRules: [value => this.validTouch || !!value || 'Required.'],
            passwordRules: [value => this.validTouch || !!value || 'Required.'],
        }
    },
    computed: {
        isActionLogin() { return this.action === 'login' },
        otherAction() { return this.isActionLogin ? 'signIn' : 'login' },
        otherActionTxt() {
            return this.txt[this.otherAction]
        },
        actionTxt() {
            return this.txt[this.action]
        },
    },
    watch: {
        action() {
            // on switch of action:
            this.loginRules = this.loginRules.slice(0, 2)
            this.resetValidation()
        },
        loginRules() {
            this.$refs.form.validate()
        },
        passwordRules() {
            this.$refs.form.validate()
        },
    },
    methods: {
        submit() {
            this.validTouch = false
            if (this.$refs.form.validate()) {
                const credential = { login: this.login, password: this.password }
                this.$emit('credential', credential)
            }
        },
        resetValidation() {
            this.$refs.form.resetValidation()
        },
    },
}
</script>
