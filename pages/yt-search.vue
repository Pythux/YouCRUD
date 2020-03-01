<template lang="html">
  <div>
    <v-form @submit.prevent="ytAPI">
      <v-text-field v-model="search" label="Search" />
    </v-form>
    <v-card :loading="loading">
      <v-row>
        <v-col cols="12" sm="4">
          <v-row align="stretch">
            <v-col cols="2" style="padding:0;padding-left:15px;">
              <v-btn
                :color="btnColor"
                elevation="0"
                style="display:block;height:100%;width:100%;min-width:40px;border-radius:5px 0 0 5px;"
                @click="clickBtn"
              >
                <plus-circle-icon />
              </v-btn>
            </v-col>
            <v-col cols="10" style="padding:0;padding-right:15px;">
              <img
                :src="img"
                alt="music image"
                style="display: block;width:100%;height:auto;max-width:320px;max-height: 180px;"
              >
            </v-col>
          </v-row>
        </v-col>
        <v-col>
          <div>
            <v-text-field v-model="name" label="Name" />
            <AutocompleteTags v-model="tags" @submit="submit" />
          </div>
          <v-spacer />
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import AutocompleteTags from '@/components/AutocompleteTags'
import { submitMusic } from '@/sharedJS/submitMusic'
import { getYtId } from '@/sharedJS/ytURL'

export default {
    components: {
        AutocompleteTags,
    },
    data() {
        return {
            search: undefined,
            name: 'Alt-J',
            tags: [],
            img: 'https://i.ytimg.com/vi/VenNcnqeAgQ/mqdefault.jpg',
            width: 320,
            height: 180,
            toSave: false,
            loading: false,
        }
    },
    computed: {
        btnColor() {
            return this.toSave ? 'success' : 'secondary'
        },
    },
    watch: {
    },
    methods: {
        clickBtn() {
            this.toSave = !this.toSave
        },
        async ytAPI() {
            const url = 'https://www.googleapis.com/youtube/v3/search' +
                `?part=snippet&maxResults=25&q=${this.search}&key=${process.env.API_KEY}`

            try {
                const ytInfo = await this.$http.get(url)
                console.log(ytInfo)
            } catch (e) {
                console.log(await this.$http.get(url))
                console.log('the yt video does not exist')
            }
        },
        submit() {
            this.loading = true
            // await submitMusic.call(this, this.name, this.url, this.ytId, this.tags)
            this.loading = false
            this.name = ''
            this.url = ''
            this.tags = []
            this.apiTags = []
        },
    },
    notifications: {
        notification: { },
    },
}
</script>
