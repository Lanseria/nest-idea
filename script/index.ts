import got from "got";
import * as faker from "faker";

const IDEA_API = "http://localhost:4000";

const randomInt = () => Math.floor(Math.random() * 10);

const generateUser = async () => {
  const { body } = await got.post(`${IDEA_API}/user/register`, {
    json: {
      username: faker.internet.userName(),
      password: "password"
    },
    responseType: "json"
  });
  console.log(body);
  return body.token;
};

const postNewIdea = async token => {
  const idea = faker.lorem.lines();
  const { body } = await got.post(`${IDEA_API}/idea`, {
    json: {
      idea,
      description: faker.lorem.paragraph()
    },
    headers: {
      authorization: `Bearer ${token}`
    },
    responseType: "json"
  });
  console.log(body);
  return body;
};
(async () => {
  const randUserNum = randomInt();
  const randIdeaNum = randomInt();
  console.log(
    `generate ${randUserNum} User and ${randIdeaNum * randUserNum} ideas`
  );
  for (let i = 0; i < randUserNum; i++) {
    const token = await generateUser();
    for (let j = 0; j < randIdeaNum; j++) {
      const idea = await postNewIdea(token);
    }
  }
})();
