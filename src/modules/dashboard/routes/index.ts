import type { RouteRecordRaw } from 'vue-router'

export const dashboardRoutes: RouteRecordRaw = {
  path: '/dashboard',
  name: 'dashboard',
  redirect: { name: 'home' },
  component: () => import('@/modules/dashboard/layouts/DashboardLayout.vue'),
  children: [
    {
      path: 'home',
      name: 'home',
      component: () => import('@/modules/dashboard/views/HomeView.vue')
    },
    {
      path: 'recipes',
      name: 'recipes',
      component: () => import('@/modules/dashboard/views/RecipesView.vue')
    },
    {
      path: 'recipe/:id',
      component: () => import('@/modules/dashboard/views/RecipeView.vue')
    },
    {
      path: 'recipes-by-user/:id',
      component: () => import('@/modules/dashboard/views/RecipesByUserView.vue')
    },
    {
      path: 'categories',
      name: 'categories',
      component: () => import('@/modules/dashboard/views/CategoriesView.vue')
    },
    {
      path: 'category/:id',
      component: () => import('@/modules/dashboard/views/CategoryView.vue')
    },
    {
      path: 'favorites',
      name: 'favorites',
      component: () => import('@/modules/dashboard/views/MyFavoritesView.vue')
    },
    {
      path: 'search',
      name: 'search',
      component: () => import('@/modules/dashboard/views/SearchView.vue')
    },
    {
      path: 'new-recipe',
      name: 'new-recipe',
      component: () => import('@/modules/dashboard/views/CreateRecipeView.vue')
    },
    {
      path: 'edit-recipe/:id',
      component: () => import('@/modules/dashboard/views/EditRecipeView.vue')
    },
    {
      path: 'my-account',
      name: 'my-account',
      component: () => import('@/modules/dashboard/views/MyAccountView.vue')
    },
    {
      path: 'my-recipes',
      name: 'my-recipes',
      component: () => import('@/modules/dashboard/views/MyRecipesView.vue')
    },
    {
      path: 'edit-account/:id',
      component: () => import('@/modules/dashboard/views/EditAccountView.vue')
    },
    {
      path: 'update-image',
      name: 'update-image',
      component: () => import('@/modules/dashboard/views/UpdateImageView.vue')
    },
    {
      path: 'settings',
      name: 'settings',
      component: () => import('@/modules/dashboard/views/SettingsView.vue'),
      children: [
        {
          path: 'update-password',
          name: 'update-password',
          component: () => import('@/modules/dashboard/views/UpdatePasswordView.vue')
        },
        {
          path: 'delete-account',
          name: 'delete-account',
          component: () => import('@/modules/dashboard/views/DeleteAccountView.vue')
        }
      ]
    }
  ]
}
