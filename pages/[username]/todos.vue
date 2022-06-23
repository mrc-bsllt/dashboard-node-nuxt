<template lang="pug">
main(id="todos" class="relative")
  div(class="icon__wrapper")
    img(src="@/assets/svg/plus.svg" class="cursor-pointer" @click="addTodo")
  section(class="todos__wrapper")
    form(method="POST" @submit.prevent="submitForm" novalidate)
      ul(id="todos-list" class="pl-10")
        li(v-for="(todo, index) in allTodos" 
          :key="index" 
          class="todo flex flex-row justify-start items-center flex-nowrap" 
          :class="{ 'mt-5': index > 0 }, { 'opacity-todo': deletedTodos.includes(index) }")
          label(:for="'todo-' + index" class="relative w-[15px] h-[15px] mr-3")
            input(type="checkbox" :id="'todo-' + index" class="todo-checkbox hidden" :value="todo.done" v-model="todo.done" @input="($event) => updateTodo($event, index, true)")
            div(class="fake-checkbox absolute top-1/2 left-0 -translate-y-1/2 w-full h-full border border-solid border-black bg-none bg-center bg-contain")
          input(type="text" 
                :value="todo.content" 
                class="todo-input w-80 bg-transparent border-b border-solid border-gold italic focus:outline-none"
                :class="{ 'line-through	': todo.done || deletedTodos.includes(index) }"
                @input="($event) => updateTodo($event, index)")
          img(v-if="!deletedTodos.includes(index)" src="@/assets/svg/basket.svg" alt="basket-icon" width="20" height="20" class="mx-2 cursor-pointer" @click="deleteTodo(index)")
          img(v-else src="@/assets/svg/restore.svg" alt="restore-icon" width="20" height="20" class="mx-2 cursor-pointer" @click="restoreTodo(index)")
      
      button(type="submit" 
            class="btn btn-confirm absolute top-[20px] right-[20px]" 
            :disabled="!updatedTodos.content.length && !updatedTodos.done.length && !deletedTodos.length && !addedTodos.length")
        | Save
</template>

<script setup lang="ts">
import type { Todo, UpdatedTodos } from '@/types/todos'

const { data, refresh } = await useAsyncData<Todo[]>('todos', () => {
  const token = useCookie('token')
  return $fetch('http://localhost:8080/api/todos', {
    headers: {
      Authorization: 'Bearer ' + token.value
    }
  })
})

let addedTodos = ref<Todo[]>([])
const todos = computed(() => {
  return data.value.map(el => {
    return { ...el }
  })
})
const allTodos = computed(() => todos.value.concat(addedTodos.value))

watch(() => addedTodos.value.length, () => {
  setTimeout(() => {
    const todos_list = document.getElementById('todos-list')! as HTMLElement
    const last_todo = todos_list.lastElementChild
    const todo_input = last_todo?.querySelector('.todo-input')! as HTMLInputElement
    todo_input.focus()
  }, 100)
})

let updatedTodos = ref<UpdatedTodos>({ content: [], done: [] })
let deletedTodos = ref<number[]>([])

function updateTodo(event: Event, index: number, isCheckbox: boolean = false): void {
  const value = (event.target as HTMLInputElement).value

  if(!isCheckbox) {
    allTodos.value[index].content = value
  
    if(!updatedTodos.value.content.includes(index)) {
      updatedTodos.value.content.push(index)
    }
    if(index <= data.value.length - 1) {
      const isSameValue = data.value[index].content === value
      if(isSameValue) {
        updatedTodos.value.content = updatedTodos.value.content.filter(el => el !== index)
      }
    }
  } else {
    if(!updatedTodos.value.done.includes(index)) {
      updatedTodos.value.done.push(index)
    } else {
      updatedTodos.value.done = updatedTodos.value.done.filter(el => el !== index)
    }
  }
}

function addTodo(): void {
  const newTodo = { content: '', done: false }
  addedTodos.value.push(newTodo)
}

function deleteTodo(index: number) {
  const addedIndex = index - data.value.length

  if(index > data.value.length - 1) {
    addedTodos.value.splice(addedIndex, 1)
    if(updatedTodos.value.content.includes(index) || updatedTodos.value.done.includes(index)) {
      updatedTodos.value.content = updatedTodos.value.content.filter(el => el !== index)
      updatedTodos.value.done = updatedTodos.value.done.filter(el => el !== index)
    }
  } else {
    deletedTodos.value.push(index)
  }
}
function restoreTodo(index: number): void {
  deletedTodos.value = deletedTodos.value.filter(el => el !== index)
}

async function submitForm() {
  const token = useCookie('token')
  const added_todos = allTodos.value.slice(data.value.length)

  const update_indexes = [ ...new Set(updatedTodos.value.content.concat(updatedTodos.value.done)) ]
  const filtered_update_indexes = update_indexes.filter(i => i <= data.value.length - 1)
  const updated_todos = allTodos.value.filter((todo, index) => filtered_update_indexes.includes(index) && !deletedTodos.value.includes(index))
  
  const deleted_todos = data.value.filter((todo, index) => deletedTodos.value.includes(index))
  
  await $fetch('http://localhost:8080/api/todos', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token.value
    },
    body: { added_todos, updated_todos, deleted_todos },
    async onResponse({ response }) {
      addedTodos.value = []
      deletedTodos.value = []
      updatedTodos.value.content = []
      updatedTodos.value.done = []
      refresh()
    }
  })
}
</script>

<style scoped lang="scss">
.todo-checkbox:checked {
  & + .fake-checkbox {
    background-image: url('@/assets/svg/check.svg');
  }
}

.opacity-todo {
  label, input {
    opacity: 0.3;
  }
}
</style>