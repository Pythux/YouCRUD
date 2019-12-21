<template lang="html">
  <div id="video-player" />
</template>

<script>
import YouTubePlayer from 'youtube-player'

export default {
    props: {
        ytId: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            player: undefined,
        }
    },
    watch: {
        ytId() {
            this.player.loadVideoById(this.ytId)
            this.player.playVideo()
        },
    },
    mounted() {
        this.player = YouTubePlayer('video-player')
        this.player.on('stateChange', event => {
            if (event.data === 0) {
                this.$emit('ended')
            }
        })
        this.player.loadVideoById(this.ytId)
        this.player.playVideo()
    },
}
</script>
