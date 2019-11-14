<template>
  <v-row>
    <v-col v-if="ytId" xs="12" sm="10" md="9" lg="7">
      <iframe
        id="ytplayer"
        type="text/html"
        width="640"
        height="360"
        :src="ytLink"
        frameborder="0"
      />
    </v-col>
    <v-col v-if="selected" xs="12" sm="12" md="3">
      <v-card class="elevation-1">
        <v-toolbar color="primary" dark flat>
          <v-toolbar-title>{{ actionTxt }}:</v-toolbar-title>
          <v-spacer />
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn large fab color="purple" v-on="on" @click="isInfo = !isInfo">
                <UserPlusIcon v-if="isInfo" size="1.5x" />
                <TerminalIcon v-else />
              </v-btn>
            </template>
            <span>{{ otherActionTxt }}</span>
          </v-tooltip>
        </v-toolbar>
        <v-card-text>
          <v-form v-if="!isInfo" ref="form" @submit.prevent="submit">
            <v-text-field v-model="selected.name" label="Name" />
            <v-text-field v-model="selectedURL" label="URL:" />
            <v-autocomplete
              v-model="selected.tags"
              :items="$store.getters['userDB/tags']"
              :search-input="currentTag"
              :no-data-text="`press enter to add the tag: ${currentTag}`"
              outlined
              dense
              chips
              small-chips
              label="Tags"
              multiple
              autocomplete="off"
              @update:search-input="updateCurrentTag"
              @keydown.enter.native.prevent="addNewTag"
            />
            <v-card-actions>
              <v-spacer />
              <v-btn type="submit" color="success" style="text-transform: none">
                {{ actionTxt }}
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
            selected: null,
            isInfo: true,
            arrayActionTxt: { true: 'Info', false: 'Update' },
            currentTag: '',
        }
    },
    computed: {
        items() {
            return this.$store.getters['userDB/music']
        },
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
        addNewTag() {
            this.existingTags.push(this.currentTag)
            this.tags.push(this.currentTag)
            this.currentTag = ''
        },
        updateCurrentTag(tag) {
            this.currentTag = tag
        },
    },
}
</script>
