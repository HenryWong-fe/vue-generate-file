module.exports = {
  pageTemplate: compoenntName => {
    return `<template>
  <div class="${compoenntName}">
    ${compoenntName}组件
  </div>
</template>
<script>
export default {
  name: '${compoenntName}'
}
</script>
<style lang="scss" scoped>
.${compoenntName} {

}
</style>
`
  },
  componentEntryTemplate: compoenntName => {`import ${compoenntName} from './${compoenntName}.vue'
export default ${componentName}`
  }
}