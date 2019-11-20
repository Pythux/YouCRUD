<template lang="html">
  <v-autocomplete
    :items="existingTags"
    :search-input="currentTag"
    :no-data-text="`press enter to add the tag: ${currentTag}`"
    outlined
    dense
    chips
    small-chips
    label="Tags"
    multiple
    autocomplete="off"
    :value="value"
    @input="$emit('input', $event)"
    @update:search-input="updateCurrentTag"
    @keydown.enter.native.prevent="addNewTag"
  />
</template>

<script>
export default {
    props: {
        value: { type: Array, default: () => [] },
    },
    data() {
        return {
            currentTag: '',
            addedTags: [],
        }
    },
    computed: {
        existingTags() {
            return this.addedTags.concat(this.$store.getters['userDB/tags'])
        },
    },
    methods: {
        addNewTag() {
            if (!this.existingTags.includes(this.currentTag)) {
                this.addedTags.push(this.currentTag)
                this.value.push(this.currentTag)
                this.currentTag = ''
            } else {
                this.currentTag = ''
            }
        },
        updateCurrentTag(tag) {
            this.currentTag = tag
        },
    },
}
</script>
