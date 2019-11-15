import Vue from 'vue'

// Only import what you need!
import { UserPlusIcon, KeyIcon, TerminalIcon, InfoIcon,
    LayersIcon, Edit3Icon, EditIcon, SaveIcon, SendIcon, UserIcon, PlusCircleIcon,
    Trash2Icon,
} from 'vue-feather-icons' // feather icons

let globalComponents = []

globalComponents = globalComponents.concat([
    UserPlusIcon, KeyIcon, TerminalIcon, LayersIcon, InfoIcon,
    Edit3Icon, EditIcon, SaveIcon, SendIcon, UserIcon, PlusCircleIcon,
    Trash2Icon]) // feather icons

globalComponents.forEach(component => {
    Vue.component(component.name, component)
})
