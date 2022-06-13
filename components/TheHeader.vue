<template lang="pug">
header#header(class="py-3 px-6 bg-black text-grey border-b border-solid border-gold")
  ul(class="header__list w-full h-full flex flex-row justify-end items-center flex-nowrap") 
    li.px-2
      nuxt-link(to="/login")
        | Login 
    li.pl-2
      nuxt-link(to="/signup")
        | Signup 
</template>