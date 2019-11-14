<template>
  <v-row>
    <iframe
      v-if="ytId"
      id="ytplayer"
      type="text/html"
      width="640"
      height="360"
      :src="ytLink"
      frameborder="0"
    />
    <v-data-table
      :headers="headers"
      disable-sort
      :items="items"
      :items-per-page="15"
      class="elevation-1"
      @click:row="click"
    />
  </v-row>
</template>

<script>
export default {
    data() {
        return {
            headers: [
                {
                    text: 'Name',
                    align: 'left',
                    value: 'name',
                },
                { text: 'Tags', value: 'tags' },
            ],
            ytId: null,
        }
    },
    computed: {
        items() {
            return this.$store.getters['userDB/music']
        },
        ytLink() {
            return 'http://www.youtube.com/embed/' + this.ytId // + '?autoplay=1'
        },
    },
    methods: {
        click(obj) {
            if (obj.ytId) {
                this.ytId = obj.ytId
            }
        },
    },
}
</script>
