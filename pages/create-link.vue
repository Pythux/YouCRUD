<template lang="html">
  <v-row justify="center" class="yolo">
    <v-col v-if="ytId" col="12">
      <iframe
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
            <v-spacer />
            <nuxt-link to="/create-multiple-link">
              <v-btn>add multiple links ?</v-btn>
            </nuxt-link>
          </v-card-title>
          <v-card-text>
            <v-text-field v-model="name" label="Name" />
            <v-text-field v-model="url" label="URL:" />
            <AutocompleteTags v-model="tags" />
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
import AutocompleteTags from '@/components/autocompleteTags'
import { submitMusic } from '@/sharedJS/submitMusic'

export default {
    components: {
        AutocompleteTags,
    },
    data() {
        return {
            name: '',
            url: '',
            tags: [],
            apiTags: [],
        }
    },
    computed: {
        ytLink() {
            return 'http://www.youtube.com/embed/' + this.ytId // + '?autoplay=1'
        },
        ytId() {
            if (this.url.startsWith('https://www.youtube.com/watch')) {
                const url = new URL(this.url)
                return url.searchParams.get('v')
            }
            return null
        },
    },
    watch: {
        ytId() {
            if (this.ytId) {
                this.ytAPI()
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
                this.tags = tags.filter(tag => this.$store.getters['userDB/tags'].includes(tag))
            } catch (e) {
                console.log(await this.$http.get(url))
                console.log('the yt video does not exist')
            }
        },
        submit() {
            submitMusic.call(this, this.name, this.url, this.ytId, this.tags)
            this.name = ''
            this.url = ''
            this.tags = []
        },
    },
}
</script>
