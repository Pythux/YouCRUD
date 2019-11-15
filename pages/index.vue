<template>
  <v-row>
    <v-col v-if="ytId" xs="12" sm="10" md="9" lg="7">
      <iframe
        type="text/html"
        width="640"
        height="360"
        :src="ytLink"
        frameborder="0"
      />
    </v-col>
    <v-col v-else xs="12" sm="10" md="9" lg="7">
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
            </v-card-actions>
          </v-form>
          <template v-else>
            {{ selected }}
          </template>
        </v-card-text>
      </v-card>
    </v-col>
    <v-data-table
      :headers="headers"
      disable-sort
      :items="$store.getters['userDB/music']"
      :items-per-page="15"
      class="elevation-1"
      @click:row="click"
    />
  </v-row>
</template>

<script>
import AutocompleteTags from '@/components/autocompleteTags'
import { submitMusic } from '@/sharedJS/submitMusic'

export default {
    components: {
        AutocompleteTags,
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
            selected: null,
            isInfo: true,
            arrayActionTxt: { true: 'Info', false: 'Update' },
        }
    },
    computed: {
        ytLink() {
            return 'http://www.youtube.com/embed/' + this.ytId // + '?autoplay=1'
        },
        ytId() {
            if (this.selected) {
                return this.selected.ytId
            }
            return undefined
        },
        actionTxt() {
            return this.arrayActionTxt[this.isInfo]
        },
        otherActionTxt() {
            return this.arrayActionTxt[!this.isInfo]
        },
        selectedURL() {
            if (this.selected.ytId) {
                return `https://www.youtube.com/watch?v=${this.ytId}`
            }
            return this.selected.url
        },
    },
    methods: {
        click(obj) {
            const newObj = { ...obj }
            if (!newObj.tags) {
                newObj.tags = []
            }
            if (!newObj.name) {
                newObj.name = ''
            }
            console.log(newObj)
            this.selected = newObj
        },
        submit() {
            submitMusic.call(this, this.selected)
        },
        deleteMusic(elem) {
            this.$store.dispatch('userDB/deleteMusic', elem.id)
            this.selected = undefined
        },
    },
}
</script>
