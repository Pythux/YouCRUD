<template lang="html">
  <div>
    <!-- <div id="player" /> -->
    <iframe
      id="player"
      :keys="ytId"
      type="text/html"
      width="640"
      height="360"
      :src="`http://www.youtube.com/embed/?enablejsapi=1`"
      frameborder="0"
    />

    <script src="http://www.youtube.com/player_api" />

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
            player.loadVideoById(this.ytId)
        },
    },
    mounted() {
        window.onYouTubePlayerAPIReady = () => {
            player = new YT.Player('player', {
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
            player.loadVideoById(this.ytId)
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
