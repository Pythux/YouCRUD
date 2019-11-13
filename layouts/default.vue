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
      <div>
        {{ $store.getters['auth/userName'] }}
      </div>
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
export default {
    data() {
        return {
            right: true,
            rightDrawer: false,
            title: 'YouCRUD',
        }
    },
}
</script>

<style lang="css" scoped>
.v-application a {
    text-decoration: none;
    color: rgb(226, 225, 220);
}
</style>
