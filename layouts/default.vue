<template>
  <v-app dark>
    <v-app-bar fixed app>
      <nuxt-link to="/create-link">
        <v-btn icon>
          <v-icon>mdi-music-note-plus</v-icon>
        </v-btn>
      </nuxt-link>
      <nuxt-link to="/">
        <v-btn icon>
          <v-icon>mdi-animation</v-icon>
        </v-btn>
      </nuxt-link>
      <v-spacer />
      <nuxt-link to="/" style="">
        <v-toolbar-title v-text="title" />
      </nuxt-link>
      <v-spacer />
      <a id="downloadAnchorElem" style="display:none" />
      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn color="primary" dark v-on="on">
            {{ $store.getters['auth/userName'] }}
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="downloadJSON">
            <v-list-item-title>Download User Data</v-list-item-title>
          </v-list-item>
          <v-list-item @click="$router.push('/tags')">
            <v-list-item-title>Tags managements</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <v-footer app>
      <span>&copy; 2019</span>
    </v-footer>
  </v-app>
</template>

<script>
import { submitMusic } from '@/sharedJS/submitMusic'

export default {
    data() {
        return {
            right: true,
            rightDrawer: false,
            title: 'YouCRUD',
        }
    },
    methods: {
        async downloadJSON() {
            const response = await this.$http.get('/')
            const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(response.data))
            const dlAnchorElem = document.getElementById('downloadAnchorElem')
            dlAnchorElem.setAttribute('href', dataStr)
            dlAnchorElem.setAttribute('download', 'userDB.json')
            dlAnchorElem.click()
        },
        // addBandsTag() {  // to use for bands sorting
        //     Object.values(this.$store.getters['userDB/music']).forEach(music => {
        //         const match = music.name.match(/(.*) - (.*)/)
        //         if (match && !music.tags.includes(match[1])) {
        //             const bandTag = match[1]
        //             console.log(match, bandTag)
        //             const copieMusic = { ...music }
        //             copieMusic.tags = [...music.tags]
        //             copieMusic.tags.push(bandTag)
        //             submitMusic.call(this, copieMusic)
        //         }
        //     })
        //     console.log('end of updates')
        //     this.$store.dispatch('userDB/saveUserDB')
        // },
    },
}
</script>

<style lang="css">
.v-application a {
    text-decoration: inherit;
    color: inherit !important;
}
</style>
