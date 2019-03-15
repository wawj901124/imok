<template>
  <div class="nav-breadcrumb-wrap">
    <div class="container">
      <nav class="nav-breadcrumb">
        <a href="/">Home</a>
        <!--<span>Goods</span>-->
        <slot></slot>   <!--slot为插槽，供别的模板页面给他放内容，如果没有起任何name属性，就是默认插槽，只要往里丢东西，就会放进来-->
        <!--<slot name="bread"></slot>  &lt;!&ndash;如果有name属性，在使用时就要把slot=name 加上了，可以根据插槽位置放置代码&ndash;&gt;-->
        <!--<slot name="B"></slot>-->
      </nav>
    </div>
  </div>
</template>

<!--<script>-->
  <!--export default {-->
    <!--name: 'NavBread'-->
  <!--}-->
<!--</script>-->

<!--<style scoped>-->

<!--</style>-->
