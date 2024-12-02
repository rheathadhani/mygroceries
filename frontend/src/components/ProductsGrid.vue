<template>
  <div class="row">
    <ProductsGridItem v-for="product in products" :key="product.productID" :product="product" :cartItems="cartItems"
      class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4 grid" />
  </div>
</template>

<script>
import ProductsGridItem from './ProductsGridItem.vue';

export default {
  name: 'ProductsGrid',
  props: ['products'],
  components: {
    ProductsGridItem,
  },
}
</script>
