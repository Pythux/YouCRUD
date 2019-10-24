<template>
  <LoginSignInHTTP action="signIn" :action-path="['/login', '/signIn']" />
</template>

<script>
import LoginSignInHTTP from '@/components/LoginSignInHTTP'

export default {
    components: {
        LoginSignInHTTP,
    },
}
</script>
