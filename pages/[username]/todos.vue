<template lang="pug">
main(id="todos" class="relative")
  div(class="icon__wrapper")
    img(src="@/assets/svg/plus.svg" @click="addTodo")
  section(class="todos__wrapper")
    form(method="POST" novalidate)
      ul(id="todos-list" class="pl-10")
        li(v-for="(todo, index) in todos" :key="index" class="todo flex flex-row justify-start items-center flex-nowrap" :class="{ 'mt-5': index > 0 }" )
          input(type="text" 
                :value="todo.content" 
                class="todo-input w-80 bg-transparent border-b border-solid border-gold italic focus:outline-none"
                @input="($event) => updateTodo($event, index)")
          img(src="@/assets/svg/basket.svg" alt="basket-icon" width="20" height="20" class="mx-2 cursor-pointer" @click="deleteTodo(index)")
      
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

watch(() => addedTodos.value.length, () => {
  setTimeout(() => {
    const todos_list = document.getElementById('todos-list')! as HTMLElement
    const last_todo = todos_list.lastElementChild
    const todo_input = last_todo?.querySelector('.todo-input')! as HTMLInputElement
    todo_input.focus()
  }, 100)
})

const updatedTodos = ref<number[]>([])
const deletedTodos = ref<number[]>([])

function updateTodo(event: Event, index: number): void {
  const value = (event.target as HTMLInputElement).value
  todos.value[index].content = value

  if(!updatedTodos.value.includes(index)) {
    updatedTodos.value.push(index)
  }
  if(index <= data.value.length - 1) {
    const isSameValue = data.value[index].content === value
    if(isSameValue) {
      updatedTodos.value.splice(index, 1)
    }
  }
}

function addTodo(): void {
  const newTodo = { content: '', done: false }
  addedTodos.value.push(newTodo)
}

function deleteTodo(index: number) {
  const addedIndex = index - data.value.length - 1

  if(index > data.value.length - 1) {
    addedTodos.value.splice(addedIndex, 1)
    if(updatedTodos.value.includes(index)) {
      updatedTodos.value.splice(index, 1)
    }
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