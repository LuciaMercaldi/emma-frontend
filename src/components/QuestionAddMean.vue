<template>
  <Transition
    name="custom-classes"
    enter-active-class="animate__animated animate__tada">
    <b-row class="text-center" v-if="display">
      <b-col cols="12">
        <b-button
          variant="success"
          class="float-none"
          @click="$emit('click')">
          <b-icon icon="plus-circle"></b-icon> {{ decript }}
        </b-button>
      </b-col>
    </b-row>
  </Transition>
</template>

<script>
export default {
	name: "QuestionAddMean",
	props: {
		display: Boolean,
    decript: String,
	},
};
</script>