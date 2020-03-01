<template lang="html">
  <v-row>
    <v-col sm="9" cols="12">
      <v-autocomplete
        v-if="!newTag"
        :value="selectedTags"
        :items="existingTags"
        :search-input="currentTag"
        no-data-text="click on the '+' button add a tag"
        :autofocus="focusAutocomplete"
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
      <v-text-field v-else v-model="tagToAdd" label="new Tag:" autofocus @keydown.enter.prevent="addNewTag()" />
    </v-col>
    <v-col cols="5" sm="3">
      <v-btn color="#9ffff6" @click="newTag = !newTag">
        New Tag
      </v-btn>
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
            focusAutocomplete: false,
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
    mounted() {
        this.selectedTags = this.value
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
            this.focusAutocomplete = true
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
