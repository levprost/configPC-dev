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
// ------------------------------------------------------------------------------

beforeAll(async () => {
  await login(user, {
    email: "edit@truc.fr",
    password: "test123",
  });

  await login(userNotOwner, {
    email: "user@truc.fr",
    password: "test123",
  });

  await login(adminUser, {
    email: "admin@truc.fr",
    password: "test123",
  });
});
describe("User Login with JWT", () => {
  test("Vérification de l'authentification via JWT", async () => {
    try {
      const res = await login(user, {
        email: "edit@truc.fr",
        password: "test123",
      });

      expect(user.token).toBeDefined();
      expect(user.email).toBe("edit@truc.fr");
      expect(res.status).toBe(200);
    } catch (error) {
      console.error("Error during JWT login:", error);
      throw error;
    }
  });
});

// ------------------------------------------------------------------------------
// UTILS
// ------------------------------------------------------------------------------
async function login(user, credentials) {
  const res = await Axios.post("/login", credentials);
  const token = res.data.data.access_token.token;

  Axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  for (let key in res.data.data.user) {
    user[key] = res.data.data.user[key];
  }
  user.token = token;

  return res;
}
describe("Admin Login", () => {
  test("Vérification de l'authentification", async () => {
    await login(adminUser, {
      email: "admin@truc.fr",
      password: "test123",
    });
  });
});
describe("userNotOwner Login", () => {
  test("Vérification de l'authentification", async () => {
    await login(userNotOwner, {
      email: "user@truc.fr",
      password: "test123",
    });
  });
});
async function register(dataReg) {
  return await Axios.post("/register", dataReg);
}
describe("User Register", () => {
  test("Vérification de l'inscription", async () => {
    const dataReg = {
      nick_name: "test520",
      email: "test520@mail.com",
      password: "test123",
      password_confirmation: "test123",
    };

    const resReg = await register(dataReg);

    expect(resReg.status).toBe(200);
    expect(resReg.data.data.user.email).toBe("test520@mail.com");
    expect(resReg.data.data.user.nick_name).toBe("test520");
  });
});
describe("Posts GET", () => {
  test("Récupération de la liste des posts", async () => {
    const res = await Axios.get("/posts");
    expect(res.data.data.length).toBeGreaterThanOrEqual(2);
  });

  test("Get Show", async () => {
    const posts = await Axios.get("/posts");
    const res = await Axios.get("/posts/" + posts.data.data[0].id);
    expect(res.data.title_post).toBeTruthy();
    expect(res.data.user_id).toBeGreaterThanOrEqual(1);
  });
});
describe("Creatures POST", () => {
  test("Create with good data", async (data = {
    title_post: "test name 2222",
    content_post: "content_test",
    content_post_1: "content_test_1",
    content_post_2: "Additional content 2",
    description_post: "This is a post description",
    subtitle_post: "subtitle_post",
    is_published: false,
    order_post: 3,
  }) => {
    // before
    const postRes = await Axios.post("/posts", data);
    // after
    const cur = await Axios.get("/posts/" + postRes.data.newPost.id);

    expect(postRes.data.newPost.title_post).toBe("test name 2222");
    expect(cur.data.title_post).toBe("test name 2222");
  });

  test("Create with bad data", async (data = {
    title_post: "test name",
    content_post: "content_test",
    content_post_1: "content_test_1",
    subtitle_post: "subtitle_post",
    is_published: false,
    user_id: "user.data.data.id",
  }) => {
    const old = await Axios.get("/posts");
    const oldNumPost = old.data.length;
    // before
    const createRes = await Axios.post("/posts", data, {
      validateStatus: () => true,
    });
    // after
    const cur = await Axios.get("/posts");
    const curNumPosts = cur.data.length;

    expect(createRes.status).toBe(422);
    expect(curNumPosts).toBe(oldNumPost);
  });
});

describe("Posts PUT", () => {
  test("Update as user owner", async () => {
    await login(user, {
      email: "edit@truc.fr",
      password: "test123",
    });
    const data = {
      title_post: "test name",
      content_post: "content_test",
      _method: "PUT",
    };

    const res = await Axios.get("/posts/");
    const post = res.data.data.find((p) => p.user_id == user.id);
    console.log(post);
    console.log(user);

    const updateRes = await Axios.post("/posts/" + post.id, data);
    expect(updateRes.status).toBe(200);
    expect(updateRes.data.new_post.title_post).toBe("test name");
  });

  test("Update as not user owner", async () => {
    const data = {
      title_post: "New title",
      content_post: "content_test_new",
      content_post_1: "content_test_1_new",
      subtitle_post: "subtitle_post_new",
      is_published: false,
      _method: "PUT",
    };

    const res = await Axios.get("/posts");
    const post = res.data.data.find((p) => p.user_id != userNotOwner.id);
    const updateRes = await Axios.post("/posts/" + post.id, data, {
      validateStatus: () => true,
    });
    expect(updateRes.status).toBe(403);
    expect(updateRes.data.title_post).not.toBe("New title");
  });
});

describe("Posts DELETE", () => {
  test("Delete as post owner", async () => {
    await login(user, {
      email: "edit@truc.fr",
      password: "test123",
    });

    const res = await Axios.get("/posts");
    const post = res.data.data.find((p) => p.user_id == user.id);

    const deleteRes = await Axios.delete("/posts/" + post.id);

    expect(deleteRes.status).toBe(200);
  });

  test("Delete as NOT owner", async () => {
    await login(userNotOwner, {
      email: "user@truc.fr",
      password: "test123",
    });

    const res = await Axios.get("/posts");
    const post = res.data.data.find((p) => p.user_id !== user.id);

    const deleteRes = await Axios.delete("/posts/" + post.id, {
      validateStatus: () => true,
    });

    expect(deleteRes.status).toBe(403);
  });

  test("Delete as Admin", async () => {
    await login(adminUser, {
      email: "admin@truc.fr",
      password: "test123",
    });

    const res = await Axios.get("/posts");
    const post = res.data.data.find((p) => p.user_id !== user.id);

    const deleteRes = await Axios.delete(`/posts/${post.id}`);

    expect(deleteRes.status).toBe(200);
  });
});

describe("Admin Login", () => {
  test("Vérification de l'authentification de l'administration", async () => {
    try {
      await login(adminUser, {
        email: "admin@truc.fr",
        password: "test123",
      });
    } catch (error) {
      console.error("Error during admin login:", error);
      throw error;
    }
  });
});

describe("Posts PUT", () => {
  test("Update as Admin owner", async (data = {
    title_post: "test name",
    content_post: "content_test",
    content_post_1: "content_test_1",
    subtitle_post: "subtitle_post",
    is_published: false,
    _method: "PUT",
  }) => {
    const res = await Axios.get("/posts/");

    const post = res.data.data.find((p) => p.user_id == user.id);

    const updateRes = await Axios.post("/posts/" + post.id, data);
    expect(updateRes.status).toBe(200);
    expect(updateRes.data.new_post.title_post).toBe("test name");
  });
});

describe("Admin Posts DELETE", () => {
  test("Delete as admin", async () => {
    const old = await Axios.get("/posts");
    const post = old.data.data.find((p) => p.user_id != adminUser.id);
    // before
    const deleteRes = await Axios.delete("/posts/" + post.id);
    // after
    const cur = await Axios.get("/posts");

    expect(deleteRes.status).toBe(200);
  });
});
