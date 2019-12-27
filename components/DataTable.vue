<template lang="html">
  <table>
    <tr class="headers">
      <th v-for="(h, i) in headers" :key="i">
        {{ h.text }}
      </th>
    </tr>
    <tr
      v-for="(row, index) in liRow"
      :key="row.id || index"
      :class="{row_even: index % 2 === 0, row_odd: index % 2 !== 0, selected: row.id === selected}"
      @click="selectedRow(row)"
    >
      <td v-for="(h, i) in headers" :key="i">
        {{ row[h.value] }}
      </td>
    </tr>
  </table>
</template>

<script>
export default {
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
            ],
            selected: undefined,
        }
    },
    methods: {
        selectedRow(row) {
            this.selected = row.id
            this.$emit('update:row', row)
        },
    },
}
</script>

<style lang="css" scoped>
.row_even {
    background-color: #424242;
}
.row_odd, .headers {
    background-color: #616161;
}
.row_even:hover, .row_odd:hover {
    background-color: #BDBDBD;
}
.selected {
    background-color: #212121;
}
table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

td, th {
  border: 1px solid #424242;
  text-align: left;
  padding: 8px;
}
</style>
