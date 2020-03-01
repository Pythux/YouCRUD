
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
              style="display: block;width:100%;height:auto;max-width:320px;max-height: 180px;"
            >
          </v-col>
        </v-row>
      </v-col>
      <v-col>
        <div>
          <v-text-field v-model="name" label="Name" />
          <AutocompleteTags v-model="tags" @submit="submit" />
        </div>
        <v-spacer />
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import AutocompleteTags from '@/components/AutocompleteTags'
// import { submitMusic } from '@/sharedJS/submitMusic'

export default {
    components: {
        AutocompleteTags,
    },
    props: {
        item: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            name: this.decode(this.item.snippet.title),
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
    },
    methods: {
        clickBtn() {
            this.toSave = !this.toSave
        },
        submit() {
            if (this.toSave) {
                this.loading = true
                // await submitMusic.call(this, this.name, this.url, this.ytId, this.tags)
                this.loading = false
                console.log('save: ', this.title)
            } else {
                console.log("don't save: ", this.title)
            }
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
}
</script>
