<template lang="html">
  <v-row>
    <table>
      <tr class="headers">
        <th v-for="(h, i) in headers" :key="i">
          {{ h.text }}
        </th>
      </tr>
      <tr
        v-for="(rowDisplayed, index) in liRowDisplayed"
        :key="rowDisplayed.id || index"
        :class="{row_odd: true, selected: rowDisplayed.id === selected}"
        @click="selectRow(rowDisplayed)"
      >
        <td v-for="(h, i) in headers" :key="i">
          {{ row[h.value] }}
        </td>
      </tr>
    </table>
    <v-pagination v-model="paginInf.pageNb" total-visible="9" circle :length="paginInf.len" :disabled="paginInf.len === 0" />
  </v-row>
</template>

<script>
export default {
    props: {
        row: {
            type: Object,
            required: false,
            default: undefined,
        },
    },
    data() {
        return {
            headers: [
                { text: 'Name', value: 'name' },
                { text: 'Tags', value: 'tags' },
            ],
            liRow: [
                { name: 'Giovanni Rovelli', tags: ['Italy'], id: 1 },
                { name: 'Laughing Bacchus', tags: ['Canada', 'Yoshi'], id: 2 },
                { name: 'Helen Bennett', tags: ['UK', 'Austria', 'Mexico'], id: 3 },
                { name: 'Moctezuma', tags: [], id: 4 },
                { name: 'Mocte', tags: [], id: 5 },
                { name: 'Moa', tags: [], id: 6 },
                { name: 'Mo', tags: [], id: 7 },
            ],
            selected: undefined,
            // pageNb: 1,
            paginInf: {
                pageNb: 1,
                len: 0,
                rowPerPage: 5,
            },
        }
    },
    computed: {
        liRowDisplayed() {
            if (this.paginInf.len !== 0) {
                const indexStart = (this.paginInf.pageNb - 1) * this.paginInf.rowPerPage
                const indexEnd = indexStart + this.paginInf.rowPerPage
                return [...this.liRow.slice(indexStart, indexEnd)]
            }
            return this.liRow
        },
    },
    watch: {
        row(updateRow) {
            this.changeSelectedRow(updateRow)
        },
        liRow() {
            this.paginInf.len = Math.ceil(this.liRow.length / this.paginInf.rowPerPage)
            if (this.paginInf.len === 1) {
                this.paginInf.len = 0
            }
        },
    },
    mounted() {
        if (this.row !== undefined) {
            this.changeSelectedRow(this.row)
        }
        this.liRow = [...this.liRow]
    },
    methods: {
        selectRow(row) {
            this.changeSelectedRow(row)
            this.$emit('update:row', row)
        },
        changeSelectedRow(row) {
            if (row.id === undefined) {
                console.error('the row object given must have an "id" key')
            } else {
                this.selected = row.id
            }
        },
    },
}
</script>

<style lang="css" scoped>
.row_even {
    background-color: #424242;
}
.row_odd, .headers {
    /* background-color: #F9FBE7; */
}

.row_even:hover, .row_odd:hover {
    background-color: #C8E6C9;
}
.selected {
    background-color: #81C784;
}
table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

td, th {
  border: 1px solid #BDBDBD;
  text-align: left;
  padding: 8px;
}
</style>
