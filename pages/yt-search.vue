<template lang="html">
  <div>
    <v-row>
      <v-col cols="5" sm="2">
        <v-text-field v-model="nbResult" type="number" min="4" label="Number of results" />
      </v-col>
      <v-col>
        <v-text-field v-model="search" label="Search" append-icon="mdi-magnify" @keydown.enter="ytAPI" />
      </v-col>
    </v-row>
    <v-col align="center">
      <v-btn v-if="!doGloableSubmit && searchData.length > 0" color="success" style="text-transform: none" @click="doGloableSubmit = true">
        add all selected
      </v-btn>
    </v-col>

    <template v-for="item in searchData">
      <YtDisplay :key="item.id.videoId" :item="item" :submit="doGloableSubmit" @done="reduceList" />
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
            doGloableSubmit: false,
            nbResult: 10,
        }
    },
    methods: {
        async ytAPI() {
            this.doGloableSubmit = false
            this.nbResult = Math.max(this.nbResult, 4)
            const url = 'https://www.googleapis.com/youtube/v3/search' +
                `?part=snippet&maxResults=${this.nbResult}&q=${this.search}&key=${process.env.API_KEY}`

            const ytInfo = (await this.$http.get(url)).data

            console.log(ytInfo)
            this.searchData = ytInfo.items.filter(item => item.id.kind === 'youtube#video')
        },
        reduceList(videoId) {
            console.log('reduce: ', videoId)
            this.searchData = this.searchData.filter(item => item.id.videoId !== videoId)
        },
    },
}
</script>
