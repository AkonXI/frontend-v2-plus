<template>
  <button :class="btnClass" :style="props.style">
    <slot></slot>
  </button>
</template>

<script setup>
import {ref, watch} from "vue"

const props = defineProps(
    {
      modelValue:{
        default:''
      },
      status: {
        type: Boolean,
        default: false
      },
      color: {
        type: String,
        default: '',
      },
      style: {
        type: String
      }
    });

console.log(props.color)

const btnColor = `btn-${typeof props.color === "undefined" ? '' : props.color}`

let btnClass = ref(`btn`)
if (props.status !== void 0 && props.status) {
  btnClass.value = `btn ${btnColor}`
}


watch(() => props.status, (newVal) => {
  // console.log(newVal)
  if (props.status !== void 0 && newVal) {
    btnClass.value = `btn ${btnColor}`
  } else {
    btnClass.value = `btn`
  }
})


</script>