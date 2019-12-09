<template>
  <v-row>
    <YtPlayer v-if="selected && selected.ytId" :yt-id="selected.ytId" @ended="changeMusic()" />
    <v-col v-else cols="12">
      <div style="height: 360px" />
    </v-col>

    <v-col v-if="selected" xs="12" sm="12" md="3" lg="5">
      <v-card class="elevation-1">
        <v-toolbar color="primary" dark flat>
          <v-toolbar-title>{{ actionTxt }}:</v-toolbar-title>
          <v-spacer />
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn large fab color="purple" v-on="on" @click="isInfo = !isInfo">
                <EditIcon v-if="isInfo" />
                <InfoIcon v-else />
              </v-btn>
            </template>
            <span>{{ otherActionTxt }}</span>
          </v-tooltip>
        </v-toolbar>
        <v-card-text>
          <v-form v-if="!isInfo" @submit.prevent="submit">
            <v-text-field v-model="selected.name" label="Name" />
            <v-text-field v-model="selectedURL" label="URL:" />
            <AutocompleteTags v-model="selected.tags" />
            <v-card-actions>
              <v-btn color="red darken-3" style="text-transform: none" @click="deleteMusic(selected)">
                Delete
              </v-btn>
              <v-spacer />
              <v-btn type="submit" color="success" style="text-transform: none">
                Update
              </v-btn>
              <!-- <v-btn color="success" style="text-transform: none" @click="submitAndgoNextUndefined">
                Update an go next undefined
              </v-btn> -->
            </v-card-actions>
          </v-form>
          <template v-else>
            {{ selected.name }}
            <br>
            <v-chip v-for="tag in selected.tags" :key="tag" style="margin: 5px">
              {{ tag }}
            </v-chip>
          </template>
        </v-card-text>
      </v-card>
    </v-col>
    <v-btn style="margin: 5px" @click="previousMusic()">
      Previous
    </v-btn>
    <v-btn style="margin: 5px" @click="changeMusic()">
      Play next random
    </v-btn>
    <v-row>
      <template v-for="tag in $store.getters['userDB/tags']">
        <v-chip
          :key="tag"
          :outlined="!activTags[tag]"
          style="margin: 5px"
          @click="switchActiveTag(tag)"
        >
          {{ tag }} ({{ $store.getters['userDB/occurencesOfTags'][tag] }})
        </v-chip>
      </template>
    </v-row>
    <v-col cols="12">
      <v-switch
        v-model="filterOnDone"
        label="ToDo"
      />
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      />
      <v-data-table
        :headers="headers"
        disable-sort
        :search="search"
        :items="musicItems"
        :items-per-page="15"
        class="elevation-2"
        @click:row="click"
      />
    </v-col>
  </v-row>
</template>

<script>
import YtPlayer from '@/components/YtPlayer'
import AutocompleteTags from '@/components/autocompleteTags'
import { submitMusic } from '@/sharedJS/submitMusic'
import { getYtId } from '@/sharedJS/ytURL'

export default {
    components: {
        AutocompleteTags,
        YtPlayer,
    },
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
            search: '',
            selected: null,
            isInfo: true,
            arrayActionTxt: { true: 'Info', false: 'Update' },
            activTags: {},
            liPrevMusic: [],
            filterOnDone: false,
        }
    },
    computed: {
        actionTxt() {
            return this.arrayActionTxt[this.isInfo]
        },
        otherActionTxt() {
            return this.arrayActionTxt[!this.isInfo]
        },
        selectedURL: {
            get() {
                if (this.selected.ytId) {
                    return `https://www.youtube.com/watch?v=${this.selected.ytId}`
                }
                return this.selected.url
            },
            set(newURL) {
                const ytId = getYtId(newURL)
                console.log('ytid:', ytId)
                if (ytId) {
                    delete this.selected.url
                    this.selected.ytId = ytId
                } else {
                    delete this.selected.ytId
                    this.selected.url = newURL
                }
            },
        },
        musicItems() {
            const liActivTags = Object.keys(this.activTags).filter(tag => this.activTags[tag])
            if (liActivTags.length === 0) {
                return this.$store.getters['userDB/music'].filter(music => {
                    if (this.filterOnDone) {
                        return !music.done
                    }
                    return true
                })
            }
            return this.$store.getters['userDB/music'].filter(music => {
                for (const tagIndex in music.tags) {
                    if (liActivTags.includes(music.tags[tagIndex])) {
                        if (this.filterOnDone) {
                            return !music.done
                        }
                        return true
                    }
                }
                return false
            })
        },
    },
    watch: {
        selected(_, oldSelected) {
            this.liPrevMusic.push(oldSelected)
            if (this.liPrevMusic.length > 20) {
                this.liPrevMusic.splice(0, 5)
            }
        },
    },
    methods: {
        switchActiveTag(tag) {
            this.activTags = Object.assign({}, this.activTags, { [tag]: !this.activTags[tag] })
        },
        click(obj) {
            const newObj = { ...obj }
            if (!newObj.tags) {
                newObj.tags = []
            }
            if (!newObj.name) {
                newObj.name = ''
            }
            this.selected = newObj
        },
        changeMusic() {
            function getRandomInt(max) {
                return Math.floor(Math.random() * Math.floor(max))
            }
            const selectedId = this.selected ? this.selected.id : undefined
            const otherMusic = this.musicItems.filter(m => m.id !== selectedId)
            if (otherMusic.length === 0) {
                console.log("can't play another music")
            } else {
                this.selected = otherMusic[getRandomInt(otherMusic.length)]
            }
        },
        previousMusic() {
            this.selected = this.liPrevMusic.pop()
            this.liPrevMusic.pop()
        },
        async submit() {
            await submitMusic.call(this, this.selected)
            for (const index in this.$store.getters['userDB/music']) {
                const music = this.$store.getters['userDB/music'][index]
                if (music.done === undefined) {
                    this.selected = music
                    break
                }
            }
        },
        deleteMusic(elem) {
            this.$store.dispatch('userDB/deleteMusic', elem.id)
            this.selected = undefined
        },
        async submitAndgoNextUndefined() {
            await submitMusic.call(this, this.selected)
            for (const index in this.$store.getters['userDB/music']) {
                const music = this.$store.getters['userDB/music'][index]
                if (music.id === music.name || music.name === '' || music.name === undefined) {
                    this.selected = music
                    break
                }
            }
        },
    },
}
</script>
