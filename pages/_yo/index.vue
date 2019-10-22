<template lang="html">
  <div>
    yo: {{ $route.params.yo }}
  </div>
</template>

<script>
export default {
    validate(data) {
        return /^\d+$/.test(data.params.yo)
    },
    mounted() {
        this.$http.get('/yolo')
    },
}
</script>

<style lang="css" scoped>
</style>
