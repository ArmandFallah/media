export const getAllTweets = async () => {
  const data = await fetch("http://localhost:3001"); // .then((data) => console.log(data));
  const json = await data.json();
  return json;
};

// getAllTweets();

export const getTweetById = async (id: number) => {
  const data = await fetch(`http://localhost:3001/tweets/${id}`);
  const json = await data.json();
  return json;
};

export const postNewTweet = async (newTweet: string, author: string) => {
  const objData = {
    value: newTweet,
    name: author,
  };

  const options = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(objData),
  };

  const data = await fetch("http://localhost:3001/tweets", options);
  const json = await data.json();
  return json;
};

export const putEditTweet = async (
  id: number,
  newTweet: string
): Promise<{ id: number; value: string }> => {
  const objData = {
    value: newTweet,
  };

  const options = {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(objData),
  };

  const data = await fetch(`http://localhost:3001/tweets/${id}`, options);
  const json = await data.json();
  return json;
};

export const deleteAllTweets = async () => {
  const options = {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };
  const data = await fetch("http://localhost:3001/tweets", options);
  const json = data.json();
  return json;
};

export const deleteTweetById = async (id: number) => {
  const options = {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };
  const data = await fetch(`http://localhost:3001/tweets/${id}`, options);
  const json = await data.json();
  return json;
};

export const createUser = async (username: string, password: string) => {
  const objData = { username, password };

  const options = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(objData),
  };

  const data = await fetch(`http://localhost:3001/user`, options);
  return data.json();
};

export const getUser = async (username: string, password: string) => {
  const objData = new URLSearchParams({ username, password }).toString();

  const options = {
    method: "GET",
  };

  const data = await fetch(`http://localhost:3001/user?${objData}`, options);
  return data.json();
};
