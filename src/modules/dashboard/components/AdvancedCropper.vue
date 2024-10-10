<template>
  <div class="w-full px-0">
    <input ref="myInputFile" type="file" @change="onFileChange" accept="image/*" class="hidden" />

    <div
      v-if="showImageCropper"
      class="w-full h-screen absolute z-30 top-0 left-0 bg-[#000000E5] flex flex-col justify-center items-center"
    >
      <div class="z-50">
        <div :class="class">
          <Cropper
            ref="cropperRef"
            @change="onCrop"
            :src="imageSource"
            :stencil-props="{ aspectRatio: 1 / 1 }"
          />
        </div>

        <button
          type="button"
          class="uppercase mt-5 w-full h-fit flex justify-center rounded-md border border-sky-600 hover:bg-sky-500 text-sky-500 hover:text-sky-50 px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm"
          @click="cropImage"
        >
          Recortar Imagen
        </button>

        <button
          type="button"
          class="uppercase mt-5 w-full h-fit flex justify-center rounded-md border border-red-600 hover:bg-red-500 text-red-500 hover:text-sky-50 px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm"
          @click="cancelCrop"
        >
          Cancelar
        </button>
      </div>
    </div>

    <!-- Mostrar la imagen recortada -->
    <div v-if="croppedImage">
      <h3>Imagen recortada:</h3>
      <img :src="croppedImage" alt="Cropped Image" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Cropper } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'

interface Props {
  class: string
}
defineProps<Props>()

const emit = defineEmits<{
  (e: 'fileSelected', file: File): void // Tipo de evento y datos emitidos
}>()

const showImageCropper = ref<boolean>(false)
const imageSource = ref<string | null>(null)
const croppedImage = ref<string | null>(null)

const cropperRef = ref()
const myInputFile = ref()

const onFileChange = (event: Event) => {
  showImageCropper.value = true
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const reader = new FileReader()

    reader.onload = () => {
      imageSource.value = reader.result as string
    }

    reader.readAsDataURL(input.files[0]) // Lee el archivo seleccionado
  }
}

const onCrop = (crop: any) => {}

const cropImage = () => {
  const cropper = cropperRef.value
  if (cropper) {
    const canvas = cropper.getResult().canvas // Obtiene el canvas del cropper
    if (canvas) {
      croppedImage.value = canvas.toDataURL('image/jpeg')
    }
  }
  const file = base64ToFile(`${croppedImage.value}`, 'cropped-image.jpg')

  emit('fileSelected', file)
  showImageCropper.value = false
}

const cancelCrop = () => {
  imageSource.value = null
  croppedImage.value = null
  showImageCropper.value = false
}

const openFileDialog = () => {
  myInputFile.value.click()
}

const base64ToFile = (base64String: string, fileName: string): File => {
  const [mimePart, dataPart] = base64String.split(',')
  const mime = mimePart.match(/:(.*?);/)![1]
  const byteString = atob(dataPart)
  const arrayBuffer = Uint8Array.from(byteString, (c) => c.charCodeAt(0))

  return new File([arrayBuffer], fileName, { type: mime })
}

defineExpose({ openFileDialog })
</script>
