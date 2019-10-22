<template lang="html">
  <div>
    yo, lo: {{ $route.params }}
  </div>
</template>

<script>
export default {
    validate(data) {
        // validate of index.vue of _yo not executed
        console.log(data.params) // params yo and lo
        if (/^\d+$/.test(data.params.lo)) {
            data.params.lo = parseInt(data.params.lo)
            return true
        }
        return false
    },
}
</script>
