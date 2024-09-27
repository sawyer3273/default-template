<script setup lang='ts'>
import { computed, ref } from 'vue'
import { useDataStore } from '@/stores/data'
import { mdiEye, mdiTrashCan } from '@mdi/js'

const router = useRouter()

interface Props {
  checkable?: Boolean
  size?: Number
  storeModel?: String
  fields?: Array
  showTitle?: String
  showLink?: String
}

const props = withDefaults(defineProps<Props>(), {
  checkable: false,
  size: 50,
  storeModel: '',
  fields: [
    {column: 'name', name: 'Имя', type: 'text'},
  ]
})

const emit = defineEmits(['load-data', 'delete-data'])


onMounted(async () => {
  openPage(1)
})



const dataStore = useDataStore()

const items = computed(() => dataStore[props.storeModel] ? dataStore[props.storeModel] : [])
const total = computed(() => dataStore[props.storeModel] ? dataStore[props.storeModel+'_count'] : 0)
const numPages = computed(() => Math.ceil(total.value / perPage.value))
const perPage = ref(props.size)
const currentPage = ref(1)

const isModalActive = ref(false)
const isModalDangerActive = ref(false)
const checkedRows = ref([])


const pagesList = computed(() => {
  const pagesList = []
  if (numPages.value < 10) {
    for (let i = 0; i < numPages.value; i++) {
      pagesList.push(i)
    }
  } else if (currentPage.value < 7) {
    for (let i = 0; i < 10; i++) {
      pagesList.push(i)
    }
  } else if (currentPage.value > numPages.value - 7) {
    for (let i = numPages.value - 10; i < numPages.value; i++) {
      pagesList.push(i)
    }
  } else {
    for (let i = currentPage.value - 4; i < currentPage.value + 5; i++) {
      pagesList.push(i)
    }
  }
  return pagesList
})

const remove = (arr, cb) => {
  const newArr = []
  arr.forEach((item) => {
    if (!cb(item)) {
      newArr.push(item)
    }
  })

  return newArr
}

const checked = (isChecked, client) => {
  if (isChecked) {
    checkedRows.value.push(client)
  } else {
    checkedRows.value = remove(checkedRows.value, (row) => row.id === client.id)
  }
}

function openPage(page) {
  currentPage.value = page
  emit('load-data', {
    size: perPage.value,
    page: page
  })
}

let itemToShow = ref({})
function showItem(id) {
  if (props.showLink) {
    router.push(props.showLink.replace('{id}', id));
  } else {
    itemToShow = items.value.find((one) => {
      if (one.id == id) {
        return one
      }
    })
    if (itemToShow) {
      isModalActive.value = true
    }
  }
}

const toDeleteId = ref(0)
function deleteAction() {
  emit('delete-data', {id: toDeleteId.value, size: perPage.value, page: currentPage.value})
  isModalActive.value = false
}
</script>

<template>
  <CardBoxModal v-model="isModalActive" :title="props.showTitle ? (itemToShow? itemToShow[props.showTitle]: props.showTitle  ) : 'Sample modal'">
    {{itemToShow}}
  </CardBoxModal>

  <CardBoxModal v-model="isModalDangerActive" :title="$t('deleteSure')" button="danger" has-cancel>
    <BaseButton label="Ok" color="contrast" @click="deleteAction" />
  </CardBoxModal>
  


  <table>
    <thead>
      <tr>
        <th v-if="checkable" />
        <th v-for="column in props.fields">{{column.name}}</th>
        <th />
      </tr>
    </thead>
    <tbody>
      <tr v-for="client in items" :key="client.id">
        <TableCheckboxCell v-if="checkable" @checked="checked($event, client)" />
        <td v-for="column in props.fields" :data-label="column.column">
          <template v-if='column.type == "img"'>
            <img class='max-h-16' :src='client[column.column]' />
          </template>
          <template v-else>
            {{ client[column.column] }}
          </template>
        </td>
        <td class="before:hidden lg:w-1 whitespace-nowrap">
          <BaseButtons type="justify-start lg:justify-end" no-wrap>
            <BaseButton color="info" :icon="mdiEye" small @click="showItem(client.id)" />
            <BaseButton
              color="danger"
              :icon="mdiTrashCan"
              small
              @click="() => {toDeleteId = client.id; isModalDangerActive = true}"
            />
          </BaseButtons>
        </td>
      </tr>
    </tbody>
  </table>


  <div class="p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800">
    <BaseLevel>
      <BaseButtons>
        <BaseButton 
          v-if='numPages > 10 && currentPage > 6'
          :active="1 === currentPage"
          :label="1"
          :color="1 === currentPage ? 'lightDark' : 'whiteDark'"
          small
          @click="openPage(1)"
        />
        <div v-if='numPages > 10 && currentPage > 6' class='pb-2'>...</div>
        <BaseButton
          v-for="page in pagesList"
          :key="page"
          :active="page === currentPage"
          :label="page"
          :color="page === currentPage ? 'lightDark' : 'whiteDark'"
          small
          @click="openPage(page)"
        />
        <div v-if='numPages > 10 && currentPage < (numPages - 6)' class='pb-2'>...</div>
        <BaseButton 
          v-if='numPages > 10 && currentPage < (numPages - 6)'
          :active="(numPages - 1) === currentPage"
          :label="numPages"
          :color="(numPages - 1) === currentPage ? 'lightDark' : 'whiteDark'"
          small
          @click="openPage(numPages - 1)"
        />
      </BaseButtons>
    </BaseLevel>
  </div>
</template>
