<template>
  <div :class="{ blur: !loaded }">
    <h3 class="text-gray-700 text-3xl font-semibold">
            {{ this.$route.params.id ? $t('form.edit_title', {resource: `User #${this.$route.params.id}`}) : $t('form.create_title', {resource: `User` }) }}
    </h3>


    <div class="mt-8">
      <div class="mt-4">
        <div class="p-6 bg-white rounded-md shadow-md">
          <form @submit.prevent="save">
            <div class="grid grid-cols-1 sm:grid-cols-1 gap-6 mt-4">

               
<div >
      <label class="text-gray-700" for="hashid"><b>{{$t('users.column.hashid')}}</b> </label>

      <textarea max="255" step="any" name="hashid" v-validate="'max:255'" v-model="body.hashid" class="form-input w-full mt-2 rounded-md focus:border-indigo-600" type="textarea">
    </textarea>
    <small
    class="text-red-800"
      v-show="errors.has('hashid')"
    >{{errors.first('hashid')}}</small>

  </div>

<div >
      <label class="text-gray-700" for="name"><b>{{$t('users.column.name')}}</b> </label>

      <textarea max="255" step="any" name="name" v-validate="'max:255'" v-model="body.name" class="form-input w-full mt-2 rounded-md focus:border-indigo-600" type="textarea">
    </textarea>
    <small
    class="text-red-800"
      v-show="errors.has('name')"
    >{{errors.first('name')}}</small>

  </div>

<div >
      <label class="text-gray-700" for="email"><b>{{$t('users.column.email')}}</b> </label>

      <input max="255" step="any" name="email" v-validate="'max:255|email'" v-model="body.email" class="form-input w-full mt-2 rounded-md focus:border-indigo-600" type="email">
    
    <small
    class="text-red-800"
      v-show="errors.has('email')"
    >{{errors.first('email')}}</small>

  </div>

<div >
      <label class="text-gray-700" for="remember_me_token"><b>{{$t('users.column.remember_me_token')}}</b> </label>

      <textarea max="255" step="any" name="remember_me_token" v-validate="'max:255'" v-model="body.remember_me_token" class="form-input w-full mt-2 rounded-md focus:border-indigo-600" type="textarea">
    </textarea>
    <small
    class="text-red-800"
      v-show="errors.has('remember_me_token')"
    >{{errors.first('remember_me_token')}}</small>

  </div>

<div >
      <label class="text-gray-700" for="password"><b>{{$t('users.column.password')}}</b> </label>

      <input max="255" step="any" name="password" v-validate="'max:255|min:8'" v-model="body.password" class="form-input w-full mt-2 rounded-md focus:border-indigo-600" type="password">
    
    <small
    class="text-red-800"
      v-show="errors.has('password')"
    >{{errors.first('password')}}</small>

  </div>

<div >
      <label class="text-gray-700" for="avatar"><b>{{$t('users.column.avatar')}}</b> </label>

      <input  name="avatar" v-validate="''" v-model="body.avatar" class="form-input w-full mt-2 rounded-md focus:border-indigo-600" type="text">
    
    <small
    class="text-red-800"
      v-show="errors.has('avatar')"
    >{{errors.first('avatar')}}</small>

  </div>

<div >
      <label class="text-gray-700" for="avatar_url"><b>{{$t('users.column.avatar_url')}}</b> </label>

      <textarea max="255" step="any" name="avatar_url" v-validate="'max:255'" v-model="body.avatar_url" class="form-input w-full mt-2 rounded-md focus:border-indigo-600" type="textarea">
    </textarea>
    <small
    class="text-red-800"
      v-show="errors.has('avatar_url')"
    >{{errors.first('avatar_url')}}</small>

  </div>


                <button
                  :disabled="loading || errors.length"
                  @click="save"
                  :class="`px-6 mx-2 py-2 bg-red-${loading ? 200 : 800} text-gray-200 rounded-md hover:bg-red-700 focus:outline-none focus:bg-red-${loading ? 100 : 700}`"
                >
                  {{ this.$route.params.id ? $t('form.edit_title', {resource: `User`}) : $t('form.create_title', {resource: `User` }) }}
                </button>
              </div>

          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { handleError, handleSuccess } from "@/helpers/response";

export default {
  title: ['users.name', 'users.plural'],
  data() {
    return {
      loaded: false,
      loading: false,
      body: {

      }
    };
  },
  methods: {
    save() {
      this.$validator.validateAll().then(valid => {
        if (valid) {
          this.sendRequest();
        }
      });
    },
    async sendRequest() {
      this.loading = true;

      this.$store
        .dispatch("user/createOrUpdate", this.body)
        .then(({data, message}) => {
          handleSuccess(this, data.message || this.$route.params.id ? this.$t('success.update', {resource: `User #${this.$route.params.id}`}) : this.$t('success.create', {resource: `User`}));
        })
        .catch((response) => {
          handleError(this, response, this.$route.params.id ? this.$t('error.update', {resource: `User #${this.$route.params.id}`}) : this.$t('error.create', {resource: `User`}));
        })
        .finally(() => {
            this.loading = false;
        });
    },
    fetchAndSetUser() {
      this.loaded = false;
      this.$store.dispatch('user/getSingle', this.$route.params.id).then((data) => {
        this.body = data;
        this.loaded = true;
      })
    }
  },
  created() {
    if(this.$route.params.id) {
      this.fetchAndSetUser();
    } else {
      this.loaded = true;
    }
  },
  watch: {
    '$route' (to, from) {
      // react to route changes...
      if(to.params.id) {
        this.fetchAndSetUser();
      } else {
        this.body = {};
      }
    }
  }
};
</script>

<style scoped>
.parent {
  display: flex;
  flex-wrap: wrap;
}

.child {
  flex: 1 0 21%; /* explanation below */
  margin: 5px;
  height: 100px;
}
</style>
