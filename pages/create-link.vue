<template lang="html">
  <v-row justify="center" class="yolo">
    <v-row v-if="ytId" justify="center">
      <iframe
        type="text/html"
        width="640"
        height="360"
        :src="ytLink"
        frameborder="0"
      />
    </v-row>

    <v-col xs="12" sm="8" md="6">
      <v-card :loading="loading">
        <form @submit.prevent="submit">
          <v-card-title>
            Save a link:
            <v-spacer />
            <nuxt-link to="/create-multiple-link">
              <v-btn>add multiple links ?</v-btn>
            </nuxt-link>
          </v-card-title>
          <v-card-text>
            <v-text-field v-model="name" label="Name" />
            <v-text-field v-model="url" label="URL:" autofocus :error-messages="errorAlreadyExist" />
            <AutocompleteTags v-model="tags" @submit="submit" />
            <v-row>
              <template v-for="tag in apiTags">
                <v-chip
                  :key="tag"
                  :outlined="true"
                  style="margin: 5px"
                >
                  {{ tag }}
                </v-chip>
              </template>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-row justify="center">
              <v-btn type="submit" color="success">
                <save-icon />
              </v-btn>
            </v-row>
          </v-card-actions>
        </form>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import AutocompleteTags from '@/components/AutocompleteTags'
import { submitMusic } from '@/sharedJS/submitMusic'
import { getYtId } from '@/sharedJS/ytURL'

export default {
    components: {
        AutocompleteTags,
        DataTable,
    },
    data() {
        return {
            name: '',
            url: '',
            tags: [],
            apiTags: [],
            loading: false,
            errorAlreadyExist: '',
            selectedRow: undefined,
        }
    },
    computed: {
        ytLink() {
            return 'https://www.youtube.com/embed/' + this.ytId // + '?autoplay=1'
        },
        ytId() {
            if (this.url) {
                return getYtId(this.url)
            }
            return undefined
        },
    },
    watch: {
        ytId() {
            if (this.ytId) {
                this.ytAPI()
                this.doesAlreadyExist()
            }
        },
    },
    methods: {
        async ytAPI() {
            const url = 'https://www.googleapis.com/youtube/v3/videos' +
                `?part=snippet&id=${this.ytId}&key=${process.env.API_KEY}`

            try {
                const ytInfo = (await this.$http.get(url)).data.items[0].snippet
                const title = ytInfo.title
                const tags = ytInfo.tags
                this.name = title
                this.apiTags = tags
                // this.tags = tags.filter(tag => this.$store.getters['userDB/tags'].includes(tag))
            } catch (e) {
                console.log(await this.$http.get(url))
                console.log('the yt video does not exist')
            }
        },
        async submit() {
            this.loading = true
            await submitMusic.call(this, this.name, this.url, this.ytId, this.tags)
            this.loading = false
            this.name = ''
            this.url = ''
            this.tags = []
            this.apiTags = []
        },
        doesAlreadyExist() {
            this.errorAlreadyExist = ''
            for (const musicId in this.$store.getters['userDB/music']) {
                if (this.$store.getters['userDB/music'][musicId].ytId === this.ytId) {
                    this.errorAlreadyExist = 'this music already exist'
                    break
                }
            }
        },
    },
    notifications: {
        notification: { },
    },
}
</script>
