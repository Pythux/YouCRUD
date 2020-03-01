<template lang="html">
  <div>
    <v-form @submit.prevent="ytAPI">
      <v-text-field v-model="search" label="Search" />
    </v-form>
    <template v-for="item in searchData">
      <YtDisplay :key="item.id.videoId" :item="item" />
    </template>
  </div>
</template>

<script>
import YtDisplay from '@/components/YtDisplay'

export default {
    components: {
        YtDisplay,
    },
    data() {
        return {
            search: undefined,
            searchData: [],
        }
    },
    methods: {
        async ytAPI() {
            const url = 'https://www.googleapis.com/youtube/v3/search' +
                `?part=snippet&maxResults=25&q=${this.search}&key=${process.env.API_KEY}`

            const ytInfo = (await this.$http.get(url)).data
            console.log(ytInfo)
            this.searchData = ytInfo.items.filter(item => item.id.kind === 'youtube#video')
            console.log(this.searchData)
        },
        submit() {
            console.log('sub global')
        },
    },
}
</script>
