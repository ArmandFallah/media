export const API =
  process.env.NODE_ENV === 'production'
    ? 'https://api.armand.world/media'
    : 'http://localhost:3001/media';

export const getAllTweets = async () => {
  const data = await fetch(`${API}/tweets`);
  return data.json();
};

export const getTweetById = async (id: number) => {
  const data = await fetch(`${API}/tweets/${id}`);
  return data.json();
};

export const postNewTweet = async (newTweet: string, author: string) => {
  const objData = {
    value: newTweet,
    name: author,
  };

  const options = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(objData),
  };

  const data = await fetch(`${API}/tweets`, options);
  return data.json();
};

export const putEditTweet = async (
  id: number,
  newTweet: string
): Promise<{ id: number; value: string }> => {
  const objData = {
    value: newTweet,
  };

  const options = {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(objData),
  };

  const data = await fetch(`${API}/tweets/${id}`, options);
  return data.json();
};

export const deleteAllTweets = async () => {
  const options = {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };
  const data = await fetch(`${API}/tweets`, options);
  return data.json();
};

export const deleteTweetById = async (id: number) => {
  const options = {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };
  const data = await fetch(`${API}/tweets/${id}`, options);
  return data.json();
};
