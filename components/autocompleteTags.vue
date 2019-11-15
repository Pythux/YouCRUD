<template lang="html">
  <v-autocomplete
    :items="$store.getters['userDB/tags']"
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
        }
    },
    methods: {
        addNewTag() {
            this.existingTags.push(this.currentTag)
            this.tags.push(this.currentTag)
            this.currentTag = ''
        },
        updateCurrentTag(tag) {
            this.currentTag = tag
        },
    },
}
</script>
