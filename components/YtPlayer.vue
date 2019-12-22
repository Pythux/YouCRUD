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
        let width = 640
        if (window.innerWidth < width) {
            width = window.innerWidth
        }
        this.player = YouTubePlayer('video-player', { width, height: Math.floor(width * 0.6) })
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
