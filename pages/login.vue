<template>
  <LoginSignInHTTP :action="$route.query.action" :action-path="['/login?action=login', '/login?action=signIn']" />
</template>

<script>
import LoginSignInHTTP from '@/components/LoginSignInHTTP'

export default {
    components: {
        LoginSignInHTTP,
    },
    // watchQuery: true,
}
</script>
