
<template lang="html">
  <v-card :loading="loading" style="margin-bottom: 15px">
    <v-row>
      <v-col cols="12" sm="4">
        <v-row align="stretch">
          <v-col cols="2" style="padding:0;padding-left:15px;">
            <v-btn
              :color="btnColor"
              elevation="0"
              style="height:100%;width:100%;min-width:40px;border-radius:5px 0 0 5px;"
              :disabled="alreadyExist"
              @click="clickBtn"
            >
              <plus-circle-icon v-if="!toSave" />
              <minus-circle-icon v-else />
            </v-btn>
          </v-col>
          <v-col cols="10" style="padding:0;padding-right:15px;">
            <img
              :src="img"
              alt="music image"
              style="display:block;width:100%;height:auto;max-width:320px;max-height: 180px;border-radius:0 5px 5px 0;"
            >
          </v-col>
        </v-row>
      </v-col>
      <v-col>
        <div>
          <v-text-field v-model="title" label="Name" />
          <AutocompleteTags v-model="tags" />
        </div>
        <v-spacer />
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import AutocompleteTags from '@/components/AutocompleteTags'
import { submitMusic } from '@/sharedJS/submitMusic'

export default {
    components: {
        AutocompleteTags,
    },
    props: {
        item: {
            type: Object,
            required: true,
        },
        submit: {
            type: Boolean,
            required: true,
        },
    },
    data() {
        return {
            title: this.decode(this.item.snippet.title),
            tags: [],
            toSave: false,
            loading: false,
        }
    },
    computed: {
        btnColor() {
            return this.toSave ? 'success' : 'secondary'
        },
        img() {
            return this.item.snippet.thumbnails.medium.url
        },
        alreadyExist() {
            const check = music => music.ytId === this.ytId
            return this.$store.getters['userDB/music'].filter(check).length === 1
        },
        ytId() {
            return this.item.id.videoId
        },
    },
    watch: {
        async submit() {
            if (this.submit && this.toSave) {
                this.loading = true
                await submitMusic.call(this, this.title, undefined, this.ytId, this.tags)
            }
            this.$emit('done', this.ytId)
        },
    },
    methods: {
        clickBtn() {
            this.toSave = !this.toSave
        },
        decode(str) {
            str = str.replace(/&#(\d+);/g, function(match, dec) {
                return String.fromCharCode(dec)
            })
            return this.unEscapeHTML(str)
        },
        unEscapeHTML(str) {
            const MAP = {
                '&amp;': '&',
                '&lt;': '<',
                '&gt;': '>',
                '&quot;': '"',
            }
            const repl = function(c) { return MAP[c] }
            return str.replace(/(&\w+;)/g, repl)
        },
    },
    notifications: {
        notification: { },
    },
}
</script>
