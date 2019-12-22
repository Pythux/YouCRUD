<template lang="html">
  <v-row>
    <v-col cols="2">
      <v-btn color="#26C6DA" @click="newTag = !newTag">
        <plus-circle-icon />
      </v-btn>
    </v-col>
    <v-col cols="10">
      <v-autocomplete
        v-if="!newTag"
        :value="selectedTags"
        :items="existingTags"
        :search-input="currentTag"
        no-data-text="click on the '+' button add a tag"
        outlined
        dense
        chips
        small-chips
        label="Tags"
        multiple
        autocomplete="off"
        @input="updateTags($event)"
        @update:search-input="updateCurrentTag"
        @keydown.enter.native.prevent="enterAutocomplete()"
      />
      <v-text-field v-else v-model="tagToAdd" label="new Tag:" @keydown.enter.prevent="addNewTag()" />
    </v-col>
  </v-row>
</template>

<script>
export default {
    props: {
        value: { type: Array, default: () => [] },
    },
    data() {
        return {
            selectedTags: [],
            currentTag: '',
            addedTags: [],
            newTag: false,
            tagToAdd: '',
        }
    },
    computed: {
        existingTags() {
            return this.addedTags.concat(this.$store.getters['userDB/tags'])
        },
    },
    watch: {
        value(value) {
            this.selectedTags = value
        },
    },
    methods: {
        updateTags(tags) {
            this.selectedTags = tags
            this.$emit('input', this.selectedTags)
        },
        addNewTag() {
            this.addedTags.push(this.tagToAdd)
            this.selectedTags.push(this.tagToAdd)
            this.updateTags(this.selectedTags)
            this.tagToAdd = ''
            this.newTag = false
        },
        updateCurrentTag(tag) {
            this.currentTag = tag
        },
        enterAutocomplete() {
            if (this.currentTag === '') {
                this.$emit('submit')
            }
            this.currentTag = ''
        },
    },
}
</script>
