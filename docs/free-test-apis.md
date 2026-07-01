# Free Test APIs

Two zero-config, CORS-enabled mock APIs. All writes are **faked** (nothing persists).

## JSONPlaceholder · `https://jsonplaceholder.typicode.com`

Docs: <https://jsonplaceholder.typicode.com/guide/>

**Resources:** `/posts` `/comments` `/albums` `/photos` `/users` `/todos`

```
GET    /posts            # list
GET    /posts/1          # single
GET    /posts?userId=1   # filter by field
GET    /posts/1/comments # nested
POST   /posts            # create (-> new id)
PUT    /posts/1          # replace
PATCH  /posts/1          # partial update
DELETE /posts/1
```

## DummyJSON · `https://dummyjson.com`

Docs: <https://dummyjson.com/docs>

**Resources:** `products` `carts` `users` `posts` `comments` `todos` `recipes` `quotes`

Every list response is wrapped: `{ <resource>: [...], total, skip, limit }`.

**Query params (any resource):** `?limit=10&skip=20` · `?select=title,price` · `?sortBy=title&order=asc` · `?delay=1000`

```
GET    /products              # list (30 default)
GET    /products/1            # single
GET    /products/search?q=phone
POST   /products/add          # create (faked)
PUT    /products/1            # update (faked)
DELETE /products/1            # -> { isDeleted: true }
```

**Extras:** `/products/categories` · `/products/category/smartphones` · `/users/filter?key=hair.color&value=Brown` · `/users/1/carts` · `/carts/user/5`

**Auth** ([docs](https://dummyjson.com/docs/auth)) — creds `emilys` / `emilyspass`:
```js
// login -> { accessToken, refreshToken }
POST /auth/login   body: { username, password, expiresInMins: 30 }
GET  /auth/me      header: Authorization: Bearer <accessToken>
POST /auth/refresh body: { refreshToken }
```

**Utilities:** `/image/400x200/282828/fff?text=Hi` ([image](https://dummyjson.com/docs/image)) · `/http/404/Not%20Found` ([http](https://dummyjson.com/docs/http)) · `/quotes/random` · `/test` · `/ip`

---

Per-resource docs: [products](https://dummyjson.com/docs/products) · [carts](https://dummyjson.com/docs/carts) · [users](https://dummyjson.com/docs/users) · [posts](https://dummyjson.com/docs/posts) · [comments](https://dummyjson.com/docs/comments) · [todos](https://dummyjson.com/docs/todos) · [recipes](https://dummyjson.com/docs/recipes) · [quotes](https://dummyjson.com/docs/quotes)
