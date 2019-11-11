<template lang="html">
  <v-row justify="center">
    <v-col v-if="ytId" col="12">
      <iframe
        id="ytplayer"
        type="text/html"
        width="640"
        height="360"
        :src="ytLink"
        frameborder="0"
      />
    </v-col>
    <v-col xs="12" sm="8" md="6">
      <v-card>
        <form @submit.prevent="submit">
          <v-card-title>
            Save a link:
          </v-card-title>
          <v-card-text>
            <v-text-field v-model="name" label="Name" />
            <v-text-field v-model="url" label="URL:" />
            <v-autocomplete
              v-model="tags"
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
              @update:search-input="updateCurrentTag"
              @keydown.enter.native.prevent="addNewTag"
            />
          </v-card-text>
          <v-card-actions>
            <v-btn type="submit">
              <save-icon />
            </v-btn>
          </v-card-actions>
        </form>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
    data() {
        return {
            name: null,
            url: '',
            tags: [],
            existingTags: ['a', 'b'],
            currentTag: '',
        }
    },
    computed: {
        ytLink() {
            return 'http://www.youtube.com/embed/' + this.ytId + '?autoplay=1'
        },
        ytId() {
            console.log('computed!')
            if (this.url.startsWith('https://www.youtube.com/watch')) {
                const url = new URL(this.url)
                return url.searchParams.get('v')
            }
            return null
        },
    },
    methods: {
        updateCurrentTag(tag) {
            this.currentTag = tag
        },
        addNewTag() {
            console.log(this.currentTag)
            this.existingTags.push(this.currentTag)
            this.tags.push(this.currentTag)
            this.currentTag = ''
        },
        submit() {
            console.log('submit:')
            console.log(this.ytId)
            // https://you-crud.firebaseio.com/users/<user_id>.json?auth=<idToken>
            // this.$http()
        },
    },
}
</script>
