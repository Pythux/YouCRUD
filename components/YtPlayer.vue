<template lang="html">
  <div>
    <!-- <div id="player" /> -->
    <iframe
      id="player"
      type="text/html"
      width="940"
      height="360"
      :src="`https://www.youtube.com/embed/?enablejsapi=1`"
      frameborder="0"
    />

    <script src="https://www.youtube.com/player_api" />

    <script>
      // create youtube player
      var player;
    </script>
  </div>
</template>

<script>
export default {
    props: {
        ytId: {
            type: String,
            required: true,
        },
    },
    watch: {
        ytId() {
            player.loadVideoById(this.ytId) // eslint-disable-line no-undef
        },
    },
    mounted() {
        window.onYouTubePlayerAPIReady = () => {
            player = new YT.Player('player', { // eslint-disable-line no-undef
                // height: '360',
                // width: '640',
                // videoId: this.ytId,
                events: {
                    'onReady': this.onPlayerReady,
                    'onStateChange': this.onPlayerStateChange,
                },
            })
        }
    },
    methods: {
        // autoplay video
        onPlayerReady(event) {
            player.loadVideoById(this.ytId) // eslint-disable-line no-undef
            event.target.playVideo()
        },
        // when video ends
        onPlayerStateChange(event) {
            if (event.data === 0) {
                this.$emit('ended')
            }
        },
    },
}
</script>
