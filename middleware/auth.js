export default function({app}) {
  if (!app.$auth.loggedIn) {
    return app.context.redirect(`/`);
  }
}

// export default function (ctx) {
//   if (!ctx.app.$auth.$state.loggedIn) {
//     return ctx.app.$auth.redirect('/login')
//   }
// }

