import Axios from 'axios';
import { BASE_URL } from '../constants';

const getHeaderToken = () => ({
  headers: { 'X-Auth-Token': localStorage.getItem('token') },
});

export const fetchPosts = () =>
  Axios.get(
    `${BASE_URL}/posts`,
    getHeaderToken(),
  );

export const createPost = newPost =>
  Axios
    .put(
      `${BASE_URL}/posts`,
      newPost,
      getHeaderToken(),
    );

export const updatePost = dataSource =>
  Axios
    .post(
      `${BASE_URL}/posts/${dataSource.id}`,
      dataSource,
      getHeaderToken(),
    );

export const fetchBlocks = postId =>
  Axios.get(
    `${BASE_URL}/posts/${postId}/blocks`,
    getHeaderToken(),
  );

export const deletePost = postId =>
  Axios
    .delete(
      `${BASE_URL}/posts/${postId}`,
      getHeaderToken(),
    );

export const loginUser = (email, password, rememberMe) =>
  Axios
    .post(
      `${BASE_URL}/sign-in`,
      { email, password, rememberMe },
      { header: { 'Content-Type': 'application/json' } },
    );

export const logoutUser = () => Axios
  .post(
    `${BASE_URL}/sign-out`,
    {},
    getHeaderToken(),
  );

export const registerUser = signUpToken =>
  Axios
    .post(`${BASE_URL}/sign-up`, signUpToken);

export const addBlock = (postId, block) =>
  Axios.put(
    `${BASE_URL}/posts/${postId}/blocks`,
    block,
    getHeaderToken(),
  );

export const removeBlock = (postId, block) =>
  Axios.delete(
    `${BASE_URL}/posts/${postId}/blocks/${block.id}`,
    getHeaderToken(),
  );


export const updateBlock = (postId, block) => {
  const url = `${BASE_URL}/posts/${postId}/blocks/${block.id}`;
  return Axios.post(
    url,
    block,
    getHeaderToken(),
  );
};