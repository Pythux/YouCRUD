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
              :value="tagCurrentValue"
              :items="existingTags"
              :filter="filter"
              outlined
              dense
              chips
              small-chips
              label="Tags"
              multiple
              @keyup.enter="addNewTag"
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
            url: null,
            tags: [],
            existingTags: [],
            tagCurrentValue: null,
            ytId: null,
        }
    },
    computed: {
        ytLink() {
            return 'http://www.youtube.com/embed/' + this.ytId + '?autoplay=1'
        },
    },
    methods: {
        filter(item, queryText, itemText) {
            this.tagCurrentValue = queryText
            return itemText.toLocaleLowerCase().includes(queryText.toLocaleLowerCase())
        },
        addNewTag() {
            console.log(this.tagCurrentValue)
            if (!this.existingTags.includes(this.tagCurrentValue)) {
                this.existingTags.push(this.tagCurrentValue)
            }
        },
        submit() {
            console.log('hey')
            console.log(this.url)
            if (this.url.startsWith('https://www.youtube.com/watch')) {
                const url = new URL(this.url)
                this.ytId = url.searchParams.get('v')
                console.log(url.searchParams)
            }
        },
    },
}
</script>

<style lang="css" scoped>
</style>
