<template lang="pug">
main(id="todos" class="relative")
  div(class="icon__wrapper")
    img(src="@/assets/svg/plus.svg")
  section(class="todos__wrapper")
    form(method="POST" novalidate)
      ul(class="todos__list pl-10")
        li(v-for="(todo, index) in todos" :key="index" class="todo flex flex-row justify-start items-center flex-nowrap")
          input(type="text" 
                :value="todo.content" 
                class="w-80 bg-transparent border-b border-solid border-gold italic focus:outline-none" 
                @input="($event) => updateTodo($event, index)")
          img(src="@/assets/svg/basket.svg" alt="basket-icon" width="20" height="20" class="mx-2 cursor-pointer")
      
      button(type="submit" class="btn btn-confirm absolute top-[20px] right-[20px]" :disabled="!updatedTodos.length && !deletedTodos.length && !addedTodos.length")
        | Save
</template>

<script setup lang="ts">
import type { Todo } from '@/types/todos'

const { data, refresh } = await useAsyncData<Todo[]>('todos', () => {
  const token = useCookie('token')
  return $fetch('http://localhost:8080/api/todos', {
    headers: {
      Authorization: 'Bearer ' + token.value
    }
  })
})

const addedTodos = ref<Todo[]>([])
const todos = computed(() => {
  const todos = data.value.map(el => {
    return { ...el }
  })
  return todos.concat(addedTodos.value)
})

const updatedTodos = ref<number[]>([])
const deletedTodos = ref<number[]>([])

function updateTodo(event: Event, index: number): void {
  const value = (event.target as HTMLInputElement).value
  const isSameValue = data.value[index].content === value

  todos.value[index].content = value
  if(!updatedTodos.value.includes(index)) {
    updatedTodos.value.push(index)
  }
  if(isSameValue) {
    updatedTodos.value.splice(index, 1)
  }
}

async function submitForm() {
  const token = useCookie('token')
  await $fetch('http://localhost:8080/api/todo', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token.value
    },
    body: { content: 'Prima todo' },
    async onResponse({ response }) {
      console.log(response)
    }
  })
}
</script>