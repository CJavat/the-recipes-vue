import isAuthenticatedGuard from '@/modules/auth/guards/is-authenticated.guard'
import type { RouteRecordRaw } from 'vue-router'

export const dashboardRoutes: RouteRecordRaw = {
  path: '/',
  name: 'dashboard',
  beforeEnter: [isAuthenticatedGuard],
  redirect: { name: 'home' },
  component: () => import('@/modules/dashboard/layouts/DashboardLayout.vue'),
  children: [
    {
      path: 'home',
      name: 'home',
      component: () => import('@/modules/dashboard/views/HomeView.vue')
    }
    //TODO: Terminar de implementar.
    // { path: 'recipes', component: RecipesPageComponent },
    // { path: 'recipe/:id', component: RecipePageComponent },
    // { path: 'recipes-by-user/:id', component: RecipesByUserComponent },
    // { path: 'categories', component: CategoriesPageComponent },
    // { path: 'category/:id', component: CategoryPageComponent },
    // { path: 'favorites', component: MyFavoritesPageComponent },
    // { path: 'search', component: SearchPageComponent },
    // { path: 'new-recipe', component: CreateRecipeComponent },
    // { path: 'edit-recipe/:id', component: CreateRecipeComponent },
    // { path: 'auth/my-account', component: MyAccountPageComponent },
    // { path: 'auth/my-recipes', component: MyRecipesComponent },
    // { path: 'auth/edit-account/:id', component: EditAccountComponent },
    // { path: 'auth/update-image', component: UpdateImagePageComponent },
    // {
    //   path: 'auth/settings',
    //   component: SettingsPageComponent,
    //   children: [
    //     { path: 'update-password', component: UpdatePasswordPageComponent },
    //     { path: 'delete-account', component: DeleteAccountComponent },
    //     { path: '**', redirectTo: 'auth/settings' },
    //   ],
    // },
  ]
}
