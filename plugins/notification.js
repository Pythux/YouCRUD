import Vue from 'vue'
import VueNotifications from 'vue-notifications'
import miniToastr from 'mini-toastr'// https://github.com/se-panfilov/mini-toastr

// You can use any font icon
// miniToastr.setIcon('error', 'i', { class: 'fa fa-warning' })
// miniToastr.setIcon('info', 'i', { class: 'fa fa-info-circle' })
// miniToastr.setIcon('success', 'i', { class: 'fa fa-check-circle-o' })

miniToastr.init()

function toast({ title, message, type, timeout, cb }) {
    return miniToastr[type](message, title, timeout, cb)
}

const options = {
    success: toast,
    error: toast,
    info: toast,
    warn: toast,
}

VueNotifications.config.timeout = 8000

Vue.use(VueNotifications, options)
