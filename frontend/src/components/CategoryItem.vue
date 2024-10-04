<template>
  <div class="category-item list-group-item text-dark bg-light" @click="onClick(category.categoryID)">
    {{ category.categoryName }}
  </div>
</template>

<script>
export default {
  props: {
    category: {
      type: Object,
      required: true
    }
  },
  methods: {
    onClick(categoryID) {
      // Emit an event or route to another component
      this.$emit('categorySelected', categoryID);
    }
  }
};
</script>

<style scoped>
.category-item {  
  cursor: pointer;
  transition: background-color 0.3s;
}

.category-item:hover {
  background-color: #f7f7f7; /* Light grey background on hover */
}

.category-item:last-child {
  border-bottom: none;
}
</style>
