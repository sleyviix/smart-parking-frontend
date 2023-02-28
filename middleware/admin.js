// export default function ({ app, redirect }) {
//   const user = app.$auth.user;
//
//   if (!user || !user.isAdmin) {
//     return redirect('/');
//   }
// }


// export default function ({ app, redirect }) {
//   const user = app.$cookies.get('userData');
//
//   if (!user || !user.isAdmin) {
//     return redirect('/');
//   }
// }
import Cookies from 'js-cookie';

export default function ({ app, redirect }) {
  const userDataString = Cookies.get('userData');
  if (!userDataString) {
    return redirect('/');
  }
  const userData = JSON.parse(userDataString);
  if (!userData || !userData.isAdmin) {
    return redirect('/');
  }
}
