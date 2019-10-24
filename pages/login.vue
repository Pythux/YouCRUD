<template>
  <LoginSignInHTTP action="login" :action-path="['/login', '/signIn']" />
</template>

<script>
import LoginSignInHTTP from '@/components/LoginSignInHTTP'

export default {
    components: {
        LoginSignInHTTP,
    },
}
</script>
