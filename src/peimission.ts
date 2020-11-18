import router from "./router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { Message } from "element-ui";
import { Route, RouteConfig } from "vue-router";
import { UserModule } from "@/store/modules/user";
import { PermissionModule } from "@/store/modules/permission";

NProgress.configure({ showSpinner: false });

const whiteList = ["/login"];

router.beforeEach(async (to: Route, _: Route, next: any) => {

  // Start progress bar
  NProgress.start();
  // Determine whether the user has logged in
  if (to.path === '/register'){
    next();
    NProgress.done();
    return
  }

  if (UserModule.token != "" && UserModule.token != "out") {

    if (to.path === "/login") {
      // If is logged in, redirect to the home page
      next({ path: "/" });
      console.log("login")
      NProgress.done();
    } else {
      console.log("enter")
      // Note: roles must be a object array! such as: ['admin'] or ['developer', 'editor']
      console.log(UserModule.roles.entries())
      if (UserModule.roles.length === 0) {
        try {
          // Get user info, including roles
          await UserModule.GetUserInfo();
          const roles = UserModule.roles;
          console.log(roles)
          // Generate accessible routes map based on role


          const accessedRoutes: any = await PermissionModule.GenerateRoutes(
            ["admin"]
          );
          // Dynamically add accessible routes
          router.addRoutes(accessedRoutes);
          // Set the replace: true, so the navigation will not leave a history record

          next({ ...to, replace: true });
        } catch (err) {
          console.log(err)
          // Remove token and redirect to login page
          UserModule.ResetToken();
          Message.error(err || "Has Error");
          next(`/login`);
          NProgress.done();
        }
      } else {
        next();
      }
    }
  } else {
    // Has no token
    if (whiteList.indexOf(to.path) !== -1) {
      // In the free login whitelist, go directly
      next();
    } else {
      // Other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`);
      NProgress.done();
    }
  }
});

router.afterEach((to: Route) => {
  // Finish progress bar
  NProgress.done();

  // set page title
  document.title = to.meta.title;
});
