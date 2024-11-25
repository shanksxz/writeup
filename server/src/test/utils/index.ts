export const userData = {
  firstName: "Shanks",
  lastName: "Xzzz",
  email: `shanksxz${Math.random()}@gmail.com`,
  username: `shanksxz${Math.random()}`,
  password: "12345678",
};

export const generateTestUser = (overrides = {}) => ({
  firstName: "Shanks",
  lastName: "Xzzz",
  email: `shanksxz${Math.random()}@gmail.com`,
  username: `shanksxz${Math.random()}`,
  password: "12345678",
  ...overrides
});

export const loginTestUser = async (request: any, user: any) => {
  const response = await request
    .post('/api/auth/signin')
    .send({
      email: user.email,
      password: user.password
    });
  return response.headers['set-cookie'][0];
};

export const TEST_TIMEOUT = 10000;
