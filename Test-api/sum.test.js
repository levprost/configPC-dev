const axios = require("axios");
const { expect } = require("@jest/globals");

const Axios = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    Accept: "application/json",
  },
});

let user = {};
let userNotOwner = {};
let adminUser = {};

beforeAll(async () => {
  await login(user, { email: "edit@truc.fr", password: "test123" });
  await login(userNotOwner, { email: "user@truc.fr", password: "test123" });
  await login(adminUser, { email: "admin@truc.fr", password: "test123" });
});

// --------------------------------------------------
// UTILS
// --------------------------------------------------
async function login(userObj, credentials) {
  const res = await Axios.post("/login", credentials);
  const token = res.data.data.access_token.token;

  Axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  Object.assign(userObj, res.data.data.user, { token });
  return res;
}

async function register(data) {
  return await Axios.post("/register", data);
}

// --------------------------------------------------
// TESTS
// --------------------------------------------------

describe("Authentication", () => {
  test("JWT login works correctly", async () => {
    const res = await login(user, {
      email: "edit@truc.fr",
      password: "test123",
    });

    expect(user.token).toBeDefined();
    expect(user.email).toBe("edit@truc.fr");
    expect(res.status).toBe(200);
  });

  test("Admin login succeeds", async () => {
    expect(adminUser.token).toBeDefined();
    expect(adminUser.email).toBe("admin@truc.fr");
  });

  test("Another user login succeeds", async () => {
    expect(userNotOwner.token).toBeDefined();
    expect(userNotOwner.email).toBe("user@truc.fr");
  });
});

describe("Registration", () => {
  test("User registration succeeds", async () => {
    const data = {
      nick_name: "test520",
      email: "test520@mail.com",
      password: "test123",
      password_confirmation: "test123",
    };

    const res = await register(data);

    expect(res.status).toBe(200);
    expect(res.data.data.user.email).toBe(data.email);
    expect(res.data.data.user.nick_name).toBe(data.nick_name);
  });
});

describe("Posts API", () => {
  test("Can list posts", async () => {
    const res = await Axios.get("/posts");
    expect(res.data.data.length).toBeGreaterThanOrEqual(1);
  });

  test("Get show", async () => {
    const { data: posts } = await Axios.get("/posts");
    const res = await Axios.get(`/posts/${posts.data[0].id}`);

    expect(res.data.title_post).toBeTruthy();
    expect(res.data.user_id).toBeGreaterThanOrEqual(1);
  });

  test("Create post with valid data", async () => {
    const data = {
      title_post: "Valid Title",
      content_post: "Some content",
      content_post_1: "Extra content",
      content_post_2: "More content",
      description_post: "Desc",
      subtitle_post: "Subtitle",
      is_published: false,
      order_post: 1,
    };

    const res = await Axios.post("/posts", data);
    const post = await Axios.get(`/posts/${res.data.newPost.id}`);

    expect(post.data.title_post).toBe(data.title_post);
  });

  test("Fail to create post with invalid data", async () => {
    const data = {
      title_post: "", // invalid: title required
      content_post: "Test",
    };

    const old = await Axios.get("/posts");
    const createRes = await Axios.post("/posts", data, {
      validateStatus: () => true,
    });
    const current = await Axios.get("/posts");

    expect(createRes.status).toBe(422);
    expect(current.data.data.length).toBe(old.data.data.length);
  });

  // test("Update post as owner", async () => {
  //   const all = await Axios.get("/posts");
  //   const post = all.data.data.find((p) => p.user_id == user.id);

  //   const res = await Axios.post('/posts/' + post.id, {
  //     title_post: "Updated Title",
  //     content_post: "Updated Content",
  //     _method: "PUT",
  //   });

  //   expect(res.status).toBe(200);
  //   expect(res.data.new_post.title_post).toBe("Updated Title");
  // });

  test("Fail to update post as non-owner", async () => {
    const { data: all } = await Axios.get("/posts");
    const post = all.data.find((p) => p.user_id != user.id);

    const res = await Axios.post(
      '/posts/' + post.id,
      {
        title_post: "Hack Title",
        _method: "PUT",
      },
      {
        validateStatus: () => true,
      }
    );

    expect(res.status).toBe(403);
  });


  // test("Delete post as owner", async () => {
  //   const res = await Axios.get('/posts');
  //   const post = res.data.data.find(p => p.user_id == user.id);
  //   // before
  //   const deleteRes = await Axios.delete('/posts/' + post.id);
  //   // after

  //   expect(deleteRes.status).toBe(200);
  // });

  test("Fail to delete post as non-owner", async () => {
    const all = await Axios.get("/posts");
    const post = all.data.data.find((p) => p.user_id != user.id);

    const res = await Axios.delete(`/posts/${post.id}`, {
      validateStatus: () => true,
    });

    expect(res.status).toBe(403);
  });
});
describe("Admin Login", () => {
  test("Vérification de l'authentification", async () => {
    await login(user, {
      email: 'admin@truc.fr',
      password: 'test123'
    });
  });
});

describe("Admin Posts PUT", () => {
  test("Update as admin", async (data = { title_post: 'New name', _method: 'PUT' }) => {
    const res = await Axios.get('/posts');
    const post = res.data.data.find(p => p.user_id != user.id);
    const updateRes = await Axios.post('/posts/' + post.id, data);
    console.log(updateRes.data);
    expect(updateRes.data.new_post.title_post).toBe('New name');
  });
});

describe("Admin Posts DELETE", () => {
  test("Delete as admin", async () => {
    const res = await Axios.get('/posts');
    const post = res.data.data.find(p => p.user_id != user.id);
    // before
    const deleteRes = await Axios.delete('/posts/' + post.id);
    // after

    expect(deleteRes.status).toBe(200);
  });
});

// describe("Admin Posts DELETE", () => {
//   test("Delete as admin", async () => {
//     const old = await Axios.get("/posts");
//     const post = old.data.data.find((p) => p.user_id != adminUser.id);
//     // before
//     const deleteRes = await Axios.delete("/posts/" + post.id);
//     // after
//     const cur = await Axios.get("/posts");

//     expect(deleteRes.status).toBe(200);
//   });
// });
