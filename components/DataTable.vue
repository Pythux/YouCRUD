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
        :class="{row_odd: index % 2, row_even: !(index % 2), selected: rowDisplayed.id === selected}"
        @click="selectRow(rowDisplayed)"
      >
        <td v-for="(h, i) in headers" :key="i">
          {{ rowDisplayed[h.value] | arrayDisplay }}
        </td>
      </tr>
    </table>
    <v-pagination v-model="paginInf.pageNb" total-visible="9" circle :length="paginInf.len" :disabled="paginInf.len === 0" />
  </v-row>
</template>

<script>
export default {
    filters: {
        arrayDisplay(value) {
            return Array.isArray(value) ? value.join(', ') : value
        },
    },
    props: {
        row: {
            type: Object,
            required: false,
            default: undefined,
        },
        itemsPerPage: {
            type: Number,
            required: false,
            default: 5,
        },
        headers: {
            type: Array,
            required: true,
        },
        items: {
            type: Array,
            required: true,
        },
    },
    data() {
        return {
            selected: undefined,
            paginInf: {
                pageNb: 1,
                len: 0,
            },
        }
    },
    computed: {
        liRowDisplayed() {
            if (this.paginInf.len !== 0) {
                const indexStart = (this.paginInf.pageNb - 1) * this.itemsPerPage
                const indexEnd = indexStart + this.itemsPerPage
                return [...this.items.slice(indexStart, indexEnd)]
            }
            return this.items
        },
    },
    watch: {
        row(updateRow) {
            this.changeSelectedRow(updateRow)
        },
        items() {
            this.checkChangeItemsLength()
        },
    },
    mounted() {
        this.checkChangeItemsLength()
        if (this.row) {
            this.changeSelectedRow(this.row)
        }
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
        checkChangeItemsLength() {
            this.paginInf.len = Math.ceil(this.items.length / this.itemsPerPage)
            if (this.paginInf.len === 1) {
                this.paginInf.len = 0
            }
            if (this.paginInf.pageNb > this.paginInf.len) {
                this.paginInf.pageNb = this.paginInf.len
            }
            if (this.paginInf.pageNb === 0) {
                this.paginInf.pageNb = 1
            }
        },
    },
}
</script>

<style lang="css" scoped>
.row_even {
    background-color: white;
}
.row_odd, .headers {
    background-color: #F9FBE7;
}

.row_even:hover, .row_odd:hover {
    background-color: #C8E6C9;
    cursor: pointer;
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
