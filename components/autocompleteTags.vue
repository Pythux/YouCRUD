<template lang="html">
  <v-row>
    <v-col cols="2">
      <v-btn color="green" @click="newTag = !newTag">
        <plus-circle-icon />
      </v-btn>
    </v-col>
    <v-col cols="10">
      <v-autocomplete
        v-if="!newTag"
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
        @keydown.enter.native.prevent="currentTag = ''"
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
    methods: {
        addNewTag() {
            console.log('yo')
            this.addedTags.push(this.tagToAdd)
            this.value.push(this.tagToAdd)
            this.tagToAdd = ''
            this.newTag = false
        },
        // addNewTag() {
        //     if (!this.existingTags.includes(this.currentTag)) {
        //         this.addedTags.push(this.currentTag)
        //         this.value.push(this.currentTag)
        //         this.currentTag = ''
        //     } else {
        //         this.currentTag = ''
        //     }
        // },
        updateCurrentTag(tag) {
            this.currentTag = tag
        },
    },
}
</script>
