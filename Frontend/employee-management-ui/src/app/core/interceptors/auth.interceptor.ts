import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  // Don't add JWT for login API
  if (req.url.includes('/auth/login')) {
    return next(req);
  }

  const token = localStorage.getItem('token');

  if (token) {

    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    return next(clonedRequest);
  }

  return next(req);
};